export function getReviewBadgeMeta(review) {
  const badge = review?.badge || null;

  if (badge === "verified_player") {
    return {
      label: "Verified Player",
      title: "GameZone has verified play activity for this reviewer on this game.",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        color: "#06131d",
        background: "linear-gradient(135deg, #7dd3fc, #38bdf8)",
        border: "1px solid rgba(255,255,255,0.18)",
      },
    };
  }

  if (badge === "purchased") {
    return {
      label: "Purchased",
      title: "This reviewer purchased this game through GameZone.",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        color: "#f8fafc",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.16)",
      },
    };
  }

  return null;
}