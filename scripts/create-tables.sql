-- Added comprehensive SQL schema for mental health platform
-- Mental Health Platform Database Schema
-- This script creates all necessary tables for the platform

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    token VARCHAR(50) UNIQUE NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'counsellor')),
    email VARCHAR(255) UNIQUE,
    firebase_uid VARCHAR(255) UNIQUE,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions for storing conversation history
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_token VARCHAR(50) NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_token) REFERENCES users(token) ON DELETE CASCADE
);

-- Chat messages within sessions
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'bot')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- Assessment results for PHQ-9 and GAD-7
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    user_token VARCHAR(50) NOT NULL,
    tool VARCHAR(10) NOT NULL CHECK (tool IN ('PHQ-9', 'GAD-7')),
    responses INTEGER[] NOT NULL,
    score INTEGER NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe')),
    is_high_risk BOOLEAN DEFAULT FALSE,
    recommendations TEXT[],
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_token) REFERENCES users(token) ON DELETE CASCADE
);

-- Counsellors and their information
CREATE TABLE IF NOT EXISTS counsellors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    specialties TEXT[],
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counsellor availability slots
CREATE TABLE IF NOT EXISTS counsellor_availability (
    id SERIAL PRIMARY KEY,
    counsellor_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time_slots TEXT[] NOT NULL,
    FOREIGN KEY (counsellor_id) REFERENCES counsellors(id) ON DELETE CASCADE
);

-- Booking appointments
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(100) PRIMARY KEY,
    student_token VARCHAR(50) NOT NULL,
    counsellor_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('online', 'offline')),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_token) REFERENCES users(token) ON DELETE CASCADE,
    FOREIGN KEY (counsellor_id) REFERENCES counsellors(id) ON DELETE CASCADE
);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    author_token VARCHAR(50) NOT NULL,
    category VARCHAR(20) DEFAULT 'general' CHECK (category IN ('general', 'anxiety', 'depression', 'sleep', 'stress', 'study')),
    upvotes INTEGER DEFAULT 0,
    upvoted_by TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_moderated BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_token) REFERENCES users(token) ON DELETE CASCADE
);

-- Forum post comments
CREATE TABLE IF NOT EXISTS forum_comments (
    id VARCHAR(100) PRIMARY KEY,
    post_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    author_token VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_token) REFERENCES users(token) ON DELETE CASCADE
);

-- Forum post flags/reports
CREATE TABLE IF NOT EXISTS forum_flags (
    id VARCHAR(100) PRIMARY KEY,
    post_id VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    reporter VARCHAR(100) NOT NULL,
    reporter_token VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

-- General reports for moderation
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Forum Post', 'User Behavior', 'Content Violation')),
    content TEXT NOT NULL,
    reporter VARCHAR(100) NOT NULL,
    reporter_token VARCHAR(50),
    target_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'under-review', 'dismissed')),
    admin_notes TEXT,
    resolved_by VARCHAR(50),
    resolved_at TIMESTAMP,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_token ON users(token);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_token ON chat_sessions(user_token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_token ON assessments(user_token);
CREATE INDEX IF NOT EXISTS idx_assessments_high_risk ON assessments(is_high_risk);
CREATE INDEX IF NOT EXISTS idx_bookings_student_token ON bookings(student_token);
CREATE INDEX IF NOT EXISTS idx_bookings_counsellor_id ON bookings(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_token ON forum_posts(author_token);
CREATE INDEX IF NOT EXISTS idx_forum_posts_timestamp ON forum_posts(timestamp);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
