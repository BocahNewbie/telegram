// ==========================================
// SISTEM ACAK NAMA - LOGIKA UTAMA (FIXED)
// ==========================================

let daftarPeserta = [];
let riwayatPemenang = [];
let intervalId = null;
let autoStopTimeout = null;
let sedangAcak = false;

// Load data saat halaman dibuka
window.onload = function() {
    TerapkanKonfigurasi();
    muatDariLocalStorage();
    renderUI();
};

// Terapkan Config Teks ke HTML
function TerapkanKonfigurasi() {
    if (typeof CONFIG !== 'undefined') {
        document.getElementById('headerTitle').innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            ${CONFIG.namaAplikasi} BY ${CONFIG.pemilikBrand}
        `;
        document.getElementById('headerSub').innerText = CONFIG.subJudul;
        const durasiDetik = CONFIG.durasiRollDetik / 1000;
        document.getElementById('btnStartText').innerText = `MULAI UNDIAN)`;
    }
}

// Tambah Peserta Satuan
function tambahPeserta() {
    const input = document.getElementById('inputNamaSatuan');
    const nama = input.value.trim();
    
    if (!nama) return;
    
    daftarPeserta.push({
        id: Date.now() + Math.random(),
        nama: nama,
        status: 'aktif'
    });
    
    input.value = '';
    simpanKeLocalStorage();
    renderUI();
    input.focus();
}

// Tambah via Enter key
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputNamaSatuan');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                tambahPeserta();
            }
        });
    }
});

// Hapus Peserta dari Daftar
function hapusPeserta(id) {
    daftarPeserta = daftarPeserta.filter(p => p.id !== id);
    simpanKeLocalStorage();
    renderUI();
}

// MULAI ACAK
function mulaiAcak() {
    const pesertaAktif = daftarPeserta.filter(p => p.status === 'aktif');
    
    if (pesertaAktif.length === 0) {
        alert('Tidak ada peserta aktif yang tersisa untuk diundi!');
        return;
    }
    
    if (sedangAcak) return;
    sedangAcak = true;
    
    const btnStart = document.getElementById('btnStart');
    btnStart.disabled = true;
    btnStart.classList.add('opacity-40', 'cursor-not-allowed');
    
    const statusText = document.getElementById('statusText');
    const statusDesc = document.getElementById('statusDesc');
    const statusCard = document.getElementById('statusCard');
    
    const durasiDetik = (CONFIG ? CONFIG.durasiRollDetik : 20000) / 1000;
    
    statusCard.className = "relative overflow-hidden rounded-xl border p-5 transition-all duration-300 bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-950/30";
    statusDesc.innerText = `Mengacak nama secara adil`;

    // Interval Animasi Acak (Mengambil dari daftar peserta aktif secara real-time)
    intervalId = setInterval(() => {
        const currentAktif = daftarPeserta.filter(p => p.status === 'aktif');
        if (currentAktif.length > 0) {
            const randomIndex = Math.floor(Math.random() * currentAktif.length);
            statusText.innerText = currentAktif[randomIndex].nama;
            statusText.classList.add('scale-105', 'text-emerald-400');
            setTimeout(() => statusText.classList.remove('scale-105', 'text-emerald-400'), 50);
        }
    }, 80);

    // Stop Otomatis sesuai Durasi Config
    const waktuDurasi = CONFIG ? CONFIG.durasiRollDetik : 20000;
    autoStopTimeout = setTimeout(() => {
        eksekusiPemenang();
    }, waktuDurasi);
}

// Proses Penentuan Pemenang Final (100% AMAN DARI BUG BLOKIR MASSAL)
function eksekusiPemenang() {
    clearInterval(intervalId);
    sedangAcak = false;
    
    // Ambil ulang peserta yang benar-benar berstatus 'aktif' saat ini
    const pesertaAktif = daftarPeserta.filter(p => p.status === 'aktif');
    if (pesertaAktif.length === 0) return;

    // Pilih satu secara murni acak (pure random) dari peserta aktif
    const finalIndex = Math.floor(Math.random() * pesertaAktif.length);
    const pemenangTerpilih = pesertaAktif[finalIndex];
    
    // UPDATE STATUS AMAN: Hanya ubah status peserta yang ID-nya 100% cocok dengan pemenangTerpilih
    daftarPeserta = daftarPeserta.map(p => {
        if (p.id === pemenangTerpilih.id) {
            return { ...p, status: 'menang' }; // Hanya pemenang tunggal
        }
        return p; // Peserta lain dipastikan tetap 'aktif' tanpa tersentuh
    });

    // Masukkan ke riwayat pemenang (Tanpa Jam)
    riwayatPemenang.unshift({
        id: Date.now(),
        nama: pemenangTerpilih.nama
    });

    simpanKeLocalStorage();
    renderUI();

    // Tampilkan di Card Utama
    const statusText = document.getElementById('statusText');
    const statusDesc = document.getElementById('statusDesc');
    const statusCard = document.getElementById('statusCard');
    
    statusText.innerText = pemenangTerpilih.nama;
    statusDesc.innerText = "Selamat! Peserta berhasil terpilih.";
    statusCard.className = "relative overflow-hidden rounded-xl border p-5 transition-all duration-300 bg-slate-950/80 border-emerald-500/80 shadow-xl shadow-emerald-950/40";

    // Aktifkan kembali tombol Start
    const btnStart = document.getElementById('btnStart');
    btnStart.disabled = false;
    btnStart.classList.remove('opacity-40', 'cursor-not-allowed');

    // Tampilkan Modal Pemenang
    tampilkanModal(pemenangTerpilih.nama);
}

// Reset Khusus Pemenang
function resetPemenangSaja() {
    if (confirm("Reset daftar pemenang dan kembalikan semua ke peserta aktif?")) {
        daftarPeserta = daftarPeserta.map(p => ({ ...p, status: 'aktif' }));
        riwayatPemenang = [];
        simpanKeLocalStorage();
        renderUI();
        
        document.getElementById('statusText').innerText = "Belum Diundi";
        document.getElementById('statusDesc').innerText = "Klik Start untuk memulai.";
    }
}

// Render Antarmuka (UI)
function renderUI() {
    const logContainer = document.getElementById('logContainer');
    const riwayatContainer = document.getElementById('riwayatContainer');
    const statTotal = document.getElementById('statTotal');
    const statPemenang = document.getElementById('statPemenang');
    const logCountText = document.getElementById('logCountText');
    
    const aktifCount = daftarPeserta.filter(p => p.status === 'aktif').length;
    const menangCount = riwayatPemenang.length;

    statTotal.innerText = aktifCount;
    statPemenang.innerText = menangCount;
    logCountText.innerText = `${aktifCount} Aktif`;

    // Render Daftar Peserta
    if (daftarPeserta.length === 0) {
        logContainer.innerHTML = `
            <div class="text-center py-12 text-slate-600">
                <i class="fa-solid fa-user-plus text-xl mb-1.5 block opacity-40"></i> Belum ada peserta.
            </div>`;
    } else {
        logContainer.innerHTML = daftarPeserta.map(p => `
            <div class="flex items-center justify-between bg-slate-950/50 border border-slate-800/60 px-3 py-2 rounded-xl transition-all">
                <div class="flex items-center gap-2 truncate">
                    <i class="fa-solid ${p.status === 'menang' ? 'fa-circle-check text-emerald-400' : 'fa-user text-slate-500'} text-[10px]"></i>
                    <span class="${p.status === 'menang' ? 'text-slate-500 line-through' : 'text-slate-200'} font-medium truncate">${p.nama}</span>
                </div>
                <div class="flex items-center gap-2">
                    ${p.status === 'menang' ? '<span class="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Menang</span>' : ''}
                    <button onclick="hapusPeserta(${p.id})" class="text-slate-600 hover:text-rose-400 transition-colors p-1" title="Hapus">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render Riwayat Pemenang (Tanpa Jam)
    if (riwayatPemenang.length === 0) {
        riwayatContainer.innerHTML = `
            <div class="text-center py-12 text-slate-600">
                <i class="fa-solid fa-trophy text-xl mb-1.5 block opacity-40"></i> Belum ada pemenang.
            </div>`;
    } else {
        riwayatContainer.innerHTML = riwayatPemenang.map((item, index) => `
            <div class="flex items-center justify-between bg-slate-950/50 border border-slate-800/60 px-3 py-2 rounded-xl">
                <div class="flex items-center gap-2.5 truncate">
                    <span class="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/20 shrink-0">${index + 1}</span>
                    <span class="text-white font-medium truncate">${item.nama}</span>
                </div>
                <span class="text-[10px] text-emerald-400 font-medium">Terpilih</span>
            </div>
        `).join('');
    }
}

// Modal Kontrol
function tampilkanModal(nama) {
    const modal = document.getElementById('winnerModal');
    const modalWinnerName = document.getElementById('modalWinnerName');
    
    modalWinnerName.innerText = nama;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

function tutupModal() {
    const modal = document.getElementById('winnerModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// LocalStorage Persistence
function simpanKeLocalStorage() {
    localStorage.setItem('roll_peserta', JSON.stringify(daftarPeserta));
    localStorage.setItem('roll_riwayat', JSON.stringify(riwayatPemenang));
}

function muatDariLocalStorage() {
    const savedPeserta = localStorage.getItem('roll_peserta');
    const savedRiwayat = localStorage.getItem('roll_riwayat');
    
    if (savedPeserta) daftarPeserta = JSON.parse(savedPeserta);
    if (savedRiwayat) riwayatPemenang = JSON.parse(savedRiwayat);
}
