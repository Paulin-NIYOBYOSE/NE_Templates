"""
FaceLock Vision - Web Dashboard Server
Developed by Paulin | Simple Flask dashboard for tracking status

Run separately:
    python -m src.web_server

Or integrated:
    from src.web_server import start_web_server
    start_web_server(port=5000)
"""

import logging
import os
import sys
import threading
import time

# Suppress Flask request logs
logging.getLogger('werkzeug').setLevel(logging.ERROR)

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from flask import Flask, jsonify, render_template
from src import web_status

app = Flask(__name__, template_folder=os.path.join(project_root, "templates"))


@app.route("/")
def index():
    return render_template("dashboard.html")


@app.route("/api/status")
def api_status():
    return jsonify(web_status.get())


def start_web_server(host: str = "0.0.0.0", port: int = 5000, debug: bool = False) -> threading.Thread:
    """Start the Flask web server in a background thread."""
    def run():
        print(f"  [WEB] Dashboard starting at http://{host}:{port}")
        print(f"  [WEB] Open: http://localhost:{port}")
        app.run(host=host, port=port, debug=debug, use_reloader=False)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread


if __name__ == "__main__":
    print("\n  ╔════════════════════════════════════════════╗")
    print("  ║  FaceLock Vision • Web Dashboard          ║")
    print("  ╚══════════════════════════════════════════╝")
    print(f"\n  Open in browser: http://localhost:5000")
    print("  Press Ctrl+C to stop\n")
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
