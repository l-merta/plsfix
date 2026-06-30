/*
CREATE DATABASE IF NOT EXISTS plsfix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE plsfix;
*/

CREATE TABLE orders (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid       CHAR(36)     NOT NULL DEFAULT (UUID()),
    email      VARCHAR(255) NOT NULL,
    product    VARCHAR(255) NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_orders_uuid (uuid),
    INDEX idx_orders_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE newsletters (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid       CHAR(36)     NOT NULL DEFAULT (UUID()),
    email      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_newsletters_uuid (uuid),
    UNIQUE KEY uq_newsletters_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE guestbook (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid       CHAR(36)     NOT NULL DEFAULT (UUID()),
    name       VARCHAR(255) NOT NULL,
    text       TEXT         NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_guestbook_uuid (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*
CREATE DATABASE plsfix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE plsfix-stage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'daniel_lane'@'%' IDENTIFIED BY 'ULKm_4B_';
GRANT ALL PRIVILEGES ON plsfix.* TO 'daniel_lane'@'%';
GRANT ALL PRIVILEGES ON plsfix_stage.* TO 'daniel_lane'@'%';
FLUSH PRIVILEGES;
*/