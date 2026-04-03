import { getPlayerStatusBadgeMeta, getReviewBadgeMeta } from "../utils/reviewBadge";

function BadgeShell({ meta }) {
  if (!meta) return null;

  return (
    <span className={meta.className} title={meta.title} aria-label={meta.ariaLabel}>
      <span className="premiumBadge__prism" aria-hidden="true" />
      <span className="premiumBadge__shine" aria-hidden="true" />
      <span className="premiumBadge__halo" aria-hidden="true" />
      <span className="premiumBadge__facet" aria-hidden="true" />
      <span className="premiumBadge__rail" aria-hidden="true" />
      <span className="premiumBadge__orb" aria-hidden="true">
        <span className="premiumBadge__orbCore" aria-hidden="true" />
        {meta.icon}
      </span>
      <span className="premiumBadge__label">{meta.label}</span>
    </span>
  );
}

export function ReviewBadge({ review, size = "default", shimmer = true }) {
  const meta = getReviewBadgeMeta(review, { size, shimmer });
  return <BadgeShell meta={meta} />;
}

export function AdminRoleBadge({ isAdmin, size = "compact", shimmer = false }) {
  const meta = isAdmin ? getReviewBadgeMeta({ isAdmin: true }, { size, shimmer }) : null;
  return <BadgeShell meta={meta} />;
}

export function PlayerStatusBadge({ isPlayerVerified, size = "table", shimmer = false }) {
  const meta = getPlayerStatusBadgeMeta(isPlayerVerified, { size, shimmer });
  return <BadgeShell meta={meta} />;
}
