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

BEGIN;

-- =========================
-- 1) MAKE SURE PLATFORM NAMES EXIST
-- =========================
INSERT INTO platform (platform_name)
SELECT 'PC'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PC');

INSERT INTO platform (platform_name)
SELECT 'PS5'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PS5');

INSERT INTO platform (platform_name)
SELECT 'Xbox Series X'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Xbox Series X');

INSERT INTO platform (platform_name)
SELECT 'Nintendo Switch'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Nintendo Switch');

-- =========================
-- 2) MAKE SURE GENRE NAMES EXIST
-- =========================
INSERT INTO genre (genre_name)
SELECT 'Action'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Action');

INSERT INTO genre (genre_name)
SELECT 'Adventure'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Adventure');

INSERT INTO genre (genre_name)
SELECT 'RPG'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'RPG');

INSERT INTO genre (genre_name)
SELECT 'Open World'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Open World');

INSERT INTO genre (genre_name)
SELECT 'Shooter'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Shooter');

INSERT INTO genre (genre_name)
SELECT 'Fantasy'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Fantasy');

INSERT INTO genre (genre_name)
SELECT 'Sci-Fi'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sci-Fi');

INSERT INTO genre (genre_name)
SELECT 'Horror'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Horror');

INSERT INTO genre (genre_name)
SELECT 'Sports'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sports');

INSERT INTO genre (genre_name)
SELECT 'Multiplayer'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Multiplayer');

INSERT INTO genre (genre_name)
SELECT 'Puzzle'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Puzzle');

INSERT INTO genre (genre_name)
SELECT 'Story Rich'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Story Rich');

-- =========================
-- 3) INSERT 10 MORE GAMES
-- =========================

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Hollow Knight',
  'Metroidvania Masterpiece',
  'Explore a haunting underground kingdom in a beautifully crafted action adventure.',
  9.4,
  'https://cdn.akamai.steamstatic.com/steam/apps/367520/library_hero.jpg',
  '#3949ab',
  2017
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Hollow Knight'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Disco Elysium - The Final Cut',
  'Detective RPG',
  'Shape a broken detective through dialogue, choices, and deep role-playing systems.',
  9.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/632470/library_hero.jpg',
  '#ef6c00',
  2021
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Disco Elysium - The Final Cut'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'DEATH STRANDING DIRECTORS CUT',
  'Connected World',
  'Reconnect a fractured America in a cinematic journey across a surreal landscape.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/1850570/library_hero.jpg',
  '#546e7a',
  2022
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'DEATH STRANDING DIRECTORS CUT'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Persona 5 Royal',
  'Stylish School RPG',
  'Live a double life as a student and Phantom Thief in a stylish turn-based RPG.',
  9.7,
  'https://cdn.akamai.steamstatic.com/steam/apps/1687950/library_hero.jpg',
  '#d32f2f',
  2022
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Persona 5 Royal'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Monster Hunter: World',
  'Creature Hunting Adventure',
  'Track, hunt, and craft your way through a living ecosystem full of giant monsters.',
  9.0,
  'https://cdn.akamai.steamstatic.com/steam/apps/582010/library_hero.jpg',
  '#2e7d32',
  2018
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Monster Hunter: World'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'NieR:Automata™',
  'Android War Story',
  'Fight for humanity in a stylish action RPG filled with emotion and philosophy.',
  9.3,
  'https://cdn.akamai.steamstatic.com/steam/apps/524220/library_hero.jpg',
  '#8d6e63',
  2017
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'NieR:Automata™'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Armored Core VI Fires of Rubicon',
  'Mech Combat Reborn',
  'Customize deadly mechs and dominate explosive high-speed battles.',
  8.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/1888160/library_hero.jpg',
  '#455a64',
  2023
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Armored Core VI Fires of Rubicon'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'It Takes Two',
  'Co-op Adventure',
  'A heartfelt and inventive co-op adventure built around constant gameplay variety.',
  9.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/1426210/library_hero.jpg',
  '#f9a825',
  2021
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'It Takes Two'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Sid Meiers Civilization VI',
  'Strategy Empire Builder',
  'Lead a civilization from ancient times into the future in a deep strategy experience.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/289070/library_hero.jpg',
  '#1565c0',
  2016
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Sid Meiers Civilization VI'
);

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Dead Space',
  'Sci-Fi Survival Horror',
  'Survive a terrifying sci-fi nightmare aboard a mining ship overrun by horrors.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/1693980/library_hero.jpg',
  '#37474f',
  2023
WHERE NOT EXISTS (
  SELECT 1 FROM game WHERE title = 'Dead Space'
);

-- =========================
-- 4) PLATFORM LINKS
-- =========================

-- PC for all 10
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PC'
WHERE g.title IN (
  'Hollow Knight',
  'Disco Elysium - The Final Cut',
  'DEATH STRANDING DIRECTORS CUT',
  'Persona 5 Royal',
  'Monster Hunter: World',
  'NieR:Automata™',
  'Armored Core VI Fires of Rubicon',
  'It Takes Two',
  'Sid Meiers Civilization VI',
  'Dead Space'
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
  'DEATH STRANDING DIRECTORS CUT',
  'Persona 5 Royal',
  'Monster Hunter: World',
  'NieR:Automata™',
  'Armored Core VI Fires of Rubicon',
  'It Takes Two',
  'Dead Space'
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
  'DEATH STRANDING DIRECTORS CUT',
  'Monster Hunter: World',
  'Armored Core VI Fires of Rubicon',
  'It Takes Two',
  'Sid Meiers Civilization VI',
  'Dead Space'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- Nintendo Switch
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Nintendo Switch'
WHERE g.title IN (
  'Hollow Knight',
  'Persona 5 Royal',
  'NieR:Automata™',
  'It Takes Two',
  'Sid Meiers Civilization VI'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- =========================
-- 5) GENRE LINKS
-- =========================

-- Hollow Knight -> Action, Adventure, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Fantasy')
WHERE g.title = 'Hollow Knight'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Disco Elysium -> RPG, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Story Rich')
WHERE g.title = 'Disco Elysium - The Final Cut'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Death Stranding -> Action, Adventure, Sci-Fi, Open World
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Sci-Fi', 'Open World')
WHERE g.title = 'DEATH STRANDING DIRECTORS CUT'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Persona 5 Royal -> RPG, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Story Rich')
WHERE g.title = 'Persona 5 Royal'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Monster Hunter World -> Action, RPG, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Multiplayer')
WHERE g.title = 'Monster Hunter: World'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- NieR Automata -> Action, RPG, Sci-Fi, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Sci-Fi', 'Story Rich')
WHERE g.title = 'NieR:Automata™'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Armored Core VI -> Action, Shooter, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Shooter', 'Sci-Fi')
WHERE g.title = 'Armored Core VI Fires of Rubicon'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- It Takes Two -> Adventure, Puzzle, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Puzzle', 'Multiplayer')
WHERE g.title = 'It Takes Two'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Civilization VI -> Strategy-ish fit using existing genres: Story Rich, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Story Rich', 'Multiplayer')
WHERE g.title = 'Sid Meiers Civilization VI'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Dead Space -> Action, Horror, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Horror', 'Sci-Fi')
WHERE g.title = 'Dead Space'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

COMMIT;


BEGIN;

-- =========================
-- 1) MAKE SURE PLATFORM NAMES EXIST
-- =========================
INSERT INTO platform (platform_name)
SELECT 'PC'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PC');

INSERT INTO platform (platform_name)
SELECT 'PS5'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PS5');

INSERT INTO platform (platform_name)
SELECT 'Xbox Series X'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Xbox Series X');

INSERT INTO platform (platform_name)
SELECT 'Nintendo Switch'
WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Nintendo Switch');

-- =========================
-- 2) MAKE SURE GENRE NAMES EXIST
-- =========================
INSERT INTO genre (genre_name)
SELECT 'Action'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Action');

INSERT INTO genre (genre_name)
SELECT 'Adventure'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Adventure');

INSERT INTO genre (genre_name)
SELECT 'RPG'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'RPG');

INSERT INTO genre (genre_name)
SELECT 'Open World'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Open World');

INSERT INTO genre (genre_name)
SELECT 'Shooter'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Shooter');

INSERT INTO genre (genre_name)
SELECT 'Fantasy'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Fantasy');

INSERT INTO genre (genre_name)
SELECT 'Sci-Fi'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sci-Fi');

INSERT INTO genre (genre_name)
SELECT 'Horror'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Horror');

INSERT INTO genre (genre_name)
SELECT 'Sports'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sports');

INSERT INTO genre (genre_name)
SELECT 'Multiplayer'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Multiplayer');

INSERT INTO genre (genre_name)
SELECT 'Puzzle'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Puzzle');

INSERT INTO genre (genre_name)
SELECT 'Story Rich'
WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Story Rich');

-- =========================
-- 3) INSERT 20 MORE GAMES
-- =========================

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Half-Life: Alyx',
  'VR Sci-Fi Breakthrough',
  'A landmark VR shooter set in the Half-Life universe with stunning immersion and world design.',
  9.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/546560/library_hero.jpg',
  '#ff9800',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Half-Life: Alyx');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Resident Evil 2',
  'Horror Reimagined',
  'A modern survival horror remake that brilliantly reimagines a classic nightmare.',
  9.3,
  'https://cdn.akamai.steamstatic.com/steam/apps/883710/library_hero.jpg',
  '#b71c1c',
  2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Resident Evil 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Devil May Cry 5',
  'Stylish Demon Action',
  'Fast, flashy, and technical combat packed into a stylish action spectacle.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/601150/library_hero.jpg',
  '#c62828',
  2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Devil May Cry 5');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'DOOM Eternal',
  'Speed and Fury',
  'An intense arena shooter built around speed, aggression, and brutal precision.',
  9.2,
  'https://cdn.akamai.steamstatic.com/steam/apps/782330/library_hero.jpg',
  '#d84315',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'DOOM Eternal');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Hades',
  'Roguelike Masterpiece',
  'A fast, addictive roguelike with exceptional combat, narrative, and replay value.',
  9.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/1145360/library_hero.jpg',
  '#ef6c00',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Hades');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Control Ultimate Edition',
  'Paranormal Action Thriller',
  'A stylish supernatural action game filled with mystery, telekinetic combat, and atmosphere.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/870780/library_hero.jpg',
  '#8e24aa',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Control Ultimate Edition');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'The Last of Us Part I',
  'Emotional Survival Story',
  'A deeply cinematic post-apocalyptic journey driven by character and survival.',
  9.4,
  'https://cdn.akamai.steamstatic.com/steam/apps/1888930/library_hero.jpg',
  '#6d4c41',
  2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'The Last of Us Part I');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'UNCHARTED: Legacy of Thieves Collection',
  'Treasure Hunting Adventure',
  'A globe-trotting cinematic action adventure with charisma, set pieces, and exploration.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/1659420/library_hero.jpg',
  '#8d6e63',
  2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'UNCHARTED: Legacy of Thieves Collection');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Marvels Guardians of the Galaxy',
  'Cosmic Story Adventure',
  'A story-driven superhero adventure with heart, humor, and strong character chemistry.',
  8.7,
  'https://cdn.akamai.steamstatic.com/steam/apps/1088850/library_hero.jpg',
  '#3949ab',
  2021
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Marvels Guardians of the Galaxy');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'FINAL FANTASY VII REMAKE INTERGRADE',
  'Legend Reborn',
  'A beautifully reimagined action RPG retelling of one of gaming’s most iconic adventures.',
  9.3,
  'https://cdn.akamai.steamstatic.com/steam/apps/1462040/library_hero.jpg',
  '#00838f',
  2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'FINAL FANTASY VII REMAKE INTERGRADE');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'TEKKEN 8',
  'Fighting Game Powerhouse',
  'A polished modern fighting game with strong visuals, impact, and competitive depth.',
  9.0,
  'https://cdn.akamai.steamstatic.com/steam/apps/1778820/library_hero.jpg',
  '#e53935',
  2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'TEKKEN 8');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Street Fighter 6',
  'Arcade Fighting Revival',
  'A vibrant and accessible fighting game with depth, style, and excellent momentum.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/1364780/library_hero.jpg',
  '#fb8c00',
  2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Street Fighter 6');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Ori and the Will of the Wisps',
  'Beautiful Platform Adventure',
  'A gorgeous emotional platformer with fluid movement and strong level design.',
  9.4,
  'https://cdn.akamai.steamstatic.com/steam/apps/1057090/library_hero.jpg',
  '#00acc1',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Ori and the Will of the Wisps');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'A Plague Tale: Requiem',
  'Dark Medieval Journey',
  'A grim, story-rich adventure combining stealth, survival, and emotional storytelling.',
  8.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/1182900/library_hero.jpg',
  '#5d4037',
  2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'A Plague Tale: Requiem');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Metro Exodus',
  'Post-Apocalyptic Escape',
  'A tense shooter blending survival, atmosphere, and narrative in a ruined world.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/412020/library_hero.jpg',
  '#455a64',
  2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Metro Exodus');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Celeste',
  'Precision Platforming Gem',
  'A heartfelt and demanding platformer celebrated for movement, challenge, and emotion.',
  9.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/504230/library_hero.jpg',
  '#7e57c2',
  2018
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Celeste');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'No Mans Sky',
  'Infinite Space Exploration',
  'A vast sci-fi adventure centered on exploration, discovery, and continual evolution.',
  8.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/275850/library_hero.jpg',
  '#1e88e5',
  2016
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'No Mans Sky');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Sea of Thieves',
  'Pirate Multiplayer Adventure',
  'A lively multiplayer sandbox built around sailing, treasure, and shared pirate stories.',
  8.7,
  'https://cdn.akamai.steamstatic.com/steam/apps/1172620/library_hero.jpg',
  '#00897b',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Sea of Thieves');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Mass Effect Legendary Edition',
  'Epic Space Saga',
  'A remastered sci-fi RPG trilogy known for choices, squadmates, and galactic storytelling.',
  9.4,
  'https://cdn.akamai.steamstatic.com/steam/apps/1328670/library_hero.jpg',
  '#283593',
  2021
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Mass Effect Legendary Edition');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Days Gone',
  'Open Road Survival',
  'A biker survival adventure set in a dangerous open world overrun by infected hordes.',
  8.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/1259420/library_hero.jpg',
  '#37474f',
  2021
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Days Gone');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT
  'Detroit: Become Human',
  'Choice Driven Future',
  'A branching narrative adventure about android identity, freedom, and consequence.',
  8.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/1222140/library_hero.jpg',
  '#1565c0',
  2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Detroit: Become Human');

-- =========================
-- 4) PLATFORM LINKS
-- =========================

-- PC for all 20
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PC'
WHERE g.title IN (
  'Half-Life: Alyx',
  'Resident Evil 2',
  'Devil May Cry 5',
  'DOOM Eternal',
  'Hades',
  'Control Ultimate Edition',
  'The Last of Us Part I',
  'UNCHARTED: Legacy of Thieves Collection',
  'Marvels Guardians of the Galaxy',
  'FINAL FANTASY VII REMAKE INTERGRADE',
  'TEKKEN 8',
  'Street Fighter 6',
  'Ori and the Will of the Wisps',
  'A Plague Tale: Requiem',
  'Metro Exodus',
  'Celeste',
  'No Mans Sky',
  'Sea of Thieves',
  'Mass Effect Legendary Edition',
  'Days Gone',
  'Detroit: Become Human'
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
  'Resident Evil 2',
  'Devil May Cry 5',
  'DOOM Eternal',
  'Hades',
  'Control Ultimate Edition',
  'The Last of Us Part I',
  'Marvels Guardians of the Galaxy',
  'FINAL FANTASY VII REMAKE INTERGRADE',
  'TEKKEN 8',
  'Street Fighter 6',
  'A Plague Tale: Requiem',
  'No Mans Sky'
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
  'DOOM Eternal',
  'Hades',
  'Control Ultimate Edition',
  'Ori and the Will of the Wisps',
  'A Plague Tale: Requiem',
  'Metro Exodus',
  'No Mans Sky',
  'Sea of Thieves',
  'Mass Effect Legendary Edition',
  'Street Fighter 6'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- Nintendo Switch
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Nintendo Switch'
WHERE g.title IN (
  'Hades',
  'Ori and the Will of the Wisps',
  'Celeste',
  'No Mans Sky'
)
AND NOT EXISTS (
  SELECT 1
  FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- =========================
-- 5) GENRE LINKS
-- =========================

-- Half-Life: Alyx -> Shooter, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Sci-Fi')
WHERE g.title = 'Half-Life: Alyx'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Resident Evil 2 -> Action, Horror
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Horror')
WHERE g.title = 'Resident Evil 2'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Devil May Cry 5 -> Action, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Fantasy')
WHERE g.title = 'Devil May Cry 5'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- DOOM Eternal -> Action, Shooter, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Shooter', 'Sci-Fi')
WHERE g.title = 'DOOM Eternal'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Hades -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'Hades'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Control Ultimate Edition -> Action, Sci-Fi, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Sci-Fi', 'Story Rich')
WHERE g.title = 'Control Ultimate Edition'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- The Last of Us Part I -> Action, Adventure, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Story Rich')
WHERE g.title = 'The Last of Us Part I'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Uncharted -> Action, Adventure, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Story Rich')
WHERE g.title = 'UNCHARTED: Legacy of Thieves Collection'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Guardians -> Action, Adventure, Story Rich, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Story Rich', 'Sci-Fi')
WHERE g.title = 'Marvels Guardians of the Galaxy'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- FF7 Remake -> Action, RPG, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Fantasy')
WHERE g.title = 'FINAL FANTASY VII REMAKE INTERGRADE'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Tekken 8 -> Action, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Multiplayer')
WHERE g.title = 'TEKKEN 8'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Street Fighter 6 -> Action, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Multiplayer')
WHERE g.title = 'Street Fighter 6'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Ori -> Adventure, Fantasy
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Fantasy')
WHERE g.title = 'Ori and the Will of the Wisps'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Plague Tale -> Adventure, Story Rich, Horror
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Story Rich', 'Horror')
WHERE g.title = 'A Plague Tale: Requiem'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Metro Exodus -> Shooter, Sci-Fi, Horror
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Sci-Fi', 'Horror')
WHERE g.title = 'Metro Exodus'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Celeste -> Adventure, Puzzle
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Puzzle')
WHERE g.title = 'Celeste'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- No Mans Sky -> Adventure, Open World, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Open World', 'Sci-Fi')
WHERE g.title = 'No Mans Sky'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Sea of Thieves -> Adventure, Open World, Multiplayer
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Open World', 'Multiplayer')
WHERE g.title = 'Sea of Thieves'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Mass Effect -> RPG, Sci-Fi, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Sci-Fi', 'Story Rich')
WHERE g.title = 'Mass Effect Legendary Edition'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Days Gone -> Action, Open World, Story Rich
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Open World', 'Story Rich')
WHERE g.title = 'Days Gone'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

-- Detroit -> Adventure, Story Rich, Sci-Fi
INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Story Rich', 'Sci-Fi')
WHERE g.title = 'Detroit: Become Human'
AND NOT EXISTS (
  SELECT 1 FROM game_genre gg
  WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id
);

COMMIT;


BEGIN;

-- =========================
-- ENSURE PLATFORM NAMES EXIST
-- =========================
INSERT INTO platform (platform_name)
SELECT 'PC' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PC');

INSERT INTO platform (platform_name)
SELECT 'PS5' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PS5');

INSERT INTO platform (platform_name)
SELECT 'Xbox Series X' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Xbox Series X');

INSERT INTO platform (platform_name)
SELECT 'Nintendo Switch' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Nintendo Switch');

-- =========================
-- ENSURE GENRES EXIST
-- =========================
INSERT INTO genre (genre_name)
SELECT 'Action' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Action');

INSERT INTO genre (genre_name)
SELECT 'Adventure' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Adventure');

INSERT INTO genre (genre_name)
SELECT 'RPG' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'RPG');

INSERT INTO genre (genre_name)
SELECT 'Open World' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Open World');

INSERT INTO genre (genre_name)
SELECT 'Shooter' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Shooter');

INSERT INTO genre (genre_name)
SELECT 'Fantasy' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Fantasy');

INSERT INTO genre (genre_name)
SELECT 'Sci-Fi' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sci-Fi');

INSERT INTO genre (genre_name)
SELECT 'Horror' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Horror');

INSERT INTO genre (genre_name)
SELECT 'Sports' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sports');

INSERT INTO genre (genre_name)
SELECT 'Multiplayer' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Multiplayer');

INSERT INTO genre (genre_name)
SELECT 'Puzzle' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Puzzle');

INSERT INTO genre (genre_name)
SELECT 'Story Rich' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Story Rich');

-- =========================
-- 30 MORE GAMES
-- =========================

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Batman: Arkham Knight','Dark Knight Finale','Glide, fight, and drive across Gotham in a cinematic superhero action adventure.',9.0,'https://cdn.akamai.steamstatic.com/steam/apps/208650/library_hero.jpg','#263238',2015
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Batman: Arkham Knight');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Remnant II','Co-op World of Chaos','Battle monstrous enemies across shifting worlds in a challenging co-op shooter RPG.',8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1282100/library_hero.jpg','#6d4c41',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Remnant II');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Star Wars Jedi: Survivor™','Force and Survival','Continue Cal Kestis’s journey in a cinematic action adventure full of powerful combat.',8.7,'https://cdn.akamai.steamstatic.com/steam/apps/1774580/library_hero.jpg','#1e88e5',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Star Wars Jedi: Survivor™');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'STAR WARS Jedi: Fallen Order™','Padawan to Hero','Master lightsaber combat and Force powers in a story-driven galactic journey.',8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1172380/library_hero.jpg','#1565c0',2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'STAR WARS Jedi: Fallen Order™');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Dying Light 2 Stay Human: Reloaded Edition','Parkour Apocalypse','Survive a sprawling infected city with fluid parkour and brutal first-person combat.',8.2,'https://cdn.akamai.steamstatic.com/steam/apps/534380/library_hero.jpg','#fb8c00',2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Dying Light 2 Stay Human: Reloaded Edition');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'The Elder Scrolls V: Skyrim Special Edition','Legendary Fantasy Journey','Explore a vast fantasy world filled with dragons, dungeons, and unforgettable quests.',9.5,'https://cdn.akamai.steamstatic.com/steam/apps/489830/library_hero.jpg','#78909c',2016
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'The Elder Scrolls V: Skyrim Special Edition');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Fallout 4','Wasteland Rebuilt','Roam a post-apocalyptic open world packed with combat, exploration, and player choice.',8.7,'https://cdn.akamai.steamstatic.com/steam/apps/377160/library_hero.jpg','#8d6e63',2015
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Fallout 4');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Red Dead Redemption','Outlaw Returns','Ride into a brutal frontier tale of revenge, loyalty, and a fading Wild West.',9.3,'https://cdn.akamai.steamstatic.com/steam/apps/2668510/library_hero.jpg','#8b1e1e',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Red Dead Redemption');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Assassins Creed Mirage','Return to the Creed','A focused stealth adventure that brings the series back to its roots.',8.3,'https://cdn.akamai.steamstatic.com/steam/apps/3035570/library_hero.jpg','#546e7a',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Assassins Creed Mirage');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Assassins Creed Valhalla','Viking Open World','Lead a Viking saga across England in a massive open-world action RPG.',8.4,'https://cdn.akamai.steamstatic.com/steam/apps/2208920/library_hero.jpg','#455a64',2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Assassins Creed Valhalla');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Far Cry 6','Tropical Rebellion','Fight to liberate a dictatorship in a chaotic open-world shooter.',8.0,'https://cdn.akamai.steamstatic.com/steam/apps/2369390/library_hero.jpg','#ef5350',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Far Cry 6');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Borderlands 3','Looter Shooter Mayhem','Blast through absurd worlds in a colorful co-op shooter packed with loot.',8.6,'https://cdn.akamai.steamstatic.com/steam/apps/397540/library_hero.jpg','#f9a825',2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Borderlands 3');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Titanfall® 2','Pilot and Titan','A beloved sci-fi shooter known for movement, mech combat, and a superb campaign.',9.4,'https://cdn.akamai.steamstatic.com/steam/apps/1237970/library_hero.jpg','#ff7043',2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Titanfall® 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Battlefield™ 1','War and Atmosphere','A cinematic shooter set across World War I battlefields with strong atmosphere.',8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1238840/library_hero.jpg','#5c6bc0',2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Battlefield™ 1');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Battlefield™ V','Squad Combat Returns','Experience large-scale battles and squad play in a refined military shooter.',8.1,'https://cdn.akamai.steamstatic.com/steam/apps/1238810/library_hero.jpg','#3949ab',2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Battlefield™ V');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Valheim','Survival in Norse Lands','Build, sail, and survive in a beautiful survival sandbox inspired by Norse myth.',9.1,'https://cdn.akamai.steamstatic.com/steam/apps/892970/library_hero.jpg','#6d4c41',2021
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Valheim');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Palworld','Creatures and Crafting','Explore, build, and battle in a survival adventure filled with strange companions.',8.3,'https://cdn.akamai.steamstatic.com/steam/apps/1623730/library_hero.jpg','#00acc1',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Palworld');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Subnautica','Oceanic Survival Wonder','Dive into an alien ocean world full of discovery, terror, and survival.',9.3,'https://cdn.akamai.steamstatic.com/steam/apps/264710/library_hero.jpg','#039be5',2018
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Subnautica');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Outer Wilds','Mystery of the Cosmos','Uncover a brilliant time-loop mystery in a handcrafted solar system.',9.6,'https://cdn.akamai.steamstatic.com/steam/apps/753640/library_hero.jpg','#ff8f00',2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Outer Wilds');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Slay the Spire','Deckbuilding Legend','A genre-defining roguelike deckbuilder packed with strategic depth.',9.4,'https://cdn.akamai.steamstatic.com/steam/apps/646570/library_hero.jpg','#8e24aa',2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Slay the Spire');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Cuphead','Classic Run and Gun','A hand-drawn action game famous for its style, bosses, and challenge.',9.1,'https://cdn.akamai.steamstatic.com/steam/apps/268910/library_hero.jpg','#d84315',2017
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Cuphead');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Forza Motorsport','Track-Day Precision','A refined racing simulation focused on speed, handling, and competition.',8.4,'https://cdn.akamai.steamstatic.com/steam/apps/2440510/library_hero.jpg','#f4511e',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Forza Motorsport');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'EA SPORTS FC™ 24','Modern Football Stage','Compete with clubs and players across a polished global football simulation.',8.1,'https://cdn.akamai.steamstatic.com/steam/apps/2195250/library_hero.jpg','#43a047',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'EA SPORTS FC™ 24');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Mortal Kombat 1','Brutal Fighting Reborn','A cinematic fighting game with intense combat and iconic finishing moves.',8.5,'https://cdn.akamai.steamstatic.com/steam/apps/1971870/library_hero.jpg','#c62828',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Mortal Kombat 1');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Sifu','Mastery Through Defeat','A stylish martial arts brawler built around precision, repetition, and growth.',8.9,'https://cdn.akamai.steamstatic.com/steam/apps/2138710/library_hero.jpg','#8d6e63',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Sifu');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Returnal™','Roguelike Sci-Fi Action','Break the cycle in a demanding sci-fi action game with fast combat and atmosphere.',8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1649240/library_hero.jpg','#455a64',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Returnal™');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Ratchet & Clank: Rift Apart','Dimension-Hopping Adventure','Jump through dimensions in a playful action adventure with spectacular presentation.',9.0,'https://cdn.akamai.steamstatic.com/steam/apps/1895880/library_hero.jpg','#7e57c2',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Ratchet & Clank: Rift Apart');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Age of Empires IV: Anniversary Edition','Empire Strategy Return','Build civilizations and command armies in a polished real-time strategy revival.',8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1466860/library_hero.jpg','#6d4c41',2021
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Age of Empires IV: Anniversary Edition');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Crusader Kings III','Grand Strategy Dynasty','Guide a dynasty through politics, war, and intrigue in a deep strategy sandbox.',9.1,'https://cdn.akamai.steamstatic.com/steam/apps/1158310/library_hero.jpg','#5d4037',2020
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Crusader Kings III');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Cities: Skylines II','Modern City Builder','Design and manage a living city in a large-scale urban simulation.',8.0,'https://cdn.akamai.steamstatic.com/steam/apps/949230/library_hero.jpg','#1e88e5',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Cities: Skylines II');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Project Zomboid','Hardcore Zombie Survival','A deep survival sandbox where every decision matters in a brutal zombie world.',9.2,'https://cdn.akamai.steamstatic.com/steam/apps/108600/library_hero.jpg','#546e7a',2013
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Project Zomboid');

-- =========================
-- PLATFORM LINKS
-- =========================

-- PC for all 30
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PC'
WHERE g.title IN (
  'Batman: Arkham Knight',
  'Remnant II',
  'Star Wars Jedi: Survivor™',
  'STAR WARS Jedi: Fallen Order™',
  'Dying Light 2 Stay Human: Reloaded Edition',
  'The Elder Scrolls V: Skyrim Special Edition',
  'Fallout 4',
  'Red Dead Redemption',
  'Assassins Creed Mirage',
  'Assassins Creed Valhalla',
  'Far Cry 6',
  'Borderlands 3',
  'Titanfall® 2',
  'Battlefield™ 1',
  'Battlefield™ V',
  'Valheim',
  'Palworld',
  'Subnautica',
  'Outer Wilds',
  'Slay the Spire',
  'Cuphead',
  'Forza Motorsport',
  'EA SPORTS FC™ 24',
  'Mortal Kombat 1',
  'Sifu',
  'Returnal™',
  'Ratchet & Clank: Rift Apart',
  'Age of Empires IV: Anniversary Edition',
  'Crusader Kings III',
  'Cities: Skylines II',
  'Project Zomboid'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- PS5
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PS5'
WHERE g.title IN (
  'Batman: Arkham Knight',
  'Remnant II',
  'Star Wars Jedi: Survivor™',
  'STAR WARS Jedi: Fallen Order™',
  'Dying Light 2 Stay Human: Reloaded Edition',
  'Red Dead Redemption',
  'Assassins Creed Mirage',
  'Assassins Creed Valhalla',
  'Far Cry 6',
  'Borderlands 3',
  'Battlefield™ 1',
  'EA SPORTS FC™ 24',
  'Mortal Kombat 1',
  'Sifu',
  'Returnal™',
  'Ratchet & Clank: Rift Apart'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- Xbox Series X
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Xbox Series X'
WHERE g.title IN (
  'Remnant II',
  'Star Wars Jedi: Survivor™',
  'STAR WARS Jedi: Fallen Order™',
  'Dying Light 2 Stay Human: Reloaded Edition',
  'The Elder Scrolls V: Skyrim Special Edition',
  'Fallout 4',
  'Assassins Creed Valhalla',
  'Far Cry 6',
  'Borderlands 3',
  'Titanfall® 2',
  'Battlefield™ 1',
  'Battlefield™ V',
  'Palworld',
  'Forza Motorsport',
  'EA SPORTS FC™ 24',
  'Age of Empires IV: Anniversary Edition'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- Nintendo Switch
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Nintendo Switch'
WHERE g.title IN (
  'Slay the Spire',
  'Cuphead',
  'Outer Wilds',
  'Subnautica'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id
    AND gp.platform_id = p.platform_id
);

-- =========================
-- GENRE LINKS
-- =========================

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure')
WHERE g.title = 'Batman: Arkham Knight'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Shooter', 'RPG')
WHERE g.title = 'Remnant II'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Story Rich')
WHERE g.title = 'Star Wars Jedi: Survivor™'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Story Rich')
WHERE g.title = 'STAR WARS Jedi: Fallen Order™'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Open World', 'Horror')
WHERE g.title = 'Dying Light 2 Stay Human: Reloaded Edition'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Fantasy', 'Open World')
WHERE g.title = 'The Elder Scrolls V: Skyrim Special Edition'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Open World', 'Shooter')
WHERE g.title = 'Fallout 4'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Open World')
WHERE g.title = 'Red Dead Redemption'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Open World')
WHERE g.title = 'Assassins Creed Mirage'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'RPG', 'Open World')
WHERE g.title = 'Assassins Creed Valhalla'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Shooter', 'Open World')
WHERE g.title = 'Far Cry 6'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Action', 'Multiplayer')
WHERE g.title = 'Borderlands 3'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Sci-Fi', 'Story Rich')
WHERE g.title = 'Titanfall® 2'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Multiplayer', 'Story Rich')
WHERE g.title = 'Battlefield™ 1'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Multiplayer')
WHERE g.title = 'Battlefield™ V'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Open World', 'Multiplayer')
WHERE g.title = 'Valheim'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Open World', 'Multiplayer')
WHERE g.title = 'Palworld'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Sci-Fi', 'Open World')
WHERE g.title = 'Subnautica'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Puzzle', 'Sci-Fi')
WHERE g.title = 'Outer Wilds'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Puzzle', 'Fantasy')
WHERE g.title = 'Slay the Spire'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Puzzle')
WHERE g.title = 'Cuphead'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Sports', 'Multiplayer')
WHERE g.title = 'Forza Motorsport'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Sports', 'Multiplayer')
WHERE g.title = 'EA SPORTS FC™ 24'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Multiplayer')
WHERE g.title = 'Mortal Kombat 1'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure')
WHERE g.title = 'Sifu'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Sci-Fi', 'Shooter')
WHERE g.title = 'Returnal™'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Adventure', 'Sci-Fi')
WHERE g.title = 'Ratchet & Clank: Rift Apart'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Story Rich', 'Multiplayer')
WHERE g.title = 'Age of Empires IV: Anniversary Edition'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Story Rich')
WHERE g.title = 'Crusader Kings III'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Story Rich', 'Multiplayer')
WHERE g.title = 'Cities: Skylines II'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Horror', 'Open World')
WHERE g.title = 'Project Zomboid'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

COMMIT;


BEGIN;

-- =========================
-- ENSURE PLATFORM NAMES EXIST
-- =========================
INSERT INTO platform (platform_name)
SELECT 'PC' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PC');

INSERT INTO platform (platform_name)
SELECT 'PS5' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'PS5');

INSERT INTO platform (platform_name)
SELECT 'Xbox Series X' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Xbox Series X');

INSERT INTO platform (platform_name)
SELECT 'Nintendo Switch' WHERE NOT EXISTS (SELECT 1 FROM platform WHERE platform_name = 'Nintendo Switch');

-- =========================
-- ENSURE GENRES EXIST
-- =========================
INSERT INTO genre (genre_name)
SELECT 'Action' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Action');

INSERT INTO genre (genre_name)
SELECT 'Adventure' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Adventure');

INSERT INTO genre (genre_name)
SELECT 'RPG' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'RPG');

INSERT INTO genre (genre_name)
SELECT 'Open World' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Open World');

INSERT INTO genre (genre_name)
SELECT 'Shooter' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Shooter');

INSERT INTO genre (genre_name)
SELECT 'Fantasy' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Fantasy');

INSERT INTO genre (genre_name)
SELECT 'Sci-Fi' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sci-Fi');

INSERT INTO genre (genre_name)
SELECT 'Horror' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Horror');

INSERT INTO genre (genre_name)
SELECT 'Sports' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Sports');

INSERT INTO genre (genre_name)
SELECT 'Multiplayer' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Multiplayer');

INSERT INTO genre (genre_name)
SELECT 'Puzzle' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Puzzle');

INSERT INTO genre (genre_name)
SELECT 'Story Rich' WHERE NOT EXISTS (SELECT 1 FROM genre WHERE genre_name = 'Story Rich');

-- =========================
-- FINAL 17 GAMES TO REACH 100
-- =========================

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Alan Wake 2','Psychological Horror Epic','A cinematic survival horror experience blending mystery, writing, and atmosphere.',
8.9,'https://cdn.akamai.steamstatic.com/steam/apps/108710/library_hero.jpg','#37474f',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Alan Wake 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Dead Cells','Roguelite Action Classic','A sharp, addictive action platformer with fast combat and endless replayability.',
9.2,'https://cdn.akamai.steamstatic.com/steam/apps/588650/library_hero.jpg','#8e24aa',2018
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Dead Cells');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Hi-Fi RUSH','Rhythm Action Surprise','Stylish combat and music-driven momentum combine in a joyful action game.',
9.0,'https://cdn.akamai.steamstatic.com/steam/apps/1817230/library_hero.jpg','#f4511e',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Hi-Fi RUSH');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Jusant','Climbing Adventure','A quiet and beautiful climbing journey built around movement and atmosphere.',
8.5,'https://cdn.akamai.steamstatic.com/steam/apps/1977170/library_hero.jpg','#26a69a',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Jusant');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Lethal Company','Co-op Horror Chaos','A wildly entertaining co-op horror scavenging game full of tension and comedy.',
8.8,'https://cdn.akamai.steamstatic.com/steam/apps/1966720/library_hero.jpg','#546e7a',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Lethal Company');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Terraria','Sandbox Survival Legend','Build, fight, explore, and craft in one of the greatest 2D sandbox adventures ever made.',
9.4,'https://cdn.akamai.steamstatic.com/steam/apps/105600/library_hero.jpg','#43a047',2011
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Terraria');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Vampire Survivors','Auto-Battler Phenomenon','A simple but brilliant survival game built around growth, chaos, and satisfaction.',
9.1,'https://cdn.akamai.steamstatic.com/steam/apps/1794680/library_hero.jpg','#c62828',2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Vampire Survivors');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'XCOM 2','Strategy Under Pressure','Lead humanity''s resistance in a tense tactical strategy game full of risk and reward.',
9.0,'https://cdn.akamai.steamstatic.com/steam/apps/268500/library_hero.jpg','#1565c0',2016
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'XCOM 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Persona 3 Reload','School Life Reborn','A stylish remake of a beloved JRPG blending dungeon crawling and daily life.',
9.1,'https://cdn.akamai.steamstatic.com/steam/apps/2161700/library_hero.jpg','#1e88e5',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Persona 3 Reload');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Like a Dragon: Infinite Wealth','Crime Drama Adventure','A huge and heartfelt RPG adventure full of drama, humor, and personality.',
8.9,'https://cdn.akamai.steamstatic.com/steam/apps/2072450/library_hero.jpg','#ff7043',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Like a Dragon: Infinite Wealth');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'The Talos Principle 2','Philosophical Puzzle Journey','A thoughtful first-person puzzle game with beauty, scale, and big ideas.',
9.0,'https://cdn.akamai.steamstatic.com/steam/apps/835960/library_hero.jpg','#5c6bc0',2023
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'The Talos Principle 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'RimWorld','Story Generator Sandbox','A colony sim famous for emergent storytelling, survival, and player freedom.',
9.5,'https://cdn.akamai.steamstatic.com/steam/apps/294100/library_hero.jpg','#8d6e63',2018
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'RimWorld');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'F1® 24','High-Speed Formula Racing','Compete through intense circuits in a polished modern Formula racing sim.',
8.2,'https://cdn.akamai.steamstatic.com/steam/apps/2488620/library_hero.jpg','#d32f2f',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'F1® 24');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Need for Speed™ Unbound','Street Racing Style','An energetic street racer with bold visuals, speed, and customization.',
8.0,'https://cdn.akamai.steamstatic.com/steam/apps/1846380/library_hero.jpg','#ffca28',2022
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Need for Speed™ Unbound');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Hunt: Showdown 1896','PvPvE Horror Hunt','A tense extraction shooter mixing monsters, gunfights, and eerie atmosphere.',
8.7,'https://cdn.akamai.steamstatic.com/steam/apps/594650/library_hero.jpg','#6d4c41',2019
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Hunt: Showdown 1896');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Warhammer 40,000: Space Marine 2','Brutal Sci-Fi Warfare','A massive action spectacle delivering scale, carnage, and power fantasy.',
8.8,'https://cdn.akamai.steamstatic.com/steam/apps/2183900/library_hero.jpg','#455a64',2024
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Warhammer 40,000: Space Marine 2');

INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
SELECT 'Black Ops III','Futuristic FPS Legacy','A content-rich futuristic shooter known for fast action and co-op variety.',
8.4,'https://cdn.akamai.steamstatic.com/steam/apps/311210/library_hero.jpg','#263238',2015
WHERE NOT EXISTS (SELECT 1 FROM game WHERE title = 'Black Ops III');

-- =========================
-- PLATFORM LINKS
-- =========================

-- PC for all 17
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PC'
WHERE g.title IN (
  'Alan Wake 2',
  'Dead Cells',
  'Hi-Fi RUSH',
  'Jusant',
  'Lethal Company',
  'Terraria',
  'Vampire Survivors',
  'XCOM 2',
  'Persona 3 Reload',
  'Like a Dragon: Infinite Wealth',
  'The Talos Principle 2',
  'RimWorld',
  'F1® 24',
  'Need for Speed™ Unbound',
  'Hunt: Showdown 1896',
  'Warhammer 40,000: Space Marine 2',
  'Black Ops III'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id AND gp.platform_id = p.platform_id
);

-- PS5
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PS5'
WHERE g.title IN (
  'Alan Wake 2',
  'Dead Cells',
  'Hi-Fi RUSH',
  'Persona 3 Reload',
  'Like a Dragon: Infinite Wealth',
  'F1® 24',
  'Need for Speed™ Unbound',
  'Warhammer 40,000: Space Marine 2',
  'Black Ops III'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id AND gp.platform_id = p.platform_id
);

-- Xbox Series X
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Xbox Series X'
WHERE g.title IN (
  'Hi-Fi RUSH',
  'Jusant',
  'Terraria',
  'Vampire Survivors',
  'Persona 3 Reload',
  'F1® 24',
  'Need for Speed™ Unbound',
  'Black Ops III'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id AND gp.platform_id = p.platform_id
);

-- Nintendo Switch
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Nintendo Switch'
WHERE g.title IN (
  'Dead Cells',
  'Terraria',
  'Vampire Survivors'
)
AND NOT EXISTS (
  SELECT 1 FROM game_platform gp
  WHERE gp.game_id = g.game_id AND gp.platform_id = p.platform_id
);

-- =========================
-- GENRE LINKS
-- =========================

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Horror', 'Story Rich')
WHERE g.title = 'Alan Wake 2'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Fantasy')
WHERE g.title = 'Dead Cells'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Story Rich')
WHERE g.title = 'Hi-Fi RUSH'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Puzzle')
WHERE g.title = 'Jusant'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Horror', 'Multiplayer')
WHERE g.title = 'Lethal Company'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Adventure', 'Open World')
WHERE g.title = 'Terraria'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Horror')
WHERE g.title = 'Vampire Survivors'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Story Rich', 'Sci-Fi')
WHERE g.title = 'XCOM 2'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Story Rich')
WHERE g.title = 'Persona 3 Reload'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('RPG', 'Story Rich')
WHERE g.title = 'Like a Dragon: Infinite Wealth'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Puzzle', 'Sci-Fi')
WHERE g.title = 'The Talos Principle 2'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Story Rich', 'RPG')
WHERE g.title = 'RimWorld'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Sports', 'Multiplayer')
WHERE g.title = 'F1® 24'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Sports', 'Open World')
WHERE g.title = 'Need for Speed™ Unbound'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Horror', 'Multiplayer')
WHERE g.title = 'Hunt: Showdown 1896'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Action', 'Sci-Fi')
WHERE g.title = 'Warhammer 40,000: Space Marine 2'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON ge.genre_name IN ('Shooter', 'Multiplayer', 'Sci-Fi')
WHERE g.title = 'Black Ops III'
AND NOT EXISTS (SELECT 1 FROM game_genre gg WHERE gg.game_id = g.game_id AND gg.genre_id = ge.genre_id);

COMMIT;