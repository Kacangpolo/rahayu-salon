
export default function Gallery() {
    const images = [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=800",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600&h=800",
        "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=600&h=800",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600&h=800"
    ];

    return (
        <section className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="mb-6 md:mb-0">
                        <span className="text-rose-400 font-semibold tracking-wider text-sm uppercase">Portofolio Kami</span>
                        <h2 className="text-4xl font-serif mt-2">Galeri Kemewahan</h2>
                    </div>
                    <a href="#" className="hidden md:inline-block px-8 py-3 border border-rose-500 text-rose-400 rounded-full hover:bg-rose-500 hover:text-white transition-colors">Lihat Semua Foto</a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className={`relative group overflow-hidden rounded-xl ${i % 2 === 0 ? 'mt-0' : 'mt-8'}`}>
                            <img
                                src={img}
                                alt={`Gallery ${i}`}
                                className="w-full h-[400px] object-cover transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-serif">Rahayu Experience</h3>
                                    <span className="text-rose-300 text-sm">Lihat Detail</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
