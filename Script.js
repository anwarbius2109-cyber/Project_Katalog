document.addEventListener('DOMContentLoaded', () => {
    // Load katalog pertama kali website dibuka
    loadData('katalog');

    // Efek Menu Melayang saat Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md', 'bg-white/95');
            navbar.classList.remove('bg-white/70', 'border-slate-200/50');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95');
            navbar.classList.add('bg-white/70', 'border-slate-200/50');
        }
    });
});

async function loadData(type) {
    const container = document.getElementById('grid-container');
    const loading = document.getElementById('loading');
    const btnKatalog = document.getElementById('btn-katalog');
    const btnPorto = document.getElementById('btn-porto');

    // Kosongkan container & tampilkan loading
    container.innerHTML = '';
    loading.classList.remove('hidden');

    // Update styling tombol tab
    if (type === 'katalog') {
        btnKatalog.className = "tab-btn active px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 bg-slate-900 text-white shadow-md";
        btnPorto.className = "tab-btn px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 bg-white text-slate-600 hover:bg-slate-200 shadow-sm border border-slate-200";
    } else {
        btnPorto.className = "tab-btn active px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 bg-slate-900 text-white shadow-md";
        btnKatalog.className = "tab-btn px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 bg-white text-slate-600 hover:bg-slate-200 shadow-sm border border-slate-200";
    }

    try {
        const url = type === 'katalog' ? 'Data/Katalog.json' : 'Data/Porto.json';
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const data = await response.json();
        loading.classList.add('hidden');

        // Render data ke dalam HTML
        data.forEach((item, index) => {
            let fiturHTML = '';
            if (item.fitur && item.fitur.length > 0) {
                const badgeFitur = item.fitur.map(f => 
                    `<span class="bg-slate-100 text-slate-600 text-[10px] md:text-[11px] px-2 py-1 rounded-md border border-slate-200 whitespace-nowrap">${f}</span>`
                ).join('');
                
                fiturHTML = `
                    <div class="mt-5 pt-4 border-t border-slate-100">
                        <div class="flex flex-wrap gap-1.5 items-center justify-start">
                            ${badgeFitur}
                        </div>
                    </div>
                `;
            }

            const card = document.createElement('div');
            card.className = `card-container bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full card-animate`;
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="image-wrapper rounded-t-2xl relative h-56 md:h-64 w-full bg-slate-200">
                    <img src="${item.gambar}" alt="${item.judul}" class="w-full h-full object-cover">
                    ${item.harga ? `<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-slate-800 shadow-sm">${item.harga}</div>` : ''}
                </div>
                
                <div class="p-5 md:p-6 flex flex-col flex-grow">
                    <h3 class="font-playfair text-lg md:text-xl font-bold text-slate-900 mb-1">${item.judul}</h3>
                    <p class="text-xs md:text-sm text-slate-500 mb-4">${item.deskripsi}</p>
                    
                    <a href="${item.link}" target="_blank" class="mt-auto inline-flex items-center justify-center w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                        Lihat Preview
                    </a>

                    ${fiturHTML}
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
        loading.classList.add('hidden');
        container.innerHTML = `<p class="text-red-500 text-center w-full col-span-full">Gagal memuat data. Pastikan Anda menjalankan ini lewat Local Server.</p>`;
    }
}
