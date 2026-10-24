# 🗺️ SteamGeo Intelligence — Spatial Data Science & Early-Warning GIS

[![Live GIS App](https://img.shields.io/badge/Live%20Platform-geo.steamcraft.online-10b981?style=for-the-badge&logo=googlemaps&logoColor=white)](https://geo.steamcraft.online)
[![Ecosystem](https://img.shields.io/badge/STEAM--Craft-Ecosystem-0284c7?style=for-the-badge&logo=react&logoColor=white)](https://steamcraft.online)
[![Creator Portfolio](https://img.shields.io/badge/Portfolio-Muhammad%20Naza%20Firmansyah-6366f1?style=for-the-badge&logo=github&logoColor=white)](https://portofolionaza.steamcraft.online)

**SteamGeo Intelligence** adalah platform analitik geospasial tingkat lanjut berbasis **Geographically Weighted Regression (GWR)**, autokorelasi spasial **Global Moran's I**, dan sistem peringatan dini **Early-Warning Vector-Borne Disease** untuk 38 Kabupaten/Kota di Provinsi Jawa Timur.

- **Lead Developer & System Architect**: **Muhammad Naza Firmansyah** ([Portofolio](https://portofolionaza.steamcraft.online) • [GitHub](https://github.com/nazaa-arch))
- **Production URL**: [`https://geo.steamcraft.online`](https://geo.steamcraft.online)
- **Part of Ecosystem**: [`https://steamcraft.online`](https://steamcraft.online)

---

## 🌟 Fitur Utama

1. **Pemodelan Spasial GWR (Geographically Weighted Regression)**:
   - Estimasi heterogenitas koefisien regresi lokal $\beta_k(u_i, v_i)$ pada setiap unit geografis.
   - Fungsi pembobotan kernel fleksibel: *Adaptive Bi-Square Kernel* dan *Fixed Gaussian Kernel*.
   - Parameter bandwidth tuning dinamis dengan pembaruan metrik *goodness of fit* ($R^2$ lokal).

2. **Deteksi Kluster Autokorelasi Spasial (LISA & Moran's I)**:
   - Klasifikasi kuadran autokorelasi spasial: High-High (Hotspot), Low-Low (Coldspot), High-Low, dan Low-High outliers.
   - Perhitungan otomatis nilai $I$ spasial beserta signifikansi p-value.

3. **Sistem Peringatan Dini Iklim & Demografi (Dengue Surveillance)**:
   - Telemetri curah hujan (mm/bulan), suhu udara (°C), kelembaban relatif (%), dan kepadatan populasi terhadap insidensi DBD.
   - Status kesiapsiagaan otomatis per kabupaten/kota (*Aman*, *Waspada*, *Siaga*, *Bahaya*) beserta rekomendasi tindakan epidemiologis.

4. **Visualisasi Interaktif Choropleth & Export Data**:
   - Peta visual spasial SVG interaktif 38 Kabupaten/Kota Jawa Timur (Bakorwil Bojonegoro, Malang, Madiun, Jember, Pamekasan).
   - Fitur ekspor dataset tabular analitis ke format `.csv` untuk publikasi ilmiah dan analisis lanjut di R/Python/QGIS.

---

## 🚀 Menjalankan Secara Lokal

```bash
# Clone repositori
git clone https://github.com/nazaa-arch/steamgeo-intelligence.git
cd steamgeo-intelligence

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka browser di `http://localhost:3004`.

## 📦 Build Produksi

```bash
npm run build
```

Hasil build siap saji tersimpan dalam folder `dist/` dan siap di-deploy ke web server (LiteSpeed / cPanel / Nginx / Vercel).

---

© 2026 **Muhammad Naza Firmansyah**. STEAM-Craft Ecosystem.
