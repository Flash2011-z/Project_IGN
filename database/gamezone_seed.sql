BEGIN;

-- For bcrypt-compatible password hashes used by /auth/login
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clean reset for testing
TRUNCATE TABLE
  user_review_like,
  comment,
  user_review,
  wishlist,
  cart_item,
  cart,
  game_experience,
  price_history,
  game_store_listing,
  review,
  roadmap_item,
  content_sequence,
  game_tag_map,
  game_tag,
  game_release,
  game_platform,
  game_genre,
  game_developer,
  game,
  reviewer,
  user_account,
  store,
  region,
  genre,
  platform,
  developer,
  publisher,
  franchise,
  age_rating
RESTART IDENTITY CASCADE;

-- =========================
-- LOOKUP TABLES
-- =========================
INSERT INTO age_rating (rating_name, description) VALUES
('E', 'Everyone'),
('T', 'Teen'),
('M', 'Mature 17+');

INSERT INTO publisher (name) VALUES
('Rockstar Games'),
('CD Projekt'),
('FromSoftware'),
('Santa Monica Studio'),
('Insomniac Games'),
('Guerrilla Games'),
('Bethesda Softworks'),
('Capcom'),
('Valve'),
('Respawn Entertainment'),
('Ubisoft'),
('Naughty Dog'),
('Big Ant Studios'),
('Konami');

INSERT INTO developer (name, country) VALUES
('Rockstar Studios', 'USA'),
('CD Projekt Red', 'Poland'),
('FromSoftware', 'Japan'),
('Santa Monica Studio', 'USA'),
('Insomniac Games', 'USA'),
('Guerrilla Games', 'Netherlands'),
('Bethesda Game Studios', 'USA'),
('Capcom', 'Japan'),
('Valve', 'USA'),
('id Software', 'USA'),
('Respawn Entertainment', 'USA'),
('Ubisoft Toronto', 'Canada'),
('Naughty Dog', 'USA'),
('Big Ant Studios', 'Australia'),
('Konami Digital Entertainment', 'Japan');

INSERT INTO franchise (name) VALUES
('Red Dead'),
('Grand Theft Auto'),
('Cyberpunk'),
('Elden Ring'),
('The Witcher'),
('God of War'),
('Marvel''s Spider-Man'),
('Horizon'),
('Starfield'),
('Resident Evil'),
('Half-Life'),
('DOOM'),
('Apex Legends'),
('Portal'),
('Far Cry'),
('Uncharted'),
('Dark Souls'),
('Cricket'),
('eFootball');

INSERT INTO platform (platform_name) VALUES
('PC'),
('PS4'),
('PS5'),
('Xbox One'),
('Xbox Series X'),
('Nintendo Switch');

INSERT INTO genre (genre_name) VALUES
('Action'),
('Adventure'),
('RPG'),
('Open World'),
('Shooter'),
('Fantasy'),
('Sci-Fi'),
('Horror'),
('Sports'),
('Multiplayer'),
('Puzzle'),
('Story Rich');

INSERT INTO region (region_name) VALUES
('Global'),
('North America'),
('Europe'),
('Asia');

INSERT INTO store (name, website, store_type) VALUES
('Steam', 'https://store.steampowered.com', 'PC'),
('PlayStation Store', 'https://store.playstation.com', 'Console'),
('Xbox Store', 'https://www.xbox.com/games/store', 'Console');

INSERT INTO reviewer (name, designation) VALUES
('IGN Staff', 'Senior Editor'),
('Mina Rahman', 'Reviews Editor'),
('Alex Carter', 'Games Critic');

INSERT INTO game_tag (tag_name) VALUES
('Must Play'),
('Best Seller'),
('Co-op Friendly'),
('Single Player');

-- =========================
-- GAMES
-- =========================
INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year, publisher_id, franchise_id, rating_id)
VALUES
(
  'Red Dead Redemption 2', 'Epic Western Saga',
  'An immersive open-world western adventure set in a dying frontier era.',
  9.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_hero.jpg',
  '#7b1c1c', 2018,
  (SELECT publisher_id FROM publisher WHERE name = 'Rockstar Games'),
  (SELECT franchise_id FROM franchise WHERE name = 'Red Dead'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Grand Theft Auto V', 'Criminal Underworld',
  'A massive open-world crime epic set in Los Santos.',
  9.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/271590/library_hero.jpg',
  '#00ff99', 2013,
  (SELECT publisher_id FROM publisher WHERE name = 'Rockstar Games'),
  (SELECT franchise_id FROM franchise WHERE name = 'Grand Theft Auto'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Cyberpunk 2077', 'Futuristic Night City',
  'A neon-lit dystopian RPG set in a cyber-enhanced future.',
  8.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_hero.jpg',
  '#ffcc00', 2020,
  (SELECT publisher_id FROM publisher WHERE name = 'CD Projekt'),
  (SELECT franchise_id FROM franchise WHERE name = 'Cyberpunk'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Elden Ring', 'Dark Fantasy Adventure',
  'A vast dark fantasy world filled with danger and mystery.',
  9.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_hero.jpg',
  '#ffd700', 2022,
  (SELECT publisher_id FROM publisher WHERE name = 'FromSoftware'),
  (SELECT franchise_id FROM franchise WHERE name = 'Elden Ring'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'The Witcher 3: Wild Hunt', 'Geralt''s Journey',
  'A story-driven open-world RPG about monster hunting.',
  9.9,
  'https://cdn.akamai.steamstatic.com/steam/apps/292030/library_hero.jpg',
  '#c62828', 2015,
  (SELECT publisher_id FROM publisher WHERE name = 'CD Projekt'),
  (SELECT franchise_id FROM franchise WHERE name = 'The Witcher'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'God of War', 'Norse Mythology',
  'Kratos begins a new journey in the realm of Norse gods.',
  9.6,
  'https://cdn.akamai.steamstatic.com/steam/apps/1593500/library_hero.jpg',
  '#1e88e5', 2022,
  (SELECT publisher_id FROM publisher WHERE name = 'Santa Monica Studio'),
  (SELECT franchise_id FROM franchise WHERE name = 'God of War'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Spider-Man Remastered', 'Marvel Superhero',
  'Swing through New York in a cinematic superhero adventure.',
  9.3,
  'https://cdn.akamai.steamstatic.com/steam/apps/1817070/library_hero.jpg',
  '#ff1744', 2022,
  (SELECT publisher_id FROM publisher WHERE name = 'Insomniac Games'),
  (SELECT franchise_id FROM franchise WHERE name = 'Marvel''s Spider-Man'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'T')
),
(
  'Horizon Zero Dawn', 'Machine Apocalypse',
  'Explore a world ruled by deadly mechanical creatures.',
  9.0,
  'https://cdn.akamai.steamstatic.com/steam/apps/1151640/library_hero.jpg',
  '#ff6f00', 2020,
  (SELECT publisher_id FROM publisher WHERE name = 'Guerrilla Games'),
  (SELECT franchise_id FROM franchise WHERE name = 'Horizon'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'T')
),
(
  'Starfield', 'Space Exploration',
  'A next-generation RPG set among the stars.',
  8.3,
  'https://cdn.akamai.steamstatic.com/steam/apps/1716740/library_hero.jpg',
  '#283593', 2023,
  (SELECT publisher_id FROM publisher WHERE name = 'Bethesda Softworks'),
  (SELECT franchise_id FROM franchise WHERE name = 'Starfield'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Resident Evil 4', 'Survival Horror',
  'A modern reimagining of a survival horror classic.',
  9.1,
  'https://cdn.akamai.steamstatic.com/steam/apps/2050650/library_hero.jpg',
  '#6d4c41', 2023,
  (SELECT publisher_id FROM publisher WHERE name = 'Capcom'),
  (SELECT franchise_id FROM franchise WHERE name = 'Resident Evil'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'M')
),
(
  'Portal 2', 'Creative Puzzle',
  'A mind-bending puzzle adventure.',
  9.8,
  'https://cdn.akamai.steamstatic.com/steam/apps/620/library_hero.jpg',
  '#03a9f4', 2011,
  (SELECT publisher_id FROM publisher WHERE name = 'Valve'),
  (SELECT franchise_id FROM franchise WHERE name = 'Portal'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'E')
),
(
  'Cricket 24', 'Official Cricket Simulation',
  'A complete and immersive cricket simulation featuring teams and stadiums from around the world.',
  8.2,
  'https://cdn.akamai.steamstatic.com/steam/apps/2358260/library_hero.jpg',
  '#006400', 2023,
  (SELECT publisher_id FROM publisher WHERE name = 'Big Ant Studios'),
  (SELECT franchise_id FROM franchise WHERE name = 'Cricket'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'E')
),
(
  'eFootball™', 'Soccer Simulation',
  'Experience international soccer with clubs, national teams, and realistic football action.',
  7.5,
  'https://cdn.akamai.steamstatic.com/steam/apps/1665460/library_hero.jpg',
  '#000080', 2021,
  (SELECT publisher_id FROM publisher WHERE name = 'Konami'),
  (SELECT franchise_id FROM franchise WHERE name = 'eFootball'),
  (SELECT rating_id FROM age_rating WHERE rating_name = 'E')
);

-- =========================
-- GAME RELATIONS
-- =========================
INSERT INTO game_developer (game_id, developer_id)
SELECT g.game_id, d.developer_id
FROM game g
JOIN developer d ON (
  (g.title = 'Red Dead Redemption 2' AND d.name = 'Rockstar Studios') OR
  (g.title = 'Grand Theft Auto V' AND d.name = 'Rockstar Studios') OR
  (g.title = 'Cyberpunk 2077' AND d.name = 'CD Projekt Red') OR
  (g.title = 'Elden Ring' AND d.name = 'FromSoftware') OR
  (g.title = 'The Witcher 3: Wild Hunt' AND d.name = 'CD Projekt Red') OR
  (g.title = 'God of War' AND d.name = 'Santa Monica Studio') OR
  (g.title = 'Spider-Man Remastered' AND d.name = 'Insomniac Games') OR
  (g.title = 'Horizon Zero Dawn' AND d.name = 'Guerrilla Games') OR
  (g.title = 'Starfield' AND d.name = 'Bethesda Game Studios') OR
  (g.title = 'Resident Evil 4' AND d.name = 'Capcom') OR
  (g.title = 'Portal 2' AND d.name = 'Valve') OR
  (g.title = 'Cricket 24' AND d.name = 'Big Ant Studios') OR
  (g.title = 'eFootball™' AND d.name = 'Konami Digital Entertainment')
);

-- PC for all games
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
CROSS JOIN platform p
WHERE p.platform_name = 'PC';

-- Additional platforms
INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PS5'
WHERE g.title IN (
  'Red Dead Redemption 2','Grand Theft Auto V','Cyberpunk 2077','Elden Ring',
  'The Witcher 3: Wild Hunt','God of War','Spider-Man Remastered',
  'Horizon Zero Dawn','Starfield','Resident Evil 4','Cricket 24','eFootball™'
);

INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'Xbox Series X'
WHERE g.title IN (
  'Red Dead Redemption 2','Grand Theft Auto V','Cyberpunk 2077','Elden Ring',
  'The Witcher 3: Wild Hunt','Horizon Zero Dawn','Starfield','Cricket 24','eFootball™'
);

INSERT INTO game_platform (game_id, platform_id)
SELECT g.game_id, p.platform_id
FROM game g
JOIN platform p ON p.platform_name = 'PS4'
WHERE g.title IN ('Grand Theft Auto V','The Witcher 3: Wild Hunt','Portal 2','eFootball™');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.game_id, ge.genre_id
FROM game g
JOIN genre ge ON (
  (g.title = 'Red Dead Redemption 2' AND ge.genre_name IN ('Action','Adventure','Open World')) OR
  (g.title = 'Grand Theft Auto V' AND ge.genre_name IN ('Action','Open World','Multiplayer')) OR
  (g.title = 'Cyberpunk 2077' AND ge.genre_name IN ('Action','RPG','Sci-Fi')) OR
  (g.title = 'Elden Ring' AND ge.genre_name IN ('Action','RPG','Fantasy')) OR
  (g.title = 'The Witcher 3: Wild Hunt' AND ge.genre_name IN ('RPG','Fantasy','Story Rich')) OR
  (g.title = 'God of War' AND ge.genre_name IN ('Action','Fantasy','Story Rich')) OR
  (g.title = 'Spider-Man Remastered' AND ge.genre_name IN ('Action','Adventure')) OR
  (g.title = 'Horizon Zero Dawn' AND ge.genre_name IN ('Action','Sci-Fi','Open World')) OR
  (g.title = 'Starfield' AND ge.genre_name IN ('RPG','Sci-Fi','Open World')) OR
  (g.title = 'Resident Evil 4' AND ge.genre_name IN ('Action','Horror')) OR
  (g.title = 'Portal 2' AND ge.genre_name IN ('Puzzle','Story Rich')) OR
  (g.title = 'Cricket 24' AND ge.genre_name IN ('Sports','Multiplayer')) OR
  (g.title = 'eFootball™' AND ge.genre_name IN ('Sports','Multiplayer'))
);

INSERT INTO game_tag_map (game_id, tag_id)
SELECT g.game_id, t.tag_id
FROM game g
JOIN game_tag t ON (
  (g.title IN ('The Witcher 3: Wild Hunt','Red Dead Redemption 2','Portal 2') AND t.tag_name = 'Must Play') OR
  (g.title IN ('Grand Theft Auto V','Elden Ring','Spider-Man Remastered') AND t.tag_name = 'Best Seller') OR
  (g.title IN ('Cricket 24','eFootball™') AND t.tag_name = 'Co-op Friendly') OR
  (g.title IN ('God of War','Resident Evil 4','Starfield') AND t.tag_name = 'Single Player')
);

INSERT INTO game_release (game_id, region_id, platform_id, release_date)
SELECT g.game_id, r.region_id, p.platform_id,
CASE g.title
  WHEN 'Red Dead Redemption 2' THEN DATE '2018-10-26'
  WHEN 'Grand Theft Auto V' THEN DATE '2013-09-17'
  WHEN 'Cyberpunk 2077' THEN DATE '2020-12-10'
  WHEN 'Elden Ring' THEN DATE '2022-02-25'
  WHEN 'The Witcher 3: Wild Hunt' THEN DATE '2015-05-19'
  WHEN 'God of War' THEN DATE '2022-01-14'
  WHEN 'Spider-Man Remastered' THEN DATE '2022-08-12'
  WHEN 'Horizon Zero Dawn' THEN DATE '2020-08-07'
  WHEN 'Starfield' THEN DATE '2023-09-06'
  WHEN 'Resident Evil 4' THEN DATE '2023-03-24'
  WHEN 'Portal 2' THEN DATE '2011-04-19'
  WHEN 'Cricket 24' THEN DATE '2023-10-05'
  WHEN 'eFootball™' THEN DATE '2021-09-30'
END
FROM game g
JOIN region r ON r.region_name = 'Global'
JOIN platform p ON p.platform_name = 'PC';

-- =========================
-- STOREFRONT / PRICES
-- =========================
INSERT INTO game_store_listing (game_id, store_id, price, currency, purchase_url, stock_status)
SELECT g.game_id, s.store_id,
CASE g.title
  WHEN 'Red Dead Redemption 2' THEN 59.99
  WHEN 'Grand Theft Auto V' THEN 29.99
  WHEN 'Cyberpunk 2077' THEN 59.99
  WHEN 'Elden Ring' THEN 59.99
  WHEN 'The Witcher 3: Wild Hunt' THEN 39.99
  WHEN 'God of War' THEN 49.99
  WHEN 'Spider-Man Remastered' THEN 59.99
  WHEN 'Horizon Zero Dawn' THEN 49.99
  WHEN 'Starfield' THEN 69.99
  WHEN 'Resident Evil 4' THEN 59.99
  WHEN 'Portal 2' THEN 9.99
  WHEN 'Cricket 24' THEN 39.99
  WHEN 'eFootball™' THEN 0.00
END,
'USD',
'https://example.com/buy/' || g.game_id,
'In Stock'
FROM game g
JOIN store s ON s.name = 'Steam';

INSERT INTO price_history (listing_id, price, date)
SELECT listing_id, price, NOW() - INTERVAL '15 days' FROM game_store_listing;

INSERT INTO price_history (listing_id, price, date)
SELECT listing_id,
CASE WHEN price > 0 THEN price - 5 ELSE 0 END,
NOW() - INTERVAL '30 days'
FROM game_store_listing;

-- =========================
-- USERS / AUTH TESTING
-- Password for all seeded users: 12345678
-- =========================
INSERT INTO user_account (username, email, password_hash, join_date) VALUES
('NeoGamer', 'neo@gz.com', crypt('12345678', gen_salt('bf')), NOW() - INTERVAL '40 days'),
('Akira99', 'akira@gz.com', crypt('12345678', gen_salt('bf')), NOW() - INTERVAL '35 days'),
('ShadowFox', 'fox@gz.com', crypt('12345678', gen_salt('bf')), NOW() - INTERVAL '28 days'),
('PixelKing', 'pixel@gz.com', crypt('12345678', gen_salt('bf')), NOW() - INTERVAL '21 days'),
('LunaByte', 'luna@gz.com', crypt('12345678', gen_salt('bf')), NOW() - INTERVAL '14 days');

INSERT INTO user_review (user_id, game_id, review_text, score, review_date)
SELECT u.user_id, g.game_id, x.review_text, x.score, x.review_date
FROM (
  VALUES
    ('neo@gz.com', 'Red Dead Redemption 2', 'Absolutely stunning world design and storytelling. A true masterpiece.', 10.0, NOW() - INTERVAL '5 days'),
    ('akira@gz.com', 'Elden Ring', 'Brutally challenging but incredibly rewarding. One of the best RPGs ever.', 9.0, NOW() - INTERVAL '4 days'),
    ('fox@gz.com', 'The Witcher 3: Wild Hunt', 'The narrative depth and side quests are unmatched.', 10.0, NOW() - INTERVAL '3 days'),
    ('pixel@gz.com', 'Cricket 24', 'Best cricket game in recent years. Feels realistic and immersive.', 8.0, NOW() - INTERVAL '2 days'),
    ('neo@gz.com', 'eFootball™', 'Good football mechanics but still needs better animations.', 7.0, NOW() - INTERVAL '36 hours'),
    ('akira@gz.com', 'Grand Theft Auto V', 'Los Santos still feels alive even after so many years.', 9.0, NOW() - INTERVAL '30 hours'),
    ('luna@gz.com', 'Cyberpunk 2077', 'Much better now after updates. Great atmosphere and style.', 8.5, NOW() - INTERVAL '18 hours')
) AS x(email, title, review_text, score, review_date)
JOIN user_account u ON u.email = x.email
JOIN game g ON g.title = x.title;

INSERT INTO user_review_like (user_id, user_review_id)
SELECT u.user_id, ur.user_review_id
FROM user_account u
JOIN user_review ur ON ur.user_review_id IN (1,2,3)
WHERE u.email IN ('fox@gz.com','pixel@gz.com','luna@gz.com')
AND u.user_id <> ur.user_id;

INSERT INTO wishlist (user_id, game_id, added_date)
SELECT u.user_id, g.game_id, NOW() - INTERVAL '1 day'
FROM user_account u
JOIN game g ON g.title IN ('Elden Ring', 'Spider-Man Remastered')
WHERE u.email = 'neo@gz.com';

INSERT INTO wishlist (user_id, game_id, added_date)
SELECT u.user_id, g.game_id, NOW() - INTERVAL '12 hours'
FROM user_account u
JOIN game g ON g.title IN ('Starfield', 'Resident Evil 4')
WHERE u.email = 'luna@gz.com';

INSERT INTO cart (user_id, created_at)
SELECT user_id, NOW() - INTERVAL '2 hours'
FROM user_account
WHERE email = 'neo@gz.com';

INSERT INTO cart_item (cart_id, listing_id, quantity)
SELECT c.cart_id, gsl.listing_id, 1
FROM cart c
JOIN user_account u ON u.user_id = c.user_id
JOIN game g ON g.title = 'Portal 2'
JOIN game_store_listing gsl ON gsl.game_id = g.game_id
WHERE u.email = 'neo@gz.com';

INSERT INTO game_experience (user_id, game_id, hours_played, completed)
SELECT u.user_id, g.game_id, 120, TRUE
FROM user_account u
JOIN game g ON g.title = 'The Witcher 3: Wild Hunt'
WHERE u.email = 'fox@gz.com';

INSERT INTO game_experience (user_id, game_id, hours_played, completed)
SELECT u.user_id, g.game_id, 48, FALSE
FROM user_account u
JOIN game g ON g.title = 'Starfield'
WHERE u.email = 'luna@gz.com';

INSERT INTO review (game_id, reviewer_id, review_text, review_date, final_score)
SELECT g.game_id, r.reviewer_id,
'An excellent release with strong presentation and lasting appeal.',
CURRENT_DATE - 10,
CASE g.title
  WHEN 'The Witcher 3: Wild Hunt' THEN 10.0
  WHEN 'Elden Ring' THEN 10.0
  WHEN 'Portal 2' THEN 9.5
  ELSE 8.5
END
FROM game g
JOIN reviewer r ON r.name = 'IGN Staff'
WHERE g.title IN ('The Witcher 3: Wild Hunt', 'Elden Ring', 'Portal 2', 'Resident Evil 4');

COMMIT;


UPDATE game
SET cover_url = 'https://images.hdqwalls.com/download/red-dead-redemption-2-takes-over-dh-1920x1080.jpg',
    avg_score = 10
WHERE title = 'Red Dead Redemption 2';