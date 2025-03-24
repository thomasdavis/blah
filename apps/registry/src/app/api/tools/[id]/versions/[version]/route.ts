import { NextRequest, NextResponse } from 'next/server';
import { getToolVersionDetails } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, version: string } }
) {
  try {
    const id = parseInt(params.id);
    const version = params.version;
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }
    
    const versionDetails = await getToolVersionDetails(id, version);
    if (!versionDetails) {
      return NextResponse.json({ error: 'Tool version not found' }, { status: 404 });
    }
    
    return NextResponse.json({ version: versionDetails });
  } catch (error) {
    console.error('Error fetching tool version:', error);
    return NextResponse.json({ error: 'Failed to fetch tool version' }, { status: 500 });
  }
}
