-- Seed one admin user so the app is immediately usable after first migration.
-- Password: Admin@1234  (BCrypt hash generated via BCryptPasswordEncoder in a throwaway test)
INSERT INTO users (email, password, role, created_at)
VALUES (
    'admin@dealership.com',
    '$2a$10$BRJvOwa/mNuD8P9yI4ZaG.sBDMSvFV1y6bvo.oK2DzdUHALzZSmYe',
    'ADMIN',
    now()
);
