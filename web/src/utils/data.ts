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
    const versionHeader = `## [${version}]`;
    const startIndex = changelogContent.indexOf(versionHeader);
    
    let latestChanges = '';
    if (startIndex !== -1) {
      // Bỏ qua dòng header ## [x.x.x]
      const contentAfterHeader = changelogContent.substring(startIndex + versionHeader.length);
      // Tìm header của phiên bản tiếp theo
      const endIndex = contentAfterHeader.indexOf('## [');
      if (endIndex !== -1) {
        latestChanges = contentAfterHeader.substring(0, endIndex);
      } else {
        latestChanges = contentAfterHeader;
      }
    } else {
      latestChanges = changelogContent; 
    }
    changelogHTML = latestChanges.trim(); // Chúng ta sẽ parse markdown bằng marked ở component
  } catch (error) {
    console.warn('Could not read changelog.md', error);
  }

  return {
    version,
    changelogHTML,
  };
}
