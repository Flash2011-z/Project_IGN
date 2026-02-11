-- Clean seed extracted from public.sql
-- Run schema_clean.sql first, then this file.

INSERT INTO age_rating (age_rating_id, rating_code, description)
VALUES (1, 'E', 'Everyone');

INSERT INTO age_rating (age_rating_id, rating_code, description)
VALUES (2, 'T', 'Teen');

INSERT INTO age_rating (age_rating_id, rating_code, description)
VALUES (3, 'M', 'Mature 17+');

INSERT INTO developer (developer_id, developer_name)
VALUES (1, 'Rockstar Games');

INSERT INTO developer (developer_id, developer_name)
VALUES (2, 'FromSoftware');

INSERT INTO developer (developer_id, developer_name)
VALUES (3, 'Naughty Dog');

INSERT INTO developer (developer_id, developer_name)
VALUES (4, 'CD Projekt Red');

INSERT INTO developer (developer_id, developer_name)
VALUES (5, 'Santa Monica Studio');

INSERT INTO developer (developer_id, developer_name)
VALUES (6, 'Insomniac Games');

INSERT INTO developer (developer_id, developer_name)
VALUES (7, 'Guerrilla Games');

INSERT INTO developer (developer_id, developer_name)
VALUES (8, 'Bethesda Game Studios');

INSERT INTO developer (developer_id, developer_name)
VALUES (9, 'Respawn Entertainment');

INSERT INTO developer (developer_id, developer_name)
VALUES (10, 'Larian Studios');

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (1, 'The Last of Us Part II', 1, NULL, 3, 2020, 'Emotional survival story set in post-apocalyptic America.', 'https://example.com/tlou2.jpg', '#b71c1c', 9.5, 'Survival • Narrative', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (2, 'God of War Ragnarok', 1, NULL, 3, 2022, 'Kratos and Atreus journey through Norse mythology.', 'https://example.com/gowr.jpg', '#1e88e5', 9.6, 'Action • Mythology', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (3, 'Elden Ring', 4, NULL, 3, 2022, 'Open world action RPG with brutal combat.', 'https://example.com/eldenring.jpg', '#d4af37', 9.7, 'Souls-like • Open World', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (4, 'Sekiro: Shadows Die Twice', 4, NULL, 3, 2019, 'Precision combat in feudal Japan.', 'https://example.com/sekiro.jpg', '#d93a2f', 9.3, 'Souls-like • Samurai', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (5, 'Cyberpunk 2077', 6, NULL, 3, 2020, 'Futuristic open world RPG in Night City.', 'https://example.com/cp2077.jpg', '#ffeb3b', 8.5, 'RPG • Sci-Fi', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (6, 'Red Dead Redemption 2', 5, NULL, 3, 2018, 'Western open world epic.', 'https://example.com/rdr2.jpg', '#c62828', 9.8, 'Open World • Western', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (7, 'Grand Theft Auto V', 5, NULL, 3, 2013, 'Crime-based open world sandbox.', 'https://example.com/gtav.jpg', '#388e3c', 9.4, 'Open World • Crime', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (8, 'The Witcher 3: Wild Hunt', 6, NULL, 3, 2015, 'Fantasy RPG following Geralt of Rivia.', 'https://example.com/witcher3.jpg', '#5d4037', 9.8, 'RPG • Fantasy', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (9, 'Assassin’s Creed Valhalla', 7, NULL, 3, 2020, 'Viking era open world action.', 'https://example.com/acv.jpg', '#283593', 8.7, 'Action • Open World', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (10, 'Resident Evil 4 Remake', 10, NULL, 3, 2023, 'Horror survival reimagined.', 'https://example.com/re4.jpg', '#000000', 9.2, 'Horror • Survival', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (11, 'Red Dead Redemption 2', 1, NULL, 3, 2018, 'Epic western open-world adventure.', 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg', '#8B0000', 9.8, 'Outlaws for Life', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (12, 'God of War Ragnarök', 1, NULL, 3, 2022, 'Kratos and Atreus face Norse gods.', 'https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg', '#3B6EA5', 9.7, 'Fate of the Realms', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (13, 'The Last of Us Part I', 1, NULL, 3, 2022, 'Survival story in post-apocalyptic world.', 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Last_of_Us_Part_I_cover.jpg', '#222222', 9.6, 'Remake', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (14, 'Cyberpunk 2077', 10, NULL, 3, 2020, 'Futuristic RPG in Night City.', 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg', '#FFD700', 8.9, 'Phantom Liberty', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (15, 'Elden Ring', 9, NULL, 3, 2022, 'Open world Souls-like RPG.', 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg', '#C2B280', 9.8, 'The Lands Between', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (16, 'Spider-Man 2', 1, NULL, 2, 2023, 'Peter and Miles vs Venom.', 'https://upload.wikimedia.org/wikipedia/en/e/ef/Spider-Man_2_cover.jpg', '#D10000', 9.5, 'Dual Heroes', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (17, 'Horizon Forbidden West', 1, NULL, 2, 2022, 'Aloy explores the forbidden west.', 'https://upload.wikimedia.org/wikipedia/en/9/90/Horizon_Forbidden_West_cover_art.jpg', '#FF6600', 9.1, 'Beyond the Horizon', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (18, 'Starfield', 2, NULL, 3, 2023, 'Space exploration RPG.', 'https://upload.wikimedia.org/wikipedia/en/8/85/Starfield_cover_art.jpg', '#111111', 8.5, 'Into the Stars', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (19, 'Baldur''s Gate 3', 7, NULL, 3, 2023, 'Dungeons & Dragons RPG.', 'https://upload.wikimedia.org/wikipedia/en/1/1e/Baldur%27s_Gate_3_cover_art.jpg', '#800000', 9.7, 'Return to Faerûn', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (20, 'Resident Evil 4 Remake', 8, NULL, 3, 2023, 'Horror survival remake.', 'https://upload.wikimedia.org/wikipedia/en/4/4f/Resident_Evil_4_2023_cover.jpg', '#3C3C3C', 9.4, 'Leon Returns', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (21, 'Call of Duty: Modern Warfare II', 6, NULL, 3, 2022, 'Modern military shooter.', 'https://upload.wikimedia.org/wikipedia/en/5/5f/Call_of_Duty_Modern_Warfare_II_Key_Art.jpg', '#2F4F4F', 8.0, 'Task Force 141', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (22, 'Final Fantasy XVI', 7, NULL, 3, 2023, 'Dark fantasy RPG.', 'https://upload.wikimedia.org/wikipedia/en/6/66/Final_Fantasy_XVI_cover.jpg', '#4B0082', 9.2, 'Eikonic Clash', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (23, 'Assassin''s Creed Valhalla', 4, NULL, 3, 2020, 'Viking open world action.', 'https://upload.wikimedia.org/wikipedia/en/f/f8/ACValhalla.jpg', '#006400', 8.5, 'Rise of the Vikings', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (24, 'Forza Horizon 5', 5, NULL, 1, 2021, 'Open world racing in Mexico.', 'https://upload.wikimedia.org/wikipedia/en/9/9a/Forza_Horizon_5_cover_art.jpg', '#FF4500', 9.1, 'Mexico Drive', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (25, 'The Witcher 3: Wild Hunt', 10, NULL, 3, 2015, 'Dark fantasy RPG masterpiece.', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg', '#556B2F', 9.9, 'Wild Hunt', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (26, 'Sekiro: Shadows Die Twice', 9, NULL, 3, 2019, 'Samurai action adventure.', 'https://upload.wikimedia.org/wikipedia/en/6/6e/Sekiro_art.jpg', '#A52A2A', 9.3, 'Shadows Die Twice', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (27, 'Battlefield 2042', 5, NULL, 3, 2021, 'Large-scale warfare shooter.', 'https://upload.wikimedia.org/wikipedia/en/3/3a/Battlefield_2042_cover_art.jpg', '#708090', 7.5, 'Future Warfare', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (28, 'Super Mario Odyssey', 3, NULL, 1, 2017, '3D platforming adventure.', 'https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg', '#FF0000', 9.7, 'Around the World', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (29, 'The Legend of Zelda: Tears of the Kingdom', 3, NULL, 1, 2023, 'Epic open world fantasy.', 'https://upload.wikimedia.org/wikipedia/en/9/9e/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg', '#228B22', 9.8, 'Sky and Depths', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (30, 'Gran Turismo 7', 1, NULL, 1, 2022, 'Realistic racing simulator.', 'https://upload.wikimedia.org/wikipedia/en/8/84/Gran_Turismo_7_cover.jpg', '#0000CD', 8.8, 'Precision Racing', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (31, 'Horizon Zero Dawn', 3, NULL, 2, 2017, 'Post-apocalyptic open world with robotic creatures.', 'https://upload.wikimedia.org/wikipedia/en/9/93/Horizon_Zero_Dawn.jpg', '#f4a261', 8.9, 'Open World • Action RPG', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (32, 'God of War Ragnarök', 3, NULL, 3, 2022, 'Kratos and Atreus face Norse destiny.', 'https://upload.wikimedia.org/wikipedia/en/a/a9/God_of_War_Ragnarok_cover.jpg', '#1d3557', 9.4, 'Mythology • Action', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (33, 'Cyberpunk 2077', 2, NULL, 3, 2020, 'Futuristic RPG set in Night City.', 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg', '#ffb703', 8.5, 'Sci-Fi • RPG', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (34, 'The Witcher 3: Wild Hunt', 2, NULL, 3, 2015, 'Epic fantasy RPG with branching storylines.', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg', '#6d6875', 9.6, 'Fantasy • RPG', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (35, 'Grand Theft Auto V', 4, NULL, 3, 2013, 'Open world crime epic.', 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png', '#2a9d8f', 9.7, 'Open World • Crime', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (36, 'Red Dead Redemption 2', 4, NULL, 3, 2018, 'Western open world adventure.', 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg', '#b5838d', 9.8, 'Western • Action', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (37, 'Elden Ring', 1, NULL, 3, 2022, 'Dark fantasy action RPG.', 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg', '#3a5a40', 9.5, 'Souls-like • Fantasy', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (38, 'Persona 5 Royal', 5, NULL, 2, 2020, 'Stylish JRPG about phantom thieves.', 'https://upload.wikimedia.org/wikipedia/en/1/12/Persona_5_cover_art.jpg', '#e63946', 9.3, 'JRPG • Turn-Based', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (39, 'Assassin’s Creed Valhalla', 3, NULL, 3, 2020, 'Viking era open world.', 'https://upload.wikimedia.org/wikipedia/en/a/a5/Assassin%27s_Creed_Valhalla_cover.jpg', '#457b9d', 8.4, 'Action • Open World', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (40, 'Resident Evil 4 Remake', 5, NULL, 3, 2023, 'Modern remake of survival horror classic.', 'https://upload.wikimedia.org/wikipedia/en/5/56/Resident_Evil_4_2023_cover.jpg', '#000000', 9.2, 'Horror • Survival', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (41, 'Baldur’s Gate 3', 2, NULL, 3, 2023, 'Massive CRPG based on D&D.', 'https://upload.wikimedia.org/wikipedia/en/1/12/Baldur%27s_Gate_3_cover_art.jpg', '#8d99ae', 9.6, 'CRPG • Fantasy', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (42, 'Monster Hunter World', 1, NULL, 2, 2018, 'Hunt giant monsters in a living ecosystem.', 'https://upload.wikimedia.org/wikipedia/en/1/1c/Monster_Hunter_World_cover_art.jpg', '#264653', 9.0, 'Action • Hunting', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (43, 'Final Fantasy VII Remake', 5, NULL, 2, 2020, 'Reimagining of classic JRPG.', 'https://upload.wikimedia.org/wikipedia/en/c/ce/FFVIIRemake.png', '#4a4e69', 8.8, 'JRPG • Fantasy', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (44, 'Marvel’s Spider-Man', 3, NULL, 2, 2018, 'Open world superhero action.', 'https://upload.wikimedia.org/wikipedia/en/e/e1/Spider-Man_PS4_cover.jpg', '#e63946', 9.1, 'Superhero • Action', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (45, 'Death Stranding', 3, NULL, 3, 2019, 'Post-apocalyptic delivery adventure.', 'https://upload.wikimedia.org/wikipedia/en/4/4b/Death_Stranding.jpg', '#22223b', 8.2, 'Adventure • Sci-Fi', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (46, 'Halo Infinite', 4, NULL, 2, 2021, 'Master Chief returns.', 'https://upload.wikimedia.org/wikipedia/en/5/51/Halo_Infinite.png', '#2a9d8f', 8.6, 'Shooter • Sci-Fi', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (47, 'Forza Horizon 5', 4, NULL, 1, 2021, 'Open world racing in Mexico.', 'https://upload.wikimedia.org/wikipedia/en/8/8c/Forza_Horizon_5_cover_art.jpg', '#ff6f00', 9.0, 'Racing • Open World', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (48, 'Starfield', 4, NULL, 3, 2023, 'Space exploration RPG.', 'https://upload.wikimedia.org/wikipedia/en/6/6a/Starfield_box_art.jpg', '#adb5bd', 8.3, 'Sci-Fi • RPG', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (49, 'Diablo IV', 2, NULL, 3, 2023, 'Dark action RPG dungeon crawler.', 'https://upload.wikimedia.org/wikipedia/en/1/1d/Diablo_IV_cover_art.jpg', '#6a040f', 8.7, 'Action • RPG', NULL);

INSERT INTO game (game_id, title, publisher_id, franchise_id, age_rating_id, release_year, description, cover_url, accent_color, avg_score, subtitle, score)
VALUES (50, 'Call of Duty: Modern Warfare II', 4, NULL, 3, 2022, 'Military shooter reboot.', 'https://upload.wikimedia.org/wikipedia/en/5/5c/Call_of_Duty_Modern_Warfare_II_2022_cover.jpg', '#0b090a', 8.1, 'Shooter • Military', NULL);

INSERT INTO game_genre (game_id, genre_id)
VALUES (1, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (1, 7);

INSERT INTO game_genre (game_id, genre_id)
VALUES (2, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 8);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 8);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (7, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (9, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (9, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 9);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (3, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (4, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (5, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (6, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (8, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (10, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (11, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (12, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (13, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (14, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (15, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (16, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (17, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (18, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (19, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (20, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (21, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (22, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (23, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (24, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (25, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (26, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (27, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (28, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (29, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (30, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (32, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (33, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (34, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (36, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (37, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (40, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (47, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (48, 19);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 1);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 2);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 3);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 4);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 5);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 6);

INSERT INTO game_genre (game_id, genre_id)
VALUES (50, 19);

INSERT INTO game_platform (game_id, platform_id)
VALUES (1, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (1, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (2, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (7, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (9, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (3, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (4, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (5, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (6, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (8, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (10, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (11, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (12, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (13, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (14, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (15, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (16, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (17, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (18, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (19, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (20, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (21, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (22, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (23, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (24, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (25, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (26, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (27, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (28, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (29, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (30, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (32, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (33, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (34, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (36, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (37, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (40, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (47, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (48, 6);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 2);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 3);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 4);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 5);

INSERT INTO game_platform (game_id, platform_id)
VALUES (50, 6);

INSERT INTO genre (genre_id, genre_name)
VALUES (1, 'Action');

INSERT INTO genre (genre_id, genre_name)
VALUES (2, 'RPG');

INSERT INTO genre (genre_id, genre_name)
VALUES (3, 'Adventure');

INSERT INTO genre (genre_id, genre_name)
VALUES (4, 'Shooter');

INSERT INTO genre (genre_id, genre_name)
VALUES (5, 'Open World');

INSERT INTO genre (genre_id, genre_name)
VALUES (6, 'Platformer');

INSERT INTO genre (genre_id, genre_name)
VALUES (7, 'Survival');

INSERT INTO genre (genre_id, genre_name)
VALUES (8, 'Souls-like');

INSERT INTO genre (genre_id, genre_name)
VALUES (9, 'Horror');

INSERT INTO genre (genre_id, genre_name)
VALUES (10, 'Fighting');

INSERT INTO genre (genre_id, genre_name)
VALUES (11, 'Strategy');

INSERT INTO genre (genre_id, genre_name)
VALUES (12, 'Sports');

INSERT INTO genre (genre_id, genre_name)
VALUES (19, 'Racing');

INSERT INTO genre (genre_id, genre_name)
VALUES (22, 'Fantasy');

INSERT INTO platform (platform_id, platform_name)
VALUES (1, 'PC');

INSERT INTO platform (platform_id, platform_name)
VALUES (2, 'PlayStation 5');

INSERT INTO platform (platform_id, platform_name)
VALUES (3, 'PlayStation 4');

INSERT INTO platform (platform_id, platform_name)
VALUES (4, 'Xbox Series X');

INSERT INTO platform (platform_id, platform_name)
VALUES (5, 'Xbox One');

INSERT INTO platform (platform_id, platform_name)
VALUES (6, 'Nintendo Switch');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (1, 'Sony Interactive Entertainment');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (2, 'Microsoft Studios');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (3, 'Nintendo');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (4, 'FromSoftware');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (5, 'Rockstar Games');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (6, 'CD Projekt');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (7, 'Ubisoft');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (8, 'Electronic Arts');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (9, 'Square Enix');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (10, 'Capcom');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (11, 'Bethesda Softworks');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (12, 'Activision');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (13, 'Bandai Namco');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (14, 'Warner Bros Games');

INSERT INTO publisher (publisher_id, publisher_name)
VALUES (15, 'Sega');

INSERT INTO store (store_id, store_name)
VALUES (1, 'Steam');

INSERT INTO store (store_id, store_name)
VALUES (2, 'Epic Games Store');

INSERT INTO store (store_id, store_name)
VALUES (3, 'PlayStation Store');

INSERT INTO store (store_id, store_name)
VALUES (4, 'Xbox Store');

INSERT INTO store (store_id, store_name)
VALUES (5, 'Nintendo eShop');

-- Reset sequences to correct next values (so future inserts work)
SELECT setval('age_rating_age_rating_id_seq', 5, true);
SELECT setval('cart_cart_id_seq', 1, false);
SELECT setval('comment_comment_id_seq', 1, false);
SELECT setval('content_sequence_sequence_id_seq', 1, false);
SELECT setval('developer_developer_id_seq', 11, true);
SELECT setval('franchise_franchise_id_seq', 1, false);
SELECT setval('game_game_id_seq', 50, true);
SELECT setval('game_store_listing_listing_id_seq', 1, false);
SELECT setval('game_tag_tag_id_seq', 1, false);
SELECT setval('genre_genre_id_seq', 23, true);
SELECT setval('platform_platform_id_seq', 14, true);
SELECT setval('price_history_price_history_id_seq', 1, false);
SELECT setval('publisher_publisher_id_seq', 16, true);
SELECT setval('rating_weight_weight_id_seq', 1, false);
SELECT setval('region_region_id_seq', 1, false);
SELECT setval('review_review_id_seq', 1, false);
SELECT setval('review_score_review_score_id_seq', 1, false);
SELECT setval('reviewer_reviewer_id_seq', 1, false);
SELECT setval('roadmap_item_roadmap_item_id_seq', 1, false);
SELECT setval('store_store_id_seq', 5, true);
SELECT setval('user_account_user_id_seq', 1, false);
SELECT setval('user_review_user_review_id_seq', 1, false);