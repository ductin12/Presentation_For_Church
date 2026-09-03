#!/usr/bin/env node

/**
 * PFC Release Publisher
 * Tự động đọc version từ package.json, trích xuất changelog,
 * tạo GitHub Release và upload 4 file bộ cài (Mac arm64, Mac x64, Win Setup, Win Portable).
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const projectDir = process.cwd();
  const pkgPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('❌ Không tìm thấy package.json trong thư mục hiện tại.');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version;
  const tagName = `v${version}`;
  const releaseName = `Presentation For Church ${tagName}`;
  const repo = 'ductin12/Presentation_For_Church';

  console.log(`🚀 Chuẩn bị phát hành: ${releaseName}`);

  // 1. Trích xuất changelog cho version này
  let releaseBody = `## ${releaseName}\n\n`;
  const changelogPath = path.join(projectDir, 'changelog.md');
  if (fs.existsSync(changelogPath)) {
    const clContent = fs.readFileSync(changelogPath, 'utf8');
    const versionRegex = new RegExp(`##\\s*\\[${version}\\][^\n]*\n([\\s\\S]*?)(?=\n##\\s*\\[|$)`, 'i');
    const match = clContent.match(versionRegex);
    if (match && match[1].trim()) {
      releaseBody += match[1].trim();
    } else {
      releaseBody += `Bản cập nhật và tối ưu hóa phiên bản ${tagName}.`;
    }
  } else {
    releaseBody += `Bản cập nhật và tối ưu hóa phiên bản ${tagName}.`;
  }

  // 2. Lấy GitHub Token từ Keychain / Git Credential
  let token = process.env.GITHUB_TOKEN;
  if (!token) {
    try {
      const cred = execSync('printf "protocol=https\\nhost=github.com\\n" | git credential fill', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const tokenMatch = cred.match(/password=(.+)/);
      if (tokenMatch) {
        token = tokenMatch[1].trim();
      }
    } catch (e) {
      // ignore
    }
  }

  if (!token) {
    console.error('❌ Không tìm thấy GitHub token trong Keychain hoặc biến môi trường GITHUB_TOKEN.');
    process.exit(1);
  }

  // 3. Kiểm tra các tệp build trong dist/
  const distDir = path.join(projectDir, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('❌ Không tìm thấy thư mục dist/. Vui lòng chạy build trước (npm run build:all).');
    process.exit(1);
  }

  const expectedFiles = [
    `Presentation.For.Church.macOS.arm64.${version}.dmg`,
    `Presentation.For.Church.macOS.x64.${version}.dmg`,
    `Presentation.For.Church.Setup.${version}.exe`,
    `Presentation.For.Church.Portable.${version}.exe`
  ];

  const filesToUpload = [];
  for (const f of expectedFiles) {
    const fullPath = path.join(distDir, f);
    if (fs.existsSync(fullPath)) {
      filesToUpload.push({ name: f, path: fullPath, size: fs.statSync(fullPath).size });
    } else {
      console.warn(`⚠️ Cảnh báo: Tệp không tồn tại: ${f}`);
    }
  }

  if (filesToUpload.length === 0) {
    console.error('❌ Không tìm thấy bất kỳ tệp cài đặt nào của version ' + version + ' trong dist/.');
    process.exit(1);
  }

  console.log(`📦 Tìm thấy ${filesToUpload.length}/${expectedFiles.length} tệp sẵn sàng upload.`);

  // 4. Tạo GitHub Release
  console.log(`🌐 Đang tạo GitHub Release ${tagName}...`);
  const createRes = await fetch(`https://api.github.com/repos/${repo}/releases`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tag_name: tagName,
      name: releaseName,
      body: releaseBody,
      draft: false,
      prerelease: false
    })
  });

  let releaseData = await createRes.json();
  if (!releaseData.id) {
    // Nếu release hoặc tag đã tồn tại, lấy release hiện có
    console.log('⚠️ Release có thể đã tồn tại, đang thử tìm release hiện có...');
    const getRes = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${tagName}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    releaseData = await getRes.json();
    if (!releaseData.id) {
      console.error('❌ Thất bại khi tạo hoặc truy vấn Release:', releaseData);
      process.exit(1);
    }
  }

  console.log(`✅ GitHub Release: ${releaseData.html_url}`);
  const uploadBaseUrl = releaseData.upload_url.replace(/{.*$/, '');

  // 5. Upload từng asset
  for (const file of filesToUpload) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1);
    const contentType = file.name.endsWith('.dmg') ? 'application/x-apple-diskimage' : 'application/x-msdownload';
    console.log(`⬆️ Đang tải lên: ${file.name} (${sizeMb} MB)...`);

    const fileStream = fs.readFileSync(file.path);
    const uploadRes = await fetch(`${uploadBaseUrl}?name=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': contentType,
        'Content-Length': file.size.toString()
      },
      body: fileStream
    });

    if (uploadRes.ok) {
      console.log(`  ✨ Tải lên thành công: ${file.name}`);
    } else {
      const errText = await uploadRes.text();
      console.error(`  ⚠️ Lỗi khi tải lên ${file.name}:`, errText);
    }
  }

  // 6. Dọn dẹp thư mục dist/ (xóa các thư mục unpacked tạm thời và blockmaps không cần thiết)
  console.log('🧹 Đang dọn dẹp thư mục dist/ để tiết kiệm dung lượng...');
  ['mac', 'mac-arm64', 'win-unpacked'].forEach(dirName => {
    const p = path.join(distDir, dirName);
    if (fs.existsSync(p)) {
      try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) {}
    }
  });

  console.log(`\n🎉 HOÀN TẤT PHÁT HÀNH ${tagName}!`);
  console.log(`🔗 Link: ${releaseData.html_url}`);
}

main().catch(err => {
  console.error('❌ Lỗi không mong muốn:', err);
  process.exit(1);
});
