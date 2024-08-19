# GreenApp

**GreenApp** adalah aplikasi mobile yang dibangun menggunakan React Native untuk memonitor dan mengontrol berbagai parameter lingkungan di sistem pertanian hidroponik atau akuaponik. Aplikasi ini terhubung dengan perangkat ESP32 melalui protokol MQTT untuk mengatur suhu, kelembapan, pH air, nutrisi air, dan kontrol perangkat seperti fan, sprayer, dan lampu.

## Fitur Utama

- **Monitoring Suhu**: Memantau suhu lingkungan secara real-time.
- **Monitoring Kelembapan**: Memantau tingkat kelembapan udara.
- **Monitoring pH Air**: Memantau tingkat keasaman air (pH).
- **Monitoring Nutrisi Air**: Memantau kadar nutrisi dalam air.
- **Kontrol Perangkat**:
  - **Fan 1 & Fan 2**: Mengaktifkan atau menonaktifkan kipas.
  - **Sprayer**: Mengaktifkan atau menonaktifkan sprayer.
  - **Lampu**: Mengatur pencahayaan.
  
## Teknologi yang Digunakan

- **React Native**: Framework untuk membangun aplikasi mobile.
- **MQTT**: Protokol komunikasi untuk IoT.
- **ESP32**: Microcontroller untuk mengontrol perangkat fisik.
- **MQTT Explorer**: Tool untuk memonitor dan menguji pesan MQTT.

## Cara Menggunakan

1. **Clone repository**:
   ```bash
   git clone https://github.com/username/GreenApp.git
