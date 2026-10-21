# Process Notes

This file keeps practical repository process/setup notes that were previously stored as separate root-level files.

## Git Hygiene

- Keep local secret files (for example `.env`) out of version control.
- Use `.env.example` for shareable placeholder configuration values.
- Review staged files before committing:
  ```bash
  git status
  ```

## First-Time Push Workflow

After cloning, work from the repository root:

```bash
cd big-project
git add .
git commit -m "Your change summary"
git push
```

## Repository Visibility

Repository visibility can be managed from repository settings:

```text
https://github.com/Larrykj/big-project/settings
```

Use **Settings → Change visibility** when needed.
