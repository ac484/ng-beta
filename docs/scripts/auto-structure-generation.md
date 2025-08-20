# Automatic Project Structure Generation

## Overview

This system automatically generates a comprehensive project structure tree before each Git commit, providing AI tools with current project structure information for better code generation assistance.

## How It Works

### 1. Pre-commit Hook
- **Location**: `.husky/pre-commit`
- **Trigger**: Runs automatically before every `git commit`
- **Actions**: 
  1. Generates project structure tree
  2. Runs lint-staged for code formatting

### 2. Structure Generation Script
- **Location**: `scripts/generate-project-structure.js`
- **Output**: `docs/project-structure.md`
- **Features**:
  - Tree depth: 4 levels
  - Smart filtering of irrelevant directories
  - Focus on AI-relevant file types
  - Automatic timestamp and metadata

## Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "generate-structure": "node scripts/generate-project-structure.js"
  }
}
```

### Manual Execution
```bash
# Generate structure manually
npm run generate-structure

# Or directly with node
node scripts/generate-project-structure.js
```

## Directory Filtering

### Excluded Directories
The following directories are automatically excluded as they're not relevant for AI code generation:

- **External Projects**: `DocuParse/`, `PartnerVerse/`, `Portfolio/`
- **Templates**: `next-shadcn-dashboard-starter-main/`
- **Build Outputs**: `.next/`, `dist/`, `build/`
- **Dependencies**: `node_modules/`
- **Version Control**: `.git/`
- **Editor Files**: `.cursor/`, `.vscode/`
- **Temporary Files**: `temp/`, `tmp/`, `logs/`
- **Cache**: `*.cache`, `*.tmp`, `*.log`

### Always Relevant Directories
These directories are prioritized and always included:

- `src/` - Main source code
- `components/` - UI components
- `lib/` - Utilities and helpers
- `hooks/` - Custom React hooks
- `types/` - TypeScript definitions
- `services/` - API integrations
- `config/` - Configuration files
- `public/` - Static assets
- `styles/` - CSS and styling

## File Type Inclusion

### Source Code
- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Other Languages**: `.py`, `.java`, `.cpp`, `.c`, `.cs`, `.go`, `.rs`, `.php`, `.rb`, `.swift`, `.kt`, `.scala`
- **Frontend**: `.vue`, `.svelte`

### Styles & Assets
- **CSS**: `.css`, `.scss`, `.sass`, `.less`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`
- **Fonts**: `.woff`, `.woff2`, `.ttf`, `.otf`

### Configuration
- **Package Managers**: `package.json`, `pnpm-lock.yaml`, `yarn.lock`
- **Build Tools**: `tsconfig.json`, `webpack.config.js`, `vite.config.js`
- **Linting**: `.eslintrc`, `.prettierrc`
- **Environment**: `.env`, `.env.example`

### Documentation
- **Markdown**: `.md`
- **Text**: `.txt`
- **Database**: `.sql`, `.graphql`

## Output Format

The generated `docs/project-structure.md` file includes:

1. **Header**: Timestamp and purpose
2. **Directory Tree**: Visual tree structure (4 levels deep)
3. **Key Directories**: Descriptions of important directories
4. **Excluded Directories**: List with exclusion reasons
5. **File Types**: Categorized file extensions included
6. **Footer**: Auto-generation notice

## Customization

### Adding New Exclusions
Edit `scripts/generate-project-structure.js`:

```javascript
const EXCLUDED_DIRS = [
  // Add your exclusions here
  'your-excluded-dir',
  '*.your-pattern'
];
```

### Adding New File Types
```javascript
const RELEVANT_EXTENSIONS = [
  // Add your file extensions here
  '.your-extension',
  'your-important-file'
];
```

### Modifying Tree Depth
```javascript
function generateTree(dir, prefix = '', maxDepth = 5, currentDepth = 0) {
  // Change maxDepth from 4 to your preferred depth
}
```

## Troubleshooting

### Common Issues

1. **Script Permission Denied**
   - Windows: No action needed
   - Linux/Mac: `chmod +x scripts/generate-project-structure.js`

2. **Husky Not Working**
   - Ensure husky is installed: `npm install husky --save-dev`
   - Reinstall hooks: `npm run prepare`

3. **Script Errors**
   - Check Node.js version: `node --version`
   - Verify file paths exist
   - Check console output for specific errors

### Manual Testing
```bash
# Test the script directly
node scripts/generate-project-structure.js

# Test the pre-commit hook
npx husky run .husky/pre-commit
```

## Benefits for AI Development

1. **Context Awareness**: AI tools get current project structure
2. **Relevant Focus**: Filters out noise (node_modules, build files)
3. **Up-to-date Information**: Always reflects current state
4. **Structured Data**: Clean, parseable format for AI consumption
5. **Automated Maintenance**: No manual updates required

## Integration with AI Tools

The generated structure file is designed to be consumed by:

- **GitHub Copilot**
- **Cursor AI**
- **Claude/GPT**
- **Custom AI assistants**
- **Code generation tools**

## Best Practices

1. **Commit Regularly**: Structure updates with each commit
2. **Review Output**: Check generated file occasionally
3. **Customize Filters**: Adjust exclusions for your project needs
4. **Version Control**: Include the script in your repository
5. **Team Sharing**: All team members benefit from consistent structure info

---

*This system ensures AI tools always have current, relevant project structure information for optimal code generation assistance.*
