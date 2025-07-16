# Pilotify UI Design Guide

This design guide provides a comprehensive overview of the UI components, layout, style tokens, and interaction patterns for Pilotify’s premium B2B web application. It is intended to serve as the single source of truth for designers and developers using Cursor + Gemini CLI.

---

## 1. Overview

Pilotify blends structured project management (inspired by HubSpot) with low-barrier engagement (inspired by Slack). The design focuses on clarity, efficiency, and engagement:

- **Global Context:** Persistent left-hand navigation for key modules.
- **Contextual Activity:** Top-bar bell with slide-out panel for timely notifications.
- **Project Scoping:** Tabbed views (Overview, Tasks, Activity, Outcomes) within each pilot project.
- **Consistent Branding:** Clean layouts, generous whitespace, minimal distractions.

---

## 2. Navigation & Layout

### 2.1 Top Navigation

- **Marketplace Link:** Top-left, replacing the application logo/text.
- **Search Bar:** Centered in the top navigation bar.
- **User Profile:** Accessed via a clickable user avatar in the top-right.
- **Notifications:** Bell icon in the top-right with an aggregate unread count.

### 2.2 Left-Hand Navigation

- **Width:** 240px
- **Items:** Dashboard, Pilot Projects, Reports
- **States:**
  - Expanded: icon + label
  - Collapsed: icons only, expands on hover or click
- **Badges:**
  - Display unread counts (e.g., new tasks, comments)
  - Reset upon visit or item read

---

## 3. Project Pages & Views

### 3.1 Project Tabs

- Tabs: Overview | Tasks | Activity | Outcomes
- Sticky at top of canvas
- Active tab indicated by underline and icon color change

### 3.2 Table & Board Toggle

- Positioned above task content
- **Table View:** Sortable columns, inline status badges
- **Board View:** Drag-and-drop columns per status
- **Calendar View:** Optional third view for timeline

### 3.3 Activity Feed

- Located under the Activity tab
- Threaded messages with emoji reactions and comments
- Inline actions: React, Comment, Bookmark

---

## 4. Style Tokens

- **Typography:**
  - H1 (Headline): 32px / 2xl
  - H2 (Section): 24px / xl
  - Body & Labels: 16px / base
- **Spacing:**
  - Grid Gap: 16px
  - Card Padding: 24px
- **Colors:**
  - Primary: #1A73E8
  - Secondary: #F9A825
  - Accent: #34A853
  - Neutral Light: #F5F5F5
  - Neutral Dark: #202124
- **Border Radius:**
  - Cards & Buttons: 8px
  - Circular Elements: 50%

---

## 5. Component Inventory

- &#x20;— Left-hand menu with icons, labels, badge support
- &#x20;— App logo, search input, bell icon, user avatar menu
- &#x20;— Circular phase progress indicator
- &#x20;— Badge for early completion milestones
- &#x20;— Dashboard card for weekly team achievements
- &#x20;— Tab bar within project views
- &#x20;/  — Table and board for tasks
- &#x20;— Slide-out notifications panel
- &#x20;— Banner for KPI exceedances
- &#x20;— In-app prompt for early-phase boosts

---

## 6. Interaction Patterns

- **Hover & Focus:** Subtle shadows, color shifts on interactive elements
- **Micro-Interactions:**
  - Badge count increments
  - Progress ring fill animations
  - Confetti bursts on achievements
- **Responsive Behavior:**
  - Collapsed nav on tablets; bottom nav on mobile
  - Full-screen panel on small viewports

---

## 7. Gamification Mechanics

These mechanics support early adoption, task completion, and team engagement:

1. **Project Progress Rings** (Primary)

   - Circular indicator around project avatar showing phase completion percent
   - Celebratory animation when milestone completes ahead of schedule

2. **Ahead-of-Schedule Milestone Badges**

   - Award tiered badges (Bronze→Gold) for early task/phase completion

3. **Team Success Spotlights**

   - Weekly summary card in Dashboard & Activity feed highlighting team performance

4. **Onboarding Boost Nudges**

   - First two weeks: bonus points & ring jumps for each task completed
   - Gentle reminders to maintain streaks

5. **Target-Surpass Celebrations**

   - Banner and optional feature unlock when KPIs exceed targets

---

## 8. Interactive Elements

- **Buttons**
  - **Variants:** Primary, Secondary, Ghost, Icon-only
  - **Sizes:** Small (28px height), Medium (36px), Large (44px)
  - **States:** Default, Hover (slight elevation + color darken), Focus (2px outline), Active (pressed-down effect)
  - **Disabled:** 50% opacity, no pointer events

- **Forms & Inputs**
  - **Text Fields:** 40px height, 16px font, 8px internal padding
    - States: Default (neutral border), Focus (primary-color border), Error (red border + icon)
  - **Select/Dropdowns:** Consistent height, indicator icon rotates on open
  - **Checkboxes & Radios:** Custom SVG icons, 24px tappable area
  - **Validation:** Inline error messages below fields (14px, red #D93025), icons on the right

- **Modals & Dialogs**
  - Centered, max-width 600px, backdrop opacity 40%
  - Close icon in top-right (24px tappable area)
  - Title (H2), body text (H3/body), and footer actions with button group aligned right

---

## 9. Iconography

- **Style:** Line icons with 2px stroke weight, 18–24px grid
- **Library:** Use shadcn/ui or lucide-react for consistency
- **Usage:** 
  - Navigation: 24px
  - Inline actions (e.g., react, bookmark): 16px
  - Status indicators (e.g., completed): 12px
- **Color:** Icons default to #5F6368, hover to #202124, active to primary #1A73E8

---

## 10. Accessibility

- **Contrast:** All text colors meet WCAG AA (4.5:1) against background
- **Focus Rings:** All interactive elements use a 3px high-contrast outline
- **Keyboard Navigation:** Logical tab order, skip navigation link to main content
- **ARIA Labels:** Non-text controls (icons, buttons) include `aria-label` or visually hidden text
- **Announcements:** Use live regions for notifications in the Activity Panel and Target Celebrations

---

## 11. Error States

- **Global Errors:** Toast at top-right, red background (#D93025), auto-dismiss after 5s or manual close
- **Form Errors:** Field-level messages (see Forms section), and summary list at form top if multiple
- **Network Failures:** Inline retry buttons with explanatory text, e.g., “Unable to load tasks. Retry.”
- **Empty States:** Illustrative SVG + messaging + primary action button, e.g., no projects → “Create your first pilot project.”

