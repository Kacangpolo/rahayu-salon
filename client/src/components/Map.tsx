
export default function Map() {
    return (
        <section className="h-[400px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126214.40546654762!2d115.09707621640624!3d-8.654271899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2409b0e5e80db%3A0xe27334e615a63581!2sDenpasar%2C%20Bali!5e0!3m2!1sen!2sid!4v1705000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-8 left-8 bg-white p-8 rounded-xl shadow-2xl max-w-sm hidden md:block">
                <h3 className="text-xl font-bold font-serif mb-2">Lokasi Kami</h3>
                <p className="text-gray-600 mb-4">Jalan Kecantikan No. 123, Denpasar, Bali</p>
                <div className="flex items-center text-rose-600 font-semibold cursor-pointer hover:underline">
                    <span>Buka di Google Maps</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
            </div>
        </section>
    );
}
