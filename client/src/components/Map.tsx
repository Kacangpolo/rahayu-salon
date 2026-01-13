export default function Map() {
    return (
        <section className="h-[400px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
            <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-8">
                <p className="text-gray-600 mb-4">Jl. Kresek No 1, Sesetan, Denpasar Selatan (Suwung Batan Kendal)</p>
                <div className="w-full h-80 rounded-lg overflow-hidden relative">
                    <iframe
                        src="https://maps.google.com/maps?q=Jl.%20Kresek%20No%201%2C%20Sesetan%2C%20Denpasar%20Selatan%20(Suwung%20Batan%20Kendal)&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            <div className="absolute top-8 left-8 bg-white p-8 rounded-xl shadow-2xl max-w-sm hidden md:block">
                <h3 className="text-xl font-bold font-serif mb-2">Lokasi Kami</h3>
                <p className="text-gray-600 mb-4">Jl. Kresek No 1, Sesetan, Denpasar Selatan (Suwung Batan Kendal)</p>
                <a
                    href="https://www.google.com/maps/search/?api=1&query=Jl.+Kresek+No+1,+Sesetan,+Denpasar+Selatan+(Suwung+Batan+Kendal)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-rose-600 font-semibold cursor-pointer hover:underline"
                >
                    <span>Buka di Google Maps</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
            </div>
        </section>
    );
}
