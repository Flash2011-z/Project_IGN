function normalizeSize(size) {
  const value = String(size || "default").trim().toLowerCase();
  if (value === "compact" || value === "table" || value === "default") {
    return value;
  }
  return "default";
}

function buildClassName(variant, size, shimmer) {
  return [
    "premiumBadge",
    `premiumBadge--${variant}`,
    `premiumBadge--${normalizeSize(size)}`,
    shimmer ? "premiumBadge--shimmer" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getVariantFromReview(review) {
  if (review?.isAdmin) return "admin";
  if (review?.badge === "verified_player") return "verified_player";
  if (review?.badge === "purchased") return "purchased";
  return null;
}

export function getReviewBadgeMeta(review, options = {}) {
  const variant = getVariantFromReview(review);

  if (!variant) return null;

  const size = options.size || "default";
  const shimmer = options.shimmer !== false;

  if (variant === "admin") {
    return {
      variant,
      icon: "♚",
      label: "Admin",
      title: "GameZone Admin",
      ariaLabel: "Admin badge",
      className: buildClassName(variant, size, shimmer),
    };
  }

  if (variant === "verified_player") {
    return {
      variant,
      icon: "✦",
      label: "Player",
      title: "Player badge",
      ariaLabel: "Player badge",
      className: buildClassName(variant, size, shimmer),
    };
  }

  return {
    variant,
    icon: "◆",
    label: "Purchased",
    title: "Purchased through GameZone",
    ariaLabel: "Purchased badge",
    className: buildClassName(variant, size, shimmer),
  };
}

export function getPlayerStatusBadgeMeta(isPlayerVerified, options = {}) {
  const variant = isPlayerVerified ? "verified_player" : "neutral";
  const size = options.size || "table";
  const shimmer = options.shimmer !== false;

  if (variant === "verified_player") {
    return {
      variant,
      icon: "✦",
      label: "Player",
      title: "Marked as player",
      ariaLabel: "Player badge",
      className: buildClassName(variant, size, shimmer),
    };
  }

  return {
    variant,
    icon: "•",
    label: "No Badge",
    title: "No player badge",
    ariaLabel: "No badge",
    className: buildClassName(variant, size, shimmer),
  };
}