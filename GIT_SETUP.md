# Git Setup Guide for OmniLogistics

## 📋 What Gets Ignored (Already configured in .gitignore)

The `.gitignore` file is already set up to exclude:

### 1. **Dependencies** (Never commit these - they're huge!)
- `node_modules/` - Frontend packages
- `vendor/` - Ruby gems
- `.mvn/`, `target/` - Java dependencies

### 2. **Build Outputs** (Generated files)
- `dist/`, `build/`, `out/` - Compiled code
- `bin/`, `obj/` - .NET binaries
- `*.class`, `*.jar` - Java compiled files

### 3. **Environment Variables** (⚠️ CRITICAL - Contains secrets!)
- `.env` files - Database passwords, API keys
- Never commit these or your credentials will be public!

### 4. **Database Data**
- `mysql_data/`, `mongo_data/` - Docker volumes
- Local database files

### 5. **IDE Configuration**
- `.vscode/`, `.idea/` - Editor settings
- These vary per developer

---

## 🚀 How to Push to GitHub

### Step 1: Initialize Git (if not already done)
```bash
cd "C:\Users\HomePC\Desktop\My Projects\Big Project\OmniLogistics"
git init
```

### Step 2: Add all files (gitignore will automatically exclude unwanted files)
```bash
git add .
```

### Step 3: Make your first commit
```bash
git commit -m "Initial commit: OmniLogistics Kenya platform"
```

### Step 4: Create a new repository on GitHub
1. Go to https://github.com/new
2. Name it: `omnilogistics-kenya`
3. Don't initialize with README (we have one)
4. Click "Create repository"

### Step 5: Connect and push
```bash
git remote add origin https://github.com/YOUR_USERNAME/omnilogistics-kenya.git
git branch -M main
git push -u origin main
```

---

## 🔐 IMPORTANT: Before Pushing

### Create a `.env.example` file (template without real secrets)
```bash
# In OmniLogistics folder, create .env.example:

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password

# M-Pesa (Kenya)
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
```

**Then commit this example:**
```bash
git add .env.example
git commit -m "Add environment variables template"
```

### Never commit:
- Real passwords
- API keys
- Database credentials
- M-Pesa secrets

---

## 📦 What WILL be committed (Good to share)

✅ Source code (`.tsx`, `.java`, `.cs`, `.py`, etc.)
✅ Configuration files (`docker-compose.yml`, `package.json`)
✅ Documentation (`README.md`)
✅ Dockerfiles
✅ `.gitignore` itself

---

## 🔄 Recommended: Add a Pre-commit Hook

Create `.git/hooks/pre-commit` to prevent accidental secrets:

```bash
#!/bin/sh
if git diff --cached --name-only | grep -E '\.env$'; then
  echo "ERROR: Attempting to commit .env file!"
  echo "Please remove it and use .env.example instead"
  exit 1
fi
```

---

## 📝 Common Git Commands

```bash
# Check what will be committed
git status

# See what's ignored
git status --ignored

# Add specific files
git add filename.txt

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull
```

---

## ⚠️ If You Accidentally Committed Secrets

1. **Remove from history:**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

2. **Force push (⚠️ Dangerous if others are using the repo):**
```bash
git push origin --force --all
```

3. **Immediately rotate all exposed credentials!**

---

## 📚 Additional Resources

- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Managing M-Pesa API keys securely](https://developer.safaricom.co.ke/docs)

---

## 🎯 Quick Checklist Before First Push

- [ ] `.gitignore` is in place
- [ ] No `.env` files in staging area (`git status`)
- [ ] Created `.env.example` with dummy values
- [ ] README.md is complete with setup instructions
- [ ] Tested that `git status` shows no sensitive files
- [ ] All services build successfully locally

---

**Happy coding! 🚀🇰🇪**
