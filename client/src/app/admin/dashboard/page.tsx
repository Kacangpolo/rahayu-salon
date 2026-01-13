"use client";

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeView, setActiveView] = useState('Dashboard');
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        revenue: 150450000,
        appointments: 28,
        clients: 142
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin');
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            const calendarEvents = res.data.map((b: any) => ({
                id: b.id,
                title: `${b.customerName} - ${b.service.name}`,
                start: b.startAt,
                end: b.endAt,
                backgroundColor: b.status === 'PENDING' ? '#F59E0B' : '#10B981',
                borderColor: b.status === 'PENDING' ? '#B45309' : '#047857',
                extendedProps: {
                    resource: b.resource?.name || 'Unassigned',
                    phone: b.customerPhone,
                    status: b.status
                }
            }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                            {/* Stats Cards */}
                            <div className="lg:col-span-1 space-y-8">
                                {/* Revenue Card */}
                                <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/20"></div>
                                    <h3 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Total Revenue</h3>
                                    <div className="text-4xl font-bold text-secondary mb-4">Rp 150.450.000</div>
                                    <div className="flex items-center text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                                        <span className="mr-1">↑</span> +12.5% vs last month
                                    </div>
                                </div>

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                                        <h3 className="text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-1">Appointments</h3>
                                        <div className="text-3xl font-bold text-secondary">{stats.appointments}</div>
                                    </div>
                                    <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                                        <h3 className="text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-1">New Clients</h3>
                                        <div className="text-3xl font-bold text-secondary">{stats.clients}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Widget */}
                            <div className="lg:col-span-2 bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-2xl relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-amber-200/50 rounded-t-3xl"></div>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-light text-secondary">Appointment Schedule</h3>
                                    <div className="flex space-x-3 text-xs font-medium">
                                        <span className="flex items-center px-3 py-1 bg-white/60 rounded-full border border-white"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Confirmed</span>
                                        <span className="flex items-center px-3 py-1 bg-white/60 rounded-full border border-white"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Pending</span>
                                    </div>
                                </div>

                                <style jsx global>{`
                                    .fc { font-family: var(--font-outfit), sans-serif; }
                                    .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 300 !important; color: #334155; }
                                    .fc-button-primary { background-color: white !important; color: #475569 !important; border: 1px solid #e2e8f0 !important; border-radius: 0.75rem !important; padding: 0.5rem 1rem !important; font-size: 0.875rem !important; font-weight: 500 !important; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                                    .fc-button-primary:hover { background-color: #f8fafc !important; border-color: #cbd5e1 !important; transform: translateY(-1px); }
                                    .fc-button-active { background-color: #f1f5f9 !important; color: #0f172a !important; }
                                    .fc-daygrid-day-number { color: #64748b; font-weight: 500; }
                                    .fc-col-header-cell-cushion { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding-bottom: 1rem !important; }
                                    .fc-timegrid-slot-label-cushion { color: #94a3b8; font-size: 0.75rem; }
                                    .fc-event { border-radius: 0.5rem; border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.2s; }
                                    .fc-event:hover { transform: scale(1.02); z-index: 50; }
                                    .fc .fc-timegrid-now-indicator-line { border-color: #D4AF37; border-width: 2px; }
                                    .fc .fc-timegrid-now-indicator-arrow { border-color: #D4AF37; border-width: 6px; }
                                `}</style>

                                <div className="h-[600px]">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView="timeGridWeek"
                                        timeZone='Asia/Makassar'
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek'
                                        }}
                                        events={events}
                                        height="100%"
                                        slotMinTime="09:00:00"
                                        slotMaxTime="21:00:00"
                                        allDaySlot={false}
                                        slotDuration="01:00:00"
                                        slotLabelFormat={{
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            omitZeroMinute: false,
                                            meridiem: 'short'
                                        }}
                                        eventContent={(eventInfo) => (
                                            <div className={`p-2 h-full flex flex-col justify-center border-l-4 ${eventInfo.event.extendedProps.status === 'PENDING' ? 'border-amber-600 bg-amber-100/90 text-amber-900' : 'border-emerald-600 bg-emerald-100/90 text-emerald-900'}`}>
                                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-0.5">{eventInfo.timeText}</div>
                                                <div className="font-bold text-xs truncate leading-tight">{eventInfo.event.title}</div>
                                                <div className="mt-1 flex items-center justify-between opacity-80 text-[10px]">
                                                    <span className="font-medium bg-white/40 px-1.5 py-0.5 rounded">{eventInfo.event.extendedProps.resource}</span>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-2xl font-light text-secondary mb-2">{activeView}</h3>
                        <p className="text-gray-500 max-w-sm">
                            Modul ini sedang dalam pengembangan tahap lanjut untuk memberikan pengalaman manajemen salon yang lebih premium.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-cream flex font-sans text-secondary selection:bg-primary selection:text-white">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/40 bg-white/20 backdrop-blur-xl p-8 shadow-2xl z-50">
                <div className="mb-12">
                    <h1 className="text-4xl font-light text-secondary tracking-tight">RAHAYU<br /><span className="font-bold text-primary">SALON</span></h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase ml-1">Premium Admin</p>
                </div>

                <nav className="flex-1 space-y-4">
                    {['Dashboard', 'Bookings', 'Clients', 'Staff', 'Finance'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveView(item)}
                            className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 group ${activeView === item ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary text-secondary font-semibold shadow-sm' : 'hover:bg-white/40 text-gray-500 hover:text-secondary'}`}
                        >
                            <span className="text-lg">{item}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-white/30">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/admin');
                        }}
                        className="flex items-center space-x-3 text-red-400 hover:text-red-500 transition-colors px-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-light text-secondary mb-2">{activeView}</h2>
                        <p className="text-gray-500 text-lg font-light">Welcome back, Manager.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-amber-200 shadow-lg border-2 border-white ring-2 ring-primary/20"></div>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
}
