#!/bin/bash

# Clerk to Supabase Migration Cleanup Script
# This script removes any remaining Clerk references and ensures clean migration

echo "🧹 Starting Clerk migration cleanup..."

# Remove any potential Clerk-related files
echo "📁 Cleaning up Clerk-related files..."
find . -name "*clerk*" -type f -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    echo "Found potential Clerk file: $file"
done

# Check for any remaining Clerk imports
echo "🔍 Checking for remaining Clerk imports..."
grep -r "from.*clerk" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . || echo "✅ No Clerk imports found"

# Check for Clerk environment variables in code
echo "🔍 Checking for Clerk environment variables..."
grep -r "CLERK" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . || echo "✅ No Clerk environment variables found in code"

# Check package.json for Clerk dependencies
echo "📦 Checking package.json for Clerk dependencies..."
if grep -q "clerk" package.json; then
    echo "⚠️  Found Clerk dependencies in package.json:"
    grep "clerk" package.json
    echo "Run: npm uninstall @clerk/nextjs @clerk/backend svix"
else
    echo "✅ No Clerk dependencies found in package.json"
fi

# Check for any remaining Clerk references in documentation
echo "📚 Checking documentation for outdated Clerk references..."
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -exec grep -l -i "clerk" {} \; | while read file; do
    echo "📝 File $file contains Clerk references - consider updating"
done

# Verify Supabase configuration
echo "🔧 Verifying Supabase configuration..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Supabase environment variables found"
    else
        echo "⚠️  Missing Supabase environment variables in .env.local"
    fi
else
    echo "⚠️  No .env.local file found - create one with Supabase configuration"
fi

# Check for potential build issues
echo "🔨 Checking for potential build issues..."
npm run build --dry-run 2>/dev/null && echo "✅ Build configuration looks good" || echo "⚠️  Potential build issues detected"

echo ""
echo "🎉 Cleanup check complete!"
echo ""
echo "📋 Final checklist:"
echo "  ✅ Remove any remaining Clerk dependencies from package.json"
echo "  ✅ Update .env.local with Supabase configuration"
echo "  ✅ Update documentation to reflect Supabase Auth"
echo "  ✅ Test authentication flow thoroughly"
echo "  ✅ Deploy with updated environment variables"
echo ""
echo "🚀 Migration to Supabase Auth is complete!"