# Project Overview: Pilotify

Pilotify is a B2B web application designed to streamline collaboration between corporate entities and innovative startups during the pilot phase of new projects.

## Key Features and Functions:

### 1. User Management & Authentication:
*   **User Roles:** `CORPORATE`, `INNOVATOR`, `ADMIN`.
*   **Authentication:** Sign-up and sign-in functionalities.
*   **User Profiles:** Users can manage their profiles via a user menu in the top navigation bar.
*   **Admin Features:** Admin users can manage categories and users.

### 2. Pilot Project Management:
*   Facilitates the creation and management of pilot projects between corporates and innovators.
*   Pilot projects have a `title`, `description`, `corporate` and `innovator` participants, and a `status`.
*   Includes task management within projects.

### 3. Marketplace:
*   A dedicated marketplace where startups (innovators) can publish harmonized pilot offers and showcase their innovations.
*   Corporates can browse and compare offers and innovations across different solution categories.

### 4. Communication & Collaboration:
*   **Activities:** Tracks user activities.
*   **Comments:** Users can add comments.
*   **Bookmarks:** Users can bookmark items.
*   **Reviews:** Functionality for reviewing projects or offers.

## Database Schema (Prisma Models):

*   **`User`**: Represents a user in the system.
    *   `id`: Unique identifier.
    *   `email`: User's email (unique).
    *   `password`: Hashed password.
    *   `name`: User's name.
    *   `role`: User's role (`CORPORATE`, `INNOVATOR`, `ADMIN`).
    *   `createdAt`, `updatedAt`: Timestamps.
    *   Relations: `corporateProjects`, `innovatorProjects`, `innovations`.

*   **`Innovation`**: Represents an innovation submitted by a startup.
    *   `id`: Unique identifier.
    *   `title`: Title of the innovation.
    *   `description`: Description of the innovation.
    *   `ownerId`: ID of the owning user (Innovator).
    *   `category`: Category of the innovation.
    *   `createdAt`, `updatedAt`: Timestamps.
    *   Relation: `owner` (to `User`).

*   **`PilotProject`**: Represents a pilot project between a corporate and an innovator.
    *   `id`: Unique identifier.
    *   `title`: Title of the pilot project.
    *   `description`: Description of the pilot project.
    *   `corporateId`: ID of the corporate participant.
    *   `innovatorId`: ID of the innovator participant.
    *   `status`: Current status of the pilot project (e.g., "Pending").
    *   `createdAt`, `updatedAt`: Timestamps.
    *   Relations: `corporate` (to `User`), `innovator` (to `User`).

## Application Structure (Key Routes & Directories):

*   **`/` (Root):** Main application entry point.
*   **`/admin`:** Admin-specific pages for managing categories and users.
*   **`/api`:** Contains all API endpoints for various functionalities.
*   **`/auth`:** Authentication-related pages (sign-in, sign-up).
*   **`/dashboard`:** User dashboard.
*   **`/marketplace`:** Marketplace pages for browsing and creating offers, and viewing innovations.
*   **`/pilot-projects`:** Pages for managing pilot projects (new, view, edit, tasks).
*   **`/profile`:** User profile pages (view, edit), accessed from the top navigation bar.

## Components & Utilities:

*   **`components/`:** Reusable UI components (e.g., `AuthProvider`, `LandingPage`, `LeftSidebar`, `Navbar`, `SignOutButton`, `TopNavbar`, `UserSearchSelect`).
*   **`lib/`:** Utility functions (e.g., `auth.ts` for authentication logic).
*   **`prisma/`:** Prisma schema and migrations for database management.
*   **`public/`:** Static assets.
*   **`scripts/`:** Contains `seed.js` for seeding the database.
*   **`types/`:** TypeScript type definitions.
