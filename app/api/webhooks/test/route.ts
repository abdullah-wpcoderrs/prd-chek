import { NextResponse } from 'next/server';

export async function POST() {
  try {
    
    console.log('🔔 TEST WEBHOOK RECEIVED');
    // Headers and body logging removed for security
    
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