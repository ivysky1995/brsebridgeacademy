# Hướng dẫn Deploy — BrSE Bridge Academy

## Bước 1: Cài đặt dependencies

```bash
cd brsebridgeacademy
npm install
```

---

## Bước 2: Tạo Supabase Project

1. Vào https://supabase.com → **New Project**
2. Đặt tên project: `brsebridgeacademy`
3. Chọn region: **Northeast Asia (Tokyo)** — gần Nhật Bản
4. Lưu lại **Database Password** (dùng sau)

---

## Bước 3: Chạy Database Migrations

Vào **Supabase Dashboard → SQL Editor**, chạy theo thứ tự:

### 3a. Schema (001_initial_schema.sql)
Copy toàn bộ nội dung file `supabase/migrations/001_initial_schema.sql` → Paste → Run

### 3b. RLS Policies (002_rls_policies.sql)
Copy toàn bộ nội dung file `supabase/migrations/002_rls_policies.sql` → Paste → Run

### 3c. Seed Data (003_seed_data.sql) [optional nhưng nên chạy để test]
Copy toàn bộ nội dung file `supabase/migrations/003_seed_data.sql` → Paste → Run

---

## Bước 4: Cấu hình Environment Variables

Lấy từ **Supabase Dashboard → Settings → API**:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  ← giữ bí mật, không commit

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="BrSE Bridge Academy"
```

---

## Bước 5: Cấu hình Supabase Auth

### Email Auth (mặc định bật sẵn)
Vào **Authentication → Settings**:
- Site URL: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
- Redirect URLs: thêm `http://localhost:3000/auth/callback`

### Google OAuth (optional)
1. Vào https://console.cloud.google.com → **APIs & Credentials → OAuth 2.0**
2. Authorized redirect URIs: `https://xxxxx.supabase.co/auth/v1/callback`
3. Copy Client ID và Client Secret
4. Vào **Supabase → Authentication → Providers → Google** → Enable → Paste

---

## Bước 6: Tạo tài khoản Admin

Sau khi đăng ký user đầu tiên, vào **Supabase SQL Editor**:

```sql
-- Thay YOUR_EMAIL bằng email đã đăng ký
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');
```

---

## Bước 7: Chạy Dev Server

```bash
npm run dev
# → http://localhost:3000
```

---

## Bước 8: Deploy lên Vercel

### 8a. Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/brsebridgeacademy.git
git push -u origin main
```

### 8b. Deploy trên Vercel

1. Vào https://vercel.com → **New Project**
2. Import GitHub repo
3. **Framework Preset**: Next.js (auto-detect)
4. **Environment Variables** — thêm tất cả từ `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`
   - `NEXT_PUBLIC_APP_NAME` = `BrSE Bridge Academy`
5. Click **Deploy**

### 8c. Cập nhật Supabase Redirect URLs

Sau khi deploy xong, vào **Supabase → Authentication → Settings**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: thêm `https://your-app.vercel.app/auth/callback`

---

## Checklist trước khi go live

```
□ Chạy npm run build thành công (0 errors)
□ Migrations 001, 002, 003 đã chạy trong Supabase
□ .env.local được điền đầy đủ
□ Tài khoản admin đã được set role = 'admin'
□ Google OAuth redirect URL đã được cập nhật
□ Vercel environment variables đã thêm đủ
□ Supabase Site URL đã cập nhật sang production URL
□ Test đăng ký → đăng nhập → xem bài học → mark complete
```

---

## Cấu trúc URLs

| URL | Mô tả |
|---|---|
| `/` | Landing page |
| `/courses` | Danh sách khóa học |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/dashboard` | Dashboard user |
| `/learn/[lessonId]` | Xem bài học (yêu cầu login) |
| `/vocabulary` | Quản lý vocab decks |
| `/admin` | Admin dashboard (role=admin) |
| `/admin/lessons` | Quản lý bài học |
| `/admin/lessons/new` | Tạo bài học mới |

---

## Lệnh tiện ích

```bash
# Dev
npm run dev

# Type check
npm run type-check

# Build & check lỗi trước deploy
npm run build

# Lint
npm run lint
```
