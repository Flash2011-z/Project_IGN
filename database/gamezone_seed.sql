INSERT INTO game (title, subtitle, description, avg_score, cover_url, accent_color, release_year)
VALUES

('Red Dead Redemption 2', 'Epic Western Saga',
'An immersive open-world western adventure set in a dying frontier era.',
9.8,
'https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_hero.jpg',
'#7b1c1c',
2018),

('Grand Theft Auto V', 'Criminal Underworld',
'A massive open-world crime epic set in Los Santos.',
9.5,
'https://cdn.akamai.steamstatic.com/steam/apps/271590/library_hero.jpg',
'#00ff99',
2013),

('Cyberpunk 2077', 'Futuristic Night City',
'A neon-lit dystopian RPG set in a cyber-enhanced future.',
8.6,
'https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_hero.jpg',
'#ffcc00',
2020),

('Elden Ring', 'Dark Fantasy Adventure',
'A vast dark fantasy world filled with danger and mystery.',
9.6,
'https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_hero.jpg',
'#ffd700',
2022),

('The Witcher 3: Wild Hunt', 'Geralt’s Journey',
'A story-driven open-world RPG about monster hunting.',
9.9,
'https://cdn.akamai.steamstatic.com/steam/apps/292030/library_hero.jpg',
'#c62828',
2015),

('God of War', 'Norse Mythology',
'Kratos begins a new journey in the realm of Norse gods.',
9.6,
'https://cdn.akamai.steamstatic.com/steam/apps/1593500/library_hero.jpg',
'#1e88e5',
2022),

('Spider-Man Remastered', 'Marvel Superhero',
'Swing through New York in a cinematic superhero adventure.',
9.3,
'https://cdn.akamai.steamstatic.com/steam/apps/1817070/library_hero.jpg',
'#ff1744',
2022),

('Horizon Zero Dawn', 'Machine Apocalypse',
'Explore a world ruled by deadly mechanical creatures.',
9.0,
'https://cdn.akamai.steamstatic.com/steam/apps/1151640/library_hero.jpg',
'#ff6f00',
2020),

('Starfield', 'Space Exploration',
'A next-generation RPG set among the stars.',
8.3,
'https://cdn.akamai.steamstatic.com/steam/apps/1716740/library_hero.jpg',
'#283593',
2023),

('Bloodborne', 'Gothic Horror',
'A dark and terrifying action RPG experience.',
9.5,
'https://cdn.akamai.steamstatic.com/steam/apps/1237970/library_hero.jpg',
'#880e4f',
2015),

('The Elder Scrolls V: Skyrim', 'Dragonborn',
'An epic open-world fantasy RPG set in Skyrim.',
9.4,
'https://cdn.akamai.steamstatic.com/steam/apps/489830/library_hero.jpg',
'#9e9e9e',
2011),

('Assassin’s Creed Valhalla', 'Viking Conquest',
'Lead epic Viking raids across England.',
8.4,
'https://cdn.akamai.steamstatic.com/steam/apps/2208920/library_hero.jpg',
'#4caf50',
2020),

('Resident Evil 4', 'Survival Horror',
'A modern reimagining of a survival horror classic.',
9.1,
'https://cdn.akamai.steamstatic.com/steam/apps/2050650/library_hero.jpg',
'#6d4c41',
2023),

('Half-Life 2', 'Legendary FPS',
'A groundbreaking first-person shooter.',
9.7,
'https://cdn.akamai.steamstatic.com/steam/apps/220/library_hero.jpg',
'#ff9800',
2004),

('Doom Eternal', 'Fast-Paced Combat',
'Rip and tear through demon hordes.',
8.9,
'https://cdn.akamai.steamstatic.com/steam/apps/782330/library_hero.jpg',
'#f44336',
2020),

('Apex Legends', 'Battle Royale',
'A competitive squad-based shooter.',
8.7,
'https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_hero.jpg',
'#e91e63',
2019),

('Portal 2', 'Creative Puzzle',
'A mind-bending puzzle adventure.',
9.8,
'https://cdn.akamai.steamstatic.com/steam/apps/620/library_hero.jpg',
'#03a9f4',
2011),

('Far Cry 6', 'Tropical Revolution',
'Fight for freedom in a tropical dictatorship.',
7.8,
'https://cdn.akamai.steamstatic.com/steam/apps/2369390/library_hero.jpg',
'#00acc1',
2021),

('Uncharted: Legacy of Thieves Collection', 'Treasure Hunt',
'Join Nathan Drake in a globe-trotting adventure.',
9.4,
'https://cdn.akamai.steamstatic.com/steam/apps/1659420/library_hero.jpg',
'#3949ab',
2022),

('Dark Souls III', 'Challenging Fantasy',
'A brutal and atmospheric dark fantasy RPG.',
9.2,
'https://cdn.akamai.steamstatic.com/steam/apps/374320/library_hero.jpg',
'#212121',
2016),

-- 21
('Cricket 24', 'Official Cricket Simulation',
'A complete and immersive cricket simulation featuring teams and stadiums from around the world.',
8.2,
'https://cdn.akamai.steamstatic.com/steam/apps/2358260/library_hero.jpg',
'#006400',
2023),

-- 22
('eFootball™', 'Soccer Simulation',
'Experience international soccer with clubs, national teams, and realistic football action.',
7.5,
'https://cdn.akamai.steamstatic.com/steam/apps/1665460/library_hero.jpg',
'#000080',
2021);




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

-- PC for all games
INSERT INTO game_platform (game_id, platform_id)
SELECT game_id, 1 FROM game;

-- PS5 (modern AAA titles)
INSERT INTO game_platform (game_id, platform_id) VALUES
(1,3),(2,3),(3,3),(4,3),(5,3),(6,3),(7,3),(8,3),
(9,3),(10,3),(12,3),(13,3),(18,3),(19,3),(20,3),
(21,3),(22,3);

-- Xbox Series X
INSERT INTO game_platform (game_id, platform_id) VALUES
(1,5),(2,5),(3,5),(4,5),(5,5),(8,5),
(9,5),(12,5),(18,5),(21,5),(22,5);


-- Red Dead Redemption 2
INSERT INTO game_genre VALUES (1,1),(1,2),(1,4);

-- GTA V
INSERT INTO game_genre VALUES (2,1),(2,4),(2,10);

-- Cyberpunk
INSERT INTO game_genre VALUES (3,1),(3,3),(3,7);

-- Elden Ring
INSERT INTO game_genre VALUES (4,1),(4,3),(4,6);

-- Witcher 3
INSERT INTO game_genre VALUES (5,3),(5,6),(5,12);

-- God of War
INSERT INTO game_genre VALUES (6,1),(6,6),(6,12);

-- Spider-Man
INSERT INTO game_genre VALUES (7,1),(7,2);

-- Horizon
INSERT INTO game_genre VALUES (8,1),(8,7);

-- Starfield
INSERT INTO game_genre VALUES (9,3),(9,7),(9,4);

-- Bloodborne
INSERT INTO game_genre VALUES (10,1),(10,6),(10,8);

-- Skyrim
INSERT INTO game_genre VALUES (11,3),(11,6),(11,4);

-- AC Valhalla
INSERT INTO game_genre VALUES (12,1),(12,4),(12,6);

-- Resident Evil 4
INSERT INTO game_genre VALUES (13,1),(13,8);

-- Half-Life 2
INSERT INTO game_genre VALUES (14,5),(14,7);

-- Doom Eternal
INSERT INTO game_genre VALUES (15,5),(15,1);

-- Apex Legends
INSERT INTO game_genre VALUES (16,5),(16,10);

-- Portal 2
INSERT INTO game_genre VALUES (17,11),(17,12);

-- Far Cry 6
INSERT INTO game_genre VALUES (18,1),(18,4);

-- Uncharted
INSERT INTO game_genre VALUES (19,2),(19,12);

-- Dark Souls III
INSERT INTO game_genre VALUES (20,3),(20,6);

-- Cricket 24
INSERT INTO game_genre VALUES (21,9),(21,10);

-- eFootball
INSERT INTO game_genre VALUES (22,9),(22,10);



INSERT INTO user_account (username, email, password_hash)
VALUES
('NeoGamer', 'neo@gz.com', 'hashed_pw'),
('Akira99', 'akira@gz.com', 'hashed_pw'),
('ShadowFox', 'fox@gz.com', 'hashed_pw'),
('PixelKing', 'pixel@gz.com', 'hashed_pw');


INSERT INTO user_review (user_id, game_id, review_text, score, review_date)
VALUES
(1, 1, 'Absolutely stunning world design and storytelling. A true masterpiece.', 10, NOW()),

(2, 4, 'Brutally challenging but incredibly rewarding. One of the best RPGs ever.', 9, NOW()),

(3, 5, 'The narrative depth and side quests are unmatched.', 10, NOW()),

(4, 21, 'Best cricket game in recent years. Feels realistic and immersive.', 8, NOW()),

(1, 22, 'Good football mechanics but needs better animations.', 7, NOW()),

(2, 2, 'Los Santos still feels alive even after so many years.', 9, NOW()),

(3, 3, 'Cyberpunk improved massively after updates. Great atmosphere.', 8, NOW());

