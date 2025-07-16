## 🧠 Project Overview

**Pilotify** is a B2B web application that streamlines collaboration between corporate entities and innovative startups during the pilot phase of new projects.

**For Startups:**  
Pilotify includes an AI module that transforms product information and marketing materials into best-practice formats, making them easily understandable for corporate clients. This helps startups present their solutions more effectively and increase their success rates.

**For Corporates:**  
Pilotify ensures that pilot projects are structured and aligned with internal documentation, regulations, and policies. It also facilitates clear communication and engagement among stakeholders, with features similar to social media interactions like likes and shares.

**Marketplace:**  
One of the standout features is a categorized **marketplace**, where startups can publish harmonized pilot offers. These offers are commercially standardized, enabling corporates to easily browse and compare across different solution categories.

### Key Features:

*   🧭 **Pilot Structuring** – Define and communicate pilot goals and expectations early.
*   🔄 **Ongoing Support** – Enable smooth follow-ups and collaboration during the pilot.
*   🛍️ **Marketplace** – Allow startups to publish and corporates to browse offers in a harmonized format.
*   📊 **Review & Outcome Evaluation** – Capture, assess, and standardize learnings at the end of pilots.

🎯 **Goal**: To make the pilot process more efficient, engaging, and successful for both startups and corporates by providing structure, clarity, and a dynamic discovery engine.

## Code Editing Instructions for Gemini CLI

You are a precise, controlled assistant working in a production codebase. Any changes must be approved before execution.

### 1. Understand Before Acting

*   **Read First:** Open and review relevant files and context. Do not alter any code before thorough reading.
*   **Identify Scope:** Note affected modules, dependencies, and potential side effects.
*   **Key Project Documents:** Always consult `project_overview.md` for a high-level understanding of the application's features and architecture, and `DESIGN_GUIDE.md` for UI/UX principles, component specifications, and styling guidelines.

### 2. Plan and Record

*   **Draft Plan:** Write a detailed plan in `tasks/todo.md` with:
    *   A clear list of discrete, atomic tasks.
    *   Estimated impact and dependencies for each task.
*   **Max Tasks:** Limit each plan to no more than 10 tasks per iteration to avoid drift.
*   **Approval Checkpoint:** Stop. Output the plan and await explicit user confirmation before proceeding.

### 3. Execute in Approved Batches

*   **Batch Execution:** Once you receive approval for the plan in `tasks/todo.md`, implement all approved tasks in sequence without pausing for each one.
*   **Focused Commits:** For each task, make a small, focused commit:
    *   **Commit Message Prefix:** Use one of the following emojis: `👍` (like), `❤️` (love), `🎉` (celebrate), `💡` (idea/lamp), `🤔` (thinking face).
    *   **Body:** Reference the corresponding `tasks/todo.md` entry and a one-line reason.
*   **Progress Updates:** After finishing each task, check it off in `tasks/todo.md` and print a brief CLI summary: “Completed: <task_description> — ”.
*   **Batch Completion Prompt:** At the end of the batch, prompt the user: "All approved tasks complete. Review changes and approve next batch plan? (yes/no)"

### 4. Communication and Logs

*   **CLI Summaries:** For each batch run, output a one-line summary per task and a final summary of the batch.
*   **Detailed Notes:** Keep detailed explanations under each task in `tasks/todo.md` as needed.

### 5. Final Review

*   **Wrap-up Section:** Add a `## Review` section at the end of `tasks/todo.md`:
    *   List all completed tasks with statuses.
    *   Note any deviations and why.
    *   Identify follow-up questions or items.

*   **Security Validation:** In the same `## Review`, include:
    *   A checklist verifying security best practices have been followed (e.g., input validation, no hard-coded secrets, proper error handling).
    *   Confirmation that no sensitive information (credentials, API keys, PII) is exposed in code or logs.
    *   A brief review for common vulnerabilities (e.g., SQL injection, XSS, insecure dependencies).

*   **Deliver Artifacts:** Present updated files and diff summaries in the CLI.---

### Style Guide

*   **Readability First:** Favor straightforward code over clever shortcuts.
*   **Naming:** Use descriptive, consistent names aligned with existing conventions.
*   **Comments:** Only add inline comments to clarify non-obvious logic.
*   **Refactors:** Avoid bulk refactors; if needed, break into separate, approved tasks.

### Safety and Control Measures

*   **No Autonomous Task Generation:** Do not add or propose tasks beyond the approved `tasks/todo.md` list.
*   **Scope Change Procedure:** If new work emerges, note it in a new draft plan and restart the approval process.
*   **Task Drift Prevention:** Enforce a hard pause after each task for user sign-off.

### 6. Documentation Practices

*   **Change Logs:** Maintain a `CHANGELOG.md` at the repo root:
    *   Record every batch or version update with date, list of tasks completed, and semantic version tag if applicable.
    *   Follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention: sections for Added, Changed, Fixed, and Security.

*   **Key Feature Descriptions:** Update `README.md` or project wiki:
    *   Summarize high-level features and usage examples after each major batch.
    *   Link to relevant modules and `tasks/todo.md` for detailed context.

*   **API and Component Docs:** For public interfaces or components:
    *   Keep inline API docblocks (e.g., JSDoc or Sphinx) up-to-date alongside code changes.
    *   As part of each approved batch, add a documentation task for any new or altered interface.

*   **Documentation Tasks:** Include doc updates in the initial plan:
    *   Treat docs the same as code: add discrete tasks in `tasks/todo.md` for updating or writing new docs.
    *   Ensure each batch plan includes at least one documentation-related task when features or interfaces change.

*   **Rabbit Holes Documentation:** Maintain a `RABBITHOLES.md` at the repo root:
    *   Document significant issues that led to reverts or extensive debugging, including symptoms, attempted solutions, suspected root causes, and lessons learned.
    *   Review this document before starting new features or major refactoring to avoid repeating past mistakes.

*   **Review Documentation:** In the Final Review:
    *   Verify that `CHANGELOG.md`, `README.md`, `RABBITHOLES.md`, and inline docs reflect all code changes.
    *   Confirm no outdated or broken links, and that examples still work as intended.

### 7. Tech Stack Overview

*   **Central Tech Stack Doc:** Maintain a `TECH_STACK.md` (or section in `README`) outlining:
    *   Core languages, frameworks, and libraries (e.g., React, Node.js, PostgreSQL).
    *   Version requirements and upgrade policies.
    *   Tooling (e.g., ESLint, Prettier, Docker) and environment setup steps.

*   **Integration with Plan:** For each batch plan, include a task to:
    *   Review and update `TECH_STACK.md`, `DESIGN_GUIDE.md`, and `project_overview.md` if new tools or versions are introduced or if architectural/design decisions are impacted.
    *   Ensure any new dependency is documented with rationale and usage examples.

*   **Onboarding Aid:** Reference `TECH_STACK.md` in developer onboarding materials so new contributors can:
    *   Quickly set up local environments.
    *   Understand why each tool or version is chosen.

*   **Review Tech Stack:** In the Final Review:
    *   Confirm that `TECH_STACK.md` reflects all new or updated dependencies.
    *   Check for outdated or deprecated tools.

This instruction set ensures a disciplined, transparent workflow where every change is planned, reviewed, and approved before execution.