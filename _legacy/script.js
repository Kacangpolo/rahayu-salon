document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check saved theme or preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            const target = document.querySelector(this.getAttribute('href'));
            // Special case for 'appointment' link to open modal instead of scroll
            if (this.getAttribute('href') === '#appointment') {
                openModal('bookingModal');
                return;
            }
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Modal Functionalitites ---
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Function to open modal
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };

    // Function to close all modals
    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Event Listeners for Close Buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Triggers for Specific Modals
    // 1. Nails Details
    const nailsBtn = document.querySelector('img[alt="Nails Art"]').closest('.service-card')
        .querySelector('.btn-text');
    if (nailsBtn) {
        nailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('nailsModal');
        });
    }

    // 2. Massage Details
    const massageBtn = document.querySelector('img[alt="Massage Spa"]').closest('.service-card')
        .querySelector('.btn-text');
    if (massageBtn) {
        massageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('massageModal');
        });
    }

    // 3. Facial Details
    const facialBtn = document.querySelector('img[alt="Facial & Spa"]').closest('.service-card')
        .querySelector('.btn-text');
    if (facialBtn) {
        facialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // This button previously had 'open-booking' class, we should remove it in HTML or handled here.
            // Since we added a proper modal, we open that instead.
            openModal('facialModal');
        });
    }

    // 4. Main Reservation Buttons & Pre-filling
    const reservationBtns = document.querySelectorAll('a[href="#appointment"], .open-booking');
    reservationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceType = btn.getAttribute('data-service');

            closeAllModals(); // Close detail modal if open
            setTimeout(() => {
                openModal('bookingModal');
                if (serviceType) {
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        serviceSelect.value = serviceType;
                    }
                }
            }, 100);
        });
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
    }


    // --- Form Submission (Backend Integration) ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Mengirim...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                notes: document.getElementById('notes').value
            };

            try {
                // Send to backend
                const response = await fetch('http://localhost:5000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const adminModeEl = document.getElementById('adminMode');
                const adminMode = adminModeEl ? adminModeEl.checked : false;
                let whatsappUrl = '';
                let message = '';

                if (adminMode) {
                    // --- ADMIN MODE: Send Confirmation TO Customer ---
                    // Sanitize phone number to start with 62
                    let targetPhone = formData.phone.replace(/\D/g, '');
                    if (targetPhone.startsWith('0')) {
                        targetPhone = '62' + targetPhone.substring(1);
                    }

                    message = `Halo *${formData.name}*! 

Terima kasih telah melakukan reservasi di Rahayu Salon.
Berikut detail pesanan Anda yang telah kami terima:

💅 *Layanan:* ${formData.service}
📅 *Tanggal:* ${formData.date}
⏰ *Jam:* ${formData.time}
📝 *Catatan:* ${formData.notes || '-'}

Mohon datang 10 menit sebelum jadwal ya. Sampai jumpa! `;

                    whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

                } else {
                    // --- CUSTOMER MODE: Send Request TO Salon ---
                    const salonPhone = '6281246042720'; // Rahayu Salon Official Number

                    message = `Halo Rahayu Salon 👋,

Saya ingin melakukan reservasi dengan detail berikut:

👤 *Nama:* ${formData.name}
📞 *No HP/WA:* ${formData.phone}
💅 *Layanan:* ${formData.service}
📅 *Tanggal:* ${formData.date}
⏰ *Jam:* ${formData.time}
📝 *Catatan:* ${formData.notes || '-'}

Mohon konfirmasinya ya, terima kasih! `;

                    whatsappUrl = `https://wa.me/${salonPhone}?text=${encodeURIComponent(message)}`;
                }

                if (response.ok) {
                    // Success handling
                    const destination = adminMode ? 'Customer' : 'WhatsApp Salon';

                    // Populate Success Modal
                    document.getElementById('successName').innerText = formData.name;
                    document.getElementById('successService').innerText = formData.service;
                    document.getElementById('successDate').innerText = formData.date;
                    document.getElementById('successTime').innerText = formData.time;

                    // Setup WA Button
                    const waBtn = document.getElementById('waButton');
                    waBtn.href = whatsappUrl;

                    // Setup Google Calendar Button
                    const gcalBtn = document.getElementById('gcalButton');

                    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
                    // Assuming booking is 1 hour duration
                    const startTime = new Date(`${formData.date}T${formData.time}`);
                    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

                    const formatGCalTime = (date) => {
                        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
                    };

                    const gcalStart = formatGCalTime(startTime);
                    const gcalEnd = formatGCalTime(endTime);
                    const eventTitle = encodeURIComponent(`Booking Rahayu Salon: ${formData.service}`);
                    const eventDetails = encodeURIComponent(`Layanan: ${formData.service}\nCatatan: ${formData.notes}`);
                    const location = encodeURIComponent("Rahayu Salon, Denpasar");

                    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${gcalStart}/${gcalEnd}&details=${eventDetails}&location=${location}`;

                    gcalBtn.href = gcalUrl;

                    bookingForm.reset();
                    if (document.getElementById('adminMode')) {
                        document.getElementById('adminMode').checked = false;
                    }
                    closeAllModals();

                    // Open Success Modal
                    setTimeout(() => {
                        openModal('successModal');
                    }, 500);

                } else {
                    // Fallback if backend fails but we still want to let them book via WA
                    const errorData = await response.json();
                    if (confirm('Gagal menyimpan ke database sistem, tapi Anda tetap bisa lanjut reservasi lewat WhatsApp. Lanjutkan?')) {
                        window.open(whatsappUrl, '_blank');
                        closeAllModals();
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                // Fallback for network error
                if (confirm('Terjadi kesalahan koneksi ke server. Lanjutkan reservasi via WhatsApp saja?')) {
                    const message = `Halo Rahayu Salon ,

Saya ingin melakukan reservasi (Manual via WA karena error sistem):

👤 *Nama:* ${formData.name}
📞 *No HP/WA:* ${formData.phone}
💅 *Layanan:* ${formData.service}
📅 *Tanggal:* ${formData.date}
⏰ *Jam:* ${formData.time}
📝 *Catatan:* ${formData.notes || '-'}

Mohon konfirmasinya ya, terima kasih! `;
                    const whatsappUrl = `https://wa.me/6281246042720?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                    closeAllModals();
                }
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    // --- Dynamic Navbar on Scroll ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
            header.style.padding = "10px 0"; // Slight shrink effect if CSS supports it or just shadow
        } else {
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.05)";
            header.style.padding = "0";
        }
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;

            // Toggle current
            question.classList.toggle('active');
            answer.classList.toggle('open');

            // Close others (Accordion behavior)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('open');
                }
            });
        });
    });

});
