# TheNerveVine System Context - AI Agent Briefing

## 🎯 PROJECT ESSENCE

**TheNerveVine** is an **ethical affiliate store hunter gatherer API hub and semi-automated affiliate health product marketplace** focused on stress and nervous system afflictions. The core innovation is the **"Domino Rally Cascade System"** - where one product approval ripples through the entire content network.

## 🌊 THE DOMINO RALLY CASCADE SYSTEM (CORE INNOVATION)

### **The Revolutionary Concept**
When an admin approves a single product (e.g., Ginkgo tincture), it automatically updates:
1. **Primary page**: `/herbs/ginkgo-biloba`
2. **Cascades to symptoms**: All symptom pages where Ginkgo is recommended
3. **Network effect**: One approval updates 10+ pages simultaneously

### **Content Hierarchy Flow**
```
Product Hunt → Admin Review → Approve → Herb Page → Symptom Pages → Live Site
```

**Example Cascade:**
- Admin approves "Ginkgo standardized extract"
- Updates `/herbs/ginkgo-biloba` page
- Auto-updates `/symptoms/memory-issues`
- Auto-updates `/symptoms/focus-problems`
- Auto-updates `/symptoms/cognitive-decline`
- All pages refresh with new product data

## 🎚️ QUALITY ↔ REVENUE SPECTRUM

### **Dynamic Scoring Control**
Admins can slide between ethical and profit-focused approaches:

```typescript
// Quality-focused (ethical sweet spot)
const scoringWeights = {
  qualityScore: 0.7,
  commissionRate: 0.2,
  userReviews: 0.1
};

// "Revenue at all costs!" mode
const scoringWeights = {
  qualityScore: 0.2,
  commissionRate: 0.7,
  availability: 0.1
};
```

## 📊 CONTENT ARCHITECTURE

### **For Each Herb:**
- **Traditional Formulations**: Tinctures, teas, powders
- **Phytoceuticals**: Standardized extracts, capsules
- **Quality Specifications**: Admin-defined criteria per type

### **For Each Symptom:**
- **Top 1-2 Recommended Herbs**: Primary therapeutic focus
- **Supporting Supplements**: Vitamins, minerals, oils (non-herbal)
- **Dynamic Product Population**: Inherits from approved herb/supplement products

### **Database Models (Key Relationships)**
```prisma
model Herb {
  products         Product[]
  symptoms         SymptomVariant[]
  qualitySpecs     QualitySpecification[]
}

model Symptom {
  variants         SymptomVariant[]
}

model SymptomVariant {
  herbs           Herb[]
  supplements     Supplement[]
}
```

## 🔄 WORKFLOW: "JSON JUGGLER & TRANSLATOR"

### **Weekly Product Hunt Process**
1. **API Harvest**: Fetch from merchant APIs (Amazon, iHerb, Vitacost)
2. **JSON Juggling**: Parse and normalize product data
3. **Quality Filter**: Apply admin-defined criteria
4. **Admin Review**: Present top 5 products per herb/supplement
5. **Approval Cascade**: Trigger network-wide updates
6. **Cache Invalidation**: Refresh all affected pages

### **The "Data Hub Juggler" (Technical)**
- `DataProcessingHub` class handles API integration
- `ProductCascadeManager` handles ripple effects
- `QualitySpecification` model defines filtering criteria
- Real-time scoring based on admin preferences

## 🛡️ ANTI-HERETICAL PROTOCOLS

### **Static File Corruption**
- **Heretical Files**: Any static pages that duplicate database-driven functionality
- **Purge Protocol**: Immediate identification and removal of conflicting static content
- **Vigilance**: Continuous scanning for static pages in `/src/app/` that conflict with dynamic routes

### **Mock Data Policy**
- **Workflow Demos**: Mock products serve layout/workflow visualization purposes
- **Clear Labeling**: All mock data marked as "WORKFLOW DEMO"
- **Fallback Logic**: Generate examples only if no real data exists

## 🏗️ TECHNICAL STACK

### **Core Technologies**
- **Frontend**: Next.js 15 + TypeScript + React
- **Database**: Neon Postgres + Prisma ORM
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js

### **Key Files & Architecture**
- `src/lib/data-processing-hub.ts` - Core API integration & scoring
- `src/lib/database.ts` - Prisma client & caching
- `src/app/admin/product-hunt/` - Admin review interface
- `src/app/herbs/[slug]/` - Dynamic herb pages
- `src/app/symptoms/[slug]/` - Dynamic symptom pages

### **Environment Variables**
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
AMAZON_ASSOCIATES_API_KEY=...
IHERB_API_KEY=...
VITACOST_API_KEY=...
```

## 🎯 BUSINESS LOGIC

### **Revenue Model**
- **Ethical Affiliate Marketing**: Quality over commission rates
- **Transparent Disclosure**: Clear affiliate relationship disclosure
- **Long-term Trust**: Sustainable user engagement over quick profits
- **Automated Income**: Low-input, high-quality product curation

### **User Journey**
1. User visits symptom page (e.g., `/symptoms/anxiety`)
2. Sees top recommended herbs + supporting supplements
3. Views curated, quality-approved products
4. Clicks affiliate links for purchases
5. Revenue generated while maintaining trust

## 🚨 CRITICAL DEBUGGING LESSONS

### **Production Issues Solved**
- **P1013 Error**: Space in `DATABASE_URL` after `:5432` broke Prisma connections
- **Vercel Config**: `output: 'standalone'` conflicted with Prisma
- **ESLint**: Unused imports treated as errors blocked builds
- **Hydration**: Server/client mismatch in `Header.tsx` component

### **Optimization Strategies**
- **ISR**: Changed from `force-dynamic` to `revalidate: 900` (15 min)
- **Caching**: API routes use `Cache-Control: public, max-age=300, s-maxage=900`
- **Database**: Added connection pooling, timeout handling, cache cleanup

## 👤 USER PROFILE CONTEXT

### **User Characteristics**
- **Non-coder business person** with light coding knowledge
- **Prefers high-level summaries** over detailed code dumps
- **Finds code overwhelming** and prefers natural language explanations
- **Values automation** and efficiency over manual processes
- **Quality-focused** but wants revenue flexibility

### **Communication Preferences**
- **No confirmation fatigue** - avoid repetitive approval requests
- **Batch operations** - group changes to minimize interruptions
- **Direct honesty** - admit mistakes immediately, focus on solutions
- **Result-oriented** - solve problems, don't protect AI reputation
- **Context-aware** - maintain session progress without repetition

### **Work Style**
- **Winter hibernation mode**: Content creation season
- **Spring/summer action**: Business logic implementation season
- **Visualization-driven**: Needs to see workflows and layouts
- **Trust-based**: Prefers AI to take action when path is clear

## 🎨 CONTENT STANDARDS

### **Writing Style**
- **Friendly and educational** with understated authority
- **Varied sentence lengths** for natural appearance
- **3-5 paragraphs** with 3-5 sentences each
- **Classy and tasteful** - avoid kitsch or tacky language
- **Evidence-based** scientific backing for all claims

### **Product Descriptions**
- **Multi-paragraph detailed descriptions** for herbs/supplements
- **Rich content** with therapeutic benefits, usage guidelines
- **SEO-optimized** structure for search visibility
- **Mobile-first** responsive design considerations

## 🔮 FUTURE VISION

### **Immediate Next Steps**
1. **API Manager Page**: Streamlined admin interface for merchant APIs
2. **Real Product Integration**: Move from mock to live product data
3. **Quality Scoring Refinement**: Enhanced algorithm implementation
4. **Cache Optimization**: Further reduce database compute hours

### **6-Month Goals**
- **Earning money** from affiliate commissions
- **Content creation focus** with automated product management
- **Advanced analytics** for optimization
- **Expanded merchant API integration**

## 🔧 COMMON DEBUGGING PATTERNS

### **Database Issues**
- Check `DATABASE_URL` for spaces or invalid characters
- Verify Prisma client initialization
- Confirm environment variables in Vercel
- Test connection with `/api/test-db` endpoints

### **Deployment Issues**
- Lint errors blocking builds (unused imports, `any` types)
- Next.js config conflicts (`output`, `serverExternalPackages`)
- Prisma generation during build process

### **Content Issues**
- Static files conflicting with dynamic routes
- Cache invalidation not triggering
- Product data not cascading to symptom pages

---

## 💡 QUICK START FOR NEW AI AGENTS

1. **Understand the cascade**: Product approval → herb page → symptom pages
2. **Respect the anti-heretical protocol**: No static file duplications
3. **Maintain quality-revenue balance**: Configurable scoring weights
4. **Focus on automation**: Reduce manual work, increase efficiency
5. **Preserve workflow demos**: Mock data serves visualization purposes
6. **Communicate clearly**: High-level summaries, avoid code dumps
7. **Be decisive**: Take action when path is clear, avoid confirmation loops

**Remember**: This is a sophisticated automated affiliate marketplace disguised as an educational herbal website. The magic is in the cascade system and quality-revenue spectrum control! 