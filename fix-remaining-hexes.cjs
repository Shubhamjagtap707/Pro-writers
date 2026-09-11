const fs = require('fs');
const path = require('path');

const hexMap = {
  // Surface colors (Midnight)
  '#0b1326': 'surface',
  '#060e20': 'surface-container-lowest',
  '#131b2e': 'surface-container-low',
  '#171f33': 'surface-container',
  '#222a3d': 'surface-container-high',
  '#2d3449': 'surface-container-highest',
  '#31394d': 'surface-bright',
  '#080d19': 'surface', // missed variation

  // Primary colors (Purple/Blue)
  '#c0c1ff': 'primary',
  '#8083ff': 'primary-container',
  '#e1e0ff': 'primary-fixed',
  '#1000a9': 'on-primary',
  '#0d0096': 'on-primary-container',
  '#07006c': 'on-primary-fixed',
  '#2f2ebe': 'on-primary-fixed-variant',
  '#494bd6': 'inverse-primary',
  '#6366f1': 'primary', // Indigo missed variation

  // Secondary colors (Lavender)
  '#cebdff': 'secondary',
  '#4f319c': 'secondary-container',
  '#e8ddff': 'secondary-fixed',
  '#381385': 'on-secondary',
  '#bea8ff': 'on-secondary-container',
  '#21005e': 'on-secondary-fixed',

  // Tertiary colors (Peach/Orange)
  '#ffb783': 'tertiary',
  '#d97721': 'tertiary-container',
  '#ffdcc5': 'tertiary-fixed',
  '#4f2500': 'on-tertiary',
  '#452000': 'on-tertiary-container',
  '#301400': 'on-tertiary-fixed',
  '#703700': 'on-tertiary-fixed-variant',

  // Error
  '#ffb4ab': 'error',
  '#93000a': 'error-container',
  '#690005': 'on-error',
  '#ffdad6': 'on-error-container',

  // Others
  '#dae2fd': 'on-surface',
  '#c7c4d7': 'on-surface-variant',
  '#908fa0': 'outline',
  '#464554': 'outline-variant',
};

// Also handle arbitrary Tailwind prefix replacements
// e.g. bg-[#0b1326]/50 -> bg-surface/50
// border-[#171f33] -> border-surface-container
// fill="#c0c1ff" -> fill-primary / stroke-primary etc for SVG.

function replaceHex(content) {
  let newContent = content;

  // 1. Replace Tailwind classes like prefix-[#hex] or prefix-[#hex]/opacity
  for (const [hex, token] of Object.entries(hexMap)) {
    // Regex for: classPrefix-[#hex] optionally followed by /opacity
    // Examples: bg-[#171f33], border-[#171f33]/50, shadow-[#8083ff]/20, from-[#171f33], via-[#171f33]
    const classRegex = new RegExp(`([a-zA-Z0-9-]+)-\\[${hex}\\](\\/[0-9]+)?`, 'gi');
    newContent = newContent.replace(classRegex, (match, prefix, opacity) => {
      return `${prefix}-${token}${opacity || ''}`;
    });

    // 2. Replace hardcoded style attributes or SVG props
    // e.g. stroke="#c0c1ff" -> stroke="var(--color-primary)"
    // or color: '#c0c1ff' -> color: 'var(--color-primary)'
    const hexLiteralRegex = new RegExp(`['"]${hex}['"]`, 'gi');
    newContent = newContent.replace(hexLiteralRegex, (match) => {
      // Determine if it was single or double quotes
      const quote = match[0];
      return `${quote}var(--color-${token})${quote}`;
    });
  }

  // Handle some edge cases: some arbitrary colors not in map but causing purple
  const edgeCases = [
    { regex: /bg-\[#283044\]/g, replacement: 'bg-inverse-on-surface' },
  ];
  for (const ec of edgeCases) {
    newContent = newContent.replace(ec.regex, ec.replacement);
  }

  return newContent;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updatedContent = replaceHex(content);
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log("Done fixing remaining hexes.");
