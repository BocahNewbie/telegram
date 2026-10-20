//Craft Beef Satuan
const { TelegramClient } = require('telegram');
const { StoreSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const input = require('input');

const apiId = 37104417;
const apiHash = 'bf947a0fb655cd13aa78dbd4cf775199'; 
const stringSession = new StoreSession('session_konoha');

async function main() {
    console.log('Menghubungkan ke Telegram...');
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Masukkan nomor HP Telegrammu (contoh: +628xxx): '),
        password: async () => await input.text('Masukkan Password 2FA (jika ada): '),
        phoneCode: async () => await input.text('Masukkan kode OTP yang masuk ke Telegram: '),
        onError: (err) => console.log(err),
    });

    console.log('Berhasil login! Userbot Crafting aktif...');

    client.addEventHandler(async (event) => {
        const message = event.message;
        if (!message || !message.text) return;

        const text = message.text;
        let replyText = '';

        // Pola Regex tangkapan pesan crafting
        if (/Pembelian Berhasil!/i.test(text)) {
            replyText = "Craft beef";
        }
        else if (/Crafting Berhasil!/i.test(text)) {
            replyText = "Craft Beef";
        }
        else if (/Energi tidak cukup/i.test(text)) {
            replyText = "Use Pizza";
        }
        else if (/Makanan telah dinikmati!/i.test(text)) {
            replyText = "Craft Beef";
        }
        else if (/Material Tidak Cukup/i.test(text)) {
            replyText = "Buy Sapi 99";
        }

        if (replyText) {
            console.log(`[TERDETEKSI] Pesan game masuk: "${text.substring(0, 30)}..."`);
            console.log(`Mengirim balasan otomatis: "${replyText}"`);
            
            setTimeout(async () => {
                try {
                    await client.sendMessage(message.chatId, {
                        message: replyText,
                        replyTo: message.id 
                    });
                    console.log('Berhasil mengirim balasan!');
                } catch (err) {
                    console.log('Gagal mengirim pesan:', err);
                }
            }, 1500);
        }
    }, new NewMessage({ incoming: true }));
}

main();


//Mancing
const { TelegramClient } = require('telegram');
const { StoreSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const input = require('input');

const apiId = 37104417;
const apiHash = 'bf947a0fb655cd13aa78dbd4cf775199'; 
const stringSession = new StoreSession('session_konoha');

async function main() {
    console.log('Menghubungkan ke Telegram...');
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Masukkan nomor HP Telegrammu (contoh: +628xxx): '),
        password: async () => await input.text('Masukkan Password 2FA (jika ada): '),
        phoneCode: async () => await input.text('Masukkan kode OTP yang masuk ke Telegram: '),
        onError: (err) => console.log(err),
    });

    console.log('Berhasil login! Userbot aktif dan siap memantau pesan masuk...');

    let lastLocation = 'Fish River'; // Default lokasi mancing

    // Menggunakan event NewMessage bawaan GramJS yang lebih akurat
    client.addEventHandler(async (event) => {
        const message = event.message;
        if (!message || !message.text) return;

        const text = message.text;
        let replyText = '';

        // 1. Cek aturan berdasarkan JSON/kondisi game
        if (text.includes('Energi Tidak Cukup')) {
            replyText = 'Use Pizza';
        } 
        else if (
            text.includes('Kamu Mendapat Ikan!') ||
            text.includes('Wow! Tangkapan Langka!') ||
            text.includes('Ups! Kamu Mendapat Sampah!') ||
            text.includes('Tangkapan Keberuntungan!') ||
            text.includes('Makanan Telah Dinikmati!') ||
            text.includes('Ikan Legendaris Tertangkap!') ||
            text.includes('Item Langka Ditemukan!') ||
            text.includes('Equipment Dipakai!') ||
	    text.includes('MASIH PINGSAN')
        ) {
            // Mengikuti lokasi terakhir (River atau Sea)
            replyText = lastLocation;
        }

        // 2. Jika ada balasan yang cocok, kirimkan dengan fitur reply (mengutip pesan)
        if (replyText) {
            console.log(`[TERDETEKSI] Pesan game masuk: "${text.substring(0, 30)}..."`);
            console.log(`Mengirim balasan otomatis: "${replyText}"`);
            
            setTimeout(async () => {
                try {
                    await client.sendMessage(message.chatId, {
                        message: replyText,
                        replyTo: message.id 
                    });
                    console.log('Berhasil mengirim balasan!');
                } catch (err) {
                    console.log('Gagal mengirim pesan:', err);
                }
            }, 1500); // Jeda 1.5 detik
        }

        // 3. Memantau pesan yang KELUAR dari akunmu sendiri untuk mendeteksi pilihan lokasi
        if (message.out) {
            if (text.toLowerCase().includes('fish river')) {
                lastLocation = 'Fish River';
                console.log('Lokasi diset ke: Fish River');
            } else if (text.toLowerCase().includes('fish sea')) {
                lastLocation = 'Fish Sea';
                console.log('Lokasi diset ke: Fish Sea');
            }
        }
    }, new NewMessage({ incoming: true, outgoing: true }));
}

main();

//Belanja
const { TelegramClient } = require('telegram');
const { StoreSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const input = require('input');

const apiId = 37104417;
const apiHash = 'bf947a0fb655cd13aa78dbd4cf775199'; 
const stringSession = new StoreSession('session_konoha');

async function main() {
    console.log('Menghubungkan ke Telegram...');
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Masukkan nomor HP Telegrammu (contoh: +628xxx): '),
        password: async () => await input.text('Masukkan Password 2FA (if any): '),
        phoneCode: async () => await input.text('Masukkan kode OTP yang masuk ke Telegram: '),
        onError: (err) => console.log(err),
    });

    console.log('Berhasil login! Userbot siap memantau aktivitas merchant/pertanian...');

    let isPaused = false;

    client.addEventHandler(async (event) => {
        const message = event.message;
        if (!message || !message.text) return;

        const text = message.text;

        // Kontrol Pause / Resume lewat ketikan manualmu sendiri
        if (message.out) {
            if (text.toLowerCase() === 'pause') {
                isPaused = true;
                console.log('--- BOT DI-PAUSE ---');
                return;
            } else if (text.toLowerCase() === 'resume') {
                isPaused = false;
                console.log('--- BOT DILANJUTKAN ---');
                return;
            }
        }

        if (isPaused) return;

        let replyText = '';

        // Menerapkan pola Regex sesuai JSON kamu
        // 1. Pola Sisa Stok besar (>100) -> Buy [Item] 99
        let matchStokBesar = text.match(/\d+×\s*.*?([A-Za-z]+(?:\s+[A-Za-z]+)?)[^]*?Sisa Stok:\s*([1-9]\d{2,})\b/);
        if (matchStokBesar) {
            let item = matchStokBesar[1].trim();
            replyText = `Buy ${item} 99`;
        }

        // 2. Pola Sisa Stok kecil (1-99 unit) -> Buy [Item] [Jumlah]
        else if (text.match(/\d+×\s*.*?([A-Za-z]+(?:\s+[A-Za-z]+)?)[^]*?Sisa Stok:\s*([1-9]\d?)\s*unit/)) {
            let m = text.match(/\d+×\s*.*?([A-Za-z]+(?:\s+[A-Za-z]+)?)[^]*?Sisa Stok:\s*([1-9]\d?)\s*unit/);
            replyText = `Buy ${m[1].trim()} ${m[2]}`;
        }

        // 3. Pola Stok saat ini hanya: [X]
        else if (text.match(/untuk[^]*?([A-Za-z]+(?:\s+[A-Za-z]+)?)[^]*?Stok saat ini hanya:\s*(\d+)/)) {
            let m = text.match(/untuk[^]*?([A-Za-z]+(?:\s+[A-Za-z]+)?)[^]*?Stok saat ini hanya:\s*(\d+)/);
            replyText = `Buy ${m[1].trim()} ${m[2]}`;
        }

        // 4. Pembelian Berhasil Berurutan (Rotasi Tanaman)
        else if (/Pembelian Berhasil![^]*?Wheat[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy grapes 99";
        }
        else if (/Pembelian Berhasil![^]*?Grapes[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Garlic 99";
        }
        else if (/Pembelian Berhasil![^]*?Garlic[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Blackbean 99";
        }
        else if (/Pembelian Berhasil![^]*?Black Bean[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Peas 99";
        }
        else if (/Pembelian Berhasil![^]*?Peas[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Figs 99";
        }
        else if (/Pembelian Berhasil![^]*?Figs[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Radishes 99";
        }
        else if (/Pembelian Berhasil![^]*?Radishes[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Apple 99";
        }
        else if (/Pembelian Berhasil![^]*?Apple[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Beet 99";
        }
        else if (/Pembelian Berhasil![^]*?Beet[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Pumpkins 99";
        }
        else if (/Pembelian Berhasil![^]*?Pumpkins[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Hay 99";
        }
        else if (/Pembelian Berhasil![^]*?Hay[^]*?Kamu punya:/.test(text)) {
            replyText = "Buy Wheat 99";
        }

        // 5. Stok Habis di Merchant (Pindah ke item berikutnya)
        else if (/Stok[^]*?Wheat\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Grapes 99";
        }
        else if (/Stok[^]*?Grapes\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Garlic 99";
        }
        else if (/Stok[^]*?Garlic\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Blackbean 99";
        }
        else if (/Stok[^]*?Black Bean\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Peas 99";
        }
        else if (/Stok[^]*?Peas\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Figs 99";
        }
        else if (/Stok[^]*?Figs\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Radishes 99";
        }
        else if (/Stok[^]*?Radishes\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Apple 99";
        }
        else if (/Stok[^]*?Apple\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Beet 99";
        }
        else if (/Stok[^]*?Beet\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Pumpkins 99";
        }
        else if (/Stok[^]*?Pumpkins\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Hay 99";
        }
        else if (/Stok[^]*?Hay\b[^]*?sudah habis di merchant/.test(text)) {
            replyText = "Buy Wheat 99";
        }

        // 6. Limit Benih Harian Tercapai
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Figs/.test(text)) {
            replyText = "Buy Radishes 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Radishes/.test(text)) {
            replyText = "Buy Apple 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Apple/.test(text)) {
            replyText = "Buy Beet 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Beet/.test(text)) {
            replyText = "Buy Pumpkins 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Pumpkins/.test(text)) {
            replyText = "Buy Hay 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Wheat/.test(text)) {
            replyText = "Buy grapes 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Grapes/.test(text)) {
            replyText = "Buy Garlic 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Garlic/.test(text)) {
            replyText = "buy Blackbean 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Black Bean/.test(text)) {
            replyText = "Buy Peas 99";
        }
        else if (/Limit\s+Benih\s+Harian\s+Tercapai![^]*?Peas/.test(text)) {
            replyText = "Buy Figs 99";
        }

        // Eksekusi pengiriman balasan jika cocok
        if (replyText) {
            console.log(`[POLA COCOK] Mengirim balasan: "${replyText}"`);
            setTimeout(async () => {
                try {
                    await client.sendMessage(message.chatId, {
                        message: replyText,
                        replyTo: message.id 
                    });
                    console.log('Berhasil terkirim!');
                } catch (err) {
                    console.log('Gagal mengirim:', err);
                }
            }, 1500);
        }
    }, new NewMessage({ incoming: true, outgoing: true }));
}

main();
