
export default function Testimonials() {
    const reviews = [
        {
            name: "Sinta Wulandari",
            role: "Entrepreneur",
            content: "Pelayanan terbaik di Bali! Terapisnya sangat profesional dan tempatnya benar-benar menenangkan. Sangat merekomendasikan paket Full Spa.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            name: "Jessica Tan",
            role: "Digital Nomad",
            content: "Tempat yang sempurna untuk me time. Saya suka ambience-nya yang mewah tapi tetap homey. Nail art-nya juga sangat rapi dan tahan lama.",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            name: "Rina Kusuma",
            role: "Ibu Rumah Tangga",
            content: "Sering kesini bareng teman-teman arisan. Staff ramah banget dan hasilnya selalu memuaskan. Facial-nya bikin wajah glowing instan!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
        }
    ];

    return (
        <section className="py-24 bg-rose-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-rose-600 font-semibold tracking-wider text-sm uppercase">Apa Kata Merekas</span>
                    <h2 className="text-4xl font-serif text-gray-900 mt-2 mb-4">Testimonial Pelanggan</h2>
                    <div className="w-20 h-1 bg-rose-400 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex justify-center -mt-16 mb-6">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic mb-6">"{review.content}"</p>
                                <h4 className="font-serif text-lg font-bold text-gray-900">{review.name}</h4>
                                <span className="text-rose-500 text-sm">{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
