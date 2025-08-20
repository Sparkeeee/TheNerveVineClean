# Maxun - Alternative Scraping Solution

## Overview
**Maxun** is an open-source, no-code web data extraction platform that could solve the current scraping challenges we've been facing. It's designed to turn any website into an API or spreadsheet automatically.

## Key Information
- **Repository**: [https://github.com/getmaxun/maxun](https://github.com/getmaxun/maxun)
- **Website**: [www.maxun.dev](https://www.maxun.dev)
- **License**: AGPL-3.0 (completely free)
- **Stars**: 13.5k+ (very popular and well-maintained)
- **Language**: TypeScript (95.9%) + JavaScript (3.8%)

## Why Maxun is Relevant

### Current Problems We're Facing
1. **Target anti-detection blocking** - persistent 500 errors and "page unavailable"
2. **CSS conflicts breaking the entire site** - inline styles vs Tailwind conflicts
3. **Complex custom implementation** - over-engineering basic scraping needs
4. **Time wasted on technical issues** - preventing focus on content creation

### How Maxun Solves These Issues
1. **Built-in anti-detection** - handles stealth automatically (no more VPN/IP rotation)
2. **Separate application** - no CSS conflicts with your main site
3. **No-code interface** - visual robot builder, no programming required
4. **Battle-tested** - 13.5k stars means it actually works
5. **Self-hosted** - you control your data and proxies

## Core Features

### Robot Actions
- **Capture List**: Extract structured bulk items (products from Amazon, etc.)
- **Capture Text**: Extract individual text content
- **Capture Screenshot**: Full page or section screenshots

### Automation Capabilities
- **Scheduled runs** - robots run automatically without manual intervention
- **Pagination handling** - automatically scrapes multiple pages
- **Login support** - can extract data behind authentication
- **Layout adaptation** - handles website changes automatically

### Output Options
- **API endpoints** - turn websites into APIs
- **Spreadsheets** - export to Excel/CSV
- **Database storage** - PostgreSQL integration
- **Scheduled exports** - automated data delivery

## Technical Requirements

### Local Deployment
- **Docker** (recommended) or local development
- **PostgreSQL** database
- **MinIO** for screenshot storage (optional)
- **Ports**: Frontend (5173), Backend (8080)

### Hardware Requirements
- **Minimum**: 2GB RAM, 1 CPU core
- **Recommended**: 4GB RAM, 2 CPU cores
- **Storage**: 10-20GB for database and screenshots

## Comparison with Current Approach

| Aspect | Current Custom Solution | Maxun |
|--------|------------------------|-------|
| **Anti-detection** | Manual (VPN, delays, user agents) | Built-in, automatic |
| **UI Issues** | CSS conflicts breaking site | Separate, working application |
| **Maintenance** | Constant bug fixes needed | Stable, well-tested |
| **Development Time** | Weeks of debugging | Minutes to set up |
| **Reliability** | Unpredictable, breaks often | Professional-grade stability |
| **Focus** | Technical troubleshooting | Content creation and business |

## Alternative Solutions Considered

### Crawlee ([github.com/apify/crawlee](https://github.com/apify/crawlee))
- **Pros**: Professional-grade, advanced anti-detection
- **Cons**: Requires coding knowledge, complex setup
- **Verdict**: Overkill for no-code needs

### Scrapy ([scrapy.org](https://www.scrapy.org))
- **Pros**: Mature, battle-tested, good performance
- **Cons**: Python-based, different tech stack, learning curve
- **Verdict**: Good but requires Python knowledge

## Setup Instructions

### Quick Start with Docker
```bash
# Clone repository
git clone https://github.com/getmaxun/maxun.git
cd maxun

# Copy environment configuration
cp ENVEXAMPLE .env

# Edit .env with your settings
# - Database credentials
# - Port configurations
# - JWT secrets
# - MinIO settings (optional)

# Start services
docker-compose up -d
```

### Environment Variables (Key Ones)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection
- `JWT_SECRET` - Authentication security
- `ENCRYPTION_KEY` - Data encryption
- `FRONTEND_PORT`, `BACKEND_PORT` - Service ports

## Business Impact

### Immediate Benefits
1. **Stop wasting time** on technical issues
2. **Get reliable scraping** that actually works
3. **Focus on content creation** (your main goal)
4. **Professional automation** for affiliate marketing

### Long-term Advantages
1. **Scalable solution** - grows with your business
2. **No technical debt** - built by professionals
3. **Community support** - 13.5k users and contributors
4. **Future-proof** - actively maintained and updated

## Recommendation

**Switch to Maxun** instead of continuing to fight with our custom solution. Here's why:

1. **It's free** - no cost to try
2. **It's proven** - 13.5k stars don't lie
3. **It's simple** - no-code interface
4. **It's reliable** - handles the problems we can't solve
5. **It's separate** - won't break your main website

## Next Steps

1. **Set up Maxun locally** using Docker
2. **Test with Target/Amazon** to verify it works
3. **Create scraping robots** for your affiliate products
4. **Schedule automation** for continuous data collection
5. **Focus on content creation** while robots work in background

## Resources

- **GitHub**: [https://github.com/getmaxun/maxun](https://github.com/getmaxun/maxun)
- **Documentation**: [https://github.com/getmaxun/maxun/tree/develop/docs](https://github.com/getmaxun/maxun/tree/develop/docs)
- **Issues**: [https://github.com/getmaxun/maxun/issues](https://github.com/getmaxun/maxun/issues)
- **Discussions**: [https://github.com/getmaxun/maxun/discussions](https://github.com/getmaxun/maxun/discussions)

---

*This document was created to evaluate Maxun as an alternative to our current custom scraping implementation. Maxun appears to solve all the major technical issues we've been facing while providing a professional, reliable solution for web data extraction.*
