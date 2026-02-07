const fs = require('fs');
const path = require('path');

function generateTree(dir, prefix = '', ignore = ['node_modules', 'dist', 'build', '.git']) {
  let output = '';
  const items = fs.readdirSync(dir);
  
  items.forEach((item, index) => {
    if (ignore.includes(item)) return;
    
    const isLast = index === items.length - 1;
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    output += `${prefix}${isLast ? '└── ' : '├── '}${item}\n`;
    
    if (stats.isDirectory()) {
      output += generateTree(itemPath, `${prefix}${isLast ? '    ' : '│   '}`, ignore);
    }
  });
  
  return output;
}

const structure = generateTree('.');
fs.writeFileSync('architecture.txt', structure);
console.log('✅ Architecture exportée dans architecture.txt');