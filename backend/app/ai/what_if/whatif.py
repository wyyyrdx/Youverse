"""
What-If engine: modified feature vector -> new distribution

Input shape (matches `what_if_scenarios` table):
{ base_scenario_id, changed_feature, new_value }

Reuses the exact same score_features() function as the live pipeline,
so "changing a behavior visibly changes the distribution" (Day 5
checkpoint) is guaranteed by construction rather than duplicated logic.
"""

from ..scoring.score import score_features


def apply_what_if(base_features: dict, changed_feature: str, new_value: float) -> dict:
    """
    base_features: the `features` dict from extract_features() for the
                    scenario being modified.
    Returns the modified feature vector alongside the new distribution.
    """
    return apply_what_if_multi(base_features, [{"changed_feature": changed_feature, "new_value": new_value}])


def apply_what_if_multi(base_features: dict, changes: list[dict]) -> dict:
    """
    Apply several feature changes at once, then rescore.

    changes: [{ "changed_feature": str, "new_value": float }, ...]
    Returns the same shape as apply_what_if(), plus a `changes` list
    echoing back what was applied.
    """
    if not changes:
        raise ValueError("apply_what_if_multi: changes list is empty")

    modified = dict(base_features)
    for change in changes:
        feature_name = change["changed_feature"]
        if feature_name not in modified:
            raise ValueError(f"Unknown feature '{feature_name}'. Known: {list(modified.keys())}")
        modified[feature_name] = change["new_value"]

    return {
        "changes": changes,
        "modified_features": modified,
        "new_distribution": score_features(modified),
    }


if __name__ == "__main__":
    from ..data.synthetic import generate_window
    from ..features.extract import extract_features
    from ..scoring.score import score_features

    window = generate_window(minutes=15, profile="focused")
    fv = extract_features(window)["features"]

    print("Baseline:", score_features(fv))
    print("What if activity_score -> 0.9:")
    result = apply_what_if(fv, "activity_score", 0.9)
    print(result["new_distribution"])
