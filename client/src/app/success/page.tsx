import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-lg border-t-8 border-[#b23b3b]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-serif text-gray-900 mb-4">Reservasi Berhasil!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Terima kasih telah memilih Rahayu Salon. <br />
                    Konfirmasi telah dikirim ke <strong>WhatsApp</strong> dan invite jadwal telah dikirim ke <strong>Email</strong> Anda.
                </p>

                <div className="space-y-4">
                    <Link href="/" className="block w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
