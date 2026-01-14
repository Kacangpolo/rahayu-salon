# Panduan Deployment: Membuat Website Rahayu Salon Publik 🌍

Panduan ini akan membantu Anda menayangkan website **Rahayu Salon** agar bisa diakses oleh siapa saja di internet.

Kita akan menggunakan kombinasi layanan gratis/murah yang sangat populer:
1.  **Railway.app**: Untuk Backend (Server), Database (PostgreSQL), dan Redis.
2.  **Vercel**: Untuk Frontend (Tampilan Website).

---

## Persiapan Awal
Pastikan kode Anda sudah ada di **GitHub** (sesuai langkah Portofolio sebelumnya).

---

## Langkah 1: Deploy Backend & Database (Railway)
*Layanan ini akan menghosting "Otak" dan "Memori" sistem.*

1.  Buka [Railway.app](https://railway.app/) dan Login (bisa pakai akun GitHub).
2.  Klik **+ New Project** > **Deploy from GitHub repo**.
3.  Pilih repository `rahayu-salon` Anda.
4.  Klik **Add Variables**. Masukkan variabel berikut (bisa dilihat di file `.env` lokal Anda, tapi sesuaikan untuk publik):
    ```env
    PORT=5000
    # Nanti diisi setelah Frontend di-deploy
    CLIENT_URL=https://rahayu-salon.vercel.app 
    
    # Biarkan kosong dulu, Railway akan buatkan otomatis:
    # DATABASE_URL
    # REDIS_HOST
    # REDIS_PORT
    ```
5.  Klik **Deploy**.
6.  Setelah project terbuat, klik kanan di canvas > **Add Database** > **PostgreSQL**. Railway akan otomatis menyambungkan variabel `DATABASE_URL` ke server Anda.
7.  Klik kanan lagi > **Add Database** > **Redis**. Railway akan menyambungkan `REDIS_HOST`.
8.  **PENTING**: Masuk ke menu **Settings** project Server > **Networking** > **Generate Domain**.
    *   Copy domain yang muncul (contoh: `rahayu-backend-production.up.railway.app`). Ini adalah **API URL** Anda.

---

## Langkah 2: Deploy Frontend (Vercel)
*Layanan ini akan menghosting "Wajah" website.*

1.  Buka [Vercel.com](https://vercel.com/) dan Login.
2.  Klik **Add New...** > **Project**.
3.  Import repository `rahayu-salon`.
4.  Pada konfigurasi **"Root Directory"**, klik Edit dan pilih folder `client`.
5.  Pada **Environment Variables**, masukkan:
    ```env
    # URL dari Langkah 1 (tambah https:// di depannya)
    NEXT_PUBLIC_API_URL=https://rahayu-backend-production.up.railway.app
    ```
6.  Klik **Deploy**.
7.  Tunggu sebentar. Jika sukses, Vercel akan memberi Anda link website (contoh: `rahayu-salon.vercel.app`).

---

## Langkah 3: Menghubungkan Keduanya
Sekarang kita perlu memberi tahu Backend alamat Frontend yang baru.

1.  Kembali ke **Railway**.
2.  Buka tab **Variables** di service Server.
3.  Update `CLIENT_URL` dengan link dari Vercel (contoh: `https://rahayu-salon.vercel.app`).
4.  Railway akan otomatis Redeploy.

---

## Selesai!
Website Anda sekarang sudah online!
-   **Publik**: `https://rahayu-salon.vercel.app`
-   **Admin**: `https://rahayu-salon.vercel.app/admin`

*Catatan: Untuk notifikasi WhatsApp yang "beneran", Anda perlu mendaftar layanan seperti Fonnte atau Twilio dan memasukkan API Key-nya di Variables Railway.*
