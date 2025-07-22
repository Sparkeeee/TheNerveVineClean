# CursorRules for TheNerveVineClean

- **FIRST RULE:** Always read cursorrules before making any changes or suggestions.
- **NO DESTRUCTION:** Never remove or overwrite existing features or UI elements unless explicitly authorized by the user. All refactors must preserve existing functionality unless otherwise agreed.

## User Profile & Working Style
- **Technical Background**: 6-month full-stack bootcamp (Django backend, 2 years ago), 50 years old, ADHD
- **Current Level**: Overview understanding, familiar with Git/version control, not actively coding since bootcamp
- **Working Style**: Prefers comprehensive, well-constructed solutions over fast-and-dirty approaches
- **Communication**: Needs examples and step-by-step for manual operations, high-level summaries for AI tasks
- **Priority**: Working code that's safe, well-constructed, and follows best practices

## Communication & Explanation Preferences
- **For Manual Operations**: Provide step-by-step instructions with examples
- **For AI Tasks**: High-level summaries focusing on achievability, timeframes, risks, and options
- **Technical Level**: Assume basic programming concepts, avoid overly technical jargon
- **Documentation**: Always create/update README.md, DEV_NOTES.md, PROJECT_LOG.md, and cursorrules.md

## Decision-Making & Autonomy Guidelines
- **Automatic Changes**: Only when in good session continuity with clear agreement on next steps
- **Ask Permission**: For any changes not explicitly agreed upon or part of an established process
- **Suggestions**: Welcome alternative approaches, but limit options to maintain progress
- **Problem Solving**: Generate multiple options rather than being myopic - user finds AI sometimes too dogged

## Error Handling & Problem Solving
- **Try Multiple Approaches**: When appropriate, but never compromise data integrity
- **Data Conservation**: Never delete content, features, or functions unless explicitly specified
- **Error Explanations**: Simple fixes preferred, detailed explanations when user needs to assist
- **Uncertainty**: Always seek clarity rather than making assumptions
- **Limitations**: Admit when stretched - user has experienced incomplete jobs due to AI limitations

## Code Quality & Development Approach
- **Priority**: Proper construction IS fast development (tortoise and hare approach)
- **Standards**: TypeScript, minimal lint errors, typed code with awareness of data flow
- **Best Practices**: Always preferred over shortcuts
- **Refactoring**: When advantageous with only positive consequences
- **Testing**: After significant changes, before git pushes and deployments
- **Technical Debt**: Actively avoid - it's the enemy

## Project Management & Organization
- **Timeline Tracking**: Agreed approximate timelines for work chunks
- **Documentation**: Update as features are deployed
- **Multiple Features**: Handle interdependencies and holistic functionality
- **Progress Updates**: Regular achievement summaries for morale and focus decisions
- **Context Awareness**: Maintain awareness of current changes' impact on codebase

## Context & Memory Management
- **Documentation Priority**: README.md, DEV_NOTES.md, PROJECT_LOG.md, cursorrules.md
- **Character Reference**: Create file about user's strengths/weaknesses as AI operator
- **Session Continuity**: Seek clarity when context might be lost
- **Dependencies**: Always consider relationships and dependencies in current work

## Time Management & Efficiency
- **Approach**: Comprehensive solutions over quick wins
- **Iteration**: Prefer well-done iterations with certainty over over-reaching
- **Large Tasks**: Break down while respecting holistic functionality and interdependencies
- **Delays**: Provide brief summaries of reasons when tasks take longer than expected

## Feedback & Iteration
- **First Attempt Issues**: Identify problems and present possible solutions
- **Questions**: Be specific, anticipate user's knowledge level
- **Options**: Provide choices but guide toward user's ethos and intent
- **User Feedback**: Usually specific corrections, often technically beyond user's current level

## Long-term Vision
- **Goal**: Herbal/naturopathic website with automated affiliate marketing system
- **Timeline**: 6 months to earning money and focusing on content creation
- **Adaptation**: AI should adapt to user's evolving needs and preferences
- **Learning**: User will learn better phrasing and caveat creation over time

## Coding Standards
- Use TypeScript for all new files and prefer `.ts`/`.tsx` over JavaScript
- Prefer functional React components
- Use camelCase for variables and functions, PascalCase for components
- Use template literals (backticks) for all multi-paragraph or long string content

## Workflow & AI Assistant
- Do NOT run git commands (commit, push, pull, etc.) unless explicitly requested by the user
- Do NOT push to GitHub or Vercel automatically; always ask for approval first
- When providing long step-by-step plans or lengthy text, also make it available as a downloadable file (Markdown or text) in addition to the chat feed
- Always ask before making any destructive or irreversible changes
- When in doubt, ask for clarification rather than making assumptions
- **PRE-EMPTIVE CLEANUP**: Before making major changes, always check for and remove duplicate files (.js/.ts pairs) to prevent approval fatigue
- **DUPLICATE PREVENTION**: Always check for existing .js files before creating .ts versions, and remove duplicates immediately
- **BATCH OPERATIONS**: When possible, group file operations to minimize approval requests

## Deployment & Environment
- Use Vercel for all deployments
- Prisma must run `prisma generate` before every build (see package.json build script)
- Use Neon as the Postgres database provider
- Ensure `.env.example` is kept up to date with all required environment variables

## Data & Content
- Never truncate or simplify rich, multi-paragraph herb or supplement descriptions
- All product and herb descriptions must be multi-paragraph and formatted for readability
- Static data files (e.g., `src/data/herbs.ts`) should use template literals for descriptions
- Database update scripts should always preserve full content and avoid accidental overwrites

## Memory & Context
- Remember that the user prefers explicit, step-by-step plans and downloadable summaries
- Maintain continuity and context across sessions; always review the latest session summary or project log if available
- Respect user preferences for workflow, naming, and deployment

## Project Management
- Use README.md and DEV_NOTES.md for persistent project context and major decisions
- Use TODO.md or a project board for tracking granular tasks and progress
- Commit often with clear messages and tag major milestones

---

*This file is intended to guide the Cursor AI assistant and any collaborators on TheNerveVineClean project. Update as needed to reflect evolving preferences and rules.* 