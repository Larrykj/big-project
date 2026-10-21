# Contributing to OmniLogistics

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/omnilogistics-kenya.git
   ```
3. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Setup

### Prerequisites
- Docker Desktop
- Node.js 18+
- Git

### Installation
```bash
# Clone the repo
cd big-project

# Start backend services
docker-compose up -d

# Start frontend
cd frontend-portal
npm install
npm run dev
```

## 🎯 Coding Standards

### TypeScript/React
- Use TypeScript for all new components
- Follow the existing file structure
- Use functional components with hooks
- Add JSDoc comments for complex functions

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add M-Pesa payment integration
fix: resolve map marker positioning bug
docs: update API documentation
chore: upgrade dependencies
```

### Code Style
- Run `npm run lint` before committing
- Use Prettier for formatting (configured)
- Keep functions small and focused
- Write meaningful variable names

## 🧪 Testing

### Before submitting a PR:
- [ ] Code builds without errors
- [ ] Linting passes (`npm run lint`)
- [ ] Manual testing completed
- [ ] No console errors in browser
- [ ] Dark mode works
- [ ] Mobile responsive

## 📝 Pull Request Process

1. **Update documentation** if adding features
2. **Add screenshots** for UI changes
3. **Describe your changes** clearly
4. **Link related issues**
5. Wait for review from maintainers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Reporting Bugs

Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots
- Environment details (OS, browser)

## 💡 Feature Requests

We welcome ideas! Open an issue with:
- **Problem:** What problem does this solve?
- **Solution:** Your proposed solution
- **Alternatives:** Other options considered
- **Context:** Why is this important for Kenya?

## 🇰🇪 Kenya-Specific Contributions

We especially welcome:
- M-Pesa integration improvements
- Swahili translations
- Kenya-specific routing optimizations
- Local payment gateway support
- Mobile money integrations

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards others

## 🎓 Learning Resources

New to:
- **React?** [React Docs](https://react.dev)
- **Docker?** [Docker Tutorial](https://docs.docker.com/get-started/)
- **TypeScript?** [TS Handbook](https://www.typescriptlang.org/docs/)

## ⚖️ License

By contributing, you agree your contributions will be licensed under the MIT License.

---

**Questions?** Open a discussion or reach out to maintainers.

**Thank you for making OmniLogistics better!** 🚀🇰🇪
