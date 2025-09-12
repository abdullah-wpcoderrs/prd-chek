// Test script to verify N8N webhook connectivity
// Run with: node test_webhook.js

const WEBHOOK_URL = 'https://smart-nocode.app.n8n.cloud/webhook-test/prd-generator';

const testPayload = {
  projectId: 'test-project-123',
  userId: 'test-user-456',
  projectName: 'SocialHub Creator',
  description: 'A comprehensive social media platform creator that allows users to build, customize, and deploy their own social networking applications.',
  techStack: 'Next.js + Supabase + TypeScript',
  targetPlatform: 'both',
  complexity: 'complex',
  projectSpec: {
    coreFeatures: 'User registration and authentication with social login options, Profile creation and customization with photo/video uploads, Real-time messaging system with text, voice, and video capabilities',
    targetUsers: 'Primary users are entrepreneurs, content creators, and community builders aged 25-45 who want to create niche social platforms.',
    designStyle: 'modern',
    brandGuidelines: 'Clean, modern interface with a focus on user experience and accessibility. Color palette should emphasize trust and creativity.',
    multiUserRoles: true,
    roleDefinitions: 'App Creator/Owner: Full administrative access... Community Moderator: Can moderate content... Content Creator: Can create and publish content...'
  },
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_test123`
};

async function testWebhook() {
  console.log('🚀 Testing webhook connection...');
  console.log('📡 URL:', WEBHOOK_URL);
  console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Success response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Network/Fetch error:', error.message);
    console.error('Full error:', error);
  }
}

testWebhook();