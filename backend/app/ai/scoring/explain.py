"""
Model explainability.

Given a feature vector and the distribution it produced, explain WHY
the top state won — which features contributed most and in which
direction. Needed for the pitch/demo (judges will ask "why did it say
that?") and listed explicitly under the Day 9 deliverable.

Kept separate from scoring.py so scoring stays a simple, fast, pure
function — explanation is a secondary pass over the same weights.
"""

from .score import WEIGHTS


def explain_top_state(feature_vector: dict, distribution: list[dict], top_n: int = 3) -> dict:
    """
    feature_vector: the `features` dict from extract_features()
    distribution:   the output of score_features(feature_vector)

    Returns the winning state plus its top contributing features,
    each with a plain-language direction ("pushed toward" / "pushed away from").
    """
    if not distribution:
        raise ValueError("explain_top_state: distribution is empty")

    top_state = distribution[0]["future_state"]

    contributions = []
    for feature_name, per_state_weights in WEIGHTS.items():
        if feature_name not in feature_vector:
            continue
        value = feature_vector[feature_name]
        weight = per_state_weights.get(top_state, 0.0)
        contribution = value * weight
        contributions.append({
            "feature": feature_name,
            "value": value,
            "contribution": round(contribution, 3),
            "direction": "pushed toward" if contribution > 0 else "pushed away from",
        })

    # Rank by absolute impact, strongest first
    contributions.sort(key=lambda c: abs(c["contribution"]), reverse=True)
    top_contributors = contributions[:top_n]

    summary = _build_summary(top_state, top_contributors)

    return {
        "top_state": top_state,
        "top_contributors": top_contributors,
        "summary": summary,
    }


def _build_summary(top_state: str, top_contributors: list[dict]) -> str:
    pushers = [c["feature"].replace("_", " ") for c in top_contributors if c["direction"] == "pushed toward"]
    if not pushers:
        return f"{top_state} was the closest match, though no single signal strongly dominated."
    if len(pushers) == 1:
        return f"{pushers[0]} was the main signal pushing toward {top_state}."
    return f"{', '.join(pushers[:-1])} and {pushers[-1]} pushed toward {top_state}."


if __name__ == "__main__":
    from ..data.synthetic import generate_window
    from ..features.extract import extract_features
    from .score import score_features

    window = generate_window(minutes=5, profile="active")
    fv = extract_features(window)["features"]
    dist = score_features(fv)
    explanation = explain_top_state(fv, dist)
    print("Distribution:", dist)
    print("Explanation:", explanation["summary"])
    print("Top contributors:", explanation["top_contributors"])
