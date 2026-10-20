-- ============================================================
-- PORTFOLIO DYNAMIC BACKEND — Supabase SQL Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- ─────────────────────────────────────────
-- 1. ADMIN AUTHORIZATION TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read/manage admin_users
CREATE POLICY "Admin users can read admin_users"
  ON admin_users FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 2. PROFILE / ABOUT TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Lokesh Gembali',
  title TEXT NOT NULL DEFAULT 'Fullstack Developer',
  roles TEXT[] NOT NULL DEFAULT ARRAY['Fullstack Developer', 'ML Developer', 'Coder'],
  bio TEXT NOT NULL DEFAULT 'I am a full-stack developer.',
  profile_image_url TEXT DEFAULT NULL,
  resume_url TEXT DEFAULT 'https://drive.google.com/file/d/1zUGG01BzJdMqyafP9W6LnLWXfbUt63mL/view?usp=drivesdk',
  github_url TEXT DEFAULT 'https://github.com/Lokesh-04-code',
  linkedin_url TEXT DEFAULT 'https://in.linkedin.com/in/lokesh-gembali-74b574305',
  leetcode_url TEXT DEFAULT 'https://leetcode.com/u/Lokesh738/',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/lokeshsai_04',
  email TEXT DEFAULT 'Gembali.lokesh2004@gmail.com',
  location TEXT DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read profile"
  ON profile FOR SELECT USING (true);

CREATE POLICY "Admins can update profile"
  ON profile FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert profile"
  ON profile FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 3. SKILLS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT USING (true);

CREATE POLICY "Admins can insert skills"
  ON skills FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update skills"
  ON skills FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete skills"
  ON skills FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 4. EXPERIENCE TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  employment_type TEXT DEFAULT 'Full-time',
  start_date TEXT NOT NULL,
  end_date TEXT DEFAULT NULL,
  is_current BOOLEAN DEFAULT false,
  description TEXT DEFAULT NULL,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  logo_url TEXT DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experience"
  ON experience FOR SELECT USING (true);

CREATE POLICY "Admins can insert experience"
  ON experience FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update experience"
  ON experience FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete experience"
  ON experience FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 5. EDUCATION TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT DEFAULT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT DEFAULT NULL,
  grade TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  logo_url TEXT DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read education"
  ON education FOR SELECT USING (true);

CREATE POLICY "Admins can insert education"
  ON education FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update education"
  ON education FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete education"
  ON education FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 6. PROJECTS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT DEFAULT NULL,
  github_url TEXT DEFAULT NULL,
  live_url TEXT DEFAULT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 7. CONTACT MESSAGES TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 8. STORAGE BUCKET SETUP (run in SQL Editor)
-- ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read portfolio-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update portfolio-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete portfolio-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ─────────────────────────────────────────
-- 9. HELPER FUNCTION: Check if current user is admin
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────
-- 10. SEED INITIAL DATA
-- ─────────────────────────────────────────

-- Profile
INSERT INTO profile (name, title, roles, bio, resume_url, github_url, linkedin_url, leetcode_url, instagram_url, email)
VALUES (
  'Lokesh Gembali',
  'Fullstack Developer',
  ARRAY['Fullstack Developer', 'ML Developer', 'Coder'],
  'I am a full-stack developer. Skilled in both front-end and back-end development, I specialize in the MERN stack and java(spring boot) to create seamless user experiences and efficient solutions and ai/ml explorer. Strong foundation in DSA.',
  'https://drive.google.com/file/d/1zUGG01BzJdMqyafP9W6LnLWXfbUt63mL/view?usp=drivesdk',
  'https://github.com/Lokesh-04-code',
  'https://in.linkedin.com/in/lokesh-gembali-74b574305',
  'https://leetcode.com/u/Lokesh738/',
  'https://www.instagram.com/lokeshsai_04',
  'Gembali.lokesh2004@gmail.com'
);

-- Skills
INSERT INTO skills (name, category, display_order) VALUES
  ('HTML', 'Frontend', 1),
  ('CSS', 'Frontend', 2),
  ('JavaScript', 'Frontend', 3),
  ('React JS', 'Frontend', 4),
  ('Tailwind CSS', 'Frontend', 5),
  ('Node JS', 'Backend', 1),
  ('Express JS', 'Backend', 2),
  ('MySQL', 'Backend', 3),
  ('MongoDB', 'Backend', 4),
  ('SpringBoot', 'Backend', 5),
  ('C', 'Languages', 1),
  ('Java', 'Languages', 2),
  ('Python', 'Languages', 3),
  ('Git', 'Tools', 1),
  ('GitHub', 'Tools', 2),
  ('VS Code', 'Tools', 3),
  ('Postman', 'Tools', 4),
  ('Docker', 'Tools', 5),
  ('Vercel', 'Tools', 6),
  ('Netlify', 'Tools', 7),
  ('Machine Learning', 'Others', 1),
  ('DSA', 'Others', 2);

-- Experience
INSERT INTO experience (company, role, employment_type, start_date, end_date, is_current, description, skills, display_order)
VALUES (
  'GOOGLE developers Club(VIT AP)',
  'Frontend Developer',
  'Part-time',
  'April 2024',
  '2025',
  false,
  'Developed dynamic and scalable web applications using the REACT, handling both frontend development for the club website.',
  ARRAY['HTML', 'CSS', 'JavaScript', 'React JS', 'Node JS', 'Tailwind CSS', 'MongoDb'],
  0
);

-- Education
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, grade, description, display_order)
VALUES
  ('VIT-AP, Amaravathi', 'Bachelor of Technology', 'Computer Science and Engineering (CSE)', 'August 2023', 'March 2027', '9.15', 'I am currently pursuing my Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE) from VIT AP. Throughout my studies, I have been actively exploring key areas such as Data Structures and Algorithms (DSA), MERN stack development, and Machine Learning (ML).', 0),
  ('Sasi junior collage, Vishakapatnam', 'APSCHE', 'Physics, Chemistry, Mathematics (MPC)', 'June 2021', 'May 2023', '98%', 'I completed my class 12 education from Sasi Junior Collage, Vishakapatnam, under the State board, where I studied Physics, Chemistry, and Mathematics (MPC).', 1),
  ('Suresh High School, Parvathipuram', 'Andhra Pradesh State Board', 'Class 10', 'June 2010', 'March 2021', '598 Marks', 'I completed my Class 10 education from Suresh School, located in Parvathipuram. My curriculum included core subjects such as Mathematics, Science, Social Studies, English, and a second language.', 2);

-- Projects
INSERT INTO projects (title, description, tags, github_url, live_url, is_featured, display_order)
VALUES
  ('FinMate(Finance Tracker)', 'Built a full-stack(java backend) finance tracker for students to manage income, expenses, and budgets. Features include JWT auth, encrypted passwords, interactive dashboards (Recharts), recurring transactions, and dynamic filtering. Stack: React.js, Tailwind CSS, Express.js, MongoDB Atlas.', ARRAY['HTML', 'CSS', 'JavaScript', 'React JS', 'SpringBoot', 'MongoDb'], 'https://github.com/Lokesh-04-code/FinMate_java', 'https://studysave.netlify.app/', true, 0),
  ('Microservices Architecture (Spring Boot)', 'Developed a microservices-based backend system using Spring Boot and Docker. Implemented three independent services (Company, Job, Review) registered with Eureka Server for service discovery. Each service uses its own PostgreSQL database. Built RESTful APIs with full CRUD operations and containerized the entire system using Docker Compose.', ARRAY['Java', 'Spring Boot', 'Microservices', 'Eureka', 'Docker', 'PostgreSQL', 'REST API'], 'https://github.com/Lokesh-04-code/microservices-project', '', false, 1),
  ('Hospital Management', 'MERN stack project enabling hospitals to manage doctor-patient appointments efficiently. Prevents slot clashes with real-time validation. Admins can add doctors and manage their availability. Clean UI for patients to book slots and doctors to view schedules.', ARRAY['React JS', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS', 'JavaScript', 'tailwind css'], 'https://github.com/Lokesh-04-code/HealtCare_appointment_booking', 'https://safeslot.netlify.app/', false, 2),
  ('Movie Recommends', 'The Movie Recommendation Website helps users discover new films similar to the ones they already enjoy. By entering the name of a movie, the system suggests 5 related movies based on the storyline, director, or title. With a clean interface and smart recommendations, it makes finding your next favorite movie quick and easy.(only Hollywood)', ARRAY['Machine Learning'], 'https://github.com/Lokesh-04-code/movie_recommendation', 'https://finddmovie.netlify.app/', false, 3);
