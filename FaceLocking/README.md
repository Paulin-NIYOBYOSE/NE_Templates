# FaceLock Vision

**Developed by Paulin** — Real-time face recognition with target lock-on, activity logging, and optional servo tracking via MQTT.

---

## Prerequisites

- **Python 3.10+** (tested on 3.13)
- A working webcam
- Optional: ESP8266 + SG90 servo for pan tracking

---

## 1. Setup

### 1.1 Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate       # Windows
```

### 1.2 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 1.3 Download Face Models (one-time)

```bash
mkdir -p models

# MediaPipe face landmarker
curl -L -o models/face_landmarker.task \
  https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task

# ArcFace embedding model (ONNX)
curl -L -o models/embedder_arcface.onnx \
  https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx
```

> **Windows:** Use `Invoke-WebRequest` in PowerShell if `curl` is unavailable.

### 1.4 Configure the Project

Open `src/config.py` and adjust at minimum:

| Setting                               | Description                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `CAMERA_INDEX`                        | Webcam index (`0` = default). Run `python -m src.camera_utils` to scan indices. |
| `MQTT_BROKER_HOST`                    | IP of your MQTT broker (your Mac/PC IP if running Mosquitto locally).           |
| `MQTT_BROKER_PORT`                    | Usually `1883`.                                                                 |
| `SERVO_MIN_ANGLE` / `SERVO_MAX_ANGLE` | Hardware limits (default: `15`–`165`).                                          |

---

## 2. Running the System

### 2.1 Check Camera

```bash
python -m src.camera
```

### 2.2 Register Faces

```bash
python -m src.enroll
```

- Enter a name when prompted.
- Look at the camera; samples are captured automatically.
- Press **S** to save the person.
- Press **Q** to quit enrollment.

Repeat for every person you want to recognize.

### 2.3 Run Face Recognition

```bash
python -m src.recognize
```

- The system shows a bounding box around every face.
- **Red** = unknown, **Blue** = registered (not locked), **Green** = locked target.
- Type a name or number to lock onto a specific person.
- Press **Q** to quit. Activity logs are saved to `data/history/`.

### 2.4 Run with Servo Tracking (MQTT)

```bash
python track.py              # Recognition + servo tracking + web dashboard
python track.py --no-mqtt    # Recognition + dashboard, no hardware
python track.py --no-web     # Recognition + servo, no dashboard
python track.py --fullscreen # Start in fullscreen
```

The web dashboard is served at `http://localhost:5001`.

---

## 3. Optional: Hardware Setup (MQTT + ESP8266)

### 3.1 Wiring

| ESP8266 (NodeMCU) | SG90 Servo |
| ----------------- | ---------- |
| D4                | Signal     |
| 3V3               | VCC        |
| GND               | GND        |

Use an external 5V supply if the servo jitters or resets the board.

### 3.2 Install Broker (macOS)

```bash
brew install mosquitto
brew services start mosquitto
```

### 3.3 Flash Firmware

1. Open `arduino/esp8266_camera_tracker/esp8266_camera_tracker.ino` in Arduino IDE.
2. Set your WiFi and MQTT broker IP:
   ```cpp
   const char* ssid     = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* mqtt_server = "192.168.1.XXX";  // Same as MQTT_BROKER_HOST
   ```
3. Select **Tools > Board > NodeMCU 1.0 (ESP-12E Module)**.
4. Select the correct **Port** and click **Upload**.
5. Open Serial Monitor (115200 baud) to verify connection.

See `arduino/README.md` and `arduino/WIRING_DIAGRAM.txt` for full details.

---

## 4. Project Structure

```
FaceLocking/
├── src/                          # Python source modules
│   ├── enroll.py                 # Face registration
│   ├── recognize.py              # Recognition + activity logging
│   ├── recognize_with_tracking.py# Recognition + servo tracking
│   ├── config.py                 # All tunable settings
│   ├── camera.py / camera_utils.py # Camera helpers
│   ├── activity_logger.py        # Blink/smile/movement logging
│   ├── tracking.py / face_tracker.py # PID servo control
│   └── mqtt_camera_controller.py # MQTT client
├── arduino/                      # ESP8266 firmware & docs
├── templates/                    # Web dashboard HTML
├── data/                         # Runtime data (created automatically)
│   ├── db/                       # Face database
│   ├── enroll/                   # Enrollment crops
│   └── history/                  # Activity CSV/JSON logs
├── models/                       # Downloaded ONNX + MediaPipe models
├── requirements.txt              # Python dependencies
├── track.py                      # Main entry point (tracking mode)
└── README.md                     # This file
```

---

## 5. Troubleshooting

| Issue                       | Fix                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Camera not opening          | Run `python -m src.camera_utils` to find the correct `CAMERA_INDEX` in `src/config.py`.                                 |
| Model file not found        | Ensure `models/face_landmarker.task` and `models/embedder_arcface.onnx` are downloaded.                                 |
| No faces recognized         | Enroll at least one person with `python -m src.enroll`. Ensure good lighting.                                           |
| MQTT not connecting         | Verify Mosquitto is running (`brew services list`). Check firewall rules. Ensure `MQTT_BROKER_HOST` matches your PC IP. |
| Servo moves wrong direction | Flip `SERVO_DIRECTION_SIGN` between `1` and `-1` in `src/config.py`.                                                    |

---

## 6. Frame Color Reference

- 🟥 **Red** — Unregistered face
- 🟦 **Blue** — Recognized, not targeted
- 🟩 **Green** — Target locked (tracking)
- 🟧 **Orange** — Target lost / searching
