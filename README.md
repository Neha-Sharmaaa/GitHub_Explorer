# GitHub Explorer 

A modern, responsive React application to search GitHub users and easily explore their repositories. Built with best frontend practices prioritizing simple, clean code.

##  Features

- **User Search with Debouncing:** Optimized search input that reduces unnecessary API calls.
- **View Repositories:** Clicking a user smoothly loads their repositories.
- **Sort & Filter:** Sort repositories by stars, forks, or recently updated. Filter by programming language.
- **State Handling:** Comprehensive loading, error, and empty states.
- **Dark Mode:** A sleek dark/light theme toggle saved in `localStorage`.
- **Responsive Design:** Mobile-first layout using CSS Grid and Flexbox.

##  Folder Structure

We follow a modular, scalable project structure:

```
src/
├── components/   # Reusable UI parts (SearchBar, UserCard, RepoCard, Loader)
├── hooks/        # Custom React hooks (useDebounce)
├── pages/        # Main views (Home)
├── services/     # API logic separation (githubApi.js)
├── index.css     # Global styles and design variables
├── App.jsx       # Root component & Theme management
└── main.jsx      # React Mount point
```

**Why this structure?**
- **Separation of Concerns:** Component UI logic is separate from API fetching (`services/`).
- **Reusability:** Small pieces like `Loader` or `useDebounce` can be easily shared or tested.
- **Maintainability:** Easy to read, debug, and expand.

##  State Handling Explained

1. **Loading State:** Shows an elegant spinner when fetching data, letting the user know the application is working. It improves UX by avoiding a "frozen" feeling.
2. **Error State:** If the GitHub API fails (e.g., rate limit exceeded), we catch the error and show a user-friendly red message instead of crushing the app.
3. **Empty State:** Guides the user when there are no repository or user results.

##  Performance: The `useDebounce` Hook

When typing "react", instead of making 5 API calls (`r`, `re`, `rea`, `reac`, `react`), the `useDebounce` hook waits for 500ms *after* the user stops typing to trigger the fetch. 
**Why it improves performance:** Avoids hammering the GitHub API, getting rate-limited, and causing laggy UI renders.

## Tech Stack
- React.js (Functional Components, Hooks: `useState`, `useEffect`, `useMemo`)
- Vite (Lightning fast bundler)
- CSS Variables for Theming
- Lucide React (Icons)

##  How to Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Steps to Deploy (Vercel)

Vercel is the easiest way to deploy a Vite React app.

1. Create a free account on [Vercel](https://vercel.com/) and connect your GitHub account.
2. Push this local repository to a new repository on your GitHub.
3. From the Vercel dashboard, click **Add New -> Project**.
4. Select your new GitHub repository.
5. Vercel will automatically detect `Vite`. The build command (`npm run build`) and output directory (`dist`) will be pre-filled perfectly.
6. Click **Deploy**. In ~30 seconds, your app will be live globally!

## Debugging Tips
- **Network Tab:** Check Chrome DevTools > Network to see if API calls fail or return unexpected JSON.
- **GitHub Rate Limits:** GitHub allows ~60 requests/hr for unauthenticated IP addresses. If you see a `403 Forbidden`, you've hit the limit. Wait a bit or use a VPN.
- **Console Logs:** Place `console.log(data)` immediately after `await response.json()` in the `services/githubApi.js` to inspect payload fields.

## Suggested GitHub Commit Messages

- `Initial commit: Setup Vite React layout structure`
- `feat: Add global CSS and Dark Mode Support`
- `feat: Add custom useDebounce hook`
- `feat: Separate GitHub API calls into services layer`
- `feat: Create highly reusable UI components (Cards, Search, Loader)`
- `feat: Integrate search logic, sorting, and filtering in the Home page`
- `docs: Complete README with architecture explanation and deployment steps`
