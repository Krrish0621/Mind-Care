-- Added comprehensive seed data for testing and development
-- Seed data for Mental Health Platform
-- This script populates the database with sample data for testing

-- Insert sample counsellors
INSERT INTO counsellors (id, name, title, specialties, rating, review_count) VALUES
('counsellor_001', 'Dr. Sarah Johnson', 'Licensed Clinical Psychologist', ARRAY['Anxiety', 'Depression', 'Cognitive Behavioral Therapy'], 4.8, 127),
('counsellor_002', 'Dr. Michael Chen', 'Licensed Professional Counselor', ARRAY['Stress Management', 'Academic Pressure', 'Mindfulness'], 4.9, 89),
('counsellor_003', 'Dr. Emily Rodriguez', 'Licensed Marriage and Family Therapist', ARRAY['Relationship Issues', 'Family Therapy', 'Communication Skills'], 4.7, 156),
('counsellor_004', 'Dr. David Kim', 'Licensed Clinical Social Worker', ARRAY['Trauma Therapy', 'PTSD', 'Crisis Intervention'], 4.6, 203),
('counsellor_005', 'Dr. Lisa Thompson', 'Licensed Professional Counselor', ARRAY['Sleep Disorders', 'Anxiety', 'Student Mental Health'], 4.8, 94);

-- Insert counsellor availability (next 7 days)
INSERT INTO counsellor_availability (counsellor_id, date, time_slots) VALUES
('counsellor_001', CURRENT_DATE + INTERVAL '1 day', ARRAY['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM']),
('counsellor_001', CURRENT_DATE + INTERVAL '2 days', ARRAY['09:00 AM', '11:00 AM', '01:00 PM']),
('counsellor_002', CURRENT_DATE + INTERVAL '1 day', ARRAY['10:00 AM', '11:30 AM', '03:00 PM', '04:30 PM']),
('counsellor_002', CURRENT_DATE + INTERVAL '3 days', ARRAY['09:30 AM', '02:30 PM', '04:00 PM']),
('counsellor_003', CURRENT_DATE + INTERVAL '2 days', ARRAY['08:30 AM', '10:00 AM', '01:30 PM', '03:00 PM']),
('counsellor_004', CURRENT_DATE + INTERVAL '1 day', ARRAY['11:00 AM', '12:30 PM', '02:00 PM']),
('counsellor_005', CURRENT_DATE + INTERVAL '4 days', ARRAY['09:00 AM', '10:30 AM', '03:30 PM', '05:00 PM']);

-- Insert sample anonymous users
INSERT INTO users (token, is_anonymous, role) VALUES
('anon_student_001', TRUE, 'student'),
('anon_student_002', TRUE, 'student'),
('anon_student_003', TRUE, 'student'),
('admin_user_001', FALSE, 'admin'),
('counsellor_user_001', FALSE, 'counsellor');

-- Insert sample forum posts
INSERT INTO forum_posts (id, title, content, author, author_token, category, upvotes, upvoted_by) VALUES
('post_001', 'Dealing with exam anxiety - tips that worked for me', 'I wanted to share some techniques that have really helped me manage my anxiety during exam periods. First, I started using the Pomodoro technique...', 'Anonymous User #234', 'anon_student_001', 'anxiety', 12, ARRAY['anon_student_002', 'anon_student_003']),
('post_002', 'Sleep schedule tips for students', 'Has anyone else been struggling with maintaining a healthy sleep schedule? I''ve been staying up way too late and it''s affecting my mental health...', 'Anonymous User #567', 'anon_student_002', 'sleep', 8, ARRAY['anon_student_001']),
('post_003', 'Feeling overwhelmed with coursework', 'This semester has been particularly challenging and I''m feeling really overwhelmed. Does anyone have strategies for managing heavy workloads?', 'Anonymous User #890', 'anon_student_003', 'stress', 15, ARRAY['anon_student_001', 'anon_student_002']),
('post_004', 'Mindfulness exercises that actually work', 'I''ve been practicing mindfulness for a few months now and wanted to share some exercises that have made a real difference in my daily anxiety levels...', 'Anonymous User #123', 'anon_student_001', 'anxiety', 22, ARRAY['anon_student_002', 'anon_student_003']);

-- Insert sample forum comments
INSERT INTO forum_comments (id, post_id, content, author, author_token) VALUES
('comment_001', 'post_001', 'Thank you for sharing this! The Pomodoro technique has been a game-changer for me too.', 'Anonymous User #456', 'anon_student_002'),
('comment_002', 'post_001', 'I''ve tried breathing exercises but never consistently. Going to give this another shot.', 'Anonymous User #789', 'anon_student_003'),
('comment_003', 'post_002', 'I had the same issue! What helped me was setting a strict bedtime and avoiding screens 1 hour before.', 'Anonymous User #234', 'anon_student_001'),
('comment_004', 'post_003', 'Breaking tasks into smaller chunks really helps. Also, don''t forget to take breaks!', 'Anonymous User #567', 'anon_student_002');

-- Insert sample assessments (anonymized)
INSERT INTO assessments (user_token, tool, responses, score, severity, is_high_risk, recommendations) VALUES
('anon_student_001', 'PHQ-9', ARRAY[1,2,1,2,1,0,1,0,0], 8, 'Mild', FALSE, ARRAY['Consider regular exercise', 'Maintain consistent sleep schedule']),
('anon_student_002', 'GAD-7', ARRAY[2,2,3,2,1,2,1], 13, 'Moderate', FALSE, ARRAY['Practice relaxation techniques', 'Consider counseling support']),
('anon_student_003', 'PHQ-9', ARRAY[2,3,2,3,2,2,2,1,1], 18, 'Moderately Severe', TRUE, ARRAY['Seek professional counseling', 'Consider medication evaluation', 'Reach out to support network']),
('anon_student_001', 'GAD-7', ARRAY[1,1,2,1,0,1,1], 7, 'Mild', FALSE, ARRAY['Practice deep breathing exercises', 'Regular physical activity']);

-- Insert sample bookings
INSERT INTO bookings (id, student_token, counsellor_id, date, time, mode, status, notes) VALUES
('booking_001', 'anon_student_001', 'counsellor_001', CURRENT_DATE + INTERVAL '2 days', '10:30 AM', 'online', 'confirmed', 'First session - anxiety management'),
('booking_002', 'anon_student_002', 'counsellor_002', CURRENT_DATE + INTERVAL '3 days', '02:30 PM', 'offline', 'confirmed', 'Follow-up session'),
('booking_003', 'anon_student_003', 'counsellor_004', CURRENT_DATE + INTERVAL '1 day', '11:00 AM', 'online', 'pending', 'Crisis support session');

-- Insert sample reports for moderation
INSERT INTO reports (id, type, content, reporter, reporter_token, target_id, status) VALUES
('report_001', 'Forum Post', 'Inappropriate language in anxiety support thread', 'Anonymous User #234', 'anon_student_001', 'post_001', 'pending'),
('report_002', 'User Behavior', 'Spam messages in multiple chat sessions', 'System Alert', NULL, 'anon_student_002', 'resolved'),
('report_003', 'Content Violation', 'Sharing personal contact information', 'Anonymous User #567', 'anon_student_002', 'post_002', 'under-review');
