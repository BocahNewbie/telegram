// State Manajemen Aplikasi
let currentState = 'STOPPED';
let totalClickCount = 0;
let uptimeSeconds = 0;
let uptimeTimer = null;
let processingTimeout = null;

// Referensi Elemen DOM
const statusCard = document.getElementById('statusCard');
const statusIconBg = document.getElementById('statusIconBg');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const statusDesc = document.getElementById('statusDesc');
const statusBadge = document.getElementById('statusBadge');
const statusPulseRing = document.getElementById('statusPulseRing');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const logContainer = document.getElementById('logContainer');
const emptyLogState = document.getElementById('emptyLogState');
const logCountText = document.getElementById('logCountText');
const statTotal = document.getElementById('statTotal');
const statUptime = document.getElementById('statUptime');

// Mengubah Tampilan Berdasarkan Status
function updateUIState(state) {
    currentState = state;
    
    // Reset Kelas Warna Umum
    statusCard.className = "relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ";
    statusIconBg.className = "relative flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ";
    statusPulseRing.classList.add('hidden');

    if (state === 'STOPPED') {
        statusCard.classList.add('bg-rose-950/20', 'border-rose-500/30');
        statusIconBg.classList.add('bg-rose-500/20', 'text-rose-400', 'border', 'border-rose-500/40');
        statusIcon.className = "fa-solid fa-power-off text-2xl";
        statusText.className = "text-xl sm:text-2xl font-bold text-rose-400";
        statusText.innerText = "Stopped / Mati";
        statusDesc.innerText = "Sistem berada dalam kondisi non-aktif.";
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30";
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span><span>Mati</span>`;
        btnStart.disabled = false;
        btnStop.disabled = true;
        stopTimer();
    } else if (state === 'PROCESSING') {
        statusCard.classList.add('bg-amber-950/20', 'border-amber-500/40');
        statusIconBg.classList.add('bg-amber-500/20', 'text-amber-400', 'border', 'border-amber-500/50');
        statusIcon.className = "fa-solid fa-spinner text-2xl animate-spin";
        statusPulseRing.classList.remove('hidden');
        statusText.className = "text-xl sm:text-2xl font-bold text-amber-400 animate-pulse";
        statusText.innerText = "Processing / Memproses...";
        statusDesc.innerText = "Menyiapkan dan menginisialisasi sistem...";
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30";
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span><span>Proses</span>`;
        btnStart.disabled = true;
        btnStop.disabled = true;
    } else if (state === 'RUNNING') {
        statusCard.classList.add('bg-emerald-950/20', 'border-emerald-500/30');
        statusIconBg.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/40', 'shadow-lg', 'shadow-emerald-500/20');
        statusIcon.className = "fa-solid fa-play text-2xl animate-pulse-slow";
        statusText.className = "text-xl sm:text-2xl font-bold text-emerald-400";
        statusText.innerText = "Running / Aktif";
        statusDesc.innerText = "Sistem berjalan dan berfungsi secara optimal.";
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Aktif</span>`;
        btnStart.disabled = true;
        btnStop.disabled = false;
        startTimer();
    }
}

// Handler saat tombol Start ditekan
function handleStart() {
    if (currentState !== 'STOPPED') return;
    incrementClick();
    addLogEntry('START', 'Menekan tombol Start. Memulai proses inisialisasi...', 'text-amber-400');
    updateUIState('PROCESSING');
    
    processingTimeout = setTimeout(() => {
        updateUIState('RUNNING');
        addLogEntry('RUNNING', 'Sistem berhasil diaktifkan dan berjalan.', 'text-emerald-400');
    }, 1800);
}

// Handler saat tombol Stop ditekan
function handleStop() {
    if (currentState !== 'RUNNING' && currentState !== 'PROCESSING') return;
    clearTimeout(processingTimeout);
    incrementClick();
    updateUIState('STOPPED');
    addLogEntry('STOP', 'Menekan tombol Stop. Sistem telah dimatikan.', 'text-rose-400');
}

// Handler untuk pilihan aktivitas baru (Craft Satuan, Belanja, Mancing)
function pilihAktivitas(namaMenu, iconClass, colorClass) {
    incrementClick();
    addLogEntry('MENU', `Memilih opsi aktivitas: ${namaMenu}`, colorClass);
}

// Menambahkan Catatan Aktivitas ke Log
function addLogEntry(type, message, colorClass) {
    if (emptyLogState) {
        emptyLogState.style.display = 'none';
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const logItem = document.createElement('div');
    logItem.className = 'flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 transform transition-all duration-300 translate-y-[-4px] opacity-0';
    
    let iconTag = '';
    if (type === 'START') {
        iconTag = `<span class="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"><i class="fa-solid fa-hourglass-half text-[11px]"></i></span>`;
    } else if (type === 'RUNNING') {
        iconTag = `<span class="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-check text-[11px]"></i></span>`;
    } else if (type === 'MENU') {
        iconTag = `<span class="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><i class="fa-solid fa-bullseye text-[11px]"></i></span>`;
    } else {
        iconTag = `<span class="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20"><i class="fa-solid fa-ban text-[11px]"></i></span>`;
    }

    logItem.innerHTML = `
        ${iconTag}
        <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
                <span class="font-semibold ${colorClass}">${type}</span>
                <span class="text-[10px] text-slate-500">${timeString}</span>
            </div>
            <p class="text-slate-300 mt-0.5 truncate">${message}</p>
        </div>
    `;

    logContainer.insertBefore(logItem, logContainer.firstChild);

    setTimeout(() => {
        logItem.classList.remove('translate-y-[-4px]', 'opacity-0');
    }, 10);

    updateLogCount();
}

// Counter total klik
function incrementClick() {
    totalClickCount++;
    statTotal.innerText = totalClickCount;
}

// Timer Uptime
function startTimer() {
    stopTimer();
    uptimeTimer = setInterval(() => {
        uptimeSeconds++;
        const mins = Math.floor(uptimeSeconds / 60).toString().padStart(2, '0');
        const secs = (uptimeSeconds % 60).toString().padStart(2, '0');
        statUptime.innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    if (uptimeTimer) {
        clearInterval(uptimeTimer);
        uptimeTimer = null;
    }
}

// Membersihkan Riwayat Log
function clearLogs() {
    logContainer.innerHTML = '';
    const emptyState = document.createElement('div');
    emptyState.id = 'emptyLogState';
    emptyState.className = 'text-center py-12 text-slate-500';
    emptyState.innerHTML = `
        <i class="fa-solid fa-clock-rotate-left text-2xl mb-2 block opacity-40"></i>
        Belum ada riwayat aktivitas.
    `;
    logContainer.appendChild(emptyState);
    updateLogCount();
}

// Memperbarui jumlah total log yang ada
function updateLogCount() {
    const items = logContainer.querySelectorAll('.flex.items-start');
    logCountText.innerText = `${items.length} Entri`;
}

// Inisialisasi awal
window.onload = function() {
    updateUIState('STOPPED');
};
