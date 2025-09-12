// Manual test script for webhook functionality
// Run this in your browser console or create a test endpoint

const testWebhookConnectivity = async () => {
  console.log('🧪 Testing webhook connectivity...');
  
  // Test 1: Check if our webhook endpoints are accessible
  try {
    const testResponse = await fetch('/api/webhooks/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'connectivity' })
    });
    
    const testData = await testResponse.json();
    console.log('✅ Test webhook response:', testData);
  } catch (error) {
    console.error('❌ Test webhook failed:', error);
  }

  // Test 2: Check environment variables
  console.log('🔍 Checking environment variables...');
  console.log('CLERK_WEBHOOK_SECRET exists:', !!process.env.CLERK_WEBHOOK_SECRET);
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Test 3: Manual user sync
  try {
    const syncResponse = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: 'test@example.com' })
    });
    
    const syncData = await syncResponse.json();
    console.log('🔄 Manual sync response:', syncData);
  } catch (error) {
    console.error('❌ Manual sync failed:', error);
  }
};

// Uncomment to run the test
// testWebhookConnectivity();