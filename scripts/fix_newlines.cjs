const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(f)) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('\\n')) {
        const fixed = content.split('\\n').join('\n');
        fs.writeFileSync(full, fixed, 'utf8');
        console.log('Fixed', full);
      }
    }
  });
}

walk(path.join(__dirname, '..', 'src'));
console.log('Done');
