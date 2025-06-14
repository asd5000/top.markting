# 🚀 Top Marketing - Complete Marketing Management System

A comprehensive marketing management platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### 🎯 Core Modules
- **Services Management** - Manage main and sub-services
- **Packages Management** - Create and manage subscription packages
- **Real Estate System** - Property management with CRM features
- **Portfolio Management** - Showcase your work
- **Order Management** - Handle customer orders and payments
- **Analytics Dashboard** - Track performance and statistics

### 👥 User Roles
- **Visitors** - Browse services, place orders, add properties
- **Super Admin** - Full system access
- **Marketing Manager** - Services and packages management
- **Real Estate Manager** - Property management only
- **Packages Manager** - Package management only
- **Support Staff** - Everything except admin management

### 🔧 Technical Features
- **Next.js 13+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling (RTL support)
- **Supabase** for database and authentication
- **Real-time updates** with Supabase subscriptions
- **File uploads** with Supabase Storage
- **Responsive design** for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- NPM or Yarn
- Supabase account

### Installation

1. **Clone or download the project**
```bash
cd admintop
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

4. **Set up database**
- Create a new Supabase project
- Run the SQL from `database/schema.sql` in Supabase SQL Editor
- Optionally run `database/seed.sql` for sample data

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Quick Start Scripts
- **Windows**: Double-click `quick-start.bat`
- **Mac/Linux**: Run `chmod +x quick-start.sh && ./quick-start.sh`

## 📁 Project Structure

```
admintop/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (public)/        # Public pages for visitors
│   │   ├── admin/           # Admin dashboard
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── database/                # Database schema and seeds
│   ├── schema.sql           # Complete database structure
│   └── seed.sql             # Initial data
├── public/                  # Static assets
└── README-شرح-التركيب.md    # Arabic installation guide
```

## 🔐 Authentication & Authorization

### Default Admin Account
- **Username**: `asdasheref`
- **Email**: `asdasheref@gmail.com`
- **Password**: `0453328124`

### User Types
- **Visitors**: Can browse services, place orders, add properties
- **Admins**: Role-based access to different system modules

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean**: For VPS deployment

## 📊 Database Schema

The system includes the following main tables:
- `users` - Customer accounts
- `admins` - Admin accounts with roles
- `services` - Main services
- `sub_services` - Service offerings
- `packages` - Subscription packages
- `orders` - Customer orders
- `real_estate` - Property listings
- `portfolio` - Work showcase
- `system_settings` - Configuration

## 🔧 Configuration

### Supabase Setup
1. Create buckets for file storage:
   - `receipts` - Payment receipts
   - `portfolio` - Portfolio images/videos
   - `properties` - Property images

2. Set up Row Level Security (RLS) policies
3. Configure authentication providers if needed

### Environment Variables
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 📱 Features Overview

### Services Management
- Create main services with custom colors and icons
- Add sub-services with pricing and features
- Dynamic service pages with URL routing

### Real Estate CRM
- Property listings with detailed information
- Image uploads (max 4 per property)
- Sales status tracking (new/selling/sold)
- Customer relationship management
- Property matching system

### Package System
- Flexible subscription packages
- Design and video quotas
- Social media management features
- Analytics and reporting

### Admin Dashboard
- Role-based access control
- Real-time statistics
- Order management
- Customer support tools

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check Supabase credentials in `.env.local`
   - Verify project is active in Supabase

2. **Build Errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **File Upload Issues**
   - Check Supabase Storage buckets are created
   - Verify bucket policies allow uploads

### Getting Help
- Check the Arabic guide: `README-شرح-التركيب.md`
- Review browser console for errors
- Check Supabase logs in dashboard

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For technical support or questions:
- Email: asdasheref@gmail.com
- WhatsApp: +201068275557

---

**Made with ❤️ for Top Marketing**
