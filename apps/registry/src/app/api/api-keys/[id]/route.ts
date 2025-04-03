import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!session.user.id) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }
    const userId = parseInt(session.user.id);
    const keyId = parseInt(params.id);
    
    if (isNaN(keyId)) {
      return NextResponse.json(
        { error: 'Invalid API key ID' },
        { status: 400 }
      );
    }
    
    // Check if the key belongs to the user and delete it in one operation
    const result = await prisma.apiKey.deleteMany({
      where: {
        id: keyId,
        userId,
      },
    });
    
    if (result.count === 0) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'API key deleted'
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}