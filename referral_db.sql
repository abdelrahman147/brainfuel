-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrer_id BIGINT NOT NULL,
  invited_id BIGINT NOT NULL,
  invited_name VARCHAR(255),
  invited_photo VARCHAR(255),
  created_at INT NOT NULL,
  UNIQUE KEY unique_ref (referrer_id, invited_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create collections table for tracking user collections
CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  collection_type ENUM('evil', 'angel', 'other') NOT NULL,
  item_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_collection (user_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create points table for tracking user points
CREATE TABLE IF NOT EXISTS points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  points INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create points_history table for tracking point transactions
CREATE TABLE IF NOT EXISTS points_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  points INT NOT NULL,
  type ENUM('referral', 'collection', 'other') NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 