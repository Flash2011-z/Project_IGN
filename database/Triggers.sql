-- trigger 1, avg score

CREATE OR REPLACE FUNCTION fn_update_game_avg_score()
RETURNS TRIGGER AS $$
DECLARE
    target_game_id INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_game_id := OLD.game_id;
    ELSE
        target_game_id := NEW.game_id;
    END IF;

    UPDATE game
    SET avg_score = (
        SELECT ROUND(AVG(score)::numeric, 1)
        FROM user_review
        WHERE game_id = target_game_id
    )
    WHERE game_id = target_game_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_game_avg_score ON user_review;

CREATE TRIGGER trg_update_game_avg_score
AFTER INSERT OR UPDATE OR DELETE
ON user_review
FOR EACH ROW
EXECUTE FUNCTION fn_update_game_avg_score();



--trigger -2, review time

CREATE OR REPLACE FUNCTION fn_set_user_review_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_user_review_updated_at ON user_review;

CREATE TRIGGER trg_set_user_review_updated_at
BEFORE UPDATE
ON user_review
FOR EACH ROW
EXECUTE FUNCTION fn_set_user_review_updated_at();

--trigger 3, comment time

CREATE OR REPLACE FUNCTION fn_set_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_comment_updated_at ON comment;

CREATE TRIGGER trg_set_comment_updated_at
BEFORE UPDATE
ON comment
FOR EACH ROW
EXECUTE FUNCTION fn_set_comment_updated_at();


--trigger 4, valid review score

CREATE OR REPLACE FUNCTION fn_validate_user_review_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.score < 0 OR NEW.score > 10 THEN
        RAISE EXCEPTION 'Review score must be between 0 and 10';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_user_review_score ON user_review;

CREATE TRIGGER trg_validate_user_review_score
BEFORE INSERT OR UPDATE
ON user_review
FOR EACH ROW
EXECUTE FUNCTION fn_validate_user_review_score();

--trigger 5, can't like own review

CREATE OR REPLACE FUNCTION fn_prevent_self_like_review()
RETURNS TRIGGER AS $$
DECLARE
    review_owner_id INT;
BEGIN
    SELECT user_id
    INTO review_owner_id
    FROM user_review
    WHERE user_review_id = NEW.user_review_id;

    IF review_owner_id IS NOT NULL AND review_owner_id = NEW.user_id THEN
        RAISE EXCEPTION 'You cannot like your own review';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_self_like_review ON user_review_like;

CREATE TRIGGER trg_prevent_self_like_review
BEFORE INSERT
ON user_review_like
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_self_like_review();

--trigger 6, can't like their own comment

CREATE OR REPLACE FUNCTION fn_prevent_self_like_comment()
RETURNS TRIGGER AS $$
DECLARE
    comment_owner_id INT;
BEGIN
    SELECT user_id
    INTO comment_owner_id
    FROM comment
    WHERE comment_id = NEW.comment_id;

    IF comment_owner_id IS NOT NULL AND comment_owner_id = NEW.user_id THEN
        RAISE EXCEPTION 'You cannot like your own comment';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_self_like_comment ON comment_like;

CREATE TRIGGER trg_prevent_self_like_comment
BEFORE INSERT
ON comment_like
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_self_like_comment();

