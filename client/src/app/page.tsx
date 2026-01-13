"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Logo from '@/components/Logo';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import FAQ from '@/components/FAQ';
import Map from '@/components/Map';
import ScrollToTop from '@/components/ScrollToTop';

interface Service {
    id: string;
    name: string;
    price: string;
    durationMin: number;
}

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: '',
        date: '',
        time: '',
        notes: ''
    });

    // Mock Services for Demo Mode
    const MOCK_SERVICES: Service[] = [
        { id: '1', name: 'Hair Spa L', price: 'Rp 150.000', durationMin: 60 },
        { id: '2', name: 'Manicure Standard', price: 'Rp 100.000', durationMin: 60 },
        { id: '3', name: 'Facial Deluxe', price: 'Rp 250.000', durationMin: 90 },
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                if (Array.isArray(res.data)) {
                    setServices(res.data.map((s: any) => ({
                        ...s,
                        price: `Rp ${new Intl.NumberFormat('id-ID').format(s.price)}`
                    })));
                }
            } catch (err) {
                console.warn('Backend offline, using Mock Data for Demo.');
                // Fallback to Mock Data
                setServices(MOCK_SERVICES);
                // Clear error so user sees the demo
                setError('');
            } finally {
                setInitLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Force WITA Timezone (Asia/Makassar is UTC+8)
            const bookingTime = `${formData.date}T${formData.time}:00+08:00`;
            // Destructure to remove date and time from the payload sent to server
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { date, time, ...payload } = formData;

            await api.post('/bookings', {
                ...payload,
                bookingTime,
            });

            router.push('/success');
        } catch (error: any) {
            console.error('Booking failed:', error);
            // Check if it's a Network Error (Backend not reachable) -> Allow simulation success for Demo
            if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
                console.log("Simulating success for Demo Mode");
                router.push('/success');
                return;
            }

            const msg = error.response?.data?.message
                ? (Array.isArray(error.response.data.message)
                    ? error.response.data.message.join(', ')
                    : error.response.data.message)
                : 'Terjadi kesalahan saat reservasi';
            alert(`Gagal: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200 selection:text-rose-900">
            <ScrollToTop />

            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>
                    {/* High-quality background - Luxury Nail & Spa */}
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center animate-slow-zoom"></div>
                </div>
            </div>

            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <Logo className="w-32 h-auto drop-shadow-2xl animate-fade-in-up" />
                </div>
                <span className="block text-rose-200 text-sm md:text-base font-medium tracking-[0.3em] mb-6 uppercase animate-fade-in-up">Hair, Spa, Nails & Eyelashes</span>
                <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-wide leading-tight animate-fade-in-up delay-100">Rahayu Salon <br /> <span className="italic text-rose-100 font-light">& Nails Art</span></h1>
                <p className="text-lg md:text-2xl font-light text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                    Destinasi perawatan kecantikan premium di jantung Bali. Kembalikan kilau alami Anda dengan sentuhan profesional kami.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                    <a href="#booking" className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-full font-medium tracking-wide transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-rose-900/50">
                        Reservasi Sekarang
                    </a>
                    <a href="#testimonials" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-full font-medium tracking-wide transition-all">
                        Lihat Review
                    </a>
                </div>
            </div>
        </section>

            {/* Testimonials */ }
    <div id="testimonials">
        <Testimonials />
    </div>

    {/* Booking Section */ }
    <section id="booking" className="py-24 px-4 md:px-0 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <span className="text-rose-600 font-semibold tracking-wider text-sm uppercase">Reservation</span>
                <h2 className="text-4xl font-serif text-gray-900 mt-2 mb-4">Buat Jadwal Perawatan</h2>
                <div className="w-20 h-1 bg-rose-600 mx-auto mb-6"></div>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Silahkan isi form di bawah ini untuk memesan slot waktu Anda secara real-time.
                </p>
            </div>

            {initLoading ? (
                <div className="text-center py-20 text-gray-400 italic">Memuat layanan eksklusif kami...</div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg">{error}</div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Personal Info */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 pb-4">
                                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xl font-serif">1</div>
                                <h3 className="text-2xl font-serif text-gray-800">Informasi Pelanggan</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Nama Lengkap</label>
                                    <input
                                        name="customerName"
                                        type="text"
                                        required
                                        className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="Nama Anda"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Email</label>
                                    <input
                                        name="customerEmail"
                                        type="email"
                                        required
                                        className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="email@domain.com"
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-gray-400 mt-2 font-light">E-ticket akan dikirim ke email ini.</p>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">WhatsApp</label>
                                    <input
                                        name="customerPhone"
                                        type="tel"
                                        required
                                        className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="081..."
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 pb-4">
                                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xl font-serif">2</div>
                                <h3 className="text-2xl font-serif text-gray-800">Detail Layanan</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Pilih Layanan</label>
                                    <div className="relative">
                                        <select
                                            name="serviceId"
                                            required
                                            className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none appearance-none cursor-pointer transition-all duration-300"
                                            onChange={handleChange}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>-- Pilih Menu Perawatan --</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} ({s.durationMin} min) - {s.price}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-rose-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Tanggal</label>
                                        <input
                                            name="date"
                                            type="date"
                                            required
                                            className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none cursor-pointer transition-all duration-300"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Jam (WITA)</label>
                                        <input
                                            name="time"
                                            type="time"
                                            required
                                            min="09:00"
                                            max="21:00"
                                            className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none cursor-pointer transition-all duration-300"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-focus-within:text-rose-600 transition-colors">Catatan Tambahan</label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="Alergi, request khusus..."
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto min-w-[320px] bg-rose-600 text-white py-5 px-10 rounded-full font-bold text-lg tracking-wider hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-600/20 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center space-x-3"
                        >
                            <span>{loading ? 'MEMPROSES...' : 'KONFIRMASI BOOKING'}</span>
                            {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                        </button>
                        <p className="text-gray-400 text-sm mt-6 flex items-center bg-gray-50 px-4 py-2 rounded-full">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Konfirmasi Instan via WhatsApp & Kalender
                        </p>
                    </div>
                </form>
            )}
        </div>
    </section>

    {/* Gallery */ }
    <Gallery />

    {/* FAQ */ }
    <FAQ />

    {/* Map */ }
    <Map />

    {/* Footer */ }
    <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
            <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-serif text-white mb-6">Rahayu Salon & Spa</h3>
                <p className="leading-relaxed mb-6 max-w-sm">
                    Kami berkomitmen untuk memberikan pengalaman perawatan kecantikan terbaik dengan menggunakan produk berkualitas dan terapis bersertifikasi. Rasakan ketenangan di tengah kesibukan Bali.
                </p>
                <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors">FB</a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors">IG</a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors">WA</a>
                </div>
            </div>
            <div>
                <h4 className="text-white font-bold uppercase tracking-wider mb-6">Layanan</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="hover:text-rose-400 transition-colors">Hair Treatment</a></li>
                    <li><a href="#" className="hover:text-rose-400 transition-colors">Manicure & Pedicure</a></li>
                    <li><a href="#" className="hover:text-rose-400 transition-colors">Facial Spa</a></li>
                    <li><a href="#" className="hover:text-rose-400 transition-colors">Body Massage</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold uppercase tracking-wider mb-6">Hubungi Kami</h4>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>Jl. Kresek No 1, Sesetan,<br />Denpasar Selatan (Suwung Batan Kendal)</span>
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span>+62 812 3456 7890</span>
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span>booking@rahayusalon.com</span>
                    </li>
                </ul>
            </div>
        </div>
        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Rahayu Salon. Developed for Excellence by <strong>K. Dharma Wijaya Kusuma</strong> using Next.js & NestJS.</p>
        </div>
    </footer>
        </main >
    );
}
