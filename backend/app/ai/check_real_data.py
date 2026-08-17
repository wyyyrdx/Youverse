"""
Pull real sensor_readings from Supabase and run them through your
feature extraction + scoring pipeline, to see how it behaves on
actual data instead of synthetic.

Setup:
  pip install supabase

Run from inside backend/app/ai/:
  python3 check_real_data.py

Credentials are read from environment variables, not hardcoded here,
so you don't accidentally commit them. Set them before running:
  export SUPABASE_URL="https://zdodsouldjxlfjahqdeb.supabase.co"
  export SUPABASE_KEY="sb_publishable_mEmipsc_pC33eC40NcZyRg_gfzN8d49"
"""

import os
import sys
from datetime import datetime, timedelta, timezone
from supabase import create_client

sys.path.insert(0, ".")
from features.extract import extract_features
from scoring.score import score_features
from scoring.explain import explain_top_state


def main():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("Set SUPABASE_URL and SUPABASE_KEY environment variables first.")
        return

    supabase = create_client(url, key)

    # Only pull a recent, continuous window — not just "last N rows",
    # since scattered test pings from different days would otherwise
    # get treated as one fake "window" and produce misleading stability scores.
    minutes_back = 15
    cutoff = (datetime.now(timezone.utc) - timedelta(minutes=minutes_back)).isoformat()

    print(f"Fetching sensor_readings from the last {minutes_back} minutes...")
    result = (
        supabase.table("sensor_readings")
        .select("*")
        .gte("timestamp", cutoff)
        .order("timestamp", desc=False)
        .execute()
    )
    readings = result.data

    if not readings:
        print(f"No sensor_readings in the last {minutes_back} minutes.")
        print("Either the device isn't actively streaming right now, or increase minutes_back.")
        return

    print(f"Got {len(readings)} readings.")
    print(f"Earliest: {readings[0]['timestamp']}")
    print(f"Latest:   {readings[-1]['timestamp']}")

    fv = extract_features(readings, user_id="real-device-test")
    window = fv["window"]
    print(f"\nWindow duration: {window['duration_minutes']} minutes across {window['n_samples']} samples")
    if window["duration_minutes"] > minutes_back * 1.5:
        print("WARNING: window duration is much longer than expected — this batch is likely")
        print("scattered test data, not a continuous stream. Treat stability scores with caution.")

    print("\nExtracted features:")
    for k, v in fv["features"].items():
        print(f"  {k}: {v}")

    distribution = score_features(fv["features"])
    print("\nScoring result:")
    for d in distribution:
        print(f"  {d['future_state']}: {d['score']}")

    explanation = explain_top_state(fv["features"], distribution)
    print(f"\nExplanation: {explanation['summary']}")


if __name__ == "__main__":
    main()
