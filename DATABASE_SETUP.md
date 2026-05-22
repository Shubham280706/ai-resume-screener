# Database Setup Guide

This project uses **PostgreSQL** with **Prisma ORM**.

## Quick Start

### Option 1: Local PostgreSQL Setup

#### Prerequisites
- Install [PostgreSQL](https://www.postgresql.org/download/)
- PostgreSQL running and accessible

#### Steps
1. **Create a database:**
   ```bash
   createdb resume_screener
   ```

2. **Update .env.local with your local database URL:**
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/resume_screener"
   ```

3. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **(Optional) View database with Prisma Studio:**
   ```bash
   npx prisma studio
   ```

---

### Option 2: Supabase Setup (Recommended for Production)

#### Prerequisites
- Free [Supabase](https://supabase.com) account

#### Steps

1. **Create a new Supabase project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose region
   - Save your password securely

2. **Get your database connection string**
   - In Supabase dashboard, go to **Settings → Database → Connection Strings**
   - Copy the **URI** (PostgreSQL dialect)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

3. **Update .env.local:**
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

4. **Run Prisma migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **Start the app:**
   ```bash
   npm run dev
   ```

---

## Database Schema

### Job Model
- `id`: Unique identifier (CUID)
- `title`: Job title
- `description`: Full job description
- `location`: Job location (optional)
- `seniority_level`: Junior/Mid/Senior/Lead
- `min_experience`: Minimum years required
- `max_experience`: Maximum years (for seniority ceiling)
- `required_skills`: Array of required technical skills
- `preferred_skills`: Array of nice-to-have skills
- `status`: "open" or "closed"
- `candidates`: Related Candidate records
- `created_at`: Timestamp
- `updated_at`: Auto-updated timestamp

### Candidate Model
- `id`: Unique identifier (CUID)
- `jobId`: Foreign key to Job
- `candidate_name`: Full name
- `email`: Email address (optional)
- `years_of_experience`: Detected from resume
- `seniority_level`: Junior/Mid/Senior/Lead
- `scoring`: JSON with `{ total_score, skills_score, experience_score, seniority_score, education_score }`
- `semantic_match`: JSON with skill matching details
- `analysis`: JSON with AI analysis insights
- `job_requirement`: JSON with parsed job requirements
- `recommendation`: STRONG_YES / YES / MAYBE / NO
- `recommendation_message`: Human-readable message
- `status`: "pending" / "reviewing" / "rejected" / "accepted"
- `created_at`: Timestamp
- `updated_at`: Auto-updated timestamp

---

## Environment Variables

### Required
- `GROQ_API_KEY`: Your Groq API key (get from https://console.groq.com)
- `DATABASE_URL`: PostgreSQL connection string

### Optional
- `NODE_ENV`: Set to "development" or "production"

---

## Troubleshooting

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `pg_isready`
- For Supabase, verify password and connection string format

### "Table does not exist"
- Run migrations: `npx prisma migrate dev`
- Or view migration status: `npx prisma migrate status`

### "Connection pooling issues" (Supabase)
- Supabase has connection limits
- Use PgBouncer in "Transaction mode" for serverless apps

### View database contents
```bash
npx prisma studio
```
Opens http://localhost:5555 with visual database browser

---

## Useful Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (deletes all data!)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open interactive database browser
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

---

## Next Steps

1. Set up your database (local or Supabase)
2. Update DATABASE_URL in .env.local
3. Run `npx prisma migrate dev`
4. Start the app: `npm run dev`
5. Upload resumes and create jobs!
