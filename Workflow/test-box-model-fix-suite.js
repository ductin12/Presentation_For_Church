const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passCount++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failCount++;
    }
}

console.log('====================================================');
console.log('🧪 PFC AUTOMATED TEST SUITE: BOX MODEL & SCROLL FIX');
console.log('====================================================\n');

const indexPath = path.join(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Test 1: Kiểm tra cú pháp tất cả các thẻ <script> trong index.html
console.log('--- Test 1: Syntax Check Toàn Bộ Script Trong index.html ---');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
let scriptSyntaxOk = true;

while ((match = scriptRegex.exec(indexHtml)) !== null) {
    const scriptContent = match[1];
    if (scriptContent.trim()) {
        scriptIdx++;
        try {
            new vm.Script(scriptContent, { filename: `index.html#script-${scriptIdx}` });
        } catch (e) {
            scriptSyntaxOk = false;
            console.error(`  ❌ Script ${scriptIdx} lỗi cú pháp:`, e.message);
        }
    }
}
assert(scriptSyntaxOk && scriptIdx > 0, `Toàn bộ ${scriptIdx} khối thẻ <script> đạt 100% cú pháp hợp lệ`);

// Test 2: Bảo toàn 100% 8 DOM IDs của Box Model
console.log('\n--- Test 2: Kiểm tra 8 DOM Input IDs của Box Model ---');
const requiredIds = [
    'settings-margin-top',
    'settings-margin-left',
    'settings-margin-right',
    'settings-margin-bottom',
    'settings-padding-top',
    'settings-padding-left',
    'settings-padding-right',
    'settings-padding-bottom'
];

requiredIds.forEach(id => {
    const hasId = indexHtml.includes(`id="${id}"`);
    assert(hasId, `Tồn tại phần tử DOM với ID: #${id}`);
});

// Test 3: Cấu trúc đồng tâm & Giới hạn chiều rộng max-w-[340px]
console.log('\n--- Test 3: Kiểm tra cấu trúc Box Model & Chống tràn viền ---');
assert(indexHtml.includes('max-w-[340px] mx-auto'), 'Khung Box Model có giới hạn max-w-[340px] mx-auto căn giữa tuyệt đối');
assert(indexHtml.includes('SLIDE TEXT'), 'Lõi trung tâm có nhãn "SLIDE TEXT" nằm giữa 2 ô padding trái/phải');
assert(indexHtml.includes('overflow-x-hidden'), 'Tab Trình chiếu & Slide đã được gắn overflow-x-hidden chặn vĩnh viễn thanh cuộn ngang');

// Test 4: Đối xứng 4 hướng và phân lớp Hộp ngoài (Margin) / Hộp trong (Padding)
console.log('\n--- Test 4: Phân lớp Margin ngoài / Padding trong chuẩn DevTools ---');
assert(indexHtml.includes('MARGIN NGOÀI'), 'Có nhãn chỉ dẫn MARGIN NGOÀI rõ ràng');
assert(indexHtml.includes('PADDING TRONG'), 'Có nhãn chỉ dẫn PADDING TRONG rõ ràng');

console.log('\n====================================================');
console.log(`📊 TỔNG KẾT TEST SUITE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
