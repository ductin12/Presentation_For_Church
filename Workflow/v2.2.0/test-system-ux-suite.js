/**
 * Automated Verification & Testing Suite for System & UX Audit V2
 * Presentation For Church (PFC) v2.2.0
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING PFC SYSTEM & UX AUDIT TEST SUITE (v2.2.0) ===\n');

const rootDir = path.resolve(__dirname, '../../');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const liveHtml = fs.readFileSync(path.join(rootDir, 'live.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(rootDir, 'main.js'), 'utf8');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  [PASS] ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  [FAIL] ${name}:`, err.message);
    }
}

// 1. Version Bump Checks
test('Version in package.json is 2.2.0', () => {
    assert.strictEqual(packageJson.version, '2.2.0');
});

test('Version display in index.html status bar is v2.2.0', () => {
    assert.ok(indexHtml.includes('v2.2.0'), 'index.html must display v2.2.0');
    assert.ok(indexHtml.includes('id="app-version-display"'), 'app-version-display element must exist');
});

// 2. Settings Modal 6-Tab Architecture
test('Settings modal has 6 tab buttons', () => {
    const tabs = ['general', 'projection', 'typography', 'controls', 'templates', 'tools'];
    for (const tab of tabs) {
        assert.ok(indexHtml.includes(`id="settings-tab-btn-${tab}"`), `Tab button ${tab} must exist`);
        assert.ok(indexHtml.includes(`id="settings-tab-pane-${tab}"`), `Tab pane ${tab} must exist`);
    }
});

test('switchSettingsTab function exists and handles active styling', () => {
    assert.ok(indexHtml.includes('function switchSettingsTab(tabId)'), 'switchSettingsTab must exist');
    assert.ok(indexHtml.includes("btn.classList.add('active')"), 'active tab styling class must exist');
});

// 3. Song Search Snippet Typography
test('Song search snippet CSS variables and classes exist in index.html', () => {
    assert.ok(indexHtml.includes('--ui-song-snippet-font:'), 'CSS variable --ui-song-snippet-font must exist');
    assert.ok(indexHtml.includes('--ui-song-snippet-size:'), 'CSS variable --ui-song-snippet-size must exist');
    assert.ok(indexHtml.includes('--ui-song-snippet-color:'), 'CSS variable --ui-song-snippet-color must exist');
    assert.ok(indexHtml.includes('.song-snippet-text'), '.song-snippet-text class must exist');
    assert.ok(indexHtml.includes('.song-snippet-text.custom-color'), '.song-snippet-text.custom-color must exist');
});

test('Song search snippet input fields exist in Settings Modal', () => {
    assert.ok(indexHtml.includes('id="settings-ui-font-song-snippet"'), 'settings-ui-font-song-snippet must exist');
    assert.ok(indexHtml.includes('id="settings-ui-size-song-snippet"'), 'settings-ui-size-song-snippet must exist');
    assert.ok(indexHtml.includes('id="settings-ui-color-song-snippet"'), 'settings-ui-color-song-snippet must exist');
    assert.ok(indexHtml.includes('id="settings-ui-color-song-snippet-enable"'), 'settings-ui-color-song-snippet-enable must exist');
});

test('main.js and index.html default settings contain song snippet fields', () => {
    assert.ok(mainJs.includes('uiFontFamilySongSnippet'), 'main.js defaults must include uiFontFamilySongSnippet');
    assert.ok(mainJs.includes('uiFontSizeSongSnippet'), 'main.js defaults must include uiFontSizeSongSnippet');
    assert.ok(mainJs.includes('uiColorSongSnippet'), 'main.js defaults must include uiColorSongSnippet');
    assert.ok(indexHtml.includes('uiFontFamilySongSnippet'), 'index.html defaults must include uiFontFamilySongSnippet');
});

test('saveSettings converts comma to dot for numeric inputs', () => {
    assert.ok(indexHtml.includes(".replace(',', '.')"), 'saveSettings must parse commas to dots');
});

// 4. Style Templates & Box Enhancements
test('Style Template box padding inputs exist in index.html', () => {
    assert.ok(indexHtml.includes('id="style-template-box-padding-top"'), 'box padding top must exist');
    assert.ok(indexHtml.includes('id="style-template-box-padding-right"'), 'box padding right must exist');
    assert.ok(indexHtml.includes('id="style-template-box-padding-bottom"'), 'box padding bottom must exist');
    assert.ok(indexHtml.includes('id="style-template-box-padding-left"'), 'box padding left must exist');
});

test('Style Template preview background switcher buttons exist', () => {
    assert.ok(indexHtml.includes("onclick=\"setStyleTemplatePreviewBg('black')\""), 'black bg button must exist');
    assert.ok(indexHtml.includes("onclick=\"setStyleTemplatePreviewBg('checker')\""), 'checker bg button must exist');
    assert.ok(indexHtml.includes("onclick=\"setStyleTemplatePreviewBg('scenic')\""), 'scenic bg button must exist');
    assert.ok(indexHtml.includes('function setStyleTemplatePreviewBg(type)'), 'setStyleTemplatePreviewBg function must exist');
});

test('live.html and index.html normalize and apply boxStyle.padding', () => {
    assert.ok(liveHtml.includes('boxStyle.padding'), 'live.html must handle boxStyle.padding');
    assert.ok(liveHtml.includes('el.style.padding'), 'live.html must apply boxStyle.padding to el.style.padding');
    assert.ok(indexHtml.includes('boxPad = (style.boxStyle'), 'index.html applyStyleToElement must include boxPad');
});

// 5. Chords System
test('Chords toggle button exists in Preview header', () => {
    assert.ok(indexHtml.includes('id="btn-toggle-chords"'), 'btn-toggle-chords must exist in Preview header');
    assert.ok(indexHtml.includes('function toggleChordsDisplay()'), 'toggleChordsDisplay function must exist');
});

test('renderChordsHTML properly wraps chords and handles showChordsOnMonitor', () => {
    assert.ok(indexHtml.includes('let showChordsOnMonitor = true;'), 'showChordsOnMonitor state must exist');
    assert.ok(indexHtml.includes('if (!showChordsOnMonitor)'), 'renderChordsHTML must check showChordsOnMonitor');
    assert.ok(indexHtml.includes('updateEditorPreview(htmlOrText)'), 'updateEditorPreview exists');
    assert.ok(indexHtml.includes('renderChordsHTML(htmlOrText || \'\')'), 'updateEditorPreview calls renderChordsHTML');
});

// 6. Safe Shortcuts & Tooltips
test('Clear Live shortcut in main.js is CmdOrCtrl+K (avoiding macOS Hide App clash)', () => {
    assert.ok(mainJs.includes("{ label: 'Clear Live', accelerator: 'CmdOrCtrl+K'"), 'main.js accelerator must be CmdOrCtrl+K');
    assert.ok(!mainJs.includes("{ label: 'Clear Live', accelerator: 'CmdOrCtrl+H'"), 'CmdOrCtrl+H must not be used for Clear Live');
});

test('Global keydown listener handles F5, Space, and Escape safely', () => {
    assert.ok(indexHtml.includes("if (e.key === 'F5')"), 'keydown must handle F5');
    assert.ok(indexHtml.includes("if (e.key === 'Escape')"), 'keydown must handle Escape');
    assert.ok(indexHtml.includes("e.code === 'Space'"), 'keydown must handle Space');
});

test('Header control buttons have data-tooltip and tooltip positions', () => {
    assert.ok(indexHtml.includes('data-tooltip="Go Live (Shift+Enter / F5)"'), 'Go Live tooltip must exist');
    assert.ok(indexHtml.includes('data-tooltip="Bật/Tắt Cửa Sổ Live (Ctrl/Cmd+L)"'), 'Screen Live tooltip must exist');
    assert.ok(indexHtml.includes('data-tooltip="Xóa nội dung chiếu (Ctrl/Cmd+K)"'), 'Clear Live tooltip must exist');
});

// 7. Song Editor Modal Polish
test('Song Editor modal has localized title, tabs, and action buttons', () => {
    assert.ok(indexHtml.includes('Soạn lời (Slides)</div>'), 'Aside tab must be Soạn lời (Slides)');
    assert.ok(indexHtml.includes('onclick="saveSong(false)">Áp dụng</button>'), 'Apply button must be localized to Áp dụng');
    assert.ok(indexHtml.includes('onclick="saveSong(true)">Lưu & Đóng</button>'), 'OK button must be localized to Lưu & Đóng');
    assert.ok(indexHtml.includes('onclick="closeSongEditor()">Hủy</button>'), 'Cancel button must be localized to Hủy');
    assert.ok(indexHtml.includes('placeholder="Nhập tên bài hát..."'), 'Song title placeholder must be localized');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
    console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
    process.exit(0);
} else {
    console.error('SOME VERIFICATION CHECKS FAILED!\n');
    process.exit(1);
}
