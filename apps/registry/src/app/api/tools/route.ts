import { NextRequest, NextResponse } from 'next/server';
import { getTools, searchTools } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const tags = searchParams.get('tags');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (query || tags) {
      const tagsList = tags ? tags.split(',') : [];
      const results = await searchTools(query || '', tagsList, limit, offset);
      return NextResponse.json({ tools: results });
    } else {
      const tools = await getTools(limit, offset);
      return NextResponse.json({ tools });
    }
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
