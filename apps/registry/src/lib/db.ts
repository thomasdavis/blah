import { prisma } from './prisma';

export async function initializeDatabase() {
  try {
    // Insert default providers if they don't exist
    await prisma.provider.upsert({
      where: { name: 'cloudflare-workers' },
      update: {},
      create: {
        name: 'cloudflare-workers',
        description: 'Cloudflare Workers serverless platform',
      },
    });

    await prisma.provider.upsert({
      where: { name: 'vercel-functions' },
      update: {},
      create: {
        name: 'vercel-functions',
        description: 'Vercel serverless functions',
      },
    });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function getTools(limit = 10, offset = 0) {
  try {
    const tools = await prisma.tool.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
        versions: {
          orderBy: { publishedAt: 'desc' },
          take: 1,
          select: { version: true },
        },
      },
    });

    return tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      created_at: tool.createdAt.toISOString(),
      author_name: tool.user.name || 'Unknown',
      latest_version: tool.versions[0]?.version,
    }));
  } catch (error) {
    console.error('Failed to get tools:', error);
    throw error;
  }
}

export async function getToolById(id: number) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { id },
      include: {
        user: {
          select: { 
            id: true,
            name: true,
          },
        },
        versions: {
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            version: true,
            publishedAt: true,
            deprecated: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    if (!tool) {
      return null;
    }
    
    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      created_at: tool.createdAt.toISOString(),
      author_name: tool.user.name || 'Unknown',
      author_id: tool.user.id,
      versions: tool.versions.map(v => ({
        id: v.id,
        version: v.version,
        published_at: v.publishedAt.toISOString(),
        deprecated: v.deprecated,
      })),
      tags: tool.tags.map(t => t.tag.name),
    };
  } catch (error) {
    console.error('Failed to get tool:', error);
    throw error;
  }
}

export async function getToolVersionDetails(toolId: number, version: string) {
  try {
    const toolVersion = await prisma.toolVersion.findFirst({
      where: {
        toolId,
        version,
      },
      include: {
        tool: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        providerConfigs: {
          include: {
            provider: true,
          },
        },
      },
    });
    
    if (!toolVersion) {
      return null;
    }
    
    return {
      id: toolVersion.id,
      version: toolVersion.version,
      code: toolVersion.code,
      manifest: toolVersion.manifest,
      published_at: toolVersion.publishedAt.toISOString(),
      deprecated: toolVersion.deprecated,
      tool_name: toolVersion.tool.name,
      tool_description: toolVersion.tool.description,
      author_name: toolVersion.tool.user.name,
      providers: toolVersion.providerConfigs.map(pc => ({
        provider_name: pc.provider.name,
        provider_description: pc.provider.description,
        config: pc.config,
      })),
    };
  } catch (error) {
    console.error('Failed to get tool version:', error);
    throw error;
  }
}

export async function searchTools(query: string, tags: string[] = [], limit = 10, offset = 0) {
  try {
    // Construct a complex query with Prisma
    const where: any = {};
    
    // Text search
    if (query && query.trim() !== '') {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    // Tag filtering
    if (tags && tags.length > 0) {
      where.tags = {
        every: {
          tag: {
            name: { in: tags },
          },
        },
      };
    }
    
    const tools = await prisma.tool.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
        versions: {
          orderBy: { publishedAt: 'desc' },
          take: 1,
          select: { version: true },
        },
      },
    });
    
    return tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      created_at: tool.createdAt.toISOString(),
      author_name: tool.user.name || 'Unknown',
      latest_version: tool.versions[0]?.version,
    }));
  } catch (error) {
    console.error('Failed to search tools:', error);
    throw error;
  }
}

export async function publishTool(
  userId: number, 
  name: string, 
  description: string | null, 
  version: string, 
  code: string, 
  manifest: any, 
  tags: string[] = [],
  providers: { provider: string, config: any }[] = []
) {
  let toolId: number | undefined;
  
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Check if tool exists
      let tool = await tx.tool.findFirst({
        where: {
          name,
          userId,
        },
      });
      
      if (tool) {
        toolId = tool.id;
        
        // Check if version already exists
        const existingVersion = await tx.toolVersion.findFirst({
          where: {
            toolId: tool.id,
            version,
          },
        });
        
        if (existingVersion) {
          throw new Error('This version already exists');
        }
      } else {
        // Create new tool
        tool = await tx.tool.create({
          data: {
            name,
            description,
            userId,
          },
        });
        
        toolId = tool.id;
      }
      
      // Create version
      const newVersion = await tx.toolVersion.create({
        data: {
          toolId: tool.id,
          version,
          code,
          manifest,
        },
      });
      
      // Process tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Create tag if it doesn't exist
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          
          // Link tag to tool
          await tx.toolTag.upsert({
            where: {
              toolId_tagId: {
                toolId: tool.id,
                tagId: tag.id,
              },
            },
            update: {},
            create: {
              toolId: tool.id,
              tagId: tag.id,
            },
          });
        }
      }
      
      // Process provider configs
      if (providers.length > 0) {
        for (const { provider: providerName, config } of providers) {
          // Find provider
          const provider = await tx.provider.findUnique({
            where: { name: providerName },
          });
          
          if (!provider) {
            continue; // Skip unknown providers
          }
          
          // Create provider config
          await tx.toolProviderConfig.create({
            data: {
              toolVersionId: newVersion.id,
              providerId: provider.id,
              config,
            },
          });
        }
      }
      
      return {
        success: true,
        toolId: tool.id,
        version,
      };
    });
  } catch (error) {
    console.error('Error in publishTool:', error);
    throw error;
  }
}