# Federals.live - Content Management Guide

## How to Post and Edit Articles

### Quick Start
1. **Access Admin Panel**: Navigate to `/admin` in your browser (e.g., `https://yoursite.com/admin`)
2. **Create New Article**: Click "New Article" button
3. **Fill in Details**: Add title, content, images, and SEO settings
4. **Publish**: Click "Save Article" to publish immediately

### Content Management Options

#### Option 1: Built-in Admin Panel (Current Implementation)
- **Access**: Go to `/admin` on your website
- **Features**:
  - Rich text editor with Markdown support
  - SEO optimization fields
  - Image management
  - Category assignment
  - Featured/Breaking news flags
  - Article preview and editing

#### Option 2: Upgrade to Professional CMS
For a production site, consider these professional options:

**A. Supabase + Custom CMS**
- Database-backed content storage
- Real-time updates
- User authentication
- Image upload and management
- API-driven content delivery

**B. Headless CMS Integration**
- **Strapi**: Self-hosted, fully customizable
- **Contentful**: Cloud-based, user-friendly
- **Sanity**: Real-time collaboration
- **Ghost**: Publishing-focused

**C. Git-based CMS**
- **Forestry/TinaCMS**: Edit content directly in Git
- **Netlify CMS**: Markdown-based workflow
- **Decap CMS**: Open-source alternative

### Current Workflow

#### Creating a New Article
1. Navigate to `/admin`
2. Click "New Article"
3. Fill in required fields:
   - **Title**: Main headline
   - **Summary**: Brief description for previews
   - **Content**: Full article in Markdown format
   - **Category**: Politics, World, Opinion, etc.
   - **Image**: Featured image URL
   - **Tags**: Comma-separated keywords
   - **SEO Settings**: Title, description, keywords

#### Editing Existing Articles
1. Go to `/admin`
2. Find article in the list
3. Click edit icon
4. Make changes and save

#### Content Features
- **Markdown Support**: Write in Markdown for rich formatting
- **SEO Optimization**: Built-in meta tags and structured data
- **Social Sharing**: Automatic Open Graph and Twitter Card generation
- **Responsive Images**: Automatic image optimization
- **Breaking News**: Flag articles as breaking news
- **Featured Articles**: Highlight important stories

### Markdown Guide
```markdown
# Main Heading
## Subheading
### Section Title

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

> Quote block

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)
```

### SEO Best Practices
1. **Title**: 50-60 characters, include main keyword
2. **Description**: 150-160 characters, compelling summary
3. **Keywords**: 3-5 relevant terms
4. **Images**: Use descriptive alt text
5. **Internal Links**: Link to related articles
6. **Categories**: Consistent categorization

### Production Deployment
For a live news site, you'll want to:

1. **Set up a database** (Supabase recommended)
2. **Configure image hosting** (Cloudinary, AWS S3)
3. **Add user authentication** for admin access
4. **Set up automated backups**
5. **Configure CDN** for fast global delivery
6. **Add analytics** (Google Analytics, Plausible)

### Next Steps
Would you like me to implement any of these upgrades:
- Database integration with Supabase
- Image upload functionality
- User authentication system
- Advanced SEO features
- Analytics integration

The current system is perfect for getting started and can handle a significant amount of content before needing a database upgrade.