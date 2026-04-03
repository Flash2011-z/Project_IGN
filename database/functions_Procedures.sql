--function-1

CREATE OR REPLACE FUNCTION fn_get_game_review_stats(p_game_id INT)
RETURNS TABLE (
    avg_score NUMERIC,
    review_count INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(
            ROUND(
                (
                    SUM(
                        ur.score *
                        CASE
                            WHEN COALESCE(ua.role, 'user') = 'admin' OR ugpb.user_id IS NOT NULL THEN 1.5
                            ELSE 1.0
                        END
                    )::numeric
                    /
                    NULLIF(
                        SUM(
                            CASE
                                WHEN COALESCE(ua.role, 'user') = 'admin' OR ugpb.user_id IS NOT NULL THEN 1.5
                                ELSE 1.0
                            END
                        )::numeric,
                        0
                    )
                ),
                1
            ),
            0
        ) AS avg_score,
        COUNT(*)::INT AS review_count
    FROM user_review ur
    LEFT JOIN user_account ua
        ON ua.user_id = ur.user_id
    LEFT JOIN user_game_player_badge ugpb
        ON ugpb.user_id = ur.user_id
       AND ugpb.game_id = ur.game_id
    WHERE ur.game_id = p_game_id;
END;
$$;

--function-2

CREATE OR REPLACE FUNCTION fn_get_game_wishlist_count(p_game_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*)::INT
    INTO v_count
    FROM wishlist
    WHERE game_id = p_game_id;

    RETURN v_count;
END;
$$;


--procedure-1

CREATE OR REPLACE PROCEDURE sp_assign_player_badge(
    IN p_user_id INT,
    IN p_game_id INT,
    IN p_granted_by INT,
    IN p_note TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM user_account WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM game WHERE game_id = p_game_id
    ) THEN
        RAISE EXCEPTION 'Game not found';
    END IF;

    INSERT INTO user_game_player_badge (
        user_id,
        game_id,
        granted_by,
        granted_at,
        note
    )
    VALUES (
        p_user_id,
        p_game_id,
        p_granted_by,
        NOW(),
        p_note
    )
    ON CONFLICT (user_id, game_id)
    DO UPDATE SET
        granted_by = EXCLUDED.granted_by,
        granted_at = EXCLUDED.granted_at,
        note = EXCLUDED.note;
END;
$$;

--procedure-2

CREATE OR REPLACE PROCEDURE sp_checkout_cart(
    IN p_user_id INT,
    IN p_customer_name TEXT,
    IN p_customer_email TEXT,
    IN p_billing_address TEXT,
    IN p_payment_method TEXT,
    INOUT p_order_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_amount NUMERIC(12,2) := 0;
    v_total_items INT := 0;
    v_currency TEXT := 'USD';
    v_cart_count INT := 0;
    rec RECORD;
BEGIN
    -- Check user exists
    IF NOT EXISTS (
        SELECT 1
        FROM user_account
        WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Check cart has items
    SELECT COUNT(*)
    INTO v_cart_count
    FROM cart c
    JOIN cart_item ci ON c.cart_id = ci.cart_id
    WHERE c.user_id = p_user_id;

    IF v_cart_count = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    -- Calculate totals
    SELECT
        COALESCE(SUM(ci.quantity * gsl.price), 0),
        COALESCE(SUM(ci.quantity), 0),
        COALESCE(MIN(gsl.currency), 'USD')
    INTO v_total_amount, v_total_items, v_currency
    FROM cart c
    JOIN cart_item ci ON c.cart_id = ci.cart_id
    JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
    WHERE c.user_id = p_user_id;

    -- Create order
    INSERT INTO customer_order (
        user_id,
        total_amount,
        total_items,
        currency,
        payment_method,
        customer_name,
        customer_email,
        billing_address,
        order_status,
        created_at
    )
    VALUES (
        p_user_id,
        v_total_amount,
        v_total_items,
        v_currency,
        p_payment_method,
        p_customer_name,
        p_customer_email,
        p_billing_address,
        'confirmed',
        NOW()
    )
    RETURNING order_id INTO p_order_id;

    -- Insert order items
    FOR rec IN
        SELECT
            ci.listing_id,
            g.game_id,
            ci.quantity,
            gsl.price,
            (ci.quantity * gsl.price) AS subtotal
        FROM cart c
        JOIN cart_item ci ON c.cart_id = ci.cart_id
        JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
        JOIN game g ON gsl.game_id = g.game_id
        WHERE c.user_id = p_user_id
        ORDER BY ci.listing_id ASC
    LOOP
        INSERT INTO order_item (
            order_id,
            listing_id,
            game_id,
            quantity,
            unit_price,
            subtotal
        )
        VALUES (
            p_order_id,
            rec.listing_id,
            rec.game_id,
            rec.quantity,
            rec.price,
            rec.subtotal
        );
    END LOOP;

    -- Clear cart
    DELETE FROM cart_item
    WHERE cart_id IN (
        SELECT cart_id
        FROM cart
        WHERE user_id = p_user_id
    );
END;
$$;