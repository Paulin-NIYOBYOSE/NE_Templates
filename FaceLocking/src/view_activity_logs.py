#!/usr/bin/env python3
"""
FaceLock Vision - Activity Report Viewer
Developed by Paulin | View and analyze target behavior logs
"""

import sys
import json
import csv
from pathlib import Path
from datetime import datetime
from typing import Dict, List

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src import config


def list_activity_logs():
    """List all available activity logs from history."""
    log_dir = config.HISTORY_DIR
    
    if not log_dir.exists():
        print("  No activity history found.")
        print(f"    Directory: {log_dir}")
        return []
    
    # Find all summary JSON files
    json_files = sorted(log_dir.glob("*_summary.json"))
    
    if not json_files:
        print("  No activity history found.")
        print(f"    Directory: {log_dir}")
        return []
    
    print("\n  " + "─"*66)
    print("  ACTIVITY REPORTS")
    print("  " + "─"*66)
    
    logs_info = []
    for idx, json_path in enumerate(json_files, 1):
        with open(json_path, 'r') as f:
            summary = json.load(f)
        
        logs_info.append({
            'index': idx,
            'json_path': json_path,
            'summary': summary
        })
        
        print(f"\n  {idx}. {summary['person_name']}")
        print(f"     Session: {summary['session_start'][:19]}")
        print(f"     Duration: {summary['session_duration_seconds']:.1f}s")
        print(f"     Behaviors: {summary['total_activities']}")
        
        # Show top activities
        counts = summary['activity_counts']
        top_activities = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:3]
        if any(count > 0 for _, count in top_activities):
            print(f"     Top: ", end="")
            print(", ".join(f"{act}:{count}" for act, count in top_activities if count > 0))
    
    print("\n  " + "─"*66)
    return logs_info


def view_activity_details(json_path: Path):
    """View detailed activity log."""
    with open(json_path, 'r') as f:
        summary = json.load(f)
    
    print("\n  " + "─"*66)
    print(f"  REPORT: {summary['person_name']}")
    print("  " + "─"*66)
    
    print(f"\n  Session:")
    print(f"    Start: {summary['session_start']}")
    print(f"    End: {summary['session_end']}")
    print(f"    Duration: {summary['session_duration_seconds']:.2f}s")
    
    print(f"\n  Behaviors:")
    for activity, count in sorted(summary['activity_counts'].items()):
        if count > 0:
            print(f"  {activity.replace('_', ' ').title()}: {count}")
    
    print(f"\n  Total: {summary['total_activities']}")
    
    # Read and display CSV timeline
    csv_path = Path(summary['csv_log'])
    if csv_path.exists():
        print(f"\n  " + "─"*66)
        print("  TIMELINE (last 20):")
        print("  " + "─"*66)
        
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            activities = list(reader)
        
        if activities:
            print(f"\n{'Time':<12} {'Frame':<8} {'Activity':<15} {'Position':<20} {'Details'}")
            print("-"*70)
            
            # Show last 20 activities
            for activity in activities[-20:]:
                timestamp = datetime.fromisoformat(activity['timestamp'])
                time_str = timestamp.strftime("%H:%M:%S")
                frame = activity['frame_number']
                act_type = activity['activity_type'].replace('_', ' ').title()
                
                pos = ""
                if activity['face_center_x'] and activity['face_center_y']:
                    pos = f"({float(activity['face_center_x']):.0f}, {float(activity['face_center_y']):.0f})"
                
                details = activity['details'][:20] if activity['details'] else ""
                
                print(f"  {time_str:<12} {frame:<8} {act_type:<15} {pos:<20} {details}")
        else:
            print("  No behaviors recorded.")
    
    print("\n  " + "─"*66)


def analyze_activity_patterns(json_path: Path):
    """Analyze activity patterns."""
    with open(json_path, 'r') as f:
        summary = json.load(f)
    
    csv_path = Path(summary['csv_log'])
    if not csv_path.exists():
        print("  CSV log not found.")
        return
    
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        activities = list(reader)
    
    if not activities:
        print("  No behaviors to analyze.")
        return
    
    print("\n  " + "─"*66)
    print(f"  PATTERN ANALYSIS: {summary['person_name']}")
    print("  " + "─"*66)
    
    # Group by activity type
    by_type: Dict[str, List] = {}
    for activity in activities:
        act_type = activity['activity_type']
        if act_type not in by_type:
            by_type[act_type] = []
        by_type[act_type].append(activity)
    
    print(f"\n  Breakdown:")
    for act_type, acts in sorted(by_type.items(), key=lambda x: len(x[1]), reverse=True):
        count = len(acts)
        if count > 0:
            # Calculate average time between activities
            if count > 1:
                frames = [int(a['frame_number']) for a in acts]
                frame_diffs = [frames[i+1] - frames[i] for i in range(len(frames)-1)]
                avg_interval = sum(frame_diffs) / len(frame_diffs)
                fps = 30  # Assume 30 FPS
                avg_interval_sec = avg_interval / fps
                print(f"  {act_type.replace('_', ' ').title()}: {count} times (avg interval: {avg_interval_sec:.1f}s)")
            else:
                print(f"  {act_type.replace('_', ' ').title()}: {count} time")
    
    # Movement analysis
    movement_types = ['move_left', 'move_right', 'move_up', 'move_down']
    total_movements = sum(len(by_type.get(m, [])) for m in movement_types)
    
    if total_movements > 0:
        print(f"\n  Movements:")
        print(f"    Total: {total_movements}")
        print(f"    Horizontal: {len(by_type.get('move_left', []))}/{len(by_type.get('move_right', []))}")
        print(f"    Vertical: {len(by_type.get('move_up', []))}/{len(by_type.get('move_down', []))}")
    
    print("\n  " + "─"*66)


def main():
    """Main function."""
    logs_info = list_activity_logs()
    
    if not logs_info:
        return
    
    print("\n  Options:")
    print("    Number    → View details")
    print("    Number+a  → Analyze (e.g., '1a')")
    print("    Q         → Quit")
    
    while True:
        try:
            choice = input("\nYour choice: ").strip().lower()
            
            if choice == 'q':
                break
            
            # Check for analysis request
            analyze = choice.endswith('a')
            if analyze:
                choice = choice[:-1]
            
            idx = int(choice)
            if 1 <= idx <= len(logs_info):
                log_info = logs_info[idx - 1]
                if analyze:
                    analyze_activity_patterns(log_info['json_path'])
                else:
                    view_activity_details(log_info['json_path'])
            else:
                print(f"  Invalid choice. Enter 1-{len(logs_info)}")
        
        except (ValueError, EOFError, KeyboardInterrupt):
            break
    
    print("\n  Done.\n")


if __name__ == "__main__":
    main()
