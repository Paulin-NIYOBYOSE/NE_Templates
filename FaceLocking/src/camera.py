"""
FaceLock Vision - Camera Validator
Developed by Paulin | Quick camera connection test
"""

import sys
import time
import cv2


def main():
    """
    Open webcam and display live video with FPS counter.
    Press 'q' to exit.
    """

    # Try to find a working camera (external first, then built-in)
    print("\n  Scanning for cameras...")
    cap = None
    camera_index = -1
    
    # Try indices 0-3 (external cameras usually come first)
    for idx in range(4):
        test_cap = cv2.VideoCapture(idx)
        if test_cap.isOpened():
            ret, frame = test_cap.read()
            if ret and frame is not None:
                cap = test_cap
                camera_index = idx
                print(f"  ● Found camera at index {idx}")
                break
            test_cap.release()
    
    if cap is None or not cap.isOpened():
        print("  ✗ No camera detected (tried indices 0-3)")
        print("  Check:")
        print("    1. Camera is connected")
        print("    2. Permissions granted (System Preferences > Privacy > Camera)")
        print("    3. No other app using the camera")
        return False

    # Set resolution and FPS
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    actual_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    actual_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"  ● Camera ready (index {camera_index})")
    print(f"    Resolution: {actual_width}x{actual_height}")
    print("    Press [Q] to exit")

    # Prepare window (important for Kali)
    cv2.namedWindow("FaceLock - Camera Test", cv2.WINDOW_NORMAL)

    frame_count = 0
    fps = 0.0
    t0 = time.time()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("  ✗ Failed to read frame from camera")
                break

            # FPS calculation (updated every second)
            frame_count += 1
            elapsed = time.time() - t0
            if elapsed >= 1.0:
                fps = frame_count / elapsed
                frame_count = 0
                t0 = time.time()

            # Overlay text
            cv2.putText(
                frame,
                f"FaceLock Vision  |  {fps:.0f} FPS",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2,
            )

            cv2.putText(
                frame,
                "[Q] Quit",
                (10, 460),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (200, 200, 200),
                1,
            )

            # Show frame
            cv2.imshow("FaceLock - Camera Test", frame)

            # Exit on 'q'
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()

    print("\n  ● Camera validated successfully\n")
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
