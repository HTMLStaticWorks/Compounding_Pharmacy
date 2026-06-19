const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
if (!fs.existsSync(historyDir)) {
  console.log('VS Code Local History folder does not exist at ' + historyDir);
  process.exit(1);
}

console.log('Searching VS Code Local History at:', historyDir);
let foundCount = 0;

function walk(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        try {
          // Check if file size is reasonable for index.html
          if (stat.size > 15000 && stat.size < 35000) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('CompoundRx') && content.includes('Apothecary and Lab Compounding') && content.includes('Who Choose Us')) {
              console.log('Found candidate local history file:', fullPath, 'Size:', stat.size);
              fs.writeFileSync('c:\\Users\\prath\\OneDrive\\Desktop\\Websites\\June_1\\Compounding Pharmacy\\recovered_history.html', content);
              foundCount++;
            }
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
}

walk(historyDir);
console.log('Search complete. Found files:', foundCount);
if (foundCount > 0) {
  process.exit(0);
} else {
  process.exit(1);
}
