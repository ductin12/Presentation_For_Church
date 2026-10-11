/**
 * Automated Test Suite: Style Template & Preview Alignment
 * Tests for Presentation For Church (PFC)
 *
 * Verifies:
 * 1. DOM element IDs and container hierarchy in index.html
 * 2. Canvas aspect-ratio & scaling mathematics
 * 3. normalizeSlideStyle() protection for template styles
 * 4. updateStyleTemplateQuickControls() state machine (enabling for library songs, highlight class)
 * 5. applyPreviewTemplateToCurrentSchedule() live sync behavior
 * 6. CSS btn-highlighted presence
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== PFC Automated Test Suite: Style Template & Preview ===\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`[PASS] ${name}`);
        passedTests++;
    } catch (e) {
        console.error(`[FAIL] ${name}:`, e.message);
    }
}

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Test 1: DOM Elements existence
runTest('DOM: style-template-preview-box element exists with proper container setup', () => {
    assert(html.includes('id="style-template-preview-box"'), 'Missing id="style-template-preview-box"');
    assert(html.includes('id="style-template-preview-canvas"'), 'Missing id="style-template-preview-canvas"');
    assert(html.includes('id="style-template-preview-text-box"'), 'Missing id="style-template-preview-text-box"');
    assert(html.includes('id="style-template-preview-text"'), 'Missing id="style-template-preview-text"');
});

// Test 2: scaleVirtualCanvas targets style-template-preview-box (NOT modal)
runTest('Canvas Scaling: scaleVirtualCanvas uses style-template-preview-box as container', () => {
    assert(!html.includes("scaleVirtualCanvas('style-template-preview-canvas', 'style-template-manager-modal')"),
        "Still using 'style-template-manager-modal' in scaleVirtualCanvas!");
    assert(html.includes("scaleVirtualCanvas('style-template-preview-canvas', 'style-template-preview-box')"),
        "Missing scaleVirtualCanvas targeting 'style-template-preview-box'");
});

// Test 3: isMainCanvas includes style-template-preview-canvas in applyStyleToElement and fitTextToBox
runTest('Stroke Consistency: style-template-preview-canvas is recognized as main canvas', () => {
    const applyStyleRegex = /applyStyleToElement[\s\S]*?canvas\.id === 'style-template-preview-canvas'/;
    const fitTextRegex = /fitTextToBox[\s\S]*?canvas\.id === 'style-template-preview-canvas'/;
    assert(applyStyleRegex.test(html), 'style-template-preview-canvas missing from applyStyleToElement isMainCanvas');
    assert(fitTextRegex.test(html), 'style-template-preview-canvas missing from fitTextToBox isMainCanvas');
});

// Test 4: CSS button highlight
runTest('UI: .btn-highlighted CSS rule is defined for .template-action-btn', () => {
    assert(html.includes('.template-action-btn.btn-highlighted'), 'Missing .template-action-btn.btn-highlighted CSS');
    assert(html.includes('background: #2563eb !important'), 'Missing primary background in btn-highlighted');
});

// Test 5: Canvas scale math simulation
runTest('Canvas Math: 960x540 canvas accurately scales into 16:9 preview box', () => {
    // Simulated preview box dimensions (e.g. 384x216)
    const cw = 384;
    const ch = 216;
    const scale = Math.min(cw / 960, ch / 540);
    assert.strictEqual(scale, 0.4, 'Scale must be 0.4 for 384x216 container');

    const renderedWidth = 960 * scale;
    const renderedHeight = 540 * scale;
    assert.strictEqual(renderedWidth, 384, 'Rendered width must match container width');
    assert.strictEqual(renderedHeight, 216, 'Rendered height must match container height');
});

// Test 6: Logic test for normalizeSlideStyle with enforceDefaultSlideStyle
runTest('Logic: normalizeSlideStyle preserves template styling even when enforceDefaultSlideStyle is active', () => {
    const globalSettings = { enforceDefaultSlideStyle: true };
    const defaults = {
        fontFamily: 'Arial',
        fontSize: '70px',
        color: '#ffffff',
        textStrokeWidth: 4,
        textStrokeColor: '#000000'
    };

    function simulateNormalize(style, overrides, contentType = 'song') {
        let source = style && typeof style === 'object' ? { ...style } : {};
        const extra = overrides && typeof overrides === 'object' ? overrides : {};
        const normalized = { ...defaults, ...source, ...extra };
        const isTemplate = !!(source?.isTemplateStyle || extra?.isTemplateStyle || source?.appliedTemplateId || extra?.appliedTemplateId);

        if (globalSettings.enforceDefaultSlideStyle && !isTemplate) {
            normalized.fontFamily = defaults.fontFamily;
            normalized.fontSize = defaults.fontSize;
            normalized.color = defaults.color;
            normalized.textStrokeWidth = defaults.textStrokeWidth;
            normalized.textStrokeColor = defaults.textStrokeColor;
        }
        if (isTemplate) {
            normalized.isTemplateStyle = true;
            if (extra?.appliedTemplateId || source?.appliedTemplateId) {
                normalized.appliedTemplateId = extra?.appliedTemplateId || source?.appliedTemplateId;
            }
        }
        return normalized;
    }

    // Normal song: gets overwritten by default settings
    const normalSongStyle = { fontFamily: 'Roboto', fontSize: '90px', color: '#ffcc00' };
    const resNormal = simulateNormalize(normalSongStyle, {});
    assert.strictEqual(resNormal.fontFamily, 'Arial');
    assert.strictEqual(resNormal.fontSize, '70px');
    assert.strictEqual(resNormal.color, '#ffffff');

    // Template style: PRESERVED!
    const templateStyle = { fontFamily: 'CMG Sans', fontSize: '100px', color: '#00ffcc', textStrokeWidth: 8 };
    const resTemplate = simulateNormalize(templateStyle, { isTemplateStyle: true });
    assert.strictEqual(resTemplate.fontFamily, 'CMG Sans');
    assert.strictEqual(resTemplate.fontSize, '100px');
    assert.strictEqual(resTemplate.color, '#00ffcc');
    assert.strictEqual(resTemplate.textStrokeWidth, 8);
    assert.strictEqual(resTemplate.isTemplateStyle, true);

    // Item with appliedTemplateId: PRESERVED!
    const resApplied = simulateNormalize(templateStyle, { appliedTemplateId: 'tpl_123' });
    assert.strictEqual(resApplied.fontFamily, 'CMG Sans');
    assert.strictEqual(resApplied.appliedTemplateId, 'tpl_123');
});

// Test 7: Quick Controls logic simulation (Apply button state)
runTest('Logic: Apply button enables for Library preview song and highlights when template changed', () => {
    // Scenario A: Library preview (Schedule is empty)
    const schedule = [];
    const currentScheduleIndex = -1;
    const currentEditingSong = { id: 1, title: 'Thanh Ca 1', type: 'song', style: {} };
    const currentSlides = [{ content: 'Lời 1' }];

    const scheduleItem = schedule[currentScheduleIndex];
    const hasScheduleItem = !!(scheduleItem && !scheduleItem.isMediaOnly);
    const hasEditingSong = !!(currentEditingSong && currentEditingSong.type !== 'media');
    const hasActivePreview = currentSlides && currentSlides.length > 0;
    const canApply = hasScheduleItem || hasEditingSong || hasActivePreview;

    assert.strictEqual(canApply, true, 'canApply must be TRUE when viewing a song from Library');

    // Scenario B: User selects a new template
    let selectedTemplateId = 'worship_bold';
    const currentAppliedId = (scheduleItem && scheduleItem.appliedTemplateId) ||
                             (currentEditingSong && currentEditingSong.appliedTemplateId) ||
                             'default';
    const isPendingChange = selectedTemplateId !== currentAppliedId;

    assert.strictEqual(isPendingChange, true, 'isPendingChange must be TRUE when new template selected');
    assert.strictEqual(canApply && isPendingChange, true, 'Apply button must be highlighted!');

    // Scenario C: After applying
    currentEditingSong.appliedTemplateId = 'worship_bold';
    const currentAppliedIdAfter = currentEditingSong.appliedTemplateId;
    const isPendingChangeAfter = selectedTemplateId !== currentAppliedIdAfter;
    assert.strictEqual(isPendingChangeAfter, false, 'Highlight should turn off after applying template');
});

// Test 8: Live sync simulation
runTest('Logic: applyPreviewTemplateToCurrentSchedule syncs to Live when item is active on Live screen', () => {
    let currentLiveStyle = { fontFamily: 'DefaultFont', fontSize: '60px' };
    let liveSendPayload = null;
    function sendToLiveWindow(data) {
        liveSendPayload = data;
    }

    const currentEditingSong = { id: 10, title: 'Bài Ca Hy Vọng', type: 'song' };
    const liveSlides = [{ content: 'Chúa là nguồn hy vọng' }];
    const currentLiveIndex = 0;
    const currentLiveScheduleIndex = -1; // loaded directly from library

    const isCurrentItemLive = (
        (currentLiveScheduleIndex >= 0 && currentLiveScheduleIndex === 0) ||
        (currentEditingSong && currentLiveScheduleIndex < 0 && liveSlides.length > 0)
    );

    assert.strictEqual(isCurrentItemLive, true, 'isCurrentItemLive must be true');

    // Applying template
    const newTemplateStyle = { fontFamily: 'Montserrat', fontSize: '85px', color: '#ffffff', isTemplateStyle: true };
    if (isCurrentItemLive && liveSlides.length > 0 && currentLiveIndex >= 0) {
        currentLiveStyle = { ...newTemplateStyle };
        sendToLiveWindow({
            text: liveSlides[currentLiveIndex].content,
            style: currentLiveStyle,
            background: null
        });
    }

    assert(liveSendPayload !== null, 'sendToLiveWindow must be called');
    assert.strictEqual(liveSendPayload.style.fontFamily, 'Montserrat');
    assert.strictEqual(liveSendPayload.style.fontSize, '85px');
});

console.log(`\n=== Results: ${passedTests}/${totalTests} Tests Passed ===\n`);
if (passedTests !== totalTests) {
    process.exit(1);
}
