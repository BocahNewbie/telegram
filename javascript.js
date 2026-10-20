let totalPemenangCount = 0;
let isUndianBerjalan = false;

// Elemen DOM
const inputPeserta = document.getElementById('inputPeserta');
const logContainer = document.getElementById('logContainer');
const emptyLogState = document.getElementById('emptyLogState');
const logCountText = document.getElementById('logCountText');
const statTotal = document.getElementById('statTotal');
const statPemenang = document.getElementById('statPemenang');
const btnStart = document.getElementById('btnStart');
const statusText = document.getElementById('statusText');
const statusDesc = document.getElementById('statusDesc');

// Hitung jumlah peserta awal
function updateStatistikPeserta() {
    const list = getDaftarPeserta();
    statTotal.innerText = list.length;
}

function getDaftarPeserta() {
    const text = inputPeserta.value.trim();
    if (!text) return [];
    return text.split(/[\n,]+/).map(item => item.trim()).filter(item => item.length > 0);
}

// Fungsi Utama Mulai Undian dengan Animasi Acak & Terscroll ke Bawah
function mulaiUndian() {
    if (isUndianBerjalan) return;
    
    const peserta = getDaftarPeserta();
    if (peserta.length === 0) {
        alert('Masukkan minimal 1 nama peserta terlebih dahulu!');
        return;
    }

    isUndianBerjalan = true;
    btnStart.disabled = true;
    btnStart.classList.add('opacity-50', 'cursor-not-allowed');

    if (emptyLogState) emptyLogState.style.display = 'none';

    statusText.innerText = "Mengacak Nama...";
    statusDesc.innerText = "Sedang memilih peserta secara acak...";

    // Buat elemen log khusus untuk animasi putar nama
    const animItem = document.createElement('div');
    animItem.className = 'flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold animate-pulse';
    animItem.innerHTML = `<span class="flex items-center gap-2"><i class="fa-solid fa-spinner animate-spin"></i> <span id="slotName">Menentukan...</span></span> <span class="text-[10px] opacity-70">Undian...</span>`;
    logContainer.insertBefore(animItem, logContainer.firstChild);

    let counter = 0;
    const slotText = document.getElementById('slotName');
    
    // Efek putar nama secara cepat (Slot Machine Effect)
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * peserta.length);
        slotText.innerText = peserta[randomIndex];
        counter++;

        // Auto-scroll ke bawah agar animasi terlihat bergerak
        logContainer.scrollTop = logContainer.scrollHeight;

        // Setelah berputar sekitar 25 kali (~2.5 detik), pilih pemenang tetap
        if (counter > 25) {
            clearInterval(interval);
            
            // Pilih pemenang final secara acak
            const finalWinnerIndex = Math.floor(Math.random() * peserta.length);
            const winnerName = peserta[finalWinnerIndex];

            totalPemenangCount++;
            statPemenang.innerText = totalPemenangCount;

            // Ubah tampilan card status jadi pemenang
            statusText.innerText = winnerName;
            statusDesc.innerText = "Selamat! Pemenang berhasil diundi.";

            // Ubah elemen animasi jadi kartu pemenang tetap
            animItem.className = 'flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 transform transition-all duration-500';
            animItem.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <span class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><i class="fa-solid fa-award"></i></span>
                    <div>
                        <div class="font-bold text-sm text-emerald-200">${winnerName}</div>
                        <div class="text-[10px] text-emerald-400/80">Pemenang ke-${totalPemenangCount}</div>
                    </div>
                </div>
                <span class="text-[10px] text-slate-400">${new Date().toLocaleTimeString('id-ID')}</span>
            `;

            // Efek scroll mulus ke bawah memperlihatkan hasil akhir
            logContainer.scrollTop = logContainer.scrollHeight;

            isUndianBerjalan = false;
            btnStart.disabled = false;
            btnStart.classList.remove('opacity-50', 'cursor-not-allowed');
            updateLogCount();
        }
    }, 90);
}

// Reset Undian
function resetUndian() {
    if (isUndianBerjalan) return;
    statusText.innerText = "Belum Diundi";
    statusDesc.innerText = "Tekan tombol Start untuk mengacak.";
    totalPemenangCount = 0;
    statPemenang.innerText = 0;
}

// Bersihkan Log
function clearLogs() {
    if (isUndianBerjalan) return;
    logContainer.innerHTML = `
        <div id="emptyLogState" class="text-center py-16 text-slate-500">
            <i class="fa-solid fa-ticket text-3xl mb-2 block opacity-40"></i>
            Daftar peserta siap diundi. Klik Start!
        </div>
    `;
    updateLogCount();
}

function updateLogCount() {
    const items = logContainer.querySelectorAll('.flex.items-center.justify-between');
    logCountText.innerText = `${items.length} Riwayat`;
}

// Inisialisasi saat halaman dibuka
window.onload = function() {
    updateStatistikPeserta();
    inputPeserta.addEventListener('input', updateStatistikPeserta);
};
