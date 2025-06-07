![Front Wall](https://github.com/user-attachments/assets/c773bb4b-0480-4c07-8387-2ff702dc290b)

## IoT Serve v1.0 (MQTT React Express)
Dalam repository ini adalah sistem monitoring dan kontrol mikrokontoler dinamai dengan branding **IoT Serve** (tested : **ESP8266**) berbasis IoT (protokol : **MQTT** | tested : HiveMQ Cloud Broker) dan aplikasi web dengan stack Javascript (**M**ySql, **E**xpress, **R**eact, **N**odeJs). Sorce code ini dibuat hanya sebagai base sistem IoT dan dirancang untuk dapat digunakan dengan **shared hosting** sebagai contoh saya buat sebagai sistem monitoring dan kontrol kebun. Free for all to use or modified **Best Regards : DM**

#### Jika kamu merasa ini bermanfaat, kamu bisa mendukung saya lewat donasi:
- [🎁 Dukung di Saweria](https://saweria.co/dmaulana)

## Features 
- Monitor panel view (Chart Log View & Realtime Sensor Value)
- Control panel view
- Uses MQTT Protocol over WebSocket
- Authenticated connection via API Auth key
- ESP8266 code (Support MQTT over SSL)

## Installation
#### Web Application
1. Clone/Download this repository.
2. Pre Install Package pada folder backend dan frontend "npm install" on terminal.
3. Sesuaikan file env pada folder backend dan frontend "cp .env.example .env" on terminal.
4. Ready to use.

#### ESP8266 Code
1. Download code dari repository ini.
2. Treatment jika menggunakan MQTT over SSL inject SSL certificate mengacu dokumentasi HiveMQ
   Login/Sign Up HiveMQ Cloud -> On Console Cluster going to -> Getting Started Tab -> Choose Arduino
   ![Screenshot 2025-06-07 112524](https://github.com/user-attachments/assets/35cd1de4-1ca7-461d-8fcc-42dec78361f0)
   Note :
   - Little FS Uploder hanya jalan di Arduino IDE 1.8.x [Tutor](https://randomnerdtutorials.com/install-esp8266-nodemcu-littlefs-arduino/).
   - Generate certificate with python access file "certs-from-mozilla.py" (run dengan python akan generate "data/certs.ar" untuk diupload dengan Little FS).
  
4. Masukkan parameter parameter SSID/Password Wifi serta credential MQTT sesuai milikmu.
5. Code masih menggunakan generate value random via Arduino syntax bisa diubah dengan kebutuhan sensormu.
6. Setting board port -> Upload.
7. Ready to use.

## Testing Video
[![Watch the video](https://img.youtube.com/vi/6AZEsBuW6Ag/maxresdefault.jpg)](https://youtu.be/6AZEsBuW6Ag)
### [Watch this video](https://youtu.be/6AZEsBuW6Ag)
