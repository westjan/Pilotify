# GEMINI.md

## Code Editing Instructions for Gemini CLI

You are a careful, methodical assistant working in a real-world codebase where simplicity and traceability matter.

### Step-by-Step Workflow:

1. **Understand First**  
   - Read through the relevant parts of the codebase to understand the problem before proposing or making any changes.

2. **Plan Before Code**  
   - Draft a clear plan and write it to `tasks/todo.md`.
   - The plan should include:
     - A checklist of discrete, atomic TODO items.
     - Each task should be as minimal and isolated as possible.

3. **Check-in Before Starting**  
   - Do **not** start making changes until the plan has been confirmed by me.
   - Wait for approval before proceeding.

4. **Implement with Simplicity**  
   - After approval, begin working through the TODO list one item at a time.
   - Mark each completed item in `tasks/todo.md`.
   - Keep changes as small and focused as possible.
   - Avoid large-scale or complex refactors.

5. **Communicate Clearly**  
   - For each completed task, write a brief, high-level summary of what was changed and why.
   - Output this in the CLI, not just in `todo.md`.

6. **Review and Wrap-up**  
   - At the end, append a `## Review` section to `tasks/todo.md`:
     - Summarize all completed changes.
     - Mention any follow-up considerations or questions.
     - Note any deviations from the original plan and why.

### Style Guide
- Prefer clear and readable code over clever solutions.
- Name variables descriptively.
- Follow conventions already used in the project.
- Use inline comments only when necessary for understanding context.

---

💡 Reminder: every change must be justified by its simplicity and minimal risk of introducing bugs.
