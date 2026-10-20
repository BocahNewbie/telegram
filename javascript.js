let daftarPeserta = []; 
let riwayatPemenang = [];
let isAcakBerjalan = false;
let shuffleInterval = null;

// Elemen DOM
const inputNamaSatuan = document.getElementById('inputNamaSatuan');
const logContainer = document.getElementById('logContainer');
const riwayatContainer = document.getElementById('riwayatContainer');
const emptyLogState = document.getElementById('emptyLogState');
const emptyRiwayatState = document.getElementById('emptyRiwayatState');
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

// Load data dari localStorage saat halaman dibuka
function loadFromStorage() {
    const savedPeserta = localStorage.getItem('nonfood_peserta');
    const savedRiwayat = localStorage.getItem('nonfood_riwayat');
    
    if (savedPeserta) {
        daftarPeserta = JSON.parse(savedPeserta);
    }
    if (savedRiwayat) {
        riwayatPemenang = JSON.parse(savedRiwayat);
    }
    renderSemua();
}

// Simpan data ke localStorage perangkat pengguna
function saveToStorage() {
    localStorage.setItem('nonfood_peserta', JSON.stringify(daftarPeserta));
    localStorage.setItem('nonfood_riwayat', JSON.stringify(riwayatPemenang));
}

// 1. Tambah Peserta Satuan
function tambahPeserta() {
    const nama = inputNamaSatuan.value.trim();
    if (!nama) {
        alert('Mohon ketik nama peserta terlebih dahulu!');
        return;
    }

    if (daftarPeserta.some(p => p.nama.toLowerCase() === nama.toLowerCase())) {
        alert('Nama peserta sudah ada di daftar!');
        return;
    }

    daftarPeserta.push({ nama: nama, sudahMenang: false });
    inputNamaSatuan.value = '';
    inputNamaSatuan.focus();

    saveToStorage();
    renderSemua();
}

// Render terpisah untuk Daftar Peserta dan Riwayat Pemenang
function renderSemua() {
    const pesertaAktif = daftarPeserta.filter(p => !p.sudahMenang).length;
    statTotal.innerText = pesertaAktif;
    statPemenang.innerText = riwayatPemenang.length;
    logCountText.innerText = `${pesertaAktif} Aktif`;

    // A. Render Kotak Daftar Peserta
    if (daftarPeserta.length === 0) {
        logContainer.innerHTML = `
            <div id="emptyLogState" class="text-center py-12 text-slate-500">
                <i class="fa-solid fa-user-plus text-2xl mb-1.5 block opacity-40"></i>
                Belum ada peserta.
            </div>
        `;
    } else {
        logContainer.innerHTML = '';
        daftarPeserta.forEach((peserta, index) => {
            const item = document.createElement('div');
            
            if (peserta.sudahMenang) {
                item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-900/30 border border-slate-800/50 text-slate-500 opacity-60';
                item.innerHTML = `
                    <span class="flex items-center gap-2 line-through"><i class="fa-solid fa-user-slash text-rose-500/50 text-[10px]"></i> ${peserta.nama}</span>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">Menang</span>
                        <button onclick="hapusPeserta(${index})" class="text-slate-600 hover:text-rose-400 transition-colors text-xs px-1.5"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `;
            } else {
                item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300';
                item.innerHTML = `
                    <span class="flex items-center gap-2"><i class="fa-solid fa-user text-indigo-400 text-[10px]"></i> ${peserta.nama}</span>
                    <button onclick="hapusPeserta(${index})" class="text-slate-500 hover:text-rose-400 transition-colors text-xs px-1.5"><i class="fa-solid fa-xmark"></i></button>
                `;
            }
            logContainer.appendChild(item);
        });
    }

    // B. Render Kotak Riwayat Pemenang
    if (riwayatPemenang.length === 0) {
        riwayatContainer.innerHTML = `
            <div id="emptyRiwayatState" class="text-center py-12 text-slate-500">
                <i class="fa-solid fa-trophy text-2xl mb-1.5 block opacity-40"></i>
                Belum ada pemenang.
            </div>
        `;
    } else {
        riwayatContainer.innerHTML = '';
        riwayatPemenang.forEach((itemRiwayat, idx) => {
            const winItem = document.createElement('div');
            winItem.className = 'flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold';
            winItem.innerHTML = `
                <span class="flex items-center gap-2"><i class="fa-solid fa-award text-amber-400"></i> ${idx + 1}. ${itemRiwayat.nama}</span>
                <span class="text-[10px] text-slate-400">${itemRiwayat.waktu}</span>
            `;
            riwayatContainer.appendChild(winItem);
        });
    }
}

// Hapus peserta satuan dari daftar
function hapusPeserta(index) {
    if (isAcakBerjalan) return;
    daftarPeserta.splice(index, 1);
    saveToStorage();
    renderSemua();
}

// 2. Klik START
function mulaiAcak() {
    const pesertaTersedia = daftarPeserta.filter(p => !p.sudahMenang);
    
    if (pesertaTersedia.length === 0) {
        alert('Semua peserta sudah menang! Silakan klik tombol "Reset Pemenang" jika ingin mengundi ulang.');
        return;
    }

    if (isAcakBerjalan) return;

    isAcakBerjalan = true;
    btnStart.disabled = true;
    btnStart.classList.add('opacity-50', 'cursor-not-allowed');
    
    btnStop.disabled = false;
    btnStop.classList.remove('opacity-50', 'cursor-not-allowed');

    emojiBadge.innerText = "🎲";
    statusDesc.innerText = "Mengacak nama... Klik STOP untuk memilih!";

    shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * pesertaTersedia.length);
        statusText.innerText = pesertaTersedia[randomIndex].nama;
        statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400 animate-pulse";
    }, 70);
}

// 3. Klik STOP
function hentiAcak() {
    if (!isAcakBerjalan) return;

    btnStop.disabled = true;
    btnStop.classList.add('opacity-50', 'cursor-not-allowed');
    statusDesc.innerText = "Menentukan orang terpilih...";

    setTimeout(() => {
        clearInterval(shuffleInterval);

        const pesertaTersedia = daftarPeserta.filter(p => !p.sudahMenang);
        const finalIndex = Math.floor(Math.random() * pesertaTersedia.length);
        const pemenangObj = pesertaTersedia[finalIndex];

        const realIndex = daftarPeserta.findIndex(p => p.nama === pemenangObj.nama);
        if (realIndex !== -1) {
            daftarPeserta[realIndex].sudahMenang = true;
        }

        const waktuMenang = new Date().toLocaleTimeString('id-ID');
        riwayatPemenang.push({ nama: pemenangObj.nama, waktu: waktuMenang });

        emojiBadge.innerText = "🎉🏆✨";
        statusText.innerText = pemenangObj.nama;
        statusText.className = "text-xl sm:text-2xl font-extrabold text-emerald-400 scale-105 transition-transform";
        statusDesc.innerText = `Selamat kepada ${pemenangObj.nama}! Berhasil terpilih.`;

        saveToStorage();
        renderSemua();

        // MUNCULKAN POPUP MODAL MODERN
        bukaModalPopup(pemenangObj.nama);

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

// Reset Pemenang Saja (Buka blokir peserta dan bersihkan riwayat)
function resetPemenangSaja() {
    if (isAcakBerjalan) return;
    if (daftarPeserta.length === 0) return;

    daftarPeserta.forEach(p => p.sudahMenang = false);
    riwayatPemenang = [];
    
    statusText.innerText = "Belum Diundi";
    statusText.className = "text-xl sm:text-2xl font-extrabold text-amber-400";
    emojiBadge.innerText = "🎯";
    statusDesc.innerText = "Semua blokir dibuka. Nama siap diundi ulang!";
    
    saveToStorage();
    renderSemua();
}

// Saat halaman dimuat, ambil data tersimpan dari browser
window.onload = function() {
    loadFromStorage();
    if (inputNamaSatuan) {
        inputNamaSatuan.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                tambahPeserta();
            }
        });
    }
};
