-- Migration 002: Row Level Security Policies

-- ─── Profiles ────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ─── Tracks & Courses (public read) ─────────────────────────────────────────
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks_select_published" ON tracks
  FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "tracks_all_admin" ON tracks
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_select_published" ON courses
  FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "courses_all_admin" ON courses
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── Lessons ─────────────────────────────────────────────────────────────────
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons_select_published" ON lessons
  FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "lessons_all_admin" ON lessons
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── Quizzes ─────────────────────────────────────────────────────────────────
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes_select_published" ON quizzes
  FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "quizzes_all_admin" ON quizzes
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_questions_select" ON quiz_questions
  FOR SELECT USING (true);
CREATE POLICY "quiz_questions_all_admin" ON quiz_questions
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── Quiz Attempts (own only) ────────────────────────────────────────────────
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_attempts_own" ON quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

-- ─── Lesson Progress (own only) ─────────────────────────────────────────────
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_progress_own" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- ─── Vocabulary (public read, admin write) ───────────────────────────────────
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocabulary_select" ON vocabulary FOR SELECT USING (true);
CREATE POLICY "vocabulary_all_admin" ON vocabulary
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── User Vocab Decks ────────────────────────────────────────────────────────
ALTER TABLE user_vocab_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocab_decks_select" ON user_vocab_decks
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "vocab_decks_manage_own" ON user_vocab_decks
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_vocab_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocab_items_own" ON user_vocab_items
  FOR ALL USING (
    deck_id IN (SELECT id FROM user_vocab_decks WHERE user_id = auth.uid())
  );

-- ─── Notes (own only) ───────────────────────────────────────────────────────
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_own" ON user_notes
  FOR ALL USING (auth.uid() = user_id);
