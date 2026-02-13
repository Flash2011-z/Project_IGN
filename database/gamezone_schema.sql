-- =========================
-- 1) USER SYSTEM
-- =========================
CREATE TABLE user_account (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlist (
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  game_id INT NOT NULL,
  added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, game_id)
);

-- =========================
-- 2) LOOKUP TABLES
-- =========================
CREATE TABLE age_rating (
  rating_id SERIAL PRIMARY KEY,
  rating_name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE franchise (
  franchise_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE publisher (
  publisher_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE developer (
  developer_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT
);

CREATE TABLE genre (
  genre_id SERIAL PRIMARY KEY,
  genre_name TEXT NOT NULL
);

CREATE TABLE platform (
  platform_id SERIAL PRIMARY KEY,
  platform_name TEXT NOT NULL
);

CREATE TABLE region (
  region_id SERIAL PRIMARY KEY,
  region_name TEXT NOT NULL
);

CREATE TABLE store (
  store_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  store_type TEXT
);

-- =========================
-- 3) GAME (backend expects this)
-- =========================
CREATE TABLE game (
  game_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  overall_score NUMERIC(3,1),
  cover_url TEXT,
  accent_color TEXT,
  release_year INT,

  publisher_id INT REFERENCES publisher(publisher_id) ON DELETE SET NULL,
  franchise_id INT REFERENCES franchise(franchise_id) ON DELETE SET NULL,
  rating_id INT REFERENCES age_rating(rating_id) ON DELETE SET NULL
);

-- =========================
-- 4) GAME RELATIONS
-- =========================
CREATE TABLE game_developer (
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  developer_id INT REFERENCES developer(developer_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, developer_id)
);

CREATE TABLE game_genre (
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  genre_id INT REFERENCES genre(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE game_platform (
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  platform_id INT REFERENCES platform(platform_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE game_release (
  release_id SERIAL PRIMARY KEY,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  region_id INT REFERENCES region(region_id) ON DELETE SET NULL,
  platform_id INT REFERENCES platform(platform_id) ON DELETE SET NULL,
  release_date DATE
);

-- =========================
-- 5) TAG SYSTEM
-- =========================
CREATE TABLE game_tag (
  tag_id SERIAL PRIMARY KEY,
  tag_name TEXT NOT NULL
);

CREATE TABLE game_tag_map (
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  tag_id INT REFERENCES game_tag(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

-- =========================
-- 6) STORE LISTING + PRICE HISTORY
-- =========================
CREATE TABLE game_store_listing (
  listing_id SERIAL PRIMARY KEY,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  store_id INT REFERENCES store(store_id) ON DELETE SET NULL,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  purchase_url TEXT,
  stock_status TEXT,

  UNIQUE (game_id, store_id)
);

CREATE TABLE price_history (
  history_id SERIAL PRIMARY KEY,
  listing_id INT REFERENCES game_store_listing(listing_id) ON DELETE CASCADE,
  price NUMERIC(10,2),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 7) REVIEWS (editorial)
-- =========================
CREATE TABLE reviewer (
  reviewer_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT
);

CREATE TABLE review (
  review_id SERIAL PRIMARY KEY,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  reviewer_id INT REFERENCES reviewer(reviewer_id) ON DELETE SET NULL,
  review_text TEXT,
  review_date DATE,
  final_score NUMERIC(3,1)
);

-- =========================
-- 8) USER REVIEWS
-- =========================
CREATE TABLE user_review (
  user_review_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  review_text TEXT,
  score NUMERIC(3,1),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (user_id, game_id)
);

CREATE TABLE user_review_like (
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  user_review_id INT REFERENCES user_review(user_review_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, user_review_id)
);

-- =========================
-- 9) COMMENTS (optional)
-- =========================
CREATE TABLE comment (
  comment_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  user_review_id INT REFERENCES user_review(user_review_id) ON DELETE CASCADE,
  parent_comment_id INT REFERENCES comment(comment_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 10) CART (optional ecommerce)
-- =========================
CREATE TABLE cart (
  cart_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_item (
  cart_id INT REFERENCES cart(cart_id) ON DELETE CASCADE,
  listing_id INT REFERENCES game_store_listing(listing_id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (cart_id, listing_id)
);

-- =========================
-- 11) EXPERIENCE (optional)
-- =========================
CREATE TABLE game_experience (
  experience_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_account(user_id) ON DELETE CASCADE,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  hours_played INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE
);

-- =========================
-- 12) CONTENT SEQUENCE + ROADMAP (optional)
-- =========================
CREATE TABLE content_sequence (
  sequence_id SERIAL PRIMARY KEY,
  franchise_id INT REFERENCES franchise(franchise_id) ON DELETE CASCADE,
  content_title TEXT NOT NULL,
  sequence_number INT
);

CREATE TABLE roadmap_item (
  roadmap_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT,
  item_type TEXT,
  status TEXT,
  expected_date DATE,
  game_id INT REFERENCES game(game_id) ON DELETE CASCADE,
  franchise_id INT REFERENCES franchise(franchise_id) ON DELETE CASCADE
);
