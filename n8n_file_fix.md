# N8N File Storage Fix Guide

## 🔍 **Current Issue Analysis**

Based on your storage URL: `https://qiviknxunhsatdhwmzdz.supabase.co/storage/v1/object/public/project-documents/SocialHub%20PRD%20Document`

### **Problems Identified:**

1. **Missing file extension** - Should be `SocialHub PRD Document.pdf`
2. **Public bucket** - Files should be in private bucket with proper access control
3. **File naming convention** - Should follow the pattern: `{documentType} Document - {projectName}.pdf`
4. **Storage policies** - Need to match file_path with storage.objects.name

## 🛠️ **Required N8N Workflow Updates**

### **0. API Endpoint Configuration**
Add the document status update API endpoint to your N8N workflow:
```
POST {APP_BASE_URL}/api/documents/update-status
```

**Required Environment Variables:**
- `APP_BASE_URL` - Your application's base URL (e.g., `https://your-app.com`)

### **1. File Naming Convention**
Update your N8N workflow to use this naming pattern:
```
{documentType} Document - {projectName}.pdf
```

**Examples:**
- `PRD Document - SocialHub.pdf`
- `User Stories Document - SocialHub.pdf`
- `Sitemap Document - SocialHub.pdf`
- `Tech Stack Document - SocialHub.pdf`
- `Screens Document - SocialHub.pdf`

### **2. Storage Upload Process**
In your N8N workflow, ensure files are uploaded to the **private** bucket:

```javascript
// N8N Upload Node Configuration
const fileName = `${documentType} Document - ${projectName}.pdf`;
const uploadPath = fileName; // Store at root level, not in user folders

// Upload to Supabase Storage
supabase.storage
  .from('project-documents')
  .upload(uploadPath, fileBuffer, {
    contentType: 'application/pdf',
    upsert: false
  });
```

### **3. Database Update Process**
After successful upload, call the document status update API:

```javascript
// Update document record via API endpoint
const updatePayload = {
  projectId: projectId,
  userId: userId,
  documentType: documentType,
  status: 'completed',
  filePath: fileName, // Just the filename, not full path
  fileSize: fileSize, // File size in bytes
  downloadUrl: null // Let the app generate signed URLs
};

const response = await fetch(`${APP_BASE_URL}/api/documents/update-status`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatePayload)
});

if (!response.ok) {
  console.error('Failed to update document status:', await response.text());
  throw new Error('Document status update failed');
}

console.log('Document status updated successfully');
```

**Alternative: Direct Database Update (if using Supabase service role)**
```javascript
// Direct database update (requires service role key)
await supabase
  .from('documents')
  .update({
    status: 'completed',
    file_path: fileName,
    file_size: fileSize,
    download_url: null
  })
  .eq('project_id', projectId)
  .eq('type', documentType)
  .eq('user_id', userId);
```

## 🔧 **Supabase Configuration Steps**

### **Step 1: Run the Fix Script**
Execute the updated `fix.sql` in your Supabase SQL Editor to:
- Set bucket to private
- Update storage policies
- Fix existing file paths
- Clean up malformed URLs

### **Step 2: Verify Bucket Settings**
```sql
-- Check bucket is private
SELECT id, name, public FROM storage.buckets WHERE id = 'project-documents';
-- Should return: public = false
```

### **Step 3: Test Storage Policies**
```sql
-- Check active policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

## 📱 **Frontend Updates Needed**

### **Update DocumentViewer Component**
The component should generate signed URLs for private files:

```typescript
// In DocumentViewer.tsx
const generateSignedUrl = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('project-documents')
    .createSignedUrl(filePath, 3600); // 1 hour expiry
    
  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
  
  return data.signedUrl;
};
```

## 🎯 **Expected File Structure After Fix**

### **Storage Structure:**
```
project-documents/
├── PRD Document - SocialHub.pdf
├── User Stories Document - SocialHub.pdf
├── Sitemap Document - SocialHub.pdf
├── Tech Stack Document - SocialHub.pdf
└── Screens Document - SocialHub.pdf
```

### **Database Records:**
```sql
-- documents table entries
| file_path                          | download_url | user_id    |
|------------------------------------|--------------|------------|
| PRD Document - SocialHub.pdf       | NULL         | user123... |
| User Stories Document - SocialHub.pdf | NULL      | user123... |
```

## ✅ **Verification Steps**

1. **Run fix.sql in Supabase**
2. **Update N8N workflow** with new file naming
3. **Test document generation** with a new project
4. **Verify signed URL generation** in DocumentViewer
5. **Check access permissions** are working correctly

## 🚨 **Important Notes**

- **Bucket must be private** for RLS policies to work
- **file_path should match storage.objects.name exactly**
- **download_url should be NULL** (generated dynamically)
- **N8N must use service role key** for uploads
- **Frontend uses anon key** with RLS for viewing

After implementing these fixes, your file storage should work correctly with proper access control and file naming conventions.