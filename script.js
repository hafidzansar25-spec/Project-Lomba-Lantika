// script.js

// ==========================================
// 1. STATE & DATA MANAGEMENT
// ==========================================
const DEFAULT_MOCK_DATA = [
    { id: 1, title: "Desain Logo Minimalis", category: "Design", freelancer_name: "Budi Santoso", school: "SMK Telkom", price: 50000, whatsapp: "081234567890", description: "Saya akan mendesain logo minimalis untuk brand Anda.", image_url: "https://images.unsplash.com/photo-1626785770985-4c6e6a0d5e3f?w=500&q=80" },
    { id: 2, title: "Edit Video TikTok/Reels", category: "Video", freelancer_name: "Siti Aminah", school: "SMA 1 Jakarta", price: 75000, whatsapp: "628987654321", description: "Editing video pendek dengan transisi kekinian.", image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
    { id: 3, title: "Landing Page HTML/Tailwind", category: "Code", freelancer_name: "Andi Wijaya", school: "Universitas Bina Nusantara", price: 150000, whatsapp: "081122334455", description: "Pembuatan landing page responsif menggunakan Tailwind CSS.", image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" }
];

// Initialize data from localStorage or Mock Data
let allGigs = JSON.parse(localStorage.getItem('hustleYouthGigs')) || DEFAULT_MOCK_DATA;
if (!localStorage.getItem('hustleYouthGigs')) {
    localStorage.setItem('hustleYouthGigs', JSON.stringify(allGigs));
}

// ==========================================
// 2. SPA NAVIGATION LOGIC
// ==========================================
function showPage(pageId) {
    const catalogPage = document.getElementById('page-catalog');
    const formPage = document.getElementById('page-form');
    const navBtn = document.getElementById('nav-btn');

    if (pageId === 'catalog') {
        catalogPage.classList.remove('hidden');
        formPage.classList.add('hidden');
        navBtn.innerHTML = '<i class="fa-solid fa-plus mr-2"></i>Buka Jasa';
        navBtn.onclick = () => showPage('form');
        renderGigs(allGigs); // Refresh data
        window.scrollTo(0, 0);
    } else {
        catalogPage.classList.add('hidden');
        formPage.classList.remove('hidden');
        navBtn.innerHTML = '<i class="fa-solid fa-arrow-left mr-2"></i>Kembali';
        navBtn.onclick = () => showPage('catalog');
        window.scrollTo(0, 0);
    }
}

// ==========================================
// 3. CATALOG & RENDERING LOGIC
// ==========================================
function renderGigs(dataList) {
    const container = document.getElementById('gigs-container');
    container.innerHTML = '';

    if (dataList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                    <i class="fa-solid fa-magnifying-glass text-3xl text-gray-500"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-300">Jasa tidak ditemukan</h3>
                <p class="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
        `;
        return;
    }

    dataList.forEach(gig => {
        const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(gig.price);
        const imageUrl = gig.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80';

        const card = `
            <div class="glass-card" onclick="openModal(${gig.id})">
                <div class="h-48 overflow-hidden relative group">
                    <img src="${imageUrl}" alt="${gig.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80'">
                    <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/30">
                        ${gig.category}
                    </div>
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">${gig.title}</h3>
                    <div class="flex items-center text-sm text-gray-400 mb-1">
                        <i class="fa-solid fa-user text-purple-400 w-5"></i>
                        <span class="truncate">${gig.freelancer_name}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-400 mb-4">
                        <i class="fa-solid fa-school text-purple-400 w-5"></i>
                        <span class="truncate">${gig.school}</span>
                    </div>
                    <div class="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                        <span class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">${formattedPrice}</span>
                        <span class="text-sm text-purple-400 font-medium group-hover:translate-x-1 transition-transform">Detail <i class="fa-solid fa-arrow-right ml-1"></i></span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Search & Filter
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeCategory = 'Semua';

const applyFilter = () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allGigs.filter(gig => {
        const matchKeyword = gig.title.toLowerCase().includes(keyword) || 
                             gig.freelancer_name.toLowerCase().includes(keyword) ||
                             gig.school.toLowerCase().includes(keyword);
        const matchCategory = activeCategory === 'Semua' || gig.category === activeCategory;
        return matchKeyword && matchCategory;
    });
    renderGigs(filtered);
};

searchInput.addEventListener('input', applyFilter);

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => {
            b.classList.remove('bg-brand-600', 'text-white');
            b.classList.add('bg-white/5', 'text-gray-300', 'border', 'border-white/10');
        });
        e.target.classList.remove('bg-white/5', 'text-gray-300', 'border', 'border-white/10');
        e.target.classList.add('bg-brand-600', 'text-white');
        activeCategory = e.target.getAttribute('data-category');
        applyFilter();
    });
});

// ==========================================
// 4. MODAL LOGIC
// ==========================================
function openModal(gigId) {
    const gig = allGigs.find(g => g.id === gigId);
    if (!gig) return;

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    let waNumber = gig.whatsapp.replace(/\D/g, '');
    if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);

    const waMessage = encodeURIComponent(`Halo, saya tertarik dengan jasa Anda "${gig.title}" di HustleYouth. Apakah masih tersedia?`);
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(gig.price);
    const imageUrl = gig.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80';

    modalContent.innerHTML = `
        <button onclick="closeModal()" class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="h-56 w-full relative">
            <img src="${imageUrl}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80'">
            <div class="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent"></div>
        </div>
        <div class="p-6 relative">
            <div class="absolute -top-4 left-6 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">${gig.category}</div>
            <h2 class="text-2xl font-bold text-white mb-4 mt-2">${gig.title}</h2>
            <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div class="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p class="text-gray-400 mb-1"><i class="fa-solid fa-user text-purple-400 mr-2"></i>Freelancer</p>
                    <p class="font-semibold text-white">${gig.freelancer_name}</p>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p class="text-gray-400 mb-1"><i class="fa-solid fa-school text-purple-400 mr-2"></i>Sekolah</p>
                    <p class="font-semibold text-white truncate">${gig.school}</p>
                </div>
            </div>
            <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-400 mb-2">Deskripsi</h4>
                <p class="text-gray-300 text-sm leading-relaxed">${gig.description}</p>
            </div>
            <div class="flex items-center justify-between border-t border-white/10 pt-6 mt-6">
                <div>
                    <p class="text-xs text-gray-400 mb-1">Harga Mulai</p>
                    <p class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">${formattedPrice}</p>
                </div>
                <a href="${waLink}" target="_blank" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all flex items-center gap-2">
                    <i class="fa-brands fa-whatsapp text-xl"></i> Order
                </a>
            </div>
        </div>
    `;

    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

// ==========================================
// 5. FORM SUBMISSION & VALIDATION
// ==========================================
const form = document.getElementById('gig-form');

function validateForm() {
    const whatsappInput = document.getElementById('whatsapp').value;
    const cleanNumber = whatsappInput.replace(/\D/g, '');

    if (!cleanNumber.startsWith('08') && !cleanNumber.startsWith('62')) {
        alert("Nomor WhatsApp harus diawali dengan 08 atau 62!");
        return false;
    }
    if (cleanNumber.length < 10) {
        alert("Nomor WhatsApp minimal harus 10 digit!");
        return false;
    }
    return true;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengirim...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());
    dataObject.price = Number(dataObject.price);
    dataObject.id = Date.now(); // Generate unique ID

    try {
        // MENCoba KIRIM KE BACKEND (Jika ada)
        const response = await fetch('http://localhost:5000/api/gigs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
        });
        
        if (!response.ok) throw new Error('Backend error');
        
    } catch (error) {
        // FALLBACK: Jika backend tidak ada (misal di GitHub Pages), simpan ke localStorage
        console.log("Backend tidak terdeteksi, menyimpan ke localStorage.");
        
        allGigs.unshift(dataObject); // Tambah ke urutan paling atas
        localStorage.setItem('hustleYouthGigs', JSON.stringify(allGigs));
    } finally {
        alert('Berhasil! Jasa Anda telah dipublikasikan.');
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showPage('catalog'); // Kembali ke katalog
    }
});

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderGigs(allGigs);
});
