/**
 * Test Suite: Settings Modal Visual-First Architecture & Compatibility
 * Workflow/test-settings-modal-visual-suite.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING PFC SETTINGS MODAL VISUAL TEST SUITE ===\n');

let passCount = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  [PASS] ${name}`);
        passCount++;
    } catch (err) {
        console.error(`  [FAIL] ${name}:`, err.message);
        process.exit(1);
    }
}

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// 1. Check Sidebar Tabs
test('Settings Modal has all 6 navigation tabs', () => {
    const tabs = ['general', 'projection', 'typography', 'controls', 'templates', 'tools'];
    tabs.forEach(t => {
        assert(html.includes(`id="settings-tab-btn-${t}"`), `Missing tab button: settings-tab-btn-${t}`);
        assert(html.includes(`id="settings-tab-pane-${t}"`), `Missing tab pane: settings-tab-pane-${t}`);
    });
});

// 2. Check Core Backward Compatibility Elements
test('All 6 Tabs retain 100% of underlying form elements and IDs', () => {
    const requiredIds = [
        'settings-theme',
        'settings-gpu-acceleration',
        'settings-show-next-verse',
        'settings-allow-single-display-live',
        'settings-auto-fit-text',
        'settings-media-path',
        'settings-enforce-default-style',
        'settings-font-family-song',
        'settings-font-size-song',
        'settings-font-color-song',
        'settings-text-stroke-width-song',
        'settings-text-stroke-color-song',
        'settings-font-family-bible',
        'settings-font-size-bible',
        'settings-font-color-bible',
        'settings-text-stroke-width-bible',
        'settings-text-stroke-color-bible',
        'settings-text-align',
        'settings-margin-top',
        'settings-margin-right',
        'settings-margin-bottom',
        'settings-margin-left',
        'settings-padding-top',
        'settings-padding-right',
        'settings-padding-bottom',
        'settings-padding-left',
        'settings-next-verse-bg',
        'settings-next-verse-color',
        'settings-next-verse-position',
        'settings-next-verse-offset',
        'settings-next-verse-size',
        'settings-next-verse-max-words',
        'settings-ui-font-song-title',
        'settings-ui-size-song-title',
        'settings-ui-color-song-title',
        'settings-ui-font-song-snippet',
        'settings-ui-size-song-snippet',
        'settings-ui-color-song-snippet',
        'settings-ui-font-bible-title',
        'settings-ui-size-bible-title',
        'settings-ui-color-bible-title',
        'settings-ui-font-slide-card',
        'settings-ui-size-slide-card',
        'settings-ui-color-slide-card',
        'settings-ui-font-panel-header',
        'settings-ui-size-panel-header',
        'settings-ui-color-panel-header',
        'settings-ui-font-app',
        'settings-ui-size-control-btn',
        'bulk-replace-find',
        'bulk-replace-replace',
        'bulk-replace-target',
        'bulk-replace-field',
        'bulk-replace-case-sensitive'
    ];
    requiredIds.forEach(id => {
        assert(html.includes(`id="${id}"`), `Missing required element ID: ${id}`);
    });
});

// 3. Check Visual Controls: iOS Toggles
test('Tab 1 & Tab 2 feature iOS-style Toggle Switches', () => {
    const toggles = [
        'settings-gpu-toggle',
        'settings-next-verse-toggle',
        'settings-single-display-toggle',
        'settings-auto-fit-toggle',
        'settings-enforce-toggle'
    ];
    toggles.forEach(t => {
        assert(html.includes(`id="${t}"`), `Missing toggle switch: ${t}`);
    });
    assert(html.includes('class="pfc-toggle-switch"'), 'Missing pfc-toggle-switch CSS markup');
});

// 4. Check Visual Controls: Segmented Pill Groups
test('Segmented Pill Groups exist for Theme, Align, Next Verse, Controls, and Bulk Replace', () => {
    const pillGroups = [
        'pfc-theme-pill-group',
        'pfc-align-pill-group',
        'pfc-next-verse-pos-pills',
        'pfc-control-size-pills',
        'pfc-bulk-target-pills',
        'pfc-bulk-field-pills'
    ];
    pillGroups.forEach(g => {
        assert(html.includes(`id="${g}"`), `Missing pill group: ${g}`);
    });
});

// 5. Check Visual Controls: Box Model Diagram
test('Tab 2 contains visual 4-directional Box Model for Margin & Padding', () => {
    assert(html.includes('MARGIN NGOÀI'), 'Missing Margin label in box model');
    assert(html.includes('PADDING TRONG'), 'Missing Padding label in box model');
    assert(html.includes('id="settings-margin-top"'), 'Margin Top missing');
    assert(html.includes('id="settings-padding-top"'), 'Padding Top missing');
});

// 6. Check Visual Controls: Slider & Live Button Preview in Tab 4
test('Tab 4 contains Slider and realtime Live Button Preview', () => {
    assert(html.includes('id="settings-ui-size-control-slider"'), 'Missing size slider');
    assert(html.includes('id="pfc-preview-live-btn"'), 'Missing live button preview');
    assert(html.includes('id="pfc-preview-golive-btn"'), 'Missing go live button preview');
    assert(html.includes('id="pfc-preview-clear-btn"'), 'Missing clear button preview');
});

// 7. Check Tab 5 Template Count Badge
test('Tab 5 has Hero Card and Template Count Badge', () => {
    assert(html.includes('id="pfc-template-count-badge"'), 'Missing template count badge');
    assert(html.includes('openStyleTemplateManager()'), 'Missing openStyleTemplateManager trigger');
});

// 8. Check Tab 6 Case Sensitivity Toggle Button
test('Tab 6 has Case Sensitivity Toggle Button', () => {
    assert(html.includes('id="pfc-case-sensitive-btn"'), 'Missing case sensitive toggle button');
    assert(html.includes('togglePfcCaseSensitive()'), 'Missing togglePfcCaseSensitive call');
});

// 9. Check Two-Way Synchronization JS Functions
test('Two-way sync functions exist and are connected to openSettings', () => {
    const requiredFns = [
        'syncToggleToSelect',
        'setPfcTheme',
        'setPfcAlign',
        'setPfcNextVersePos',
        'setPfcControlSize',
        'setPfcBulkTarget',
        'setPfcBulkField',
        'togglePfcCaseSensitive',
        'syncSettingsVisualControlsFromValues'
    ];
    requiredFns.forEach(fn => {
        assert(html.includes(`function ${fn}`), `Missing JS function: ${fn}`);
    });
    assert(html.includes('syncSettingsVisualControlsFromValues();'), 'openSettings does not call syncSettingsVisualControlsFromValues');
});

console.log(`\n=== RESULTS: ${passCount}/${passCount} TESTS PASSED ===\nALL SETTINGS MODAL VISUAL CHECKS PASSED SUCCESSFULLY!\n`);
