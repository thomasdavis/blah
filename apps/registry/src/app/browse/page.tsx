import { getTools, searchTools } from '@/lib/db';
import ToolCard from '@/components/ToolCard';
import SearchBox from '@/components/SearchBox';
import TagFilterList from '@/components/TagFilterList';
import { prisma } from '@/lib/prisma';

interface BrowsePageProps {
  searchParams: {
    query?: string;
    tags?: string;
    page?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const query = searchParams.query || '';
  const tags = searchParams.tags ? searchParams.tags.split(',') : [];
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;
  
  // Get popular tags - in a production app, you would implement a query
  // that returns tags based on usage frequency
  const popularTags = await prisma.tag.findMany({
    take: 20,
    orderBy: {
      toolTags: {
        _count: 'desc',
      },
    },
    select: {
      name: true,
    },
  });
  
  const tagNames = popularTags.map(tag => tag.name);
  
  // In case we don't have enough tags in the database yet, we'll add some defaults
  if (tagNames.length < 5) {
    tagNames.push(
      ...['utility', 'ai', 'data', 'http', 'file', 'image', 'text', 'api',
        'math', 'network', 'storage', 'database', 'cloud'].filter(
          tag => !tagNames.includes(tag)
        )
    );
  }
  
  // Get tools - either search results or all tools
  const tools = query || tags.length > 0 
    ? await searchTools(query, tags, limit, offset)
    : await getTools(limit, offset);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Tools</h1>
      
      <SearchBox />
      
      <TagFilterList availableTags={tagNames} />
      
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No tools found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters, or{' '}
            <a href="/dashboard/publish" className="text-blue-500 hover:underline">
              publish a new tool
            </a>
          </p>
        </div>
      )}
      
      {/* Simple pagination - in a real implementation, you would calculate total pages */}
      <div className="mt-12 flex justify-center space-x-4">
        {page > 1 && (
          <a
            href={`/browse?query=${query}&tags=${tags.join(',')}&page=${page - 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Previous
          </a>
        )}
        
        {tools.length === limit && (
          <a
            href={`/browse?query=${query}&tags=${tags.join(',')}&page=${page + 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}