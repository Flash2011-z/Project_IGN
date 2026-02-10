
INSERT INTO age_rating (rating_code, description)
VALUES ('E', 'Everyone');

INSERT INTO publisher (publisher_name)
VALUES ('Test Publisher');

INSERT INTO franchise (franchise_name)
VALUES ('Test Franchise');

INSERT INTO genre (genre_name)
VALUES ('Action');

INSERT INTO platform (platform_name)
VALUES ('PC');

INSERT INTO developer (developer_name)
VALUES ('Studio A');

INSERT INTO game_tag (tag_name)
VALUES ('Editor Choice');

INSERT INTO region (region_name)
VALUES ('US');

INSERT INTO store (store_name)
VALUES ('Steam');


INSERT INTO game (
    title,
    publisher_id,
    franchise_id,
    age_rating_id,
    release_year,
    description
)
VALUES (
    'Test Game',
    1,
    1,
    1,
    2024,
    'Sample game used for testing the GameZone platform'
);


INSERT INTO game_genre (game_id, genre_id)
VALUES (1, 1);

INSERT INTO game_platform (game_id, platform_id)
VALUES (1, 1);

INSERT INTO game_developer (game_id, developer_id)
VALUES (1, 1);

INSERT INTO game_tag_map (game_id, tag_id)
VALUES (1, 1);


INSERT INTO game_release (
    game_id,
    region_id,
    platform_id,
    release_date
)
VALUES (
    1,
    1,
    1,
    '2024-06-01'
);


INSERT INTO reviewer (reviewer_name, outlet)
VALUES ('John Doe', 'Game Reviews Weekly');

INSERT INTO review (
    game_id,
    reviewer_id,
    final_score,
    review_date
)
VALUES (
    1,
    1,
    8.5,
    '2024-06-10'
);

INSERT INTO review_score (
    review_id,
    category,
    score
)
VALUES
    (1, 'Gameplay', 8.5),
    (1, 'Graphics', 8.0),
    (1, 'Story', 7.5);


INSERT INTO user_account (username, email)
VALUES ('testuser', 'testuser@example.com');


INSERT INTO user_rating (user_id, game_id, rating)
VALUES (1, 1, 9.0);

INSERT INTO user_review (
    user_id,
    game_id,
    review_text,
    spoiler_flag
)
VALUES (
    1,
    1,
    'Great gameplay and smooth performance.',
    FALSE
);

INSERT INTO user_review_like (user_id, user_review_id)
VALUES (1, 1);

INSERT INTO comment (
    user_review_id,
    user_id,
    comment_text
)
VALUES (
    1,
    1,
    'Totally agree with this review!'
);


INSERT INTO player_profile (
    user_id,
    game_id,
    hours_played,
    skill_level
)
VALUES (
    1,
    1,
    25,
    'Intermediate'
);

INSERT INTO game_experience (
    user_id,
    game_id,
    difficulty_score,
    enjoyment_score
)
VALUES (
    1,
    1,
    7.5,
    9.0
);


INSERT INTO game_store_listing (
    game_id,
    store_id,
    current_price,
    product_url
)
VALUES (
    1,
    1,
    59.99,
    'https://store.steampowered.com/app/testgame'
);

INSERT INTO price_history (
    listing_id,
    price
)
VALUES (
    1,
    59.99
);


INSERT INTO cart (user_id)
VALUES (1);

INSERT INTO cart_item (
    cart_id,
    listing_id,
    quantity
)
VALUES (
    1,
    1,
    1
);

INSERT INTO wishlist (user_id, game_id)
VALUES (1, 1);


INSERT INTO roadmap_item (
    game_id,
    franchise_id,
    title,
    description,
    status,
    planned_date
)
VALUES (
    1,
    1,
    'Expansion Pack 1',
    'New missions and characters',
    'Planned',
    '2024-12-01'
);

INSERT INTO content_sequence (
    franchise_id,
    game_id,
    sequence_number,
    release_date
)
VALUES (
    1,
    1,
    1,
    '2024-06-01'
);


INSERT INTO rating_weight (
    min_days,
    max_days,
    weight_factor
)
VALUES
    (0, 30, 1.00),
    (31, 180, 0.85),
    (181, 365, 0.70);
