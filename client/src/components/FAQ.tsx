
import { useState } from 'react';

export default function FAQ() {
    const faqs = [
        {
            q: "Apakah harus reservasi terlebih dahulu?",
            a: "Ya, kami sangat menyarankan untuk reservasi terlebih dahulu untuk memastikan ketersediaan slot waktu dan terapis pilihan Anda."
        },
        {
            q: "Bagaimana jika saya terlambat datang?",
            a: "Kami memberikan toleransi keterlambatan 15 menit. Jika lebih dari itu, durasi perawatan mungkin akan dikurangi agar tidak mengganggu jadwal pelanggan berikutnya."
        },
        {
            q: "Apakah ada area parkir?",
            a: "Tentu! Kami menyediakan area parkir luas dan aman gratis untuk semua pelanggan Rahayu Salon."
        },
        {
            q: "Apakah menerima pembayaran Cashless?",
            a: "Ya, kami menerima pembayaran via QRIS, Debit Card, Credit Card, dan Transfer Bank."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif text-gray-900 mb-4">Pertanyaan Umum</h2>
                    <div className="w-20 h-1 bg-rose-600 mx-auto"></div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left p-6 bg-gray-50 flex justify-between items-center hover:bg-rose-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-800 text-lg">{faq.q}</span>
                                <span className={`text-rose-500 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </button>
                            <div
                                className={`bg-white transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 p-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                            >
                                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
