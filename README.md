# FSD LLM - File Connections Analyzer

A modern React application for visualizing and analyzing connections between PDF documents using AI-powered content analysis.

## Features

- 📄 **Document Relationship Analysis**: Visualize connections between PDF documents
- 🎯 **Smart Content Detection**: AI-powered analysis of document relationships
- 🔍 **Interactive Filtering**: Filter by document types and relationship types
- 📊 **Detailed Insights**: View connection reasons, confidence scores, and page references
- 🎨 **Beautiful UI**: Modern, responsive design with dark mode support
- ⚡ **Fast Performance**: Built with Vite and optimized for speed

## Document Types Supported

- **Research** - Academic papers and studies
- **Policy** - Guidelines and regulations
- **Manual** - Procedural documentation
- **Report** - Assessment and evaluation documents
- **Specification** - Technical requirements
- **Contract** - Legal agreements

## Relationship Types

- **Content Reference** - Direct citations and references
- **Policy Alignment** - Compliance and regulatory alignment
- **Data Dependency** - Information flow and dependencies
- **Concept Overlap** - Shared themes and concepts
- **Contradiction** - Conflicting information or requirements
- **Supplement** - Supporting and enhancing content

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Visualization**: SVG-based network diagrams

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fsd-llm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Netlify Deployment

This project is configured for easy deployment on Netlify:

#### Option 1: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Choose your repository
5. Netlify will automatically detect the build settings from `netlify.toml`
6. Click "Deploy site"

#### Option 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to Netlify's deploy area

#### Option 3: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Environment Variables

Currently, the app uses mock data. When integrating with Supabase or other services, add environment variables in your Netlify site settings:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Configuration Files

- `netlify.toml` - Netlify build configuration
- `public/_redirects` - Client-side routing for SPA
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx
│   ├── DocumentManagement.tsx
│   ├── FileConnections.tsx
│   └── Sidebar.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for styling

## Future Enhancements

- [ ] Real AI document analysis integration
- [ ] Supabase database integration
- [ ] Document upload functionality
- [ ] Advanced filtering options
- [ ] Export capabilities
- [ ] User authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the repository.