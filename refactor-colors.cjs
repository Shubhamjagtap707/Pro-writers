const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-\[#0b1326\]/g, replacement: 'bg-surface' },
  { regex: /bg-\[#060e20\]/g, replacement: 'bg-surface-container-lowest' },
  { regex: /bg-\[#131b2e\]/g, replacement: 'bg-surface-container-low' },
  { regex: /bg-\[#171f33\]/g, replacement: 'bg-surface-container' },
  { regex: /bg-\[#222a3d\]/g, replacement: 'bg-surface-container-high' },
  { regex: /bg-\[#2d3449\]/g, replacement: 'bg-surface-container-highest' },
  { regex: /bg-\[#31394d\]/g, replacement: 'bg-surface-bright' },
  
  // Primary
  { regex: /bg-\[#c0c1ff\]/g, replacement: 'bg-primary' },
  { regex: /text-\[#c0c1ff\]/g, replacement: 'text-primary' },
  { regex: /border-\[#c0c1ff\]/g, replacement: 'border-primary' },
  { regex: /ring-\[#c0c1ff\]/g, replacement: 'ring-primary' },
  { regex: /from-\[#c0c1ff\]/g, replacement: 'from-primary' },
  
  { regex: /bg-\[#8083ff\]/g, replacement: 'bg-primary-container' },
  { regex: /text-\[#8083ff\]/g, replacement: 'text-primary-container' },
  { regex: /border-\[#8083ff\]/g, replacement: 'border-primary-container' },
  { regex: /ring-\[#8083ff\]/g, replacement: 'ring-primary-container' },
  { regex: /to-\[#8083ff\]/g, replacement: 'to-primary-container' },

  { regex: /text-\[#1000a9\]/g, replacement: 'text-on-primary' },
  { regex: /bg-\[#1000a9\]/g, replacement: 'bg-on-primary' },
  { regex: /border-\[#1000a9\]/g, replacement: 'border-on-primary' },

  { regex: /text-\[#07006c\]/g, replacement: 'text-on-primary-fixed' },
  
  { regex: /text-\[#494bd6\]/g, replacement: 'text-inverse-primary' },
  { regex: /bg-\[#494bd6\]/g, replacement: 'bg-inverse-primary' },
  { regex: /to-\[#494bd6\]/g, replacement: 'to-inverse-primary' },

  // Secondary
  { regex: /text-\[#cebdff\]/g, replacement: 'text-secondary' },
  { regex: /bg-\[#cebdff\]/g, replacement: 'bg-secondary' },
  
  { regex: /text-\[#4f319c\]/g, replacement: 'text-secondary-container' },
  { regex: /bg-\[#4f319c\]/g, replacement: 'bg-secondary-container' },
  { regex: /border-\[#4f319c\]/g, replacement: 'border-secondary-container' },

  { regex: /text-\[#bea8ff\]/g, replacement: 'text-on-secondary-container' },

  // On Surface & Variants
  { regex: /text-\[#dae2fd\]/g, replacement: 'text-on-surface' },
  { regex: /bg-\[#dae2fd\]/g, replacement: 'bg-on-surface' },
  { regex: /border-\[#dae2fd\]/g, replacement: 'border-on-surface' },

  { regex: /text-\[#c7c4d7\]/g, replacement: 'text-on-surface-variant' },
  { regex: /bg-\[#c7c4d7\]/g, replacement: 'bg-on-surface-variant' },
  { regex: /border-\[#c7c4d7\]/g, replacement: 'border-on-surface-variant' },

  { regex: /text-\[#908fa0\]/g, replacement: 'text-outline' },
  { regex: /bg-\[#908fa0\]/g, replacement: 'bg-outline' },
  { regex: /border-\[#908fa0\]/g, replacement: 'border-outline' },
  { regex: /placeholder-\[#908fa0\]/g, replacement: 'placeholder-outline' },

  { regex: /text-\[#464554\]/g, replacement: 'text-outline-variant' },
  { regex: /bg-\[#464554\]/g, replacement: 'bg-outline-variant' },
  { regex: /border-\[#464554\]/g, replacement: 'border-outline-variant' },

  // Error
  { regex: /text-\[#ffb4ab\]/g, replacement: 'text-error' },
  { regex: /bg-\[#ffb4ab\]/g, replacement: 'bg-error' },
  { regex: /border-\[#ffb4ab\]/g, replacement: 'border-error' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log("Done refactoring hex colors.");
