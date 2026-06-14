#!/usr/bin/env python3
"""
FaceLock Vision - Camera Stream Manager
Developed by Paulin | Resilient camera capture with auto-reconnect
"""

import os
import time
from typing import List, Optional, Tuple

import cv2
import numpy as np

from . import config


def get_available_devices() -> List[Tuple[int, str]]:
    """List existing /dev/video* device nodes (Linux only)."""
    devices = []
    if os.name == 'posix' and os.path.exists('/dev'):
        for i in range(10):
            dev_path = f"/dev/video{i}"
            if os.path.exists(dev_path):
                devices.append((i, dev_path))
    return devices


def find_working_camera(max_index: int = 10, quiet: bool = False) -> int:
    """
    Return the first camera index that can open and deliver a valid frame.
    Returns -1 if none found.
    """
    if not quiet:
        print("  Scanning for cameras...")
    for idx in range(max_index):
        cap = _open_capture(idx)
        if cap is not None:
            cap.release()
            if not quiet:
                print(f"  ● Camera found at index {idx}")
            return idx
    return -1


def _open_capture(index: int) -> Optional[cv2.VideoCapture]:
    """Try default backend first (macOS), then V4L2 (Linux); verify with a real frame read."""
    # On macOS, use CAP_ANY first; on Linux, try V4L2 first
    import platform
    if platform.system() == 'Darwin':  # macOS
        backends = (cv2.CAP_ANY,)
    else:  # Linux
        backends = (cv2.CAP_V4L2, cv2.CAP_ANY)
    
    for backend in backends:
        cap = cv2.VideoCapture(index, backend)
        if not cap.isOpened():
            cap.release()
            continue
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, config.CAMERA_FRAME_WIDTH)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config.CAMERA_FRAME_HEIGHT)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        for _ in range(config.CAMERA_OPEN_VERIFY_FRAMES):
            ret, frame = cap.read()
            if ret and frame is not None and frame.size > 0:
                return cap
            time.sleep(0.05)
        cap.release()
    return None


class CameraStream:
    """Resilient wrapper around cv2.VideoCapture with reconnect support."""

    def __init__(self):
        self.cap: Optional[cv2.VideoCapture] = None
        self.index: int = config.CAMERA_INDEX
        self._fail_streak = 0

    def open(self) -> bool:
        indices = self._candidate_indices()
        for idx in indices:
            cap = _open_capture(idx)
            if cap is None:
                continue
            self.cap = cap
            self.index = idx
            if idx != config.CAMERA_INDEX:
                print(
                    f"  ● Using camera index {idx} "
                    f"(index {config.CAMERA_INDEX} unavailable — update config)"
                )
            else:
                print(f"  ● Camera connected (index {idx})")
            self._fail_streak = 0
            return True
        return False

    def _candidate_indices(self) -> List[int]:
        ordered: List[int] = []
        if config.CAMERA_INDEX not in ordered:
            ordered.append(config.CAMERA_INDEX)
        if config.CAMERA_AUTO_DETECT:
            found = find_working_camera(max_index=10, quiet=True)
            if found >= 0 and found not in ordered:
                ordered.append(found)
            for idx in range(4):
                if idx not in ordered:
                    ordered.append(idx)
        return ordered

    def read(self) -> Tuple[bool, Optional[np.ndarray]]:
        """Read a frame; retry and reconnect on transient V4L2 failures."""
        if self.cap is None or not self.cap.isOpened():
            if not self._reconnect():
                return False, None

        for _ in range(config.CAMERA_READ_RETRIES):
            try:
                ret, frame = self.cap.read()
            except cv2.error:
                ret, frame = False, None
            if ret and frame is not None and frame.size > 0:
                self._fail_streak = 0
                return True, frame
            time.sleep(0.02)

        self._fail_streak += 1
        if self._fail_streak >= config.CAMERA_RECONNECT_AFTER_FAILS:
            print(
                f"  ⚠ Camera reconnecting after {self._fail_streak} failed reads"
            )
            if self._reconnect():
                self._fail_streak = 0
                try:
                    ret, frame = self.cap.read()
                except cv2.error:
                    ret, frame = False, None
                if ret and frame is not None and frame.size > 0:
                    return True, frame
        return False, None

    def _reconnect(self) -> bool:
        self.release(silent=True)
        time.sleep(config.CAMERA_RECONNECT_DELAY_SEC)
        return self.open()

    def release(self, silent: bool = False) -> None:
        if self.cap is not None:
            try:
                self.cap.release()
            except cv2.error:
                pass
            self.cap = None

    @staticmethod
    def is_window_open(window_name: str) -> bool:
        try:
            return cv2.getWindowProperty(window_name, cv2.WND_PROP_VISIBLE) >= 1
        except cv2.error:
            return False


if __name__ == "__main__":
    print("\n  FaceLock Vision - Camera Scanner")
    print("  " + "─" * 34)
    devices = get_available_devices()
    if devices:
        print("  Devices found:")
        for idx, path in devices:
            print(f"    {path}")
    print("\n  Testing camera indices...")
    working_idx = find_working_camera()
    if working_idx >= 0:
        print(f"\n  ● Recommended config.CAMERA_INDEX = {working_idx}")
    else:
        print("\n  ✗ No working camera found!")
