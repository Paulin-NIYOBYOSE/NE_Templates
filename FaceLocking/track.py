#!/usr/bin/env python3
"""BENAX Speaker Tracking System - Recognition + Servo Tracking (MQTT)
Developed by Paulin | Shortcut to speaker tracking mode with hardware control
"""

import sys
from src.recognize_with_tracking import main
from src.web_server import start_web_server

if __name__ == "__main__":
    fullscreen = "--fullscreen" in sys.argv or "-f" in sys.argv
    no_mqtt = "--no-mqtt" in sys.argv
    no_web = "--no-web" in sys.argv

    if not no_web:
        start_web_server(port=5001)
        print("  [INFO] Web dashboard: http://localhost:5001")
        print("  [INFO] Use --no-web to disable dashboard\n")

    success = main(start_fullscreen=fullscreen, enable_mqtt=not no_mqtt)
    sys.exit(0 if success else 1)
