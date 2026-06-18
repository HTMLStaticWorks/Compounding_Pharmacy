const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\prath\\.gemini\\antigravity-ide\\brain\\defc49d3-09ed-4a84-b40a-3e4af976e3c4\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist at ' + logPath);
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');
console.log('Total lines in log:', lines.length);

for (const line of lines) {
  if (line.includes('index.html') && line.includes('<!DOCTYPE html>')) {
    try {
      const data = JSON.parse(line);
      let html = '';
      
      // Check if file content is in type VIEW_FILE or in content
      if (data.type === 'VIEW_FILE' && data.content) {
        html = data.content;
      } else if (data.content && data.content.includes('<!DOCTYPE html>')) {
        html = data.content;
      }
      
      if (!html) {
        // Fallback: extract using regex from raw JSON line to get the original text
        const match = line.match(/"([^"]*<!DOCTYPE html>[^"]*)"/);
        if (match) {
          html = match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\"/g, '"')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
        }
      }
      
      if (html) {
        // Clean up line numbers if any (like '1: <!DOCTYPE html>')
        if (html.includes('1: <!DOCTYPE html>')) {
          html = html.split('\n').map(l => {
            const m = l.match(/^\s*\d+:\s?(.*)$/);
            return m ? m[1] : l;
          }).join('\n');
        }
        
        // Remove trailing and leading formatting wrapper if present
        if (html.startsWith('Created At:')) {
          const linesOfHtml = html.split('\n');
          const fileStartIdx = linesOfHtml.findIndex(l => l.includes('<!DOCTYPE html>'));
          if (fileStartIdx !== -1) {
            html = linesOfHtml.slice(fileStartIdx).join('\n');
          }
        }
        
        // Additional cleanup: if there is a trailing block showing it does not show the entire content, slice it
        const trailingMarker = 'The above content shows the entire, complete file contents';
        if (html.includes(trailingMarker)) {
          html = html.split(trailingMarker)[0];
        }
        const trailingMarker2 = 'The above content does NOT show the entire file contents';
        if (html.includes(trailingMarker2)) {
          html = html.split(trailingMarker2)[0];
        }

        html = html.trim() + '\n';
        
        fs.writeFileSync('c:\\Users\\prath\\OneDrive\\Desktop\\Websites\\June_1\\Compounding Pharmacy\\index.html', html);
        console.log('Successfully recovered index.html!');
        process.exit(0);
      }
    } catch (e) {
      console.error('Failed to parse line:', e.message);
    }
  }
}

console.log('Could not find index.html contents in log.');
