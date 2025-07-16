# RABBITHOLES.md

This document lists significant issues encountered during development that led to reverts or substantial debugging efforts, serving as a knowledge base to avoid similar problems in the future.

## Known Issues (Rabbit Holes)

### 1. Tailwind CSS Styles Not Applying in Next.js 15 Development Environment

*   **Date Encountered:** 2025-07-16
*   **Date Reverted:** 2025-07-16
*   **Symptoms:**
    *   `npm run dev` server starts without errors, but no Tailwind CSS styles are applied in the browser.
    *   Test `div` with `bg-green-500` shows no green background.
    *   Errors like `Error: Cannot apply unknown utility class `text-base`` or `text-neutralDark`, `text-2xl` appear in the terminal during `npm run dev`.
*   **Attempted Solutions:**
    *   Verified `tailwind.config.ts` content paths.
    *   Verified `globals.css` imports (`@tailwind` directives).
    *   Removed `@apply` directives from `globals.css` for `text-base`, `text-neutralDark`, `text-2xl`, `text-xl` and applied classes directly to `<body>` and `h1`/`h2` tags.
    *   Removed explicit `fontSize` definitions from `tailwind.config.ts`.
    *   Cleaned npm cache and reinstalled dependencies (`npm cache clean --force`, `rd /s /q node_modules`, `npm install`).
    *   Modified `postcss.config.mjs` to explicitly reference `tailwind.config.ts`.
    *   Removed `--turbopack` flag from `dev` script in `package.json`.
    *   Removed `experimental` block from `next.config.ts`.
    *   Changed `postcss.config.mjs` to `postcss.config.js` and updated its content.
    *   Installed `autoprefixer`.
*   **Suspected Root Cause:** Likely a compatibility issue or subtle interaction between Next.js 15 (especially with Turbopack), Tailwind CSS, and PostCSS processing in the development environment. The `@apply` directive in `globals.css` seems particularly problematic with Turbopack.
*   **Impact of Revert:** Lost significant time debugging, delayed progress on UI styling.
*   **Lessons Learned/Recommendations:**
    *   Avoid using `@apply` directives in `globals.css` for utility classes when using Next.js 15 with Tailwind CSS, especially if Turbopack is involved. Apply utility classes directly in JSX.
    *   Be cautious with `experimental` flags in `next.config.ts` as they can change rapidly between Next.js versions.
    *   When encountering persistent styling issues in development, consider the interaction between the bundler (Turbopack/Webpack), PostCSS, and Tailwind CSS.
    *   For future similar issues, consider creating a minimal Next.js + Tailwind project from scratch to compare configurations.
*   **Relevant Commits:**
    *   Issue introduced: [Link to commit if known]
    *   Revert commit: [Link to revert commit]

## Successfully Debugged Issues

### 1. Client Component Build Error (`useState` in Server Component Context)

*   **Date Encountered:** 2025-07-16
*   **Date Resolved:** 2025-07-16
*   **Symptoms:**
    *   Build error: `You're importing a component that needs `useState`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.`
    *   Error trace pointed to `TopNavbar.tsx` and `Layout.tsx`.
*   **Solution:**
    *   Added `'use client';` directive to the top of `src/components/TopNavbar.tsx`.
    *   Added `'use client';` directive to the top of `src/components/Layout.tsx` because it imports and renders `TopNavbar.tsx`, which is a client component.
*   **Lessons Learned/Recommendations:**
    *   When using React Hooks (like `useState`, `useEffect`, etc.) in Next.js 13+ App Router, ensure the component (and any parent components in the import chain that render it) is explicitly marked as a Client Component using `'use client';` at the top of the file.
    *   Understand the distinction between Server Components and Client Components in Next.js to avoid common hydration and rendering issues.
*   **Relevant Commits:**
    *   Fix commit: [Link to commit that fixed the issue]