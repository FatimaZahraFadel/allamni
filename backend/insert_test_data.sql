-- Insert test data for the education platform

-- Insert test teacher
INSERT INTO users (name, email, hashed_password, role, language_preference, created_at, updated_at)
VALUES ('Test Teacher', 'teacher@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'teacher', 'en', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Insert test students
INSERT INTO users (name, email, hashed_password, role, language_preference, created_at, updated_at)
VALUES 
('Alice Johnson', 'alice@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW()),
('Bob Smith', 'bob@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW()),
('Carol Davis', 'carol@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW()),
('David Wilson', 'david@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW()),
('Emma Brown', 'emma@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Insert test school (assuming teacher ID is 1)
INSERT INTO schools (name, address, teacher_id, created_at, updated_at)
SELECT 'Test School', '123 Test Street', u.id, NOW(), NOW()
FROM users u 
WHERE u.email = 'teacher@test.com'
ON DUPLICATE KEY UPDATE name = name;

-- Insert test class
INSERT INTO classes (name, description, school_id, created_at, updated_at)
SELECT 'Mathematics 101', 'Basic mathematics class', s.id, NOW(), NOW()
FROM schools s 
WHERE s.name = 'Test School'
ON DUPLICATE KEY UPDATE name = name;

-- Insert another test class
INSERT INTO classes (name, description, school_id, created_at, updated_at)
SELECT 'English Literature', 'Introduction to English literature', s.id, NOW(), NOW()
FROM schools s 
WHERE s.name = 'Test School'
ON DUPLICATE KEY UPDATE name = name;
