# Development Notes - TheNerveVineClean

## Project Overview
**Goal**: Herbal/naturopathic website with automated affiliate marketing system
**Timeline**: 6 months to earning money and focusing on content creation
**Current Status**: Foundation established, ready for merchant API framework implementation

## Current Session Summary (Latest)
**Date**: [Current Date]
**Focus**: Completed heretical file purge - removed static data that duplicated database functionality
**Achievements**:
- ✅ Purged static symptoms data from `/src/app/symptoms/page.tsx` - replaced with database-driven API calls
- ✅ Purged static symptoms data from `/src/app/herbs/page.tsx` - replaced with database-driven API calls  
- ✅ Purged static fallback product data from `/src/app/symptoms/[slug]/page.tsx` - made fully database-driven
- ✅ Verified all remaining static data is intentional (mock data for development, marketing content, etc.)
- ✅ Confirmed database-driven APIs are working for symptoms, herbs, and supplements

## Heretical File Purge Summary
**Completed Purge Operations**:
1. **Symptoms Page (`/src/app/symptoms/page.tsx`)**: Removed static symptoms array (23 hardcoded symptoms) and replaced with `getSymptoms()` function that fetches from `/api/symptoms`
2. **Herbs Page (`/src/app/herbs/page.tsx`)**: Removed static symptoms array and replaced with database-driven symptoms fetching
3. **Individual Symptom Page (`/src/app/symptoms/[slug]/page.tsx`)**: Removed static fallback product data and made fully database-driven

**Files Confirmed as Non-Heretical**:
- Blog page static data: Intentional content management system
- Main page static data: Marketing content, not duplicating database functionality
- Admin mock data: Development/testing tools, not production data
- Type definitions: TypeScript interfaces, not static data

**Database-Driven Systems Verified**:
- ✅ Symptoms API (`/api/symptoms`) - fully functional
- ✅ Herbs API (`/api/herbs`) - fully functional  
- ✅ Supplements API (`/api/supplements`) - fully functional
- ✅ Search API (`/api/search`) - fully functional

## Technical Architecture
- **Frontend**: Next.js with TypeScript and React
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: Neon Postgres
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Current Project State
### Completed Features
- Basic Next.js application structure
- Database schema with Prisma (herbs, supplements, symptoms)
- Admin interface for content management
- Basic herb and supplement pages
- Search functionality
- Content import/export systems
- **NEW**: Fully database-driven symptom system (no static data)

### In Progress
- Merchant API framework design and implementation
- Affiliate marketing system architecture
- Product hunt integration planning

## Next Major Milestone: Merchant API Framework
**Timeline**: 7-10 days for complete framework
**Components**:
1. API abstraction & interface design (0.5-1 day)
2. Mock data & mock services (1 day)
3. Database schema & migrations (1 day)
4. API routing & endpoints (1-1.5 days)
5. UI & admin tools (2-3 days)
6. Environment & configuration (0.5 day)
7. Testing & documentation (1 day)
8. Real API integration (1-2 days when keys arrive)

## User Preferences & Working Style
### Communication
- **Manual Operations**: Step-by-step instructions with examples
- **AI Tasks**: High-level summaries with timeframes, risks, options
- **Technical Level**: Assume basic concepts, avoid jargon
- **Documentation**: Always update README.md, DEV_NOTES.md, PROJECT_LOG.md

### Decision Making
- **Automatic Changes**: Only with good session continuity and clear agreement
- **Permission Required**: For unagreed changes or new directions
- **Options**: Multiple approaches welcome but limit to maintain progress
- **Problem Solving**: Generate options, don't be myopic

### Code Quality
- **Approach**: Comprehensive solutions over quick wins
- **Standards**: TypeScript, minimal lint errors, typed code
- **Best Practices**: Always preferred over shortcuts
- **Data Conservation**: Never delete content unless explicitly specified

## Session Management Guidelines
### For AI Assistant
- Review latest session summary before starting
- Check DEV_NOTES.md for current priorities
- Update documentation as work progresses
- Provide achievement summaries for morale
- Maintain awareness of codebase interdependencies

### For User
- Share session summaries when returning
- Update priorities in DEV_NOTES.md
- Provide feedback on AI performance
- Communicate any changes made outside AI sessions

## Current Priorities
1. **Immediate**: Begin merchant API framework implementation
2. **Short-term**: Complete affiliate marketing system architecture
3. **Medium-term**: Integrate real merchant APIs as keys become available
4. **Long-term**: Optimize for revenue generation and content creation

## Technical Debt & Considerations
- Ensure all new code follows TypeScript best practices
- Maintain data integrity in all database operations
- Consider impact of changes on existing features
- Test thoroughly before deployments

## Environment & Configuration
- Keep .env.example updated with all required variables
- Document all API keys and endpoints as they become available
- Maintain clear separation between development and production configs

## Documentation Standards
- **README.md**: High-level project overview and setup
- **DEV_NOTES.md**: Current session, progress, and next steps
- **PROJECT_LOG.md**: Detailed technical decisions and changes
- **cursorrules.md**: AI collaboration guidelines and preferences
- **USER_PROFILE.md**: User-specific context and preferences

## Success Metrics
- **Technical**: Clean, maintainable code with minimal errors
- **Functional**: Working affiliate marketing system
- **Business**: Revenue generation from affiliate links
- **User Experience**: Smooth, professional website experience

---

*Last Updated: [Current Date]*
*Next Review: [Next Session]* 