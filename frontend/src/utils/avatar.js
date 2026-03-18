const DEFAULT_STYLE = "adventurer";
const BG_COLORS = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf";

function buildDicebearUrl(style, seed) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${BG_COLORS}`;
}

export function getAvatarUrl(user) {
  if (!user) return buildDicebearUrl(DEFAULT_STYLE, "Player");

  const style = user.avatar_style || DEFAULT_STYLE;
  const seed =
    user.avatar_seed ||
    user.username ||
    user.name ||
    user.email ||
    "Player";

  return buildDicebearUrl(style, seed);
}