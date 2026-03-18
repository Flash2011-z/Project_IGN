CREATE TABLE IF NOT EXISTS customer_order (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_items INT NOT NULL DEFAULT 0,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  payment_method VARCHAR(50),
  customer_name VARCHAR(120),
  customer_email VARCHAR(160),
  billing_address TEXT,
  order_status VARCHAR(40) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_item (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES customer_order(order_id) ON DELETE CASCADE,
  listing_id INT NOT NULL REFERENCES game_store_listing(listing_id),
  game_id INT NOT NULL REFERENCES game(game_id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);