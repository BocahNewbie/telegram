let daftarPeserta = [];
let totalPemenangCount = 0;
let isAcakBerjalan = false;
let shuffleInterval = null;

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
const emojiBadge = document.getElementById('emojiBadge');

// 1. Tambah Peserta Satuan
function tambahPeserta() {
    const nama = inputNamaSatuan.value.trim();
    if (!nama) {
        alert('Mohon ketik nama peserta terlebih dahulu!');
        return;
    }

    daftarPeserta.push(nama);
    inputNamaSatuan.value = '';
    inputNamaSatuan.focus();

    renderDaftarPeserta();
}

// Render daftar peserta ke panel kanan
function renderDaftarPeserta() {
    statTotal.innerText = daftarPeserta.length;

    if (daftarPeserta.length === 0) {
        logContainer.innerHTML = `
            <div id="emptyLogState" class="text-center py-16 text-slate-500">
                <i class="fa-solid fa-users text-3xl mb-2 block opacity-40"></i>
                Belum ada peserta. Masukkan nama dan klik Tambah!
            </div>
        `;
        logCountText.innerText = `0 Peserta`;
        return;
    }

    if (emptyLogState) {
        logContainer.innerHTML = '';
    }

    logContainer.innerHTML = '';
    daftarPeserta.forEach((peserta, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300';
        item.innerHTML = `
            <span class="flex items-center gap-2"><i class="fa-solid fa-user text-indigo-400 text-[10px]"></i> ${peserta}</span>
            <button onclick="hapusPeserta(${index})" class="text-slate-500 hover:text-rose-400 transition-colors text-xs px-2"><i class="fa-solid fa-xmark"></i></button>
        `;
        logContainer.appendChild(item);
    });

    logCountText.innerText = `${daftarPeserta.length} Peserta`;
}

// Hapus peserta satuan dari daftar
function hapusPeserta(index) {
    if (isAcakBerjalan) return;
    daftarPeserta.splice(index, 1);
    renderDaftarPeserta();
}

// 2. Klik START: Animasi berputar di header (tanpa scroll)
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

    emojiBadge.innerText = "🎲";
    statusDesc.innerText = "Mengacak nama di header... Klik STOP untuk memilih!";

    // Efek putar nama acak di header secara cepat
    shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * daftarPeserta.length);
        statusText.innerText = daftarPeserta[randomIndex];
        statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400 animate-pulse";
    }, 70);
}

// 3. Klik STOP: Berhenti perlahan selama 4 detik, tampilkan pemenang dengan emoji interaktif
function hentiAcak() {
    if (!isAcakBerjalan) return;

    btnStop.disabled = true;
    btnStop.classList.add('opacity-50', 'cursor-not-allowed');
    statusDesc.innerText = "Menentukan pemenang utama (4 detik)...";

    // Perlambat perputaran selama 4 detik
    setTimeout(() => {
        clearInterval(shuffleInterval);

        // Pilih pemenang final secara acak murni
        const finalIndex = Math.floor(Math.random() * daftarPeserta.length);
        const pemenang = daftarPeserta[finalIndex];

        totalPemenangCount++;
        statPemenang.innerText = totalPemenangCount;

        // Tampilkan hasil di header dengan emoticon perayaan
        emojiBadge.innerText = "🎉🏆✨";
        statusText.innerText = pemenang;
        statusText.className = "text-xl sm:text-2xl font-extrabold text-emerald-400 scale-105 transition-transform";
        statusDesc.innerText = `Selamat kepada ${pemenang}! Berhasil terpilih sebagai pemenang.`;

        // Masukkan riwayat pemenang ke daftar riwayat di bawah list peserta
        const winItem = document.createElement('div');
        winItem.className = 'flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold mt-2';
        winItem.innerHTML = `
            <span class="flex items-center gap-2"><i class="fa-solid fa-award text-amber-400"></i> Pemenang: ${pemenang}</span>
            <span class="text-[10px] text-slate-400">${new Date().toLocaleTimeString('id-ID')}</span>
        `;
        logContainer.prepend(winItem); // Taruh di paling atas riwayat

        // Reset status tombol (Nama peserta tetap ada di list sehingga bisa diundi lagi!)
        isAcakBerjalan = false;
        btnStart.disabled = false;
        btnStart.classList.remove('opacity-50', 'cursor-not-allowed');

    }, 4000); // Durasi 4 detik
}

// Reset Semua
function clearLogs() {
    if (isAcakBerjalan) return;
    daftarPeserta = [];
    totalPemenangCount = 0;
    statPemenang.innerText = 0;
    statusText.innerText = "Belum Diundi";
    statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400";
    emojiBadge.innerText = "🎯";
    statusDesc.innerText = "Tekan Start lalu Stop untuk menguji keberuntungan.";
    renderDaftarPeserta();
}

// Shortcut Enter untuk input nama
window.onload = function() {
    if (inputNamaSatuan) {
        inputNamaSatuan.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                tambahPeserta();
            }
        });
    }
};
