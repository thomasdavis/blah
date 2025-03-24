import { NextRequest, NextResponse } from 'next/server';
import { getSession, validateApiKey } from '@/lib/auth';
import { publishTool } from '@/lib/db';
import { validate as validateSemVer } from 'semver';
import { NewTool, PublishResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    let userId: number;
    
    // Check authentication
    const session = await getSession();
    if (session?.user?.id) {
      // User is authenticated via session
      userId = parseInt(session.user.id);
    } else {
      // Check for API key in header
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Validate API key
      const apiKey = authHeader.substring(7);
      const keyValidation = await validateApiKey(apiKey);
      if (!keyValidation) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      userId = keyValidation.userId;
    }
    
    // Parse request body
    const data = await request.json();
    const { name, description, version, code, manifest, tags, providers } = data as NewTool;
    
    // Validate required fields
    if (!name || !version || !code) {
      return NextResponse.json(
        { error: 'Name, version, and code are required' },
        { status: 400 }
      );
    }
    
    // Validate semver
    if (!validateSemVer(version)) {
      return NextResponse.json(
        { error: 'Invalid semantic version format' },
        { status: 400 }
      );
    }
    
    try {
      // Publish the tool using our transaction-based function
      const result = await publishTool(
        userId,
        name,
        description || null,
        version,
        code,
        manifest || {},
        tags || [],
        providers || []
      );
      
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'This version already exists' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error publishing tool:', error);
    return NextResponse.json(
      { error: 'Failed to publish tool', details: String(error) },
      { status: 500 }
    );
  }
}