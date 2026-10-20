let daftarPeserta = [];
let totalPemenangCount = 0;
let isAcakBerjalan = false;
let shuffleInterval = null;
let stopTimer = null;

// Elemen DOM
const inputNamaSatuan = document.getElementById('inputNamaSatuan');
const logContainer = document.getElementById('logContainer');
const emptyLogState = document.getElementById('emptyLogState');
const logCountText = document.getElementById('logCountText');
const statTotal = document.getElementById('statTotal');
const statPemenang = document.getElementById('statPemenang');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const statusText = document.getElementById('statusText');
const statusDesc = document.getElementById('statusDesc');

// 1. Tambah Peserta Satuan dan otomatis masuk ke animasi panel pinggir
function tambahPeserta() {
    const nama = inputNamaSatuan.value.trim();
    if (!nama) {
        alert('Mohon ketik nama peserta terlebih dahulu!');
        return;
    }

    daftarPeserta.push(nama);
    inputNamaSatuan.value = '';
    inputNamaSatuan.focus();

    updateTampilanPesertaBaru();
}

// Render daftar peserta ke panel pinggir
function updateTampilanPesertaBaru() {
    statTotal.innerText = daftarPeserta.length;

    if (emptyLogState && daftarPeserta.length > 0) {
        emptyLogState.style.display = 'none';
    }

    // Buat elemen item peserta di panel pinggir
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 animate-fadeIn';
    item.innerHTML = `
        <span class="flex items-center gap-2"><i class="fa-solid fa-user text-indigo-400 text-[10px]"></i> ${daftarPeserta[daftarPeserta.length - 1]}</span>
        <span class="text-[10px] text-slate-500">Terdaftar</span>
    `;
    logContainer.appendChild(item);
    logContainer.scrollTop = logContainer.scrollHeight;
    updateLogCountText();
}

// 2. Klik START untuk mulai mengacak nama dengan animasi scroll
function mulaiAcak() {
    if (daftarPeserta.length === 0) {
        alert('Daftar peserta masih kosong! Tambahkan peserta terlebih dahulu.');
        return;
    }

    if (isAcakBerjalan) return;

    isAcakBerjalan = true;
    btnStart.disabled = true;
    btnStart.classList.add('opacity-50', 'cursor-not-allowed');
    
    btnStop.disabled = false;
    btnStop.classList.remove('opacity-50', 'cursor-not-allowed');

    statusText.innerText = "Mengacak Nama...";
    statusDesc.innerText = "Sistem sedang berjalan, silakan klik STOP untuk berhenti.";

    // Efek putar nama acak dengan kecepatan tinggi (Slot Machine + Auto-scroll)
    shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * daftarPeserta.length);
        const namaAcak = daftarPeserta[randomIndex];

        statusText.innerText = namaAcak;
        
        // Buat efek elemen berjalan di panel pinggir
        const rollingItem = document.createElement('div');
        rollingItem.className = 'flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] animate-pulse';
        rollingItem.innerHTML = `<span><i class="fa-solid fa-spinner animate-spin text-[9px]"></i> Memilih: ${namaAcak}</span>`;
        
        logContainer.appendChild(rollingItem);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Batasi jumlah baris riwayat agar tidak terlalu penuh
        if (logContainer.children.length > 30) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }, 80);
}

// 3. Klik STOP untuk berhenti secara bertahap selama 4 detik sampai ke pemenang
function hentiAcak() {
    if (!isAcakBerjalan) return;

    btnStop.disabled = true;
    btnStop.classList.add('opacity-50', 'cursor-not-allowed');
    statusDesc.innerText = "Menuju penentuan pemenang (Proses 4 detik)...";

    // Perlambat perputaran secara bertahap selama 4 detik
    setTimeout(() => {
        clearInterval(shuffleInterval);

        // Pilih pemenang final secara acak murni
        const finalIndex = Math.floor(Math.random() * daftarPeserta.length);
        const pemenang = daftarPeserta[finalIndex];

        totalPemenangCount++;
        statPemenang.innerText = totalPemenangCount;

        // Tampilkan hasil pemenang di kartu utama
        statusText.innerText = pemenang;
        statusDesc.innerText = `Selamat! ${pemenang} terpilih sebagai pemenang.`;

        // Tambahkan kartu pemenang permanen ke panel pinggir dengan efek gulir otomatis
        const winItem = document.createElement('div');
        winItem.className = 'flex items-center justify-between p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-bold shadow-lg';
        winItem.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><i class="fa-solid fa-award"></i></span>
                <div>
                    <div class="text-sm text-emerald-200">${pemenang}</div>
                    <div class="text-[10px] text-emerald-400/80">Pemenang #${totalPemenangCount}</div>
                </div>
            </div>
            <span class="text-[10px] text-slate-400">${new Date().toLocaleTimeString('id-ID')}</span>
        `;
        logContainer.appendChild(winItem);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Reset status tombol
        isAcakBerjalan = false;
        btnStart.disabled = false;
        btnStart.classList.remove('opacity-50', 'cursor-not-allowed');

    }, 4000); // Durasi berhenti perlahan selama 4 detik
}

// Bersihkan daftar
function clearLogs() {
    if (isAcakBerjalan) return;
    daftarPeserta = [];
    statTotal.innerText = 0;
    statusText.innerText = "Belum Diundi";
    statusDesc.innerText = "Tekan Start lalu Stop untuk menguji keberuntungan.";
    logContainer.innerHTML = `
        <div id="emptyLogState" class="text-center py-16 text-slate-500">
            <i class="fa-solid fa-users text-3xl mb-2 block opacity-40"></i>
            Belum ada peserta. Masukkan nama dan klik Tambah!
        </div>
    `;
    updateLogCountText();
}

function updateLogCountText() {
    const count = daftarPeserta.length;
    logCountText.innerText = `${count} Peserta`;
}

// Tekan Enter untuk shortcut tombol Tambah
window.onload = function() {
    if (inputNamaSatuan) {
        inputNamaSatuan.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                tambahPeserta();
            }
        });
    }
};
