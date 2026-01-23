# Security Policy

## 🔒 Reporting a Vulnerability

**Please DO NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email:** security@omnilogistics.ke (or create a placeholder email)
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depending on severity (Critical: 7 days, High: 30 days)

## 🛡️ Security Best Practices

### For Developers

1. **Never commit secrets:**
   - No API keys in code
   - Use `.env` files (which are gitignored)
   - Use GitHub Secrets for CI/CD

2. **Dependencies:**
   - Run `npm audit` regularly
   - Update dependencies monthly
   - Review security advisories

3. **Authentication:**
   - Use JWT with secure secrets
   - Implement rate limiting
   - Hash passwords with bcrypt

4. **M-Pesa Integration:**
   - Store API keys in environment variables
   - Use HTTPS for all requests
   - Validate webhook signatures

### For Deployment

- Enable HTTPS/TLS
- Use Docker secrets for production
- Implement CORS properly
- Add security headers (Helmet.js)
- Regular security audits

## 🚨 Known Security Considerations

### Current Status (Development)
- ⚠️ Sample data uses mock credentials
- ⚠️ Docker services run on localhost
- ⚠️ No rate limiting implemented yet
- ⚠️ Authentication not yet implemented

### Before Production
- [ ] Implement JWT authentication
- [ ] Add rate limiting (express-rate-limit)
- [ ] Enable HTTPS
- [ ] Secure Docker volumes
- [ ] Add CSRF protection
- [ ] Implement input validation
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules

## 🔐 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [M-Pesa Security Guidelines](https://developer.safaricom.co.ke/docs#security)

---

**Thank you for helping keep OmniLogistics secure!** 🛡️
