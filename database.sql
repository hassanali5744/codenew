CREATE DATABASE cybercrux;
USE cybercrux;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
ADD COLUMN profile_picture VARCHAR(255);
select * from users
ALTER TABLE users ADD COLUMN profile_pic TEXT;
ALTER TABLE users MODIFY COLUMN profile_pic LONGTEXT;
ALTER TABLE users DROP COLUMN profile_picture;

ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry BIGINT;
ALTER TABLE users
CHANGE COLUMN reset_token_expiry reset_token_expires DATETIME;
ALTER TABLE users
ADD COLUMN reset_token_expiry BIGINT;
DELETE FROM users WHERE id = 2;
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cover VARCHAR(255) NOT NULL,
    pdf VARCHAR(255),
    description TEXT
 
);
drop table books;
CREATE TABLE tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  `usage` TEXT,
  author VARCHAR(100)
);
ALTER TABLE tools
DROP COLUMN author,
ADD COLUMN image_url VARCHAR(500),
ADD COLUMN download_url VARCHAR(500);

select * from tools
truncate table users
select * from users 
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;

-- Add index for better performance
CREATE INDEX idx_google_id ON users(google_id);


CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  cover VARCHAR(500),
  pdf VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0.0,
  downloads INT DEFAULT 0,
  read_time VARCHAR(50),
  pages INT,
  published VARCHAR(10),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


select * from Books


CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_featured ON books(featured);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_downloads ON books(downloads); 


select * from practice_categories
 -- Create practice_categories table
CREATE TABLE IF NOT EXISTS practice_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    color_gradient VARCHAR(100) DEFAULT 'from-blue-500 to-cyan-500',
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select * from practice_scenarios
-- Create practice scenarios table
CREATE TABLE IF NOT EXISTS practice_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    time_estimate VARCHAR(20) NOT NULL,
    questions_count INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    likes INT DEFAULT 0,
    views INT DEFAULT 0,
    description TEXT NOT NULL,
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select *from practice_questions
-- Create practice questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scenario_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple-choice', 'coding', 'scenario', 'practical') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    points INT NOT NULL DEFAULT 0,
    time_limit INT DEFAULT 0, -- in minutes
    options JSON, -- for multiple choice questions
    correct_answer TEXT, -- for coding/scenario/practical questions
    explanation TEXT,
    code_template TEXT, -- for coding questions
    code_snippet TEXT, -- for practical questions
    scenario_context TEXT, -- for scenario questions
    expected_output TEXT, -- for coding questions
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE
);
select * from user_practice_progress
-- Create user practice progress table
CREATE TABLE IF NOT EXISTS user_practice_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scenario_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    time_taken INT DEFAULT 0, -- in seconds
    completed_at TIMESTAMP NULL,
    answers JSON, -- store user answers
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_scenario (user_id, scenario_id)
);
ALTER TABLE user_practice_progress
ADD COLUMN level INT DEFAULT 1
select * from user_practice_progress
-- Create user practice bookmarks table
CREATE TABLE IF NOT EXISTS user_practice_bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scenario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_bookmark (user_id, scenario_id)
);

-- Update category counts
UPDATE practice_categories SET count = (
    SELECT COUNT(*) FROM practice_scenarios WHERE category_key = practice_categories.key_name AND is_active = TRUE
);
select * from practice_questions
-- Create indexes for better performance
CREATE INDEX idx_scenarios_category ON practice_scenarios(category);
CREATE INDEX idx_scenarios_difficulty ON practice_scenarios(difficulty);
CREATE INDEX idx_scenarios_featured ON practice_scenarios(is_featured);
CREATE INDEX idx_questions_scenario ON practice_questions(scenario_id);
CREATE INDEX idx_questions_type ON practice_questions(question_type);
CREATE INDEX idx_progress_user ON user_practice_progress(user_id);
CREATE INDEX idx_progress_scenario ON user_practice_progress(scenario_id);
CREATE INDEX idx_bookmarks_user ON user_practice_bookmarks(user_id);

select * from practice_questions
INSERT INTO practice_questions (scenario_id, question_text, question_type, difficulty, points, time_limit, options, correct_answer, explanation, order_index) VALUES
(7, 'What is the primary purpose of memory forensics?', 'multiple-choice', 'Easy', 15, 2, '["To recover deleted files", "To analyze running processes and system state", "To decrypt encrypted data", "To repair corrupted memory"]', '1', 'Memory forensics focuses on analyzing the current state of system memory, including running processes, network connections, and system artifacts.', 1),
(7, 'Using Volatility Framework, what command would you use to list all running processes?', 'practical', 'Medium', 20, 3, NULL, 'pslist', 'The "pslist" command in Volatility lists all running processes in the memory dump.', 2)
select * from practice_scenarios
drop table Tools
select * from users
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(500), -- URL to author's image
  date DATE NOT NULL,
  read_time VARCHAR(20),      -- e.g., "10 min read"
  category VARCHAR(100),
  tags TEXT,                  -- Can be stored as comma-separated string or a separate table for normalization
  excerpt TEXT,
  content LONGTEXT,           -- HTML content
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0
);
describe user_practice_progress
select * from blogs
select * from tools
ALTER TABLE tools
MODIFY COLUMN commands JSON,
MODIFY COLUMN platforms JSON;
-- Blog 1: Roadmap
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'The Ultimate Cybersecurity Roadmap for 2025',
  'Hassan Raza',
  'https://i.pravatar.cc/150?img=1',
  '2025-07-20',
  '8 min read',
  'Cybersecurity',
  'cybersecurity,roadmap,career',
  'A complete guide to becoming a cybersecurity expert in 2025.',
  '<p>Cybersecurity is a growing field...</p>',
  TRUE,
  1200
);

-- Blog 2: Homelab Setup
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Building Your First Cybersecurity Homelab',
  'Ayesha Khan',
  'https://i.pravatar.cc/150?img=2',
  '2025-06-15',
  '6 min read',
  'Networking',
  'homelab,networking,setup',
  'Step-by-step guide to set up your own cybersecurity homelab.',
  '<p>Setting up a homelab helps you learn hands-on...</p>',
  TRUE,
  950
);

-- Blog 3: General
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Top 10 Open Source Tools for Pentesting',
  'Ali Haider',
  'https://i.pravatar.cc/150?img=3',
  '2025-05-30',
  '5 min read',
  'Tools',
  'pentesting,open source,hacking',
  'Explore the most powerful free tools for ethical hacking.',
  '<p>Open-source tools offer great value for penetration testers...</p>',
  FALSE,
  1800
);

-- Blog 4: Another Roadmap
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Red Team Roadmap: Skills You Need in 2025',
  'Sarah Imran',
  'https://i.pravatar.cc/150?img=4',
  '2025-08-01',
  '7 min read',
  'Red Team',
  'red team,roadmap,cybersecurity',
  'What you should learn to become an effective red teamer.',
  '<p>Red teaming is more than just hacking...</p>',
  FALSE,
  620
);

-- Blog 5: Homelab Tools
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Must-Have Tools for Your Homelab in 2025',
  'Usman Tariq',
  'https://i.pravatar.cc/150?img=5',
  '2025-07-10',
  '4 min read',
  'Tools',
  'homelab,tools,automation',
  'These tools will supercharge your homelab experience.',
  '<p>From virtualization to monitoring, these tools are essential...</p>',
  FALSE,
  740
);
-- Guide 1: Career Planning
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Cybersecurity Career Planning: A Step-by-Step Guide',
  'Hassan Raza',
  'https://i.pravatar.cc/150?img=6',
  '2025-07-05',
  '7 min read',
  'Career',
  'career,planning,guide,cybersecurity',
  'Plan your career in cybersecurity with this structured guide.',
  '<p>Career planning in cybersecurity starts with understanding...</p>',
  TRUE,
  1300
);

-- Guide 2: Beginner's Tutorial
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Beginner\'s Guide to Ethical Hacking',
  'Areeba Shah',
  'https://i.pravatar.cc/150?img=7',
  '2025-06-10',
  '9 min read',
  'Tutorials',
  'beginner,guide,hacking,tutorial',
  'Start your ethical hacking journey with this complete beginner\'s guide.',
  '<p>This guide covers the basics every beginner should know...</p>',
  FALSE,
  900
);

-- Guide 3: Certification Tips
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Top 5 Tips to Pass Your Cybersecurity Certifications',
  'Zain Ul Abideen',
  'https://i.pravatar.cc/150?img=8',
  '2025-08-01',
  '5 min read',
  'Certifications',
  'certification,tips,exam prep,study strategy',
  'Ace your certification exams with these effective tips.',
  '<p>Getting certified can boost your career, and here\'s how you can pass...</p>',
  TRUE,
  2000
);

-- Guide 4: Building a Portfolio
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'How to Build a Strong Cybersecurity Portfolio',
  'Ali Rehman',
  'https://i.pravatar.cc/150?img=9',
  '2025-07-18',
  '6 min read',
  'Career',
  'portfolio,guide,tips,career',
  'Demonstrate your skills with an impressive cybersecurity portfolio.',
  '<p>Your portfolio should include labs, blogs, and projects...</p>',
  FALSE,
  850
);

-- Guide 5: Resources and Learning Path
INSERT INTO blogs (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
VALUES (
  'Top Learning Resources for Aspiring Cybersecurity Analysts',
  'Fatima Noor',
  'https://i.pravatar.cc/150?img=10',
  '2025-07-01',
  '8 min read',
  'Learning',
  'learning,resources,guide,beginner',
  'A curated list of the best learning platforms and books.',
  '<p>Start learning cybersecurity from these trusted sources...</p>',
  FALSE,
  1100
);
SELECT 
        u.id,
        u.username,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed_scenarios,
        COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN ps.points END), 0) as total_points,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as average_score,
        MAX(upp.completed_at) as last_completed
       FROM users u
       LEFT JOIN user_practice_progress upp ON u.id = upp.user_id
       LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
       GROUP BY u.id, u.username
       HAVING total_points > 0
       ORDER BY total_points DESC, completed_scenarios DESC, average_score DESC
       LIMIT 50 OFFSET 0
