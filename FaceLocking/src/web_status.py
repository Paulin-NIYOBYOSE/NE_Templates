"""
FaceLock Vision - Web Status Publisher
Developed by Paulin | Shared state for web dashboard
"""

import threading
import time
from typing import Any, Dict, Optional

_lock = threading.Lock()
_status: Dict[str, Any] = {
    "speaker_name": None,
    "confidence": 0.0,
    "tracking_state": "IDLE",
    "motor_command": "STOPPED",
    "servo_angle": 90,
    "face_center": {"x": 0, "y": 0},
    "fps": 0.0,
    "frame_count": 0,
    "session_start": None,
    "session_duration_sec": 0.0,
    "activities": {},
    "log_entries": [],
    "timestamp": "",
}


def update(**kwargs) -> None:
    """Update one or more status fields."""
    with _lock:
        for key, value in kwargs.items():
            if key in _status:
                _status[key] = value
        _status["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S")


def get() -> Dict[str, Any]:
    """Get a snapshot of current status."""
    with _lock:
        return dict(_status)


def add_log_entry(entry: str) -> None:
    """Add a log entry, keeping only the last 50."""
    with _lock:
        _status["log_entries"].append({
            "time": time.strftime("%H:%M:%S"),
            "message": entry,
        })
        if len(_status["log_entries"]) > 50:
            _status["log_entries"] = _status["log_entries"][-50:]
