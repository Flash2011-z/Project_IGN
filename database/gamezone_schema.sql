-- Clean schema extracted from public.sql
-- Run this first (creates tables + constraints).

CREATE TABLE age_rating (
    age_rating_id SERIAL PRIMARY KEY,
    rating_code TEXT NOT NULL,
    description TEXT,
    CONSTRAINT age_rating_rating_code_key UNIQUE (rating_code)
);

CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT cart_user_id_key UNIQUE (user_id)
);

CREATE TABLE cart_item (
    cart_id INT NOT NULL,
    listing_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT cart_item_pkey PRIMARY KEY (cart_id, listing_id),
    CONSTRAINT cart_item_quantity_check CHECK (quantity > 0)
);

CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    user_review_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    comment_text TEXT NOT NULL,
    comment_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE content_sequence (
    sequence_id SERIAL PRIMARY KEY,
    franchise_id INT NOT NULL,
    game_id INT NOT NULL,
    sequence_number INT NOT NULL,
    release_date DATE,
    CONSTRAINT uq_franchise_sequence UNIQUE (franchise_id, sequence_number)
);

CREATE TABLE developer (
    developer_id SERIAL PRIMARY KEY,
    developer_name TEXT NOT NULL,
    CONSTRAINT developer_developer_name_key UNIQUE (developer_name)
);

CREATE TABLE franchise (
    franchise_id SERIAL PRIMARY KEY,
    franchise_name TEXT NOT NULL,
    CONSTRAINT franchise_franchise_name_key UNIQUE (franchise_name)
);

CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    publisher_id INT NOT NULL,
    franchise_id INT,
    age_rating_id INT NOT NULL,
    release_year INT,
    description TEXT,
    cover_url TEXT,
    accent_color TEXT,
    avg_score NUMERIC(3,1) DEFAULT 0.0,
    subtitle TEXT,
    score NUMERIC(3,1)
);

CREATE TABLE game_developer (
    game_id INT NOT NULL,
    developer_id INT NOT NULL,
    CONSTRAINT game_developer_pkey PRIMARY KEY (game_id, developer_id)
);

CREATE TABLE game_experience (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    difficulty_score NUMERIC(2,1),
    enjoyment_score NUMERIC(2,1),
    CONSTRAINT game_experience_pkey PRIMARY KEY (user_id, game_id),
    CONSTRAINT game_experience_difficulty_score_check CHECK (difficulty_score >= 0::numeric AND difficulty_score <= 10::numeric),
    CONSTRAINT game_experience_enjoyment_score_check CHECK (enjoyment_score >= 0::numeric AND enjoyment_score <= 10::numeric)
);

CREATE TABLE game_genre (
    game_id INT NOT NULL,
    genre_id INT NOT NULL,
    CONSTRAINT game_genre_pkey PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE game_platform (
    game_id INT NOT NULL,
    platform_id INT NOT NULL,
    CONSTRAINT game_platform_pkey PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE game_release (
    game_id INT NOT NULL,
    region_id INT NOT NULL,
    platform_id INT NOT NULL,
    release_date DATE NOT NULL,
    CONSTRAINT game_release_pkey PRIMARY KEY (game_id, region_id, platform_id)
);

CREATE TABLE game_store_listing (
    listing_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    store_id INT NOT NULL,
    current_price NUMERIC(10,2) NOT NULL,
    product_url TEXT,
    CONSTRAINT uq_game_store UNIQUE (game_id, store_id)
);

CREATE TABLE game_tag (
    tag_id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL,
    CONSTRAINT game_tag_tag_name_key UNIQUE (tag_name)
);

CREATE TABLE game_tag_map (
    game_id INT NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT game_tag_map_pkey PRIMARY KEY (game_id, tag_id)
);

CREATE TABLE genre (
    genre_id SERIAL PRIMARY KEY,
    genre_name TEXT NOT NULL,
    CONSTRAINT genre_genre_name_key UNIQUE (genre_name)
);

CREATE TABLE platform (
    platform_id SERIAL PRIMARY KEY,
    platform_name TEXT NOT NULL,
    CONSTRAINT platform_platform_name_key UNIQUE (platform_name)
);

CREATE TABLE player_profile (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    hours_played INT,
    skill_level TEXT,
    CONSTRAINT player_profile_pkey PRIMARY KEY (user_id, game_id),
    CONSTRAINT player_profile_hours_played_check CHECK (hours_played >= 0)
);

CREATE TABLE price_history (
    price_history_id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    price_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE publisher (
    publisher_id SERIAL PRIMARY KEY,
    publisher_name TEXT NOT NULL,
    CONSTRAINT publisher_publisher_name_key UNIQUE (publisher_name)
);

CREATE TABLE rating_weight (
    weight_id SERIAL PRIMARY KEY,
    min_days INT NOT NULL,
    max_days INT NOT NULL,
    weight_factor NUMERIC(3,2) NOT NULL
);

CREATE TABLE region (
    region_id SERIAL PRIMARY KEY,
    region_name TEXT NOT NULL,
    CONSTRAINT region_region_name_key UNIQUE (region_name)
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    final_score NUMERIC(3,1),
    review_date DATE
);

CREATE TABLE review_score (
    review_score_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    category TEXT NOT NULL,
    score NUMERIC(3,1) NOT NULL
);

CREATE TABLE reviewer (
    reviewer_id SERIAL PRIMARY KEY,
    reviewer_name TEXT NOT NULL,
    outlet TEXT
);

CREATE TABLE roadmap_item (
    roadmap_item_id SERIAL PRIMARY KEY,
    game_id INT,
    franchise_id INT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    planned_date DATE
);

CREATE TABLE store (
    store_id SERIAL PRIMARY KEY,
    store_name TEXT NOT NULL,
    CONSTRAINT store_store_name_key UNIQUE (store_name)
);

CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT user_account_username_key UNIQUE (username),
    CONSTRAINT user_account_email_key UNIQUE (email)
);

CREATE TABLE user_rating (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating NUMERIC(2,1) NOT NULL,
    rating_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT user_rating_pkey PRIMARY KEY (user_id, game_id),
    CONSTRAINT user_rating_rating_check CHECK (rating >= 0::numeric AND rating <= 10::numeric)
);

CREATE TABLE user_review (
    user_review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    review_text TEXT NOT NULL,
    spoiler_flag BOOLEAN DEFAULT false,
    review_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE user_review_like (
    user_id INT NOT NULL,
    user_review_id INT NOT NULL,
    liked_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT user_review_like_pkey PRIMARY KEY (user_id, user_review_id)
);

CREATE TABLE wishlist (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    added_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT wishlist_pkey PRIMARY KEY (user_id, game_id)
);

-- Foreign keys
ALTER TABLE cart ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE cart_item ADD CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart (cart_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE cart_item ADD CONSTRAINT fk_cart_item_listing FOREIGN KEY (listing_id) REFERENCES game_store_listing (listing_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE comment ADD CONSTRAINT fk_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES comment (comment_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE comment ADD CONSTRAINT fk_comment_review FOREIGN KEY (user_review_id) REFERENCES user_review (user_review_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE comment ADD CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE content_sequence ADD CONSTRAINT fk_sequence_franchise FOREIGN KEY (franchise_id) REFERENCES franchise (franchise_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE content_sequence ADD CONSTRAINT fk_sequence_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game ADD CONSTRAINT fk_game_age_rating FOREIGN KEY (age_rating_id) REFERENCES age_rating (age_rating_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE game ADD CONSTRAINT fk_game_franchise FOREIGN KEY (franchise_id) REFERENCES franchise (franchise_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE game ADD CONSTRAINT fk_game_publisher FOREIGN KEY (publisher_id) REFERENCES publisher (publisher_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE game_developer ADD CONSTRAINT fk_game_developer_developer FOREIGN KEY (developer_id) REFERENCES developer (developer_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_developer ADD CONSTRAINT fk_game_developer_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_experience ADD CONSTRAINT fk_experience_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_experience ADD CONSTRAINT fk_experience_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_genre ADD CONSTRAINT fk_game_genre_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_genre ADD CONSTRAINT fk_game_genre_genre FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_platform ADD CONSTRAINT fk_game_platform_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_platform ADD CONSTRAINT fk_game_platform_platform FOREIGN KEY (platform_id) REFERENCES platform (platform_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_release ADD CONSTRAINT fk_release_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_release ADD CONSTRAINT fk_release_platform FOREIGN KEY (platform_id) REFERENCES platform (platform_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE game_release ADD CONSTRAINT fk_release_region FOREIGN KEY (region_id) REFERENCES region (region_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE game_store_listing ADD CONSTRAINT fk_listing_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_store_listing ADD CONSTRAINT fk_listing_store FOREIGN KEY (store_id) REFERENCES store (store_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_tag_map ADD CONSTRAINT fk_game_tag_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE game_tag_map ADD CONSTRAINT fk_game_tag_tag FOREIGN KEY (tag_id) REFERENCES game_tag (tag_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE player_profile ADD CONSTRAINT fk_profile_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE player_profile ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE price_history ADD CONSTRAINT fk_price_listing FOREIGN KEY (listing_id) REFERENCES game_store_listing (listing_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE review ADD CONSTRAINT fk_review_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE review ADD CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES reviewer (reviewer_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE review_score ADD CONSTRAINT fk_score_review FOREIGN KEY (review_id) REFERENCES review (review_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE roadmap_item ADD CONSTRAINT fk_roadmap_franchise FOREIGN KEY (franchise_id) REFERENCES franchise (franchise_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE roadmap_item ADD CONSTRAINT fk_roadmap_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_rating ADD CONSTRAINT fk_user_rating_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_rating ADD CONSTRAINT fk_user_rating_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_review ADD CONSTRAINT fk_user_review_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_review ADD CONSTRAINT fk_user_review_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_review_like ADD CONSTRAINT fk_like_review FOREIGN KEY (user_review_id) REFERENCES user_review (user_review_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE user_review_like ADD CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_game FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES user_account (user_id) ON DELETE CASCADE ON UPDATE NO ACTION;