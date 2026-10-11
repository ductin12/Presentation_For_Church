#!/usr/bin/env node

/**
 * PFC Telegram Inbound Approval & Remote Command Listener
 * Zero-dependency: Built using native Node.js https module.
 * 
 * Usage:
 *   node scripts/telegram-listener.js --check-approval
 *   node scripts/telegram-listener.js --daemon
 *   node scripts/telegram-listener.js --ack "Tin nhắn phản hồi..."
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env
function loadEnv() {
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
                process.env[key] = val;
            }
        }
    });
}

loadEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = String(process.env.TELEGRAM_CHAT_ID || '').trim();
const STATE_FILE = path.join(__dirname, '../Workflow/.telegram-state.json');

function loadState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        }
    } catch (e) {}
    return { lastUpdateId: 0, lastCommand: null, lastCommandTime: null };
}

function saveState(state) {
    try {
        const dir = path.dirname(STATE_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
        console.warn('Không thể lưu state:', e.message);
    }
}

function makeRequest(method, endpoint, payload = null) {
    return new Promise((resolve, reject) => {
        if (!BOT_TOKEN) {
            return reject(new Error('Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env!'));
        }

        const data = payload ? JSON.stringify(payload) : null;
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/${endpoint}`,
            method: method,
            headers: {}
        };

        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.ok) {
                        resolve(parsed.result);
                    } else {
                        reject(new Error(`Telegram API Error: ${parsed.description || 'Unknown error'}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function sendReply(text) {
    if (!CHAT_ID) return;
    try {
        await makeRequest('POST', 'sendMessage', {
            chat_id: CHAT_ID,
            text: text,
            disable_web_page_preview: true
        });
    } catch (e) {
        console.warn('Lỗi gửi phản hồi Telegram:', e.message);
    }
}

// Kiểm tra xem tin nhắn có chứa lệnh duyệt hay không
function isApprovalCommand(text) {
    if (!text) return false;
    const normalized = text.toLowerCase().trim();
    const approvalPatterns = [
        /^duy[eệ]t\b/i,
        /^ok\b/i,
        /^ti[eế]n h[aà]nh\b/i,
        /^l[aà]m ti[eế]p\b/i,
        /^approve\b/i,
        /^action\b/i,
        /^\/approve\b/i,
        /^\/action\b/i
    ];
    return approvalPatterns.some(p => p.test(normalized));
}

async function checkApproval() {
    const state = loadState();
    let offset = state.lastUpdateId ? state.lastUpdateId + 1 : 0;

    let updates = [];
    try {
        updates = await makeRequest('GET', `getUpdates?offset=${offset}&timeout=5`);
    } catch (err) {
        console.error('Lỗi lấy updates:', err.message);
        return { success: false, error: err.message };
    }

    if (!Array.isArray(updates) || updates.length === 0) {
        console.log(JSON.stringify({ approved: false, message: 'Chưa có tin nhắn mới nào.' }));
        return { approved: false };
    }

    let detectedApproval = null;

    for (const update of updates) {
        if (update.update_id > state.lastUpdateId) {
            state.lastUpdateId = update.update_id;
        }

        const msg = update.message;
        if (!msg || !msg.text) continue;

        // Chỉ chấp nhận tin nhắn từ đúng tài khoản người quản trị
        const fromChatId = String(msg.chat ? msg.chat.id : '');
        if (CHAT_ID && fromChatId !== CHAT_ID) continue;

        const text = msg.text.trim();
        console.log(`[Telegram Listener] Đã nhận tin nhắn từ @${msg.from.username || fromChatId}: "${text}"`);

        if (isApprovalCommand(text)) {
            detectedApproval = {
                text: text,
                from: msg.from.first_name || msg.from.username || 'User',
                date: new Date(msg.date * 1000).toISOString(),
                updateId: update.update_id
            };
            state.lastCommand = text;
            state.lastCommandTime = detectedApproval.date;
        }
    }

    saveState(state);

    if (detectedApproval) {
        await sendReply(`🤖 [PFC AI Agent] Đã nhận lệnh phê duyệt: "${detectedApproval.text}"!\n⚙️ Hệ thống đang tự động kích hoạt Pha Action và bắt đầu thực thi...`);
        const result = {
            approved: true,
            command: detectedApproval.text,
            sender: detectedApproval.from,
            time: detectedApproval.date
        };
        console.log(JSON.stringify(result));
        return result;
    }

    console.log(JSON.stringify({ approved: false, message: 'Tin nhắn mới không phải lệnh duyệt.' }));
    return { approved: false };
}

async function waitForMessage(timeoutSec = 60) {
    const startTime = Date.now();
    const endTime = startTime + (timeoutSec * 1000);
    const state = loadState();

    console.log(`[Telegram Listener] Đang lắng nghe tin nhắn từ chat ${CHAT_ID} (chờ tối đa ${timeoutSec}s)...`);

    while (Date.now() < endTime) {
        let offset = state.lastUpdateId ? state.lastUpdateId + 1 : 0;
        let updates = [];
        try {
            updates = await makeRequest('GET', `getUpdates?offset=${offset}&timeout=10`);
        } catch (err) {
            console.error('[Telegram Listener] Lỗi kết nối:', err.message);
            await new Promise(r => setTimeout(r, 2000));
            continue;
        }

        if (Array.isArray(updates) && updates.length > 0) {
            for (const update of updates) {
                if (update.update_id > state.lastUpdateId) {
                    state.lastUpdateId = update.update_id;
                }
                const msg = update.message;
                if (!msg || !msg.text) continue;
                const fromChatId = String(msg.chat ? msg.chat.id : '');
                if (CHAT_ID && fromChatId !== CHAT_ID) continue;

                const text = msg.text.trim();
                const approved = isApprovalCommand(text);
                const sender = msg.from.first_name || msg.from.username || 'User';
                const date = new Date(msg.date * 1000).toISOString();

                state.lastCommand = text;
                state.lastCommandTime = date;
                saveState(state);

                await sendReply(`🤖 [PFC AI Agent] Đã nhận lệnh từ bạn: "${text}"\n⚡ Trạng thái: ${approved ? 'Đã duyệt! Đang thực thi...' : 'Đang xử lý...'}`);

                const result = {
                    received: true,
                    approved: approved,
                    command: text,
                    sender: sender,
                    time: date
                };
                console.log(JSON.stringify(result));
                return result;
            }
            saveState(state);
        }
    }

    const result = { received: false, message: `Hết thời gian chờ (${timeoutSec}s).` };
    console.log(JSON.stringify(result));
    return result;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--check-approval')) {
        await checkApproval();
        return;
    }

    if (args.includes('--wait')) {
        const waitIdx = args.indexOf('--wait');
        const timeout = parseInt(args[waitIdx + 1], 10) || 60;
        await waitForMessage(timeout);
        return;
    }

    if (args.includes('--ack') && args[args.indexOf('--ack') + 1]) {
        const replyText = args[args.indexOf('--ack') + 1];
        await sendReply(replyText);
        console.log('✅ Đã gửi phản hồi xác nhận qua Telegram.');
        return;
    }

    if (args.includes('--init-offset')) {
        // Đồng bộ offset hiện tại để bỏ qua các tin nhắn cũ
        const state = loadState();
        const updates = await makeRequest('GET', 'getUpdates?offset=0');
        if (updates.length > 0) {
            state.lastUpdateId = updates[updates.length - 1].update_id;
            saveState(state);
            console.log(`✅ Đã đồng bộ offset tới update_id: ${state.lastUpdateId}`);
        } else {
            console.log('Không có updates nào cần đồng bộ.');
        }
        return;
    }

    console.log('Hướng dẫn: node scripts/telegram-listener.js --check-approval | --wait <seconds> | --init-offset');
}

main().catch(err => {
    console.error('Lỗi:', err.message);
    process.exit(1);
});
