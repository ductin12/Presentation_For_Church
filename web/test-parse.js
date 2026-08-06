const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), '..');
console.log('rootDir:', rootDir);

try {
  const changelogPath = path.join(rootDir, 'changelog.md');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  console.log('Loaded changelog length:', changelogContent.length);
  
  const version = '2.0.1';
  const versionRegex = new RegExp(`## \\\[${version}\\\](.*?)## \\\[`, 's');
  const match = changelogContent.match(versionRegex);
  if (match) {
    console.log('Matched latest changes length:', match[1].length);
  } else {
    console.log('Regex did not match!');
  }
} catch (e) {
  console.error(e);
}
