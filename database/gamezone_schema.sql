
CREATE TABLE age_rating (
    age_rating_id SERIAL PRIMARY KEY,
    rating_code TEXT NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE publisher (
    publisher_id SERIAL PRIMARY KEY,
    publisher_name TEXT NOT NULL UNIQUE
);


CREATE TABLE franchise (
    franchise_id SERIAL PRIMARY KEY,
    franchise_name TEXT NOT NULL UNIQUE
);



CREATE TABLE genre (
    genre_id SERIAL PRIMARY KEY,
    genre_name TEXT NOT NULL UNIQUE
);



CREATE TABLE platform (
    platform_id SERIAL PRIMARY KEY,
    platform_name TEXT NOT NULL UNIQUE
);


CREATE TABLE developer (
    developer_id SERIAL PRIMARY KEY,
    developer_name TEXT NOT NULL UNIQUE
);


CREATE TABLE game_tag (
    tag_id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL UNIQUE
);


CREATE TABLE region (
    region_id SERIAL PRIMARY KEY,
    region_name TEXT NOT NULL UNIQUE
);


CREATE TABLE store (
    store_id SERIAL PRIMARY KEY,
    store_name TEXT NOT NULL UNIQUE
);


CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    publisher_id INT NOT NULL,
    franchise_id INT,
    age_rating_id INT NOT NULL,
    release_year INT,
    description TEXT,

    CONSTRAINT fk_game_publisher
        FOREIGN KEY (publisher_id)
        REFERENCES publisher(publisher_id),

    CONSTRAINT fk_game_franchise
        FOREIGN KEY (franchise_id)
        REFERENCES franchise(franchise_id),

    CONSTRAINT fk_game_age_rating
        FOREIGN KEY (age_rating_id)
        REFERENCES age_rating(age_rating_id)
);

CREATE TABLE game_genre (
    game_id INT NOT NULL,
    genre_id INT NOT NULL,

    PRIMARY KEY (game_id, genre_id),

    CONSTRAINT fk_game_genre_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_genre_genre
        FOREIGN KEY (genre_id)
        REFERENCES genre(genre_id)
        ON DELETE CASCADE
);


CREATE TABLE game_platform (
    game_id INT NOT NULL,
    platform_id INT NOT NULL,

    PRIMARY KEY (game_id, platform_id),

    CONSTRAINT fk_game_platform_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_platform_platform
        FOREIGN KEY (platform_id)
        REFERENCES platform(platform_id)
        ON DELETE CASCADE
);


CREATE TABLE game_developer (
    game_id INT NOT NULL,
    developer_id INT NOT NULL,

    PRIMARY KEY (game_id, developer_id),

    CONSTRAINT fk_game_developer_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_developer_developer
        FOREIGN KEY (developer_id)
        REFERENCES developer(developer_id)
        ON DELETE CASCADE
);


CREATE TABLE game_tag_map (
    game_id INT NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (game_id, tag_id),

    CONSTRAINT fk_game_tag_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_tag_tag
        FOREIGN KEY (tag_id)
        REFERENCES game_tag(tag_id)
        ON DELETE CASCADE
);


CREATE TABLE game_release (
    game_id INT NOT NULL,
    region_id INT NOT NULL,
    platform_id INT NOT NULL,
    release_date DATE NOT NULL,

    PRIMARY KEY (game_id, region_id, platform_id),

    CONSTRAINT fk_release_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_release_region
        FOREIGN KEY (region_id)
        REFERENCES region(region_id),

    CONSTRAINT fk_release_platform
        FOREIGN KEY (platform_id)
        REFERENCES platform(platform_id)
);




CREATE TABLE reviewer (
    reviewer_id SERIAL PRIMARY KEY,
    reviewer_name TEXT NOT NULL,
    outlet TEXT
);


CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    final_score NUMERIC(3,1),
    review_date DATE,

    CONSTRAINT fk_review_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES reviewer(reviewer_id)
        ON DELETE CASCADE
);


CREATE TABLE review_score (
    review_score_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    category TEXT NOT NULL,
    score NUMERIC(3,1) NOT NULL,

    CONSTRAINT fk_score_review
        FOREIGN KEY (review_id)
        REFERENCES review(review_id)
        ON DELETE CASCADE
);



CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE
);


CREATE TABLE user_rating (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 10),
    rating_date DATE DEFAULT CURRENT_DATE,

    PRIMARY KEY (user_id, game_id),

    CONSTRAINT fk_user_rating_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_rating_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE
);


CREATE TABLE user_review (
    user_review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    review_text TEXT NOT NULL,
    spoiler_flag BOOLEAN DEFAULT FALSE,
    review_date DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_user_review_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_review_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE
);


CREATE TABLE user_review_like (
    user_id INT NOT NULL,
    user_review_id INT NOT NULL,
    liked_date DATE DEFAULT CURRENT_DATE,

    PRIMARY KEY (user_id, user_review_id),

    CONSTRAINT fk_like_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_like_review
        FOREIGN KEY (user_review_id)
        REFERENCES user_review(user_review_id)
        ON DELETE CASCADE
);



CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    user_review_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    comment_text TEXT NOT NULL,
    comment_date DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_comment_review
        FOREIGN KEY (user_review_id)
        REFERENCES user_review(user_review_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_parent
        FOREIGN KEY (parent_comment_id)
        REFERENCES comment(comment_id)
        ON DELETE CASCADE
);


CREATE TABLE player_profile (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    hours_played INT CHECK (hours_played >= 0),
    skill_level TEXT,

    PRIMARY KEY (user_id, game_id),

    CONSTRAINT fk_profile_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profile_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE
);




CREATE TABLE game_experience (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    difficulty_score NUMERIC(2,1) CHECK (difficulty_score BETWEEN 0 AND 10),
    enjoyment_score NUMERIC(2,1) CHECK (enjoyment_score BETWEEN 0 AND 10),

    PRIMARY KEY (user_id, game_id),

    CONSTRAINT fk_experience_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_experience_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE
);




CREATE TABLE rating_weight (
    weight_id SERIAL PRIMARY KEY,
    min_days INT NOT NULL,
    max_days INT NOT NULL,
    weight_factor NUMERIC(3,2) NOT NULL
);



CREATE TABLE game_store_listing (
    listing_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    store_id INT NOT NULL,
    current_price NUMERIC(10,2) NOT NULL,
    product_url TEXT,

    CONSTRAINT fk_listing_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_listing_store
        FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_game_store
        UNIQUE (game_id, store_id)
);



CREATE TABLE price_history (
    price_history_id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_price_listing
        FOREIGN KEY (listing_id)
        REFERENCES game_store_listing(listing_id)
        ON DELETE CASCADE
);






CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_date DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE
);




CREATE TABLE cart_item (
    cart_id INT NOT NULL,
    listing_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),

    PRIMARY KEY (cart_id, listing_id),

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES cart(cart_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_listing
        FOREIGN KEY (listing_id)
        REFERENCES game_store_listing(listing_id)
        ON DELETE CASCADE
);





CREATE TABLE wishlist (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    added_date DATE DEFAULT CURRENT_DATE,

    PRIMARY KEY (user_id, game_id),

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_wishlist_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE
);




CREATE TABLE roadmap_item (
    roadmap_item_id SERIAL PRIMARY KEY,
    game_id INT,
    franchise_id INT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    planned_date DATE,

    CONSTRAINT fk_roadmap_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_roadmap_franchise
        FOREIGN KEY (franchise_id)
        REFERENCES franchise(franchise_id)
        ON DELETE CASCADE
);





CREATE TABLE content_sequence (
    sequence_id SERIAL PRIMARY KEY,
    franchise_id INT NOT NULL,
    game_id INT NOT NULL,
    sequence_number INT NOT NULL,
    release_date DATE,

    CONSTRAINT fk_sequence_franchise
        FOREIGN KEY (franchise_id)
        REFERENCES franchise(franchise_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sequence_game
        FOREIGN KEY (game_id)
        REFERENCES game(game_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_franchise_sequence
        UNIQUE (franchise_id, sequence_number)
);


