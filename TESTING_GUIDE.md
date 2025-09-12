# Testing Guide: Real-time Document System

# Supabase Auth + Real-time Testing Guide

This guide will help you test all the features we've implemented to ensure the Supabase Auth + Real-time integration is working correctly.

## 🚀 **Prerequisites**
- Development server is running (`npm run dev`)
- Supabase database schema has been applied
- Environment variables are configured in `.env.local`
- Supabase authentication is set up

## 📋 **Step-by-Step Testing Process**

### **Test 1: Basic Authentication & Database Connection**

1. **Open your app** at `http://localhost:3000`
2. **Sign in with Supabase Auth** (or create a new account)
3. **Check browser console** for any authentication errors
4. **Navigate to Projects page** (`/projects`)

**Expected Result:**
- ✅ No authentication errors in console
- ✅ Projects page loads (even if empty)
- ✅ Real-time connection establishes (check network tab for WebSocket)

### **Test 2: Create Your First Project**

1. **Go to Dashboard** (`/dashboard`)
2. **Fill out the form:**
   - Project Name: "Test Social App"
   - Description: "A simple social media platform for developers"
   - Tech Stack: Select "Next.js + Supabase + TypeScript"
   - Keep default settings
3. **Click "Generate Documentation Suite"**

**Expected Result:**
- ✅ Project gets created in Supabase
- ✅ Progress modal appears
- ✅ Gets redirected to Projects page
- ✅ New project appears immediately (real-time)

### **Test 3: Verify Database Records**

1. **Open Supabase Dashboard**
2. **Go to Table Editor**
3. **Check the following tables:**

   **Projects Table:**
   - ✅ New project record exists
   - ✅ `user_id` matches your Supabase Auth user ID
   - ✅ Status is 'pending' or 'processing'

   **Documents Table:**
   - ✅ 5 document records created (PRD, User Stories, Sitemap, Tech Stack, Screens)
   - ✅ All have same `project_id` and `user_id`
   - ✅ Status is 'pending'

### **Test 4: Real-time Updates**

1. **Keep Projects page open** in browser
2. **Open Supabase Dashboard** in another tab
3. **Manually update project progress:**
   ```sql
   UPDATE projects 
   SET progress = 50, current_step = 'Generating PRD...' 
   WHERE id = 'your-project-id';
   ```
4. **Watch Projects page** (don't refresh)

**Expected Result:**
- ✅ Progress bar updates automatically
- ✅ Current step text changes
- ✅ No page refresh needed

### **Test 5: Document Status Updates**

1. **Update a document status in Supabase:**
   ```sql
   UPDATE documents 
   SET status = 'completed', file_size = 1048576
   WHERE project_id = 'your-project-id' AND type = 'PRD';
   ```
2. **Watch Projects page**

**Expected Result:**
- ✅ Document icon turns green
- ✅ Size appears in project details
- ✅ View/Download buttons become active

### **Test 6: User Data Isolation**

1. **Sign out of current account**
2. **Sign in with different email** (or incognito mode)
3. **Go to Projects page**

**Expected Result:**
- ✅ Projects page is empty
- ✅ Previous user's projects not visible
- ✅ Can create projects independently

### **Test 7: Error Handling**

1. **Temporarily break Supabase connection** (wrong URL in env)
2. **Try creating a project**
3. **Restore connection**

**Expected Result:**
- ✅ Clear error message shown
- ✅ App doesn't crash
- ✅ Works normally after fixing

## 🔍 **Debugging Common Issues**

### **No Projects Showing**
- Check browser console for errors
- Verify Supabase Auth user ID matches database records
- Check Supabase RLS policies are enabled

### **Real-time Not Working**
- Check network tab for WebSocket connections
- Verify Supabase URL and anon key
- Look for subscription errors in console

### **Authentication Errors**
- Check Supabase Auth integration setup
- Verify environment variables
- Check middleware configuration

### **Database Connection Issues**
- Test Supabase connection in dashboard
- Verify table permissions
- Check RLS policies

## 📊 **Monitoring in Browser DevTools**

### **Network Tab**
- WebSocket connection to Supabase
- API calls to server actions
- Authentication token headers

### **Console Tab**
- Real-time subscription logs
- Authentication status
- Error messages

### **Application Tab**
- Local storage for Supabase Auth session
- Session storage data

## 🎯 **Success Criteria**

Your integration is working correctly if:

✅ **Authentication:** Users can sign in and their identity is properly managed by Supabase Auth  
✅ **Data Isolation:** Users only see their own projects and documents  
✅ **Real-time Updates:** Changes in database appear immediately without refresh  
✅ **Project Creation:** Dashboard form creates records in both projects and documents tables  
✅ **Storage Structure:** Documents follow the `{userId}/{projectId}/{documentType}/` path pattern  
✅ **Error Handling:** App gracefully handles connection issues and displays helpful messages  

## 🚀 **Next Steps After Testing**

Once all tests pass:

1. **Update N8N Workflow** to use Supabase project IDs
2. **Configure Real Webhooks** (set `NODE_ENV=production`)
3. **Test End-to-End** document generation
4. **Deploy to Production** when ready

## 💡 **Testing Tips**

- **Use Browser DevTools** extensively during testing
- **Test with Multiple Users** to verify data isolation
- **Monitor Supabase Logs** for any database errors
- **Check Real-time Dashboard** in Supabase for connection status
- **Test Edge Cases** like network disconnections and reconnections

Happy testing! 🎉