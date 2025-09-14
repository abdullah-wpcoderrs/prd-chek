# PRD Generator - AI Documentation Generator for Vibe Coders

A comprehensive web application that helps vibe coders (developers who build with AI tools) generate professional documentation suites for their projects. Transform your project ideas into complete, development-ready documentation in minutes.

## 🚀 Features

### Core Documentation Suite
- **Product Requirements Document (PRD)** - Comprehensive feature specifications and requirements
- **User Journey & Story Documents** - Detailed user flows, personas, and interaction patterns
- **Sitemap Documents** - Complete application structure and navigation mapping
- **Features & Tech Stack Requirements** - Technology recommendations with compatibility analysis
- **Screen-by-Screen Specifications** - Detailed content and functionality for each interface

### Key Capabilities
- 🤖 **AI-Powered Generation** - Advanced prompts create comprehensive documentation
- ⚡ **Lightning Fast** - Complete documentation suites in under 5 minutes
- 🔧 **Tech Stack Integration** - Support for 10+ popular technology stacks
- 📱 **Multi-Platform** - Web, mobile, and desktop application documentation
- 🎨 **Professional Templates** - Pre-built templates for common project types
- 📄 **Export Options** - PDF downloads and online viewing
- 🔄 **Project Management** - Organize documentation in project folders

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.1 with App Router
- **Backend**: Supabase PostgreSQL with Row Level Security and n8n webhook engine
- **UI Components**: Shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Native Supabase Auth with SSR support
- **Database**: Supabase PostgreSQL with Row Level Security
- **Webhook Integration**: N8N workflow automation
- **TypeScript**: Full type safety throughout

## 🎯 Target Users

**Vibe Coders** - Developers who:
- Build applications using AI coding tools
- Need comprehensive documentation to guide AI development
- Want professional project specifications without manual writing
- Require structured documentation for team collaboration
- Seek to streamline the project planning process

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser
- n8n

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/prd-generator.git
   cd prd-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # N8N Webhook Configuration
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/generate-docs
   NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/status
   
   # Supabase Authentication & Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Application Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 N8N Webhook Integration

The application integrates with N8N workflows for document generation:

### Required Endpoints

1. **Generation Webhook** (`/webhook/generate-docs`)
   - Method: POST
   - Payload: Project details and requirements
   - Response: Project ID for tracking

2. **Status Webhook** (`/webhook/status`)
   - Method: GET
   - Query: `projectId`
   - Response: Generation status and document URLs

### Mock Mode
For development, the application includes mock webhook functions that simulate the generation process using local storage.

## 📱 Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Document generation interface
│   ├── projects/          # Project management dashboard
│   ├── templates/         # Pre-built documentation templates
│   └── page.tsx          # Landing page
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── DocumentViewer.tsx # PDF viewer and document display
│   ├── GenerationProgress.tsx # Real-time generation tracking
│   └── Navbar.tsx        # Main navigation
├── lib/                   # Utility functions and integrations
│   ├── webhook.ts        # N8N webhook integration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## 🎨 Design System

- **Font**: Apple system fonts (SF Pro Display/Text)
- **Colors**: Steel blue color scheme with professional grays
- **Border Radius**: Consistent 2px radius across components
- **Spacing**: Tailwind's spacing scale for consistency
- **Components**: Built on Radix UI primitives for accessibility

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Full Next.js support with serverless functions
- **Railway**: Simple deployment with environment management
- **Self-hosted**: Any Node.js environment with Docker support

## 🔮 Future Enhancements

- **Real-time Collaboration** - Multiple users editing documents
- **Version Control** - Track document changes and revisions
- **Advanced Templates** - Industry-specific documentation templates
- **API Integration** - Direct integration with development tools
- **Team Management** - Multi-user workspaces and permissions
- **Custom Branding** - White-label solutions for agencies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first styling approach
- **Next.js** for the robust React framework
- **The Vibe Coder Community** for inspiration and feedback

---

**Built with ❤️ for the vibe coders community**

Transform your ideas into production-ready documentation with PRD Generator. (Abdullah Ajibowu) [www.linkedin.com/in/ajibowu-abdullah] - wpcoderrs © 2025.
