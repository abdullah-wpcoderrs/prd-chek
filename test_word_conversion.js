// Test script to verify Word conversion API
// Run with: node test_word_conversion.js

const testWordConversion = async () => {
  console.log('🚀 Testing Word conversion API...');
  
  const testPayload = {
    documentId: 'test-doc-123',
    extractedText: `Product Requirements Document

Overview
This is a test document for Word conversion functionality.

Features
• User authentication
• Document management
• PDF to Word conversion
• Real-time collaboration

Technical Requirements
The system should support:
1. Multiple file formats
2. Secure user access
3. Fast conversion processing

Conclusion
This test document demonstrates the Word conversion feature.`,
    documentName: 'Test Document'
  };

  try {
    const response = await fetch('http://localhost:3000/api/documents/convert-to-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Error response:', errorData);
      return;
    }

    // Check if we got a Word document
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      console.log('✅ Success: Received Word document');
      console.log('Content-Type:', contentType);
      
      const blob = await response.blob();
      console.log('Document size:', blob.size, 'bytes');
    } else {
      console.log('⚠️ Unexpected content type:', contentType);
    }

  } catch (error) {
    console.error('❌ Network/Fetch error:', error.message);
  }
};

// Note: This test requires authentication, so it will fail with 401 Unauthorized
// when run directly. It's mainly for testing the API structure.
testWordConversion();