export default function Map() {
    return (
        <section className="h-[400px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
            <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-8">
                <p className="text-gray-600 mb-4">Jl. Kresek No 1, Sesetan, Denpasar Selatan (Suwung Batan Kendal)</p>
                <div className="w-full h-80 rounded-lg overflow-hidden relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.020577782626!2d115.22817237497262!3d-8.691763991093123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240f2b3b7c87f%3A0x5030bfbca8305c0!2sJl.%20Kresek%20No.1%2C%20Sesetan%2C%20Denpasar%20Selatan%2C%20Kota%20Denpasar%2C%20Bali!5e0!3m2!1sen!2sid!4v1705040000000!5m2!1sen!2sid"
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
                <div className="flex items-center text-rose-600 font-semibold cursor-pointer hover:underline">
                    <span>Buka di Google Maps</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
            </div>
        </section>
    );
}
