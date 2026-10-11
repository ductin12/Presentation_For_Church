#!/usr/bin/env node

/**
 * PFC Telegram Notification & Remote Gate Bridge
 * Zero-dependency: Built using native Node.js https module.
 * 
 * Usage:
 *   node scripts/telegram-notify.js --text "Nội dung thông báo..."
 *   node scripts/telegram-notify.js --file "Workflow/WF-...-PLAN.md" --title "Kế hoạch mới"
 *   node scripts/telegram-notify.js --check
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env if present
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
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function makeRequest(method, endpoint, payload) {
    return new Promise((resolve, reject) => {
        if (!BOT_TOKEN) {
            return reject(new Error('Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env hoặc biến môi trường!'));
        }

        const data = JSON.stringify(payload);
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/${endpoint}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

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
        req.write(data);
        req.end();
    });
}

async function sendTextMessage(text, extra = {}) {
    if (!CHAT_ID) {
        throw new Error('Chưa cấu hình TELEGRAM_CHAT_ID trong file .env hoặc biến môi trường!');
    }
    try {
        return await makeRequest('POST', 'sendMessage', {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            ...extra
        });
    } catch (err) {
        // Fallback tự động gửi plain text nếu Telegram không parse được markdown
        if (err.message && err.message.includes('can\'t parse entities')) {
            return await makeRequest('POST', 'sendMessage', {
                chat_id: CHAT_ID,
                text: text,
                disable_web_page_preview: true,
                ...extra
            });
        }
        throw err;
    }
}

async function sendDocumentFile(filePath, caption = '') {
    if (!CHAT_ID || !BOT_TOKEN) return;
    const boundary = '----TelegramBoundary' + Date.now();
    const filename = path.basename(filePath);
    const fileData = fs.readFileSync(filePath);

    let parts = [
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${filename}"\r\nContent-Type: text/markdown\r\n\r\n`),
        fileData,
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ];

    const payload = Buffer.concat(parts);

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/sendDocument`,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': payload.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.ok) resolve(parsed.result);
                    else reject(new Error(parsed.description || 'Lỗi gửi file'));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// Tạo trang đọc nhanh trên Telegra.ph (Instant View) cho điện thoại
async function publishTelegraph(title, textContent) {
    try {
        const lines = textContent.split('\n');
        const nodes = [];
        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('# ')) {
                nodes.push({ tag: 'h3', children: [trimmed.replace(/^#\s*/, '')] });
            } else if (trimmed.startsWith('## ')) {
                nodes.push({ tag: 'h4', children: [trimmed.replace(/^##\s*/, '')] });
            } else {
                nodes.push({ tag: 'p', children: [trimmed] });
            }
        }

        const payload = JSON.stringify({
            access_token: '057f6e1f5dabaab037cb8ecd4dafd5067837607d9e55c7efb11f78046938',
            title: title.slice(0, 100),
            author_name: 'PFC AI Agent',
            content: JSON.stringify(nodes.slice(0, 100)),
            return_content: false
        });

        return new Promise((resolve) => {
            const req = https.request({
                hostname: 'api.telegra.ph',
                port: 443,
                path: '/createPage',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            }, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(body);
                        if (parsed.ok && parsed.result && parsed.result.url) {
                            resolve(parsed.result.url);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            });
            req.on('error', () => resolve(null));
            req.write(payload);
            req.end();
        });
    } catch (e) {
        return null;
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--check')) {
        console.log('=== TELEGRAM BRIDGE HEALTH CHECK ===');
        if (!BOT_TOKEN) {
            console.log('⚠️  TELEGRAM_BOT_TOKEN: Chưa cấu hình (Xem file .env.example)');
            process.exit(0);
        }
        if (!CHAT_ID) {
            console.log('⚠️  TELEGRAM_CHAT_ID: Chưa cấu hình (Xem file .env.example)');
            process.exit(0);
        }
        try {
            const me = await makeRequest('GET', 'getMe', {});
            console.log(`✅ Kết nối Bot thành công! Tên bot: @${me.username} (${me.first_name})`);
            console.log(`✅ Chat ID mục tiêu: ${CHAT_ID}`);
            console.log('Sẵn sàng gửi thông báo từ xa!');
        } catch (err) {
            console.error('❌ Lỗi kết nối Telegram:', err.message);
        }
        return;
    }

    const textIdx = args.indexOf('--text');
    if (textIdx !== -1 && args[textIdx + 1]) {
        const text = args[textIdx + 1];
        if (!BOT_TOKEN || !CHAT_ID) {
            console.log('[Telegram Bridge] Bỏ qua thông báo (chưa cấu hình token).');
            return;
        }
        try {
            await sendTextMessage(text);
            console.log('✅ Đã gửi thông báo đến Telegram thành công!');
        } catch (err) {
            console.warn('⚠️  Không thể gửi tin nhắn Telegram:', err.message);
        }
        return;
    }

    const fileIdx = args.indexOf('--file');
    if (fileIdx !== -1 && args[fileIdx + 1]) {
        const filePath = path.resolve(args[fileIdx + 1]);
        if (!fs.existsSync(filePath)) {
            console.error('File không tồn tại:', filePath);
            return;
        }
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // Khử toàn bộ các đường dẫn file:/// cục bộ để người dùng trên điện thoại không bấm nhầm link chết
        fileContent = fileContent.replace(/\[([^\]]+)\]\(file:\/\/\/[^\)]+\)/g, '$1');

        const titleIdx = args.indexOf('--title');
        const rawTitle = (titleIdx !== -1 && args[titleIdx + 1]) ? args[titleIdx + 1] : path.basename(filePath);
        const title = `*${rawTitle}*\n\n`;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.log('[Telegram Bridge] Bỏ qua gửi file (chưa cấu hình token).');
            return;
        }

        try {
            // 1. Tạo link đọc nhanh Telegra.ph
            const telegraphUrl = await publishTelegraph(rawTitle, fileContent);
            let instantViewBlock = '';
            if (telegraphUrl) {
                instantViewBlock = `\n\n⚡ *Đọc báo cáo trực tiếp trên điện thoại (Instant View):*\n${telegraphUrl}`;
            }

            // 2. Gửi tóm tắt + link Instant View
            const summary = fileContent.slice(0, 3000) + (fileContent.length > 3000 ? '\n\n...(Nội dung chi tiết xem file đính kèm)' : '');
            await sendTextMessage(`${title}${summary}${instantViewBlock}`, { disable_web_page_preview: false });
            console.log('✅ Đã gửi nội dung văn bản & Instant View đến Telegram thành công!');

            // 3. Gửi đính kèm file tài liệu gốc (.md)
            await sendDocumentFile(filePath, `📄 File báo cáo chi tiết: ${path.basename(filePath)}`);
            console.log('✅ Đã gửi đính kèm file tài liệu gốc đến Telegram thành công!');
        } catch (err) {
            console.warn('⚠️  Lỗi gửi tài liệu Telegram:', err.message);
        }
        return;
    }

    console.log('Hướng dẫn: node scripts/telegram-notify.js --text "Lời nhắn" hoặc --file <path> --title <title>');
}

main().catch(err => {
    console.warn('[Telegram Bridge Warning]:', err.message);
});
