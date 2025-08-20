# CursorRules for TheNerveVineClean

## Core Principles
- **Preserve Functionality:** Never remove or overwrite existing features or UI elements unless explicitly authorized. All refactors must preserve existing functionality unless otherwise agreed.
- **Data Integrity:** Never delete content, features, or functions unless explicitly specified. Always prioritize data conservation and technical debt prevention.
- **Best Practices:** Use TypeScript, functional React components, and proper naming conventions. Prefer well-constructed, maintainable code over shortcuts.
- **Batch Operations:** Group file operations and changes to minimize interruptions and approval requests.
- **Automation:** Use scripts and automation for routine tasks to reduce manual steps and prevent confirmation fatigue.

## AI Behavior Restrictions
- **Manual Mode Only:** AI must wait for explicit instructions before making changes
- **No Auto-Suggestions:** AI cannot propose improvements or refactoring
- **Implementation Only:** AI focuses on execution, not design decisions
- **Preserve Working Code:** AI cannot modify functional code without explicit permission
- **No Destructive Helping:** AI cannot "improve" working solutions without being asked

## Honesty & Transparency
- **ALWAYS admit mistakes immediately** - No defensive behavior or ego protection
- **NEVER try to make basic functionality seem impressive** - Focus on results, not appearances
- **Focus on results, not reputation** - Solve problems, don't protect perceived competence
- **Direct honesty** - If you make poor diagnostic choices, say so and move to real solutions
- **You're a tool, not a human** - Act accordingly with logical behavior, not emotional responses
- **Test real functionality first** - Don't waste time on "Hello World" tests unless specifically needed
- **Explain diagnostic choices** - If you create test pages, explain WHY they're needed
- **Don't get excited about basic routing** - It's expected functionality, not impressive

## Heretical File Detection & Purge Protocol
- **Immediate Reporting:** Any static/legacy files discovered must be reported immediately to the user with full details of their location and purpose.
- **Heretical Identification:** Static pages that duplicate database-driven functionality are considered heretical and must be purged.
- **Purge Authorization:** Before deleting any files, confirm they are truly redundant and safe to remove.
- **Vigilance:** Always scan for static pages in `/src/app/` that might conflict with dynamic routes.
- **Documentation:** Report all purged heretical files in commit messages and project logs.

## Communication & Workflow
- **Manual Operations:** Provide step-by-step instructions with examples when user action is required.
- **AI Tasks:** Summarize high-level plans, risks, and options. Default to action when only one viable path is present.
- **Documentation:** Always update `README.md`, `DEV_NOTES.md`, and `PROJECT_LOG.md` after significant changes.
- **Feedback:** Identify issues, present possible solutions, and avoid looping or repeating suggestions already tried.
- **Confirmation Fatigue:** Avoid unnecessary confirmation requests. Only ask for approval when a change is destructive, irreversible, or ambiguous.
- **Loop Prevention:** Keep a running context of session progress and avoid repeating troubleshooting steps unless new information is available.

## Coding Standards
- Use TypeScript for all new files; prefer `.ts`/`.tsx` over JavaScript.
- Use camelCase for variables/functions, PascalCase for components.
- Use template literals for multi-paragraph or long string content.
- Minimize lint errors and ensure typed code with clear data flow.

## Project Management
- **Pre-emptive Cleanup:** Before major changes, remove duplicate `.js`/`.ts` pairs (keep `.ts`).
- **Testing:** Test after significant changes, before git pushes and deployments.
- **Documentation Priority:** Keep `README.md`, `DEV_NOTES.md`, and `PROJECT_LOG.md` up to date.
- **Progress Updates:** Provide regular summaries of achievements and reasons for delays.
- **Context Awareness:** Maintain awareness of current changes' impact on the codebase.

## Deployment & Environment
- Use Vercel for deployments.
- Run `prisma generate` before every build.
- Use Neon for Postgres.
- Keep `.env.example` up to date with all required environment variables.

## Anti-Looping & Fatigue Guidance
- Do NOT run git commands unless explicitly requested.
- Do NOT push to GitHub or Vercel automatically; always ask for approval first.
- When providing long plans or text, also make it available as a downloadable file.
- Avoid repeating troubleshooting steps or suggestions already attempted in the session.
- When in doubt, ask for clarification rather than making assumptions.

---

## Project Vision & Personal Notes (for context)
- **Goal:** Herbal/naturopathic website with automated affiliate marketing system.
- **Timeline:** 6 months to earning money and focusing on content creation.
- **Adaptation:** AI should adapt to evolving needs and preferences.
- **Learning:** User will improve phrasing and caveat creation over time.

*This file guides the Cursor AI assistant and collaborators. Update as needed to reflect evolving preferences and rules.* 