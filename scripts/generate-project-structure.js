#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to exclude (case-insensitive)
const EXCLUDED_DIRS = [
  'DocuParse',
  'next-shadcn-dashboard-starter-main',
  'PartnerVerse',
  'Portfolio',
  '.git',
  '.next',
  'node_modules',
  '.cursor',
  '.vscode',
  'dist',
  'build',
  'coverage',
  '.nyc_output',
  'temp',
  'tmp',
  'logs',
  '*.log',
  '*.tmp',
  '*.cache'
];

// File extensions to include (for AI code generation relevance)
const RELEVANT_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.vue',
  '.svelte',
  '.py',
  '.java',
  '.cpp',
  '.c',
  '.cs',
  '.go',
  '.rs',
  '.php',
  '.rb',
  '.swift',
  '.kt',
  '.scala',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.json',
  '.yaml',
  '.yml',
  '.toml',
  '.ini',
  '.md',
  '.txt',
  '.sql',
  '.graphql',
  '.gql',
  '.sh',
  '.bat',
  '.ps1',
  '.dockerfile',
  '.dockerignore',
  '.gitignore',
  '.env',
  '.env.example',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'tsconfig.json',
  'jsconfig.json',
  'webpack.config.js',
  'vite.config.js',
  'rollup.config.js',
  'babel.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js'
];

// Directories that are always relevant
const ALWAYS_RELEVANT_DIRS = [
  'src',
  'components',
  'pages',
  'app',
  'lib',
  'utils',
  'hooks',
  'types',
  'interfaces',
  'services',
  'api',
  'config',
  'constants',
  'helpers',
  'middleware',
  'public',
  'assets',
  'images',
  'icons',
  'fonts',
  'styles',
  'themes',
  'layouts',
  'templates'
];

function shouldExclude(name, isDirectory) {
  const lowerName = name.toLowerCase();

  // Check if it's in the excluded directories list
  if (
    EXCLUDED_DIRS.some(
      (excluded) =>
        excluded.toLowerCase() === lowerName ||
        (excluded.startsWith('*') && name.endsWith(excluded.slice(1)))
    )
  ) {
    return true;
  }

  // Skip hidden files/directories (except some important ones)
  if (
    name.startsWith('.') &&
    !['.env', '.gitignore', '.eslintrc', '.prettierrc'].includes(name)
  ) {
    return true;
  }

  // For files, check if they have relevant extensions
  if (!isDirectory) {
    const ext = path.extname(name).toLowerCase();
    const isRelevantExt = RELEVANT_EXTENSIONS.some(
      (relevant) =>
        relevant.toLowerCase() === ext ||
        relevant.toLowerCase() === name.toLowerCase()
    );

    // Include files with relevant extensions or important config files
    if (
      !isRelevantExt &&
      !['README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING'].some((prefix) =>
        name.toLowerCase().startsWith(prefix.toLowerCase())
      )
    ) {
      return false; // Don't exclude, but mark as less relevant
    }
  }

  return false;
}

function isAlwaysRelevant(name) {
  return ALWAYS_RELEVANT_DIRS.some(
    (relevant) => relevant.toLowerCase() === name.toLowerCase()
  );
}

function generateTree(dir, prefix = '', maxDepth = 6, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    return '';
  }

  try {
    const items = fs
      .readdirSync(dir)
      .filter((item) => !shouldExclude(item, true))
      .sort((a, b) => {
        // Directories first, then files
        const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
        const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
        if (aIsDir !== bIsDir) return bIsDir - aIsDir;

        // Always relevant directories first
        const aRelevant = isAlwaysRelevant(a);
        const bRelevant = isAlwaysRelevant(b);
        if (aRelevant !== bRelevant) return bRelevant - aRelevant;

        // Then alphabetical
        return a.localeCompare(b);
      });

    let tree = '';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = path.join(dir, item);
      const isLast = i === items.length - 1;
      const isDirectory = fs.statSync(itemPath).isDirectory();

      const connector = isLast ? '└── ' : '├── ';
      const nextPrefix = isLast ? '    ' : '│   ';

      tree += `${prefix}${connector}${item}`;

      if (isDirectory) {
        tree += '/\n';
        if (currentDepth < maxDepth - 1) {
          tree += generateTree(
            itemPath,
            prefix + nextPrefix,
            maxDepth,
            currentDepth + 1
          );
        }
      } else {
        tree += '\n';
      }
    }

    return tree;
  } catch (error) {
    return `${prefix}└── [Error reading directory: ${error.message}]\n`;
  }
}

function generateProjectStructure() {
  const projectRoot = process.cwd();
  const docsOutputFile = path.join(projectRoot, 'docs', 'project-structure.md');
  const kiroOutputFile = path.join(
    projectRoot,
    '.kiro',
    'steering',
    'project-structure.md'
  );

  console.log('🌳 Generating project structure tree...');

  try {
    // Generate the tree
    const tree = generateTree(projectRoot);

    // Create the markdown content
    const timestamp = new Date().toISOString();
    const content = `# Project Structure

> **Auto-generated on:** ${timestamp}  
> **Purpose:** AI code generation reference - shows relevant project structure for development

## Directory Tree

\`\`\`
${tree}
\`\`\`

## Key Directories

${ALWAYS_RELEVANT_DIRS.map((dir) => `- **\`${dir}/\`** - ${getDirDescription(dir)}`).join('\n')}

## Excluded Directories

The following directories are excluded as they are not relevant for AI code generation:

${EXCLUDED_DIRS.map((dir) => `- \`${dir}/\` - ${getExclusionReason(dir)}`).join('\n')}

## File Types Included

- **Source Code:** ${RELEVANT_EXTENSIONS.filter((ext) => ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala'].includes(ext)).join(', ')}
- **Styles:** ${RELEVANT_EXTENSIONS.filter((ext) => ['.css', '.scss', '.sass', '.less'].includes(ext)).join(', ')}
- **Configuration:** ${RELEVANT_EXTENSIONS.filter((ext) => ['.json', '.yaml', '.yml', '.toml', '.ini', '.env'].includes(ext)).join(', ')}
- **Documentation:** ${RELEVANT_EXTENSIONS.filter((ext) => ['.md', '.txt'].includes(ext)).join(', ')}
- **Build Tools:** ${RELEVANT_EXTENSIONS.filter((ext) => ['.dockerfile', '.gitignore', 'package.json', 'tsconfig.json', 'webpack.config.js', 'vite.config.js', 'tailwind.config.js'].includes(ext)).join(', ')}

---

*This file is automatically generated before each commit to provide AI tools with current project structure information.*
`;

    // Ensure docs directory exists
    const docsDir = path.dirname(docsOutputFile);
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Ensure .kiro/steering directory exists
    const kiroDir = path.dirname(kiroOutputFile);
    if (!fs.existsSync(kiroDir)) {
      fs.mkdirSync(kiroDir, { recursive: true });
    }

    // Write both files
    fs.writeFileSync(docsOutputFile, content, 'utf8');
    fs.writeFileSync(kiroOutputFile, content, 'utf8');

    console.log(`✅ Project structure saved to:`);
    console.log(`   📁 docs: ${docsOutputFile}`);
    console.log(`   🎯 .kiro/steering: ${kiroOutputFile}`);
    console.log(`📊 Tree depth: 6 levels`);
    console.log(`🚫 Excluded ${EXCLUDED_DIRS.length} directories`);

    return true;
  } catch (error) {
    console.error('❌ Error generating project structure:', error.message);
    return false;
  }
}

function getDirDescription(dirName) {
  const descriptions = {
    src: 'Main source code directory',
    components: 'Reusable UI components',
    pages: 'Page components and routing',
    app: 'App router components (Next.js 13+)',
    lib: 'Utility libraries and helpers',
    utils: 'Utility functions',
    hooks: 'Custom React hooks',
    types: 'TypeScript type definitions',
    interfaces: 'TypeScript interfaces',
    services: 'API and external service integrations',
    api: 'API routes and handlers',
    config: 'Configuration files',
    constants: 'Application constants',
    helpers: 'Helper functions',
    middleware: 'Request/response middleware',
    public: 'Static assets served directly',
    assets: 'Project assets (images, icons, etc.)',
    images: 'Image files',
    icons: 'Icon files',
    fonts: 'Font files',
    styles: 'Global styles and CSS modules',
    themes: 'Theme configurations',
    layouts: 'Layout components',
    templates: 'Template components'
  };

  return descriptions[dirName] || 'Project directory';
}

function getExclusionReason(dirName) {
  const reasons = {
    DocuParse: 'External tool, not part of main codebase',
    'next-shadcn-dashboard-starter-main':
      'Template/starter code, not relevant for current development',
    PartnerVerse: 'External project, not part of main codebase',
    Portfolio: 'External project, not part of main codebase',
    '.git': 'Git version control metadata',
    '.next': 'Next.js build output',
    node_modules: 'Dependencies (can be reinstalled)',
    '.cursor': 'Editor-specific files',
    '.vscode': 'Editor-specific configuration',
    dist: 'Build output directory',
    build: 'Build output directory',
    coverage: 'Test coverage reports',
    '.nyc_output': 'Test coverage output',
    temp: 'Temporary files',
    tmp: 'Temporary files',
    logs: 'Log files',
    '*.log': 'Log files',
    '*.tmp': 'Temporary files',
    '*.cache': 'Cache files'
  };

  return reasons[dirName] || 'Not relevant for AI code generation';
}

// Run if called directly
if (require.main === module) {
  const success = generateProjectStructure();
  process.exit(success ? 0 : 1);
}

module.exports = { generateProjectStructure };
