let daftarPeserta = []; // Berisi objek: { nama: "...", sudahMenang: false }
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
const winnerModal = document.getElementById('winnerModal');
const modalWinnerName = document.getElementById('modalWinnerName');

// 1. Tambah Peserta Satuan
function tambahPeserta() {
    const nama = inputNamaSatuan.value.trim();
    if (!nama) {
        alert('Mohon ketik nama peserta terlebih dahulu!');
        return;
    }

    // Cek duplikasi nama
    if (daftarPeserta.some(p => p.nama.toLowerCase() === nama.toLowerCase())) {
        alert('Nama peserta sudah ada di daftar!');
        return;
    }

    daftarPeserta.push({ nama: nama, sudahMenang: false });
    inputNamaSatuan.value = '';
    inputNamaSatuan.focus();

    renderDaftarPeserta();
}

// Render daftar peserta ke panel kanan (dengan status blokir jika sudah menang)
function renderDaftarPeserta() {
    const pesertaAktif = daftarPeserta.filter(p => !p.sudahMenang).length;
    statTotal.innerText = pesertaAktif;

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

    logContainer.innerHTML = '';
    daftarPeserta.forEach((peserta, index) => {
        const item = document.createElement('div');
        
        if (peserta.sudahMenang) {
            // Tampilan jika peserta sudah menang (Di-blok / Disabled)
            item.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-800/50 text-slate-500 opacity-60';
            item.innerHTML = `
                <span class="flex items-center gap-2 line-through"><i class="fa-solid fa-user-slash text-rose-500/50 text-[10px]"></i> ${peserta.nama}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">Menang</span>
                    <button onclick="hapusPeserta(${index})" class="text-slate-600 hover:text-rose-400 transition-colors text-xs px-2"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        } else {
            // Tampilan peserta aktif
            item.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300';
            item.innerHTML = `
                <span class="flex items-center gap-2"><i class="fa-solid fa-user text-indigo-400 text-[10px]"></i> ${peserta.nama}</span>
                <button onclick="hapusPeserta(${index})" class="text-slate-500 hover:text-rose-400 transition-colors text-xs px-2"><i class="fa-solid fa-xmark"></i></button>
            `;
        }
        logContainer.appendChild(item);
    });

    logCountText.innerText = `${pesertaAktif} Peserta Aktif`;
}

// Hapus peserta satuan dari daftar
function hapusPeserta(index) {
    if (isAcakBerjalan) return;
    daftarPeserta.splice(index, 1);
    renderDaftarPeserta();
}

// 2. Klik START: Animasi berputar di header dari peserta yang BELUM menang
function mulaiAcak() {
    const pesertaTersedia = daftarPeserta.filter(p => !p.sudahMenang);
    
    if (pesertaTersedia.length === 0) {
        alert('Semua peserta sudah menang! Silakan klik "Reset Pemenang" jika ingin mengundi ulang nama yang ada tanpa menambah baru.');
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

    // Efek putar nama acak di header
    shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * pesertaTersedia.length);
        statusText.innerText = pesertaTersedia[randomIndex].nama;
        statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400 animate-pulse";
    }, 70);
}

// 3. Klik STOP: Berhenti selama 4 detik, tentukan pemenang, blokir namanya, dan tampilkan POPUP
function hentiAcak() {
    if (!isAcakBerjalan) return;

    btnStop.disabled = true;
    btnStop.classList.add('opacity-50', 'cursor-not-allowed');
    statusDesc.innerText = "Menentukan pemenang utama (4 detik)...";

    setTimeout(() => {
        clearInterval(shuffleInterval);

        // Ambil hanya peserta yang belum menang
        const pesertaTersedia = daftarPeserta.filter(p => !p.sudahMenang);
        const finalIndex = Math.floor(Math.random() * pesertaTersedia.length);
        const pemenangObj = pesertaTersedia[finalIndex];

        // Tandai peserta ini sudah menang (agar otomatis terblokir)
        const realIndex = daftarPeserta.findIndex(p => p.nama === pemenangObj.nama);
        if (realIndex !== -1) {
            daftarPeserta[realIndex].sudahMenang = true;
        }

        totalPemenangCount++;
        statPemenang.innerText = totalPemenangCount;

        // Tampilkan hasil di header
        emojiBadge.innerText = "🎉🏆✨";
        statusText.innerText = pemenangObj.nama;
        statusText.className = "text-xl sm:text-2xl font-extrabold text-emerald-400 scale-105 transition-transform";
        statusDesc.innerText = `Selamat kepada ${pemenangObj.nama}! Berhasil terpilih.`;

        // Render ulang daftar peserta (muncullah efek blokir di list kanan)
        renderDaftarPeserta();

        // TAMPILKAN POPUP MODAL PEMENANG
        bukaModalPopup(pemenangObj.nama);

        // Reset tombol kontrol
        isAcakBerjalan = false;
        btnStart.disabled = false;
        btnStart.classList.remove('opacity-50', 'cursor-not-allowed');

    }, 4000);
}

// Kontrol Popup Modal
function bukaModalPopup(namaPemenang) {
    modalWinnerName.innerText = namaPemenang;
    winnerModal.classList.remove('hidden');
    setTimeout(() => winnerModal.classList.add('show'), 10);
}

function tutupModal() {
    winnerModal.classList.remove('show');
    setTimeout(() => winnerModal.classList.add('hidden'), 300);
}

// Tombol Khusus: Reset Pemenang Saja (Membuka blokir nama agar bisa dipakai lagi tanpa menambah nama baru)
function resetPemenangSaja() {
    if (isAcakBerjalan) return;
    if (daftarPeserta.length === 0) return;

    daftarPeserta.forEach(p => p.sudahMenang = false);
    totalPemenangCount = 0;
    statPemenang.innerText = 0;
    statusText.innerText = "Belum Diundi";
    statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400";
    emojiBadge.innerText = "🎯";
    statusDesc.innerText = "Semua blokir dibuka. Nama siap diundi ulang!";
    renderDaftarPeserta();
}

// Reset Semua (Hapus total)
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
