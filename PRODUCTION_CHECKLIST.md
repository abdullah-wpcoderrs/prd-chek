# Production Deployment Checklist

## 🚀 Pre-Deployment Checklist

### ✅ **Environment Configuration**
- [ ] **Supabase Project** - Production instance created
- [ ] **Environment Variables** - All required variables set in production
- [ ] **Database Schema** - Applied to production Supabase instance
- [ ] **RLS Policies** - Enabled and tested in production
- [ ] **Storage Buckets** - Created with proper policies

### ✅ **Security Configuration**
- [ ] **Row Level Security** - Enabled on all tables
- [ ] **Service Role Key** - Securely stored (not in client code)
- [ ] **CORS Settings** - Configured in Supabase for production domain
- [ ] **Email Templates** - Customized in Supabase Auth settings
- [ ] **OAuth Providers** - Configured with production URLs

### ✅ **Authentication Setup**
- [ ] **Email Verification** - Enabled in Supabase Auth
- [ ] **Password Policies** - Configured (minimum length, complexity)
- [ ] **Rate Limiting** - Configured for auth endpoints
- [ ] **Redirect URLs** - Updated for production domain
- [ ] **Email Delivery** - SMTP configured or using Supabase defaults

### ✅ **Performance & Monitoring**
- [ ] **Database Indexes** - Applied for optimal performance
- [ ] **Connection Pooling** - Configured appropriately
- [ ] **Real-time Subscriptions** - Tested under load
- [ ] **Error Tracking** - Sentry or similar service configured
- [ ] **Analytics** - User tracking and performance monitoring

## 🔧 **Environment Variables (Production)**

### **Required Variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NODE_ENV=production

# N8N Webhooks (if using)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-production.com/webhook/generate-docs
NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL=https://your-n8n-production.com/webhook/status
```

### **Security Notes:**
- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- **Use different keys** for production vs development
- **Rotate keys regularly** for enhanced security
- **Store secrets** in your deployment platform's secure vault

## 🎯 **Deployment Steps**

### **1. Prepare Production Environment**
```bash
# 1. Build the application
npm run build

# 2. Test the build locally
npm start

# 3. Run cleanup script
chmod +x cleanup-migration.sh
./cleanup-migration.sh
```

### **2. Database Migration**
```sql
-- Apply schema to production Supabase
-- 1. Run schema.sql
-- 2. Run rls_policies.sql  
-- 3. Create storage buckets
-- 4. Test with sample data
```

### **3. Supabase Configuration**
1. **Create production project** in Supabase dashboard
2. **Apply database schema** from `schema.sql`
3. **Enable RLS policies** from `rls_policies.sql`
4. **Configure authentication**:
   - Enable email verification
   - Set password policies
   - Configure OAuth providers
   - Set redirect URLs
5. **Create storage bucket** `project-documents`
6. **Test authentication** flow

### **4. Deploy Application**

#### **Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### **Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

#### **Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway deploy

# Set environment variables in Railway dashboard
```

### **5. Post-Deployment Testing**

#### **Authentication Flow:**
- [ ] Sign up with email verification
- [ ] Sign in with email/password
- [ ] Password reset flow
- [ ] OAuth sign-in (if configured)
- [ ] Profile management
- [ ] Sign out

#### **Application Features:**
- [ ] Create new project
- [ ] Real-time updates
- [ ] Document generation
- [ ] File downloads
- [ ] User isolation

#### **Performance Testing:**
- [ ] Page load speeds
- [ ] Real-time subscription performance
- [ ] Database query performance
- [ ] File upload/download speeds

## 🔍 **Monitoring & Maintenance**

### **Set Up Monitoring:**
- [ ] **Supabase Dashboard** - Monitor database performance
- [ ] **Vercel Analytics** - Track application performance
- [ ] **Error Tracking** - Sentry or similar service
- [ ] **Uptime Monitoring** - Pingdom or similar service

### **Regular Maintenance:**
- [ ] **Monitor database usage** and optimize queries
- [ ] **Review security logs** for suspicious activity
- [ ] **Update dependencies** regularly
- [ ] **Backup database** regularly
- [ ] **Monitor error rates** and fix issues promptly

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Authentication Errors:**
- Check CORS settings in Supabase
- Verify redirect URLs are correct
- Ensure environment variables are set correctly

#### **Database Connection Issues:**
- Check connection string format
- Verify RLS policies aren't blocking access
- Monitor connection pool usage

#### **Real-time Not Working:**
- Check WebSocket connections in browser DevTools
- Verify Supabase URL and keys
- Monitor real-time usage in Supabase dashboard

#### **File Upload Issues:**
- Check storage bucket policies
- Verify file size limits
- Monitor storage usage

## 📊 **Success Metrics**

### **Performance Targets:**
- **Page Load Time:** < 2 seconds
- **Authentication:** < 1 second response time
- **Real-time Updates:** < 500ms latency
- **Database Queries:** < 100ms average response time

### **Reliability Targets:**
- **Uptime:** 99.9%
- **Error Rate:** < 0.1%
- **Authentication Success Rate:** > 99%

---

## 🎉 **Go Live!**

Once all checklist items are complete:

1. **Update DNS** to point to production deployment
2. **Enable SSL certificate** (automatic with most platforms)
3. **Monitor application** for first 24 hours
4. **Announce launch** to users
5. **Collect feedback** and iterate

**Your Supabase Auth migration is production-ready!** 🚀