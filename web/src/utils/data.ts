import fs from 'fs';
import path from 'path';

export interface AppData {
  version: string;
  changelogHTML: string;
}

export function getAppData(): AppData {
  // Kiểm tra thư mục gốc repo (thư mục cha nếu chạy từ thư mục web, hoặc thư mục hiện tại)
  const candidateDirs = [
    path.join(process.cwd(), '..'),
    process.cwd(),
  ];
  
  let version = '2.1.7'; // Default fallback v2.1.7
  let foundRootDir = candidateDirs[0];

  for (const dir of candidateDirs) {
    try {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === 'blessingworship-app' && pkg.version) {
          version = pkg.version;
          foundRootDir = dir;
          break;
        } else if (pkg.version && pkg.name !== 'web') {
          version = pkg.version;
          foundRootDir = dir;
        }
      }
    } catch {
      // Continue search
    }
  }

  let changelogHTML = '';
  try {
    const changelogPath = path.join(foundRootDir, 'changelog.md');
    if (fs.existsSync(changelogPath)) {
      const changelogContent = fs.readFileSync(changelogPath, 'utf8');
      
      // Tìm section của version mới nhất. Format: ## [x.x.x]
      const versionHeader = `## [${version}]`;
      const startIndex = changelogContent.indexOf(versionHeader);
      
      let latestChanges = '';
      if (startIndex !== -1) {
        const contentAfterHeader = changelogContent.substring(startIndex + versionHeader.length);
        const endIndex = contentAfterHeader.indexOf('## [');
        if (endIndex !== -1) {
          latestChanges = contentAfterHeader.substring(0, endIndex);
        } else {
          latestChanges = contentAfterHeader;
        }
      } else {
        latestChanges = changelogContent; 
      }
      changelogHTML = latestChanges.trim();
    }
  } catch (error) {
    console.warn('Could not read changelog.md', error);
  }

  if (!changelogHTML) {
    changelogHTML = `### Bản cập nhật v2.1.6
- **Sửa lỗi chính tả toàn diện trong thư viện bài hát (\`data/songs.json\`):** Rà soát toàn bộ 294 bài hát và hiệu đính 223 lỗi dấu câu chuẩn xác.
- **Tách slide tự động với Enter 2 lần:** Nhấn Enter lần 2 trên dòng trống để tạo ngay slide mới mà không cần thao tác chuột.
- **Kéo thả hoán đổi vị trí slide (Drag & Drop):** Tự do sắp xếp thứ tự các khổ thơ trong bài hát trực quan.
- **Tối ưu trải nghiệm soạn thảo Rich Text & cỡ chữ:** Giữ khung soạn thảo chuẩn mực, đồng bộ hoàn hảo với màn hình xem trước và máy chiếu.
- **Đồng bộ tắt ứng dụng và Live Screen:** Thoát sạch sẽ toàn màn hình phụ trên macOS và Windows khi tắt app.`;
  }

  return {
    version,
    changelogHTML,
  };
}
