# 🤖 Automation Safety Protocol

## 🚨 CRITICAL RULES
- **NEVER** push directly to `main` branch
- **ALWAYS** work on `feature/automation` branch
- **REQUIRE** manual review before merging
- **TEST** all changes before deployment

## 📋 Pre-Automation Checklist
- [ ] Create feature branch from `develop`
- [ ] Set up automated testing
- [ ] Configure branch protection rules
- [ ] Establish rollback procedures

## 🔄 Workflow
1. **Development:** `feature/automation` branch
2. **Testing:** Automated tests + manual review
3. **Integration:** Merge to `develop` branch
4. **Production:** Manual merge to `main` only

## 🛡️ Safety Measures
- **Database backups** before any schema changes
- **Environment isolation** for testing
- **Rollback scripts** for critical changes
- **Monitoring** for unexpected behavior

## ⚠️ Red Flags
- Large file changes without explanation
- Database schema modifications
- Environment variable changes
- Package.json modifications

## 🎯 Automation Scope
### ✅ ALLOWED
- Code improvements
- Bug fixes
- Documentation updates
- Test additions
- UI enhancements

### ❌ FORBIDDEN
- Database migrations (without approval)
- Environment changes
- Production deployments
- Security modifications
- Package updates (major versions)

## 📞 Emergency Contacts
- **Rollback:** `git reset --hard HEAD~1`
- **Branch Reset:** `git checkout main && git branch -D feature/automation`
- **Database Restore:** Use backup scripts
