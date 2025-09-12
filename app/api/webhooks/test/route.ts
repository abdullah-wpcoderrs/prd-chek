import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔔 TEST WEBHOOK RECEIVED');
    console.log('📝 Headers:', Object.fromEntries(req.headers.entries()));
    console.log('📄 Body:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString(),
      received: true 
    });
  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return NextResponse.json({ error: 'Failed to process test webhook' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}