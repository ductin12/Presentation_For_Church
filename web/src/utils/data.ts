import fs from 'fs';
import path from 'path';

export interface AppData {
  version: string;
  changelogHTML: string;
}

export function getAppData(): AppData {
  // Đường dẫn trỏ ra thư mục gốc của repo
  const rootDir = path.join(process.cwd(), '..');
  
  let version = '2.0.1'; // Default fallback
  try {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkgContent = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    if (pkg.version) {
      version = pkg.version;
    }
  } catch (error) {
    console.warn('Could not read parent package.json, using fallback version.');
  }

  let changelogHTML = '';
  try {
    const changelogPath = path.join(rootDir, 'changelog.md');
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    // Tìm section của version mới nhất. Format thường là: ## [x.x.x] - YYYY-MM-DD
    const versionRegex = new RegExp(`## \\\\[${version}\\\\](.*?)## \\\\[`, 's');
    let latestChanges = '';
    const match = changelogContent.match(versionRegex);
    if (match) {
      latestChanges = match[1];
    } else {
      // Nếu không parse được theo cấu trúc trên, lấy toàn bộ hoặc lấy một khúc
      latestChanges = changelogContent; 
    }
    changelogHTML = latestChanges.trim(); // Chúng ta sẽ parse markdown bằng marked ở component
  } catch (error) {
    console.warn('Could not read changelog.md');
  }

  return {
    version,
    changelogHTML,
  };
}
