# GitHub Portfolio Dashboard

A beautiful, feature-rich dashboard to visualize and analyze GitHub profiles with interactive charts, real-time filtering, and comprehensive analytics.

**🚀 [Live Demo](https://github-dashboard-nofar.vercel.app)** | **📊 [GitHub Repo](https://github.com/nofar9792/github-dashboard)**

---

## Features

### Core Analytics

- 📊 **Language Statistics** - Pie chart and percentage breakdown of programming languages
- 🔥 **Contribution Heatmap** - 30-day contribution activity visualization
- ⭐ **Top Repositories** - Showcase most-starred projects
- 📈 **User Statistics** - Followers, following, stars, contribution streak

### Discovery & Filtering

- 🔍 **Real-time Search** - Filter repositories by name and description
- 🏷️ **Language Filter** - Find repos by programming language
- 🔀 **Smart Sorting** - Sort by stars, forks, updated date, creation date, or name
- 📁 **Category Organization** - All Repositories, Personal Projects, Top Starred

### User Experience

- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, desktop
- ⚡ **Fast Loading** - Optimized API calls and lazy loading
- 🎯 **Clean UI** - Intuitive interface with visual hierarchy
- 🔗 **Direct Links** - One-click access to GitHub profiles and repositories

---

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts (pie, bar, responsive charts)
- **HTTP**: Axios
- **Icons**: Lucide React

### Backend & APIs

- **Data Source**: GitHub REST API (public, no authentication required)
- **Deployment**: Vercel (auto-deploy from GitHub)

### Testing & Quality

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (Chrome, Firefox, Safari)
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode
- **CI/CD**: GitHub Actions

### DevTools

- **Package Manager**: npm
- **Runtime**: Node.js 20.x
- **Build Tool**: Next.js Turbopack

---

## Core Engineering Challenges

### 1. **Real-time API Data Processing & Aggregation**

**Challenge**: GitHub API returns paginated data across multiple endpoints. Efficiently combining user data, repositories, events, and languages into cohesive statistics.

**Solution**:

- Implemented batch API fetching with proper error handling
- Created utility functions to transform raw API data into actionable insights
- Used state management to cache processed data and minimize re-renders
- Built helper functions for complex calculations (contribution streak, language percentages)

**Key Functions**:

- `getLanguageStats()` - Calculate top 8 programming languages
- `getLanguagePercentage()` - Convert repo counts to percentages
- `calculateContributionStreak()` - Track consecutive days with activity
- `categorizeRepositories()` - Organize repos by type and popularity

### 2. **Dynamic Filtering & Sorting with State Management**

**Challenge**: Implementing multi-dimensional filtering (search query + language + category) and six different sort options while maintaining performance and user experience.

**Solution**:

- Created composable, pure filter functions that don't mutate data
- Separated concerns: filtering, sorting, and categorization are independent operations
- Used React hooks strategically to prevent unnecessary re-renders
- Implemented computed state that updates only when dependencies change

**Implementation**:

- Search filters by repository name and description
- Language dropdown for filtering by programming language
- Category tabs for quick organization switching
- Sort dropdown for reordering by 5 different metrics

### 3. **Responsive Multi-Chart Dashboard**

**Challenge**: Managing multiple data visualizations (pie charts, bar charts, heatmaps, grids) with different layouts and ensuring responsive behavior across all screen sizes.

**Solution**:

- Built charts with Recharts' ResponsiveContainer for automatic scaling
- Implemented grid layouts that adapt from 1→2→3 columns based on viewport
- Created modular chart components with consistent styling
- Added proper loading and error states for data resilience

**Charts Implemented**:

- Pie chart for language distribution
- Bar chart for language frequency
- Grid heatmap for contribution activity
- Repository cards in responsive grid

### 4. **Efficient State Management & Performance**

**Challenge**: Fetching data from 3 different GitHub endpoints, processing it, and managing multiple filter/sort states without causing performance issues or excessive re-renders.

**Solution**:

- Consolidated data fetching into a single useEffect
- Memoized derived data (filtered repos, sorted repos, unique languages)
- Computed category organizations once on data load
- Avoided prop drilling with local component state

### 5. **Comprehensive Full-Stack Testing**

**Challenge**: Ensuring reliability across unit tests, integration tests, and E2E tests while keeping CI/CD pipeline fast and maintaining high code quality standards.

**Solution**:

- Unit tests for all utility functions with edge case coverage
- E2E tests for critical user flows (search, filter, sort, navigation)
- GitHub Actions CI pipeline running on every push
- Automated coverage reporting with Codecov
- Multi-version Node.js testing (18.x, 20.x)

**Test Coverage**:

- Utility function tests (filtering, sorting, calculations)
- Home page tests (search form, example buttons)
- Profile page tests (data loading, chart rendering, user info display)
- Filter/sort interaction tests

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Local Setup

```bash
# Clone the repository
git clone https://github.com/nofar9792/github-dashboard.git
cd github-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run ci           # Run full CI pipeline
```

---

## Project Structure

```
github-dashboard/
├── app/
│   ├── dashboard.tsx          # Main dashboard component with analytics & filters
│   ├── page.tsx               # Home page with search interface
│   ├── layout.tsx             # Root layout
│   ├── profile/[username]/    # Dynamic profile route
│   └── globals.css            # Global styles
├── lib/
│   └── github.ts              # GitHub API integration & data processing
├── __tests__/
│   └── github.test.ts         # Unit tests for utilities
├── e2e/
│   ├── home.spec.ts           # E2E tests for home page
│   └── profile.spec.ts        # E2E tests for profile page
├── .github/workflows/
│   └── ci.yml                 # GitHub Actions CI/CD pipeline
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies and scripts
```

---

## API Integration

The application uses the **GitHub REST API** for all data (public endpoints, no authentication required):

**Endpoints Used**:

- `GET /users/{username}` - User profile, followers, bio
- `GET /users/{username}/repos` - Repository list with metadata
- `GET /users/{username}/events/public` - Public events for contribution analysis

**Rate Limits**: 60 requests/hour (unauthenticated). For production, add GitHub OAuth token to increase to 5,000 requests/hour.

**No Database**: The app is entirely serverless, fetching live data from GitHub's public API.

---

## Performance Optimizations

- ✅ **Code Splitting** - Next.js automatically chunks routes
- ✅ **Image Optimization** - GitHub avatars loaded efficiently
- ✅ **Lazy Loading** - Charts render on demand
- ✅ **API Caching** - Data cached during component lifecycle
- ✅ **Responsive Images** - Proper sizing for all viewports
- ✅ **Turbopack** - Next.js fast build system for quick development

---

## Deployment

The project is **automatically deployed to Vercel** when you push to the `main` branch.

**Live URL**: https://github-dashboard-nofar.vercel.app

### Manual Deployment

```bash
npm install -g vercel
vercel
```

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## Contact

- **GitHub**: [@nofar9792](https://github.com/nofar9792)
- **Email**: nofar9792@gmail.com
