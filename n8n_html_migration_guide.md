# N8N HTML Migration Guide - Simplified

## 🎯 **Objective**
Update your N8N workflow to generate HTML files instead of PDF files using the same file paths and storage structure.

## 🔄 **What Changes in N8N**

### **1. File Generation**
**Before (PDF):**
```javascript
// Generate PDF document
const pdfBuffer = await generatePDF(documentContent);
const fileName = `${documentType} Document - ${projectName}.pdf`;
```

**After (HTML):**
```javascript
// Generate HTML document
const htmlContent = generateHTML(documentContent);
const fileName = `${documentType} Document - ${projectName}.html`;
```

### **2. HTML Template Structure**
Create HTML templates for each document type:

```javascript
// N8N Function Node: HTML Template Generator
const generateHTML = (documentData, documentType) => {
  const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentData.projectName} - ${documentType}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #fff;
        }
        
        .document-header {
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        
        .document-header h1 {
            color: #1f2937;
            margin: 0 0 0.5rem 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .document-header h2 {
            color: #6b7280;
            margin: 0;
            font-size: 1.5rem;
            font-weight: 400;
        }
        
        .meta-info {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #6b7280;
        }
        
        .section {
            margin-bottom: 2rem;
        }
        
        .section h3 {
            color: #1f2937;
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin-bottom: 1rem;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .feature-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            background: #f9fafb;
        }
        
        .feature-card h4 {
            margin: 0 0 0.5rem 0;
            color: #1f2937;
        }
        
        .priority-high { border-left: 4px solid #ef4444; }
        .priority-medium { border-left: 4px solid #f59e0b; }
        .priority-low { border-left: 4px solid #10b981; }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .tech-item {
            background: #3b82f6;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
        }
        
        .requirements-list {
            list-style: none;
            padding: 0;
        }
        
        .requirements-list li {
            background: #f3f4f6;
            margin: 0.5rem 0;
            padding: 1rem;
            border-radius: 6px;
            border-left: 3px solid #3b82f6;
        }
        
        @media print {
            body { margin: 0; padding: 1rem; }
            .document-header { page-break-after: avoid; }
        }
        
        @media (max-width: 768px) {
            body { padding: 1rem; }
            .document-header h1 { font-size: 2rem; }
            .feature-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="document-header">
        <h1>${documentType.replace('_', ' & ')}</h1>
        <h2>${documentData.projectName}</h2>
        <div class="meta-info">
            <span>Generated: ${new Date().toLocaleDateString()}</span>
            <span>Version: 1.0</span>
            <span>Platform: ${documentData.targetPlatform}</span>
        </div>
    </header>
    
    <main class="document-content">
        ${getDocumentTypeContent(documentData, documentType)}
    </main>
</body>
</html>`;

  return baseTemplate;
};
```

### **3. Document Type Specific Content**

```javascript
// N8N Function Node: Document Content Generator
const getDocumentTypeContent = (data, type) => {
  switch(type) {
    case 'Research_Insights':
      return `
        <section class="section">
          <h3>Market Analysis</h3>
          <p>${data.description}</p>
        </section>
        
        <section class="section">
          <h3>Target Audience</h3>
          <p>Primary users and their needs based on research findings.</p>
        </section>
      `;
      
    case 'PRD':
      return `
        <section class="section">
          <h3>Product Overview</h3>
          <p>${data.description}</p>
        </section>
        
        <section class="section">
          <h3>Core Features</h3>
          <div class="feature-grid">
            ${generateFeatureCards(data)}
          </div>
        </section>
        
        <section class="section">
          <h3>Technical Requirements</h3>
          <ul class="requirements-list">
            <li>Platform: ${data.targetPlatform}</li>
            <li>Technology Stack: ${data.techStack}</li>
            <li>Performance Requirements: Fast loading, responsive design</li>
            <li>Security: User authentication and data protection</li>
          </ul>
        </section>
      `;
      
    case 'TRD':
      return `
        <section class="section">
          <h3>Technology Stack</h3>
          <div class="tech-stack">
            ${data.techStack.split(',').map(tech => 
              `<span class="tech-item">${tech.trim()}</span>`
            ).join('')}
          </div>
        </section>
        
        <section class="section">
          <h3>Architecture Overview</h3>
          <p>System architecture and technical implementation details.</p>
        </section>
      `;
      
    // Add other document types (BRD, Vision_Strategy, Planning_Toolkit)...
    default:
      return `
        <section class="section">
          <h3>Document Content</h3>
          <p>${data.description}</p>
        </section>
      `;
  }
};

const generateFeatureCards = (data) => {
  const features = [
    { title: 'User Authentication', description: 'Secure login and registration', priority: 'high' },
    { title: 'Dashboard', description: 'Main user interface', priority: 'high' },
    { title: 'Data Management', description: 'CRUD operations', priority: 'medium' },
    { title: 'Reporting', description: 'Analytics and reports', priority: 'low' }
  ];
  
  return features.map(feature => `
    <div class="feature-card priority-${feature.priority}">
      <h4>${feature.title}</h4>
      <p>${feature.description}</p>
      <small>Priority: ${feature.priority.toUpperCase()}</small>
    </div>
  `).join('');
};
```

### **4. File Upload Process**
**Update your Supabase upload node (same as before, just change extension):**

```javascript
// N8N Supabase Upload Node
const fileName = `${documentType} Document - ${projectName}.html`; // Changed from .pdf to .html
const htmlBuffer = Buffer.from(htmlContent, 'utf8');

// Upload HTML file to Supabase Storage (same bucket, same process)
const { data, error } = await supabase.storage
  .from('project-documents')
  .upload(fileName, htmlBuffer, {
    contentType: 'text/html', // Changed from application/pdf
    upsert: false
  });

if (error) {
  throw new Error(`Upload failed: ${error.message}`);
}
```

### **5. Database Update (Simplified)**
**Same API call, no extra fields needed:**

```javascript
// N8N HTTP Request Node - Update Document Status (SAME AS BEFORE)
const updatePayload = {
  projectId: projectId,
  userId: userId,
  documentType: documentType,
  status: 'completed',
  filePath: fileName, // e.g., "PRD Document - SocialHub.html"
  fileSize: Buffer.byteLength(htmlContent, 'utf8'),
  downloadUrl: null // Let frontend generate signed URLs
  // NO contentType field needed - simplified!
};

const response = await fetch(`${APP_BASE_URL}/api/documents/update-status`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatePayload)
});
```

## 🔧 **Required N8N Workflow Changes**

### **Only 3 Changes Needed:**
1. **PDF Generator Node** → **HTML Generator Node**
2. **File Extension**: Change `.pdf` to `.html`
3. **Content Type**: Change `application/pdf` to `text/html`

**That's it! No additional API calls, no extra database fields, same file paths.**

## ✅ **Testing Your Updated Workflow**

1. **Test HTML Generation**: Verify HTML templates render correctly
2. **Test File Upload**: Ensure HTML files upload to same storage location
3. **Test Frontend**: Confirm HTML viewer displays documents properly

## 🚨 **Important Notes**

- **Same File Paths**: Use existing `file_path` column structure
- **Same Storage**: Upload to same `project-documents` bucket
- **Same API**: Use existing `/api/documents/update-status` endpoint
- **No Extra Fields**: No `content_type` or additional database columns needed
- **Backward Compatible**: Existing workflow structure remains the same

This is a minimal change - just swap PDF generation for HTML generation while keeping everything else identical!