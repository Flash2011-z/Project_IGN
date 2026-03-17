BEGIN;

-- =========================
-- 1) MAKE SURE PLATFORM NAMES EXIST
-- =========================
INSERT INTO platform (platform_name)
SELECT 'PC'
WHERE NOT EXISTS (
  SELECT 1 FROM platform WHERE platform_name = 'PC'
);

INSERT INTO platform (platform_name)
SELECT 'PS5'
WHERE NOT EXISTS (
  SELECT 1 FROM platform WHERE platform_name = 'PS5'
);

INSERT INTO platform (platform_name)
SELECT 'Xbox Series X'
WHERE NOT EXISTS (
  SELECT 1 FROM platform WHERE platform_name = 'Xbox Series X'
);

-- =========================
-- 2) MAKE SURE GENRE NAMES EXIST
-- =========================
INSERT INTO genre (genre_name)
SELECT 'Action'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Action'
);

INSERT INTO genre (genre_name)
SELECT 'Adventure'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Adventure'
);

INSERT INTO genre (genre_name)
SELECT 'RPG'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'RPG'
);

INSERT INTO genre (genre_name)
SELECT 'Open World'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Open World'
);

INSERT INTO genre (genre_name)
SELECT 'Shooter'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Shooter'
);

INSERT INTO genre (genre_name)
SELECT 'Fantasy'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Fantasy'
);

INSERT INTO genre (genre_name)
SELECT 'Sci-Fi'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Sci-Fi'
);

INSERT INTO genre (genre_name)
SELECT 'Horror'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Horror'
);

INSERT INTO genre (genre_name)
SELECT 'Sports'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Sports'
);

INSERT INTO genre (genre_name)
SELECT 'Multiplayer'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Multiplayer'
);

INSERT INTO genre (genre_name)
SELECT 'Story Rich'
WHERE NOT EXISTS (
  SELECT 1 FROM genre WHERE genre_name = 'Story Rich'
);

-- =========================
-- 3) INSERT THE EXTRA 10 GAMES ONLY IF MISSING
-- =========================

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Black Myth: Wukong',
  'Mythic Action RPG',
  'Journey through a myth-inspired world filled with fierce bosses, magic, and cinematic combat.',
  9.2,
  'https://cdn.akamai.steamstatic.com/steam/apps/2358720/library_hero.jpg',
  '#c28b2c',
  2024
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Black Myth: Wukong'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Ghost of Tsushima DIRECTORS CUT',
  'Samurai Open World',
  'Become the Ghost and defend Tsushima in a sweeping samurai adventure.',
  9.4,
  'https://cdn.akamai.steamstatic.com/steam/apps/2215430/library_hero.jpg',
  '#8b1e1e',
  2024
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Ghost of Tsushima DIRECTORS CUT'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Baldurs Gate 3',
  'Epic Party RPG',
  'A story-rich fantasy RPG where every choice shapes the journey.',
  9.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_hero.jpg',
  '#7b5e57',
  2023
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Baldurs Gate 3'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Sekiro™: Shadows Die Twice - GOTY Edition',
  'Shinobi Challenge',
  'Master precise sword combat and stealth in a brutal reimagining of Sengoku Japan.',
  9.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/814380/library_hero.jpg',
  '#795548',
  2019
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Sekiro™: Shadows Die Twice - GOTY Edition'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Resident Evil Village',
  'Village Nightmare',
  'Survive a haunting first-person horror journey through a twisted village.',
  8.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/1196590/library_hero.jpg',
  '#607d8b',
  2021
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Resident Evil Village'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Forza Horizon 5',
  'Open-Road Festival',
  'Race across vibrant Mexican landscapes in a stylish open-world driving festival.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_hero.jpg',
  '#ff5722',
  2021
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Forza Horizon 5'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Lies of P',
  'Dark Belle Époque',
  'A dark soulslike retelling of Pinocchio set in a twisted mechanical city.',
  9.0,
  'https://cdn.akamai.steamstatic.com/steam/apps/1627720/library_hero.jpg',
  '#3e2723',
  2023
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Lies of P'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Hades II',
  'Rogue Underworld',
  'Battle beyond the Underworld in a fast and stylish action roguelike.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/1145350/library_hero.jpg',
  '#673ab7',
  2025
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Hades II'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'HELLDIVERS™ 2',
  'Co-op Galactic War',
  'Drop into chaotic squad-based battles against alien threats across the galaxy.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/553850/library_hero.jpg',
  '#ffc107',
  2024
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'HELLDIVERS™ 2'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Dragons Dogma 2',
  'Grand Fantasy Quest',
  'Set out on a massive fantasy adventure shaped by exploration and emergent combat.',
  8.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/2054970/library_hero.jpg',
  '#455a64',
  2024
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Dragons Dogma 2'
);

-- =========================
-- 4) PLATFORM LINKS FOR THE EXTRA 10 GAMES
-- SAFE AGAINST DUPLICATES
-- =========================

-- PC for all 10
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PC'
WHERE g.title IN (
  'Black Myth: Wukong',
  'Ghost of Tsushima DIRECTORS CUT',
  'Baldurs Gate 3',
  'Sekiro™: Shadows Die Twice - GOTY Edition',
  'Resident Evil Village',
  'Forza Horizon 5',
  'Lies of P',
  'Hades II',
  'HELLDIVERS™ 2',
  'Dragons Dogma 2'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- PS5
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PS5'
WHERE g.title IN (
  'Black Myth: Wukong',
  'Ghost of Tsushima DIRECTORS CUT',
  'Baldurs Gate 3',
  'Sekiro™: Shadows Die Twice - GOTY Edition',
  'Resident Evil Village',
  'Lies of P',
  'HELLDIVERS™ 2',
  'Dragons Dogma 2'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- Xbox Series X
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Xbox Series X'
WHERE g.title IN (
  'Black Myth: Wukong',
  'Baldurs Gate 3',
  'Resident Evil Village',
  'Forza Horizon 5',
  'HELLDIVERS™ 2',
  'Dragons Dogma 2'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- =========================
-- 5) GENRE LINKS FOR THE EXTRA 10 GAMES
-- SAFE AGAINST DUPLICATES
-- =========================

-- Black Myth: Wukong -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'Black Myth: Wukong'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Ghost of Tsushima -> Action, Adventure, Open World
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Open World')
WHERE g.title = 'Ghost of Tsushima DIRECTORS CUT'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Baldurs Gate 3 -> RPG, Fantasy, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Fantasy', 'Story Rich')
WHERE g.title = 'Baldurs Gate 3'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Sekiro -> Action, Adventure, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Fantasy')
WHERE g.title = 'Sekiro™: Shadows Die Twice - GOTY Edition'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Resident Evil Village -> Action, Horror
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Horror')
WHERE g.title = 'Resident Evil Village'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Forza Horizon 5 -> Open World, Sports, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Open World', 'Sports', 'Multiplayer')
WHERE g.title = 'Forza Horizon 5'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Lies of P -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'Lies of P'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Hades II -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'Hades II'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- HELLDIVERS 2 -> Shooter, Sci-Fi, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Sci-Fi', 'Multiplayer')
WHERE g.title = 'HELLDIVERS™ 2'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

-- Dragons Dogma 2 -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'Dragons Dogma 2'
AND NOT EXISTS (
  SELECT 1
  FROM game_genre gg
  WHERE gg.game_id = g.game_id
    AND gg.genre_id = ge.genre_id
);

COMMIT;

