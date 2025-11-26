# Refactoring Experiment - Student Instructions

## 🎯 What This Is

This is a **curiosity-driven exploration** of refactoring with AI assistance!

This codebase is deliberately terrible (but working!). Your goal is to **experiment** with:
- Working with AI to identify code problems
- Planning refactoring strategies
- Actually improving real (terrible) code
- Learning what makes code "good" vs "bad"

**This is NOT a graded assignment!** It's too large to finish in class. Think of it as a playground to:
- Try out refactoring techniques
- Practice working with AI tools
- Experience the satisfaction of improving messy code
- See how YOU would approach fixing this mess

Work on as much or as little as interests you!

## Why This is Interesting

**The code works perfectly** (all 68 tests pass!), but it's a nightmare to maintain. You'll discover:

- How code can be "correct" but still terrible
- What makes experienced developers cringe
- The difference between "works" and "works well"
- How satisfying it is to clean up a mess
- Why code reviews matter

**Plus:** You get to boss an AI around and critique its work! 😄

## Getting Started

### 1. Copy Lesson to Your Work Directory
```bash
# From the course root directory
cd /Users/juancho/Courses/5500-2025/src/Lessons

# Copy the lesson to your work directory
cp -r source/lessons/Lesson-09 work/lessons/

# Navigate to your working copy
cd work/lessons/Lesson-09

# Install dependencies
npm install
```

**Important:** Always work in `work/lessons/`, NOT `source/lessons/`. 
The `work/` directory is in `.gitignore` so you won't accidentally push to the course repo.

**Optional - Create Your Own Git Repo:**
If you want full version control for your refactoring work:
```bash
cd work/lessons/Lesson-09
git init
git add .
git commit -m "Initial commit: stinky library system"
```

Now you can create branches and commit as you refactor!

### 2. Run the Application 🎮
```bash
npm start
```

This launches an interactive command-line interface! Try:
- Adding books
- Registering members
- Checking out books
- Viewing reports

**See the terrible code in action!** Notice how slow and clunky it feels? That's because of all the code smells!

### 3. Verify Tests Work
```bash
npm test
```
All 68 tests should pass! ✅

### 4. Run Coverage
```bash
npm run test:coverage
```
Note the baseline: ~65% coverage

## Phase 1: Discovery & Analysis (with AI)

### Step 1: Explore the Codebase

Open each file and examine it. Start with:
- `src/database.ts` - How is data stored?
- `src/utils.ts` - What do these functions do?
- `src/checkout.ts` - How does checkout work?
- `src/book.ts` - How are books managed?
- `src/member.ts` - How are members managed?

### Step 2: Work with an AI to Identify Code Smells

**Prompt your AI assistant with:**

```
I'm working on a refactoring exercise with deliberately bad code. 
I'll share files from a library management system one at a time.

For each file, please:
1. Identify ALL code smells present
2. Explain WHY each is problematic
3. Suggest how to fix it
4. Estimate the difficulty (Easy/Medium/Hard)

Let's start with this file: [paste file contents]
```

**Go through each file:**
- `src/utils.ts` - What's wrong here?
- `src/checkout.ts` - Examine the checkout function
- `src/book.ts` - Look at book operations
- `src/member.ts` - Review member operations
- `src/reports.ts` - Check reporting logic
- `tests/*.test.ts` - Are the tests well-written?

### Step 3: Create a Comprehensive Code Smell List

Work with your AI to create a master list. For example:

```markdown
## Code Smells Found

### Critical Issues
1. God Function in checkout.ts (200+ lines)
2. Global mutable state in database.ts
3. No separation of concerns

### High Priority
1. Code duplication - fee calculation repeated 3x
2. Magic numbers everywhere (14, 0.5, 5, etc.)
3. Inconsistent error handling (7 different patterns!)

### Medium Priority
1. Poor function names (f1, s1, a1, etc.)
2. Mixed concerns (UI formatting in models)
3. Tight coupling (no dependency injection)

### Low Priority
1. Brittle tests with duplicated setup
2. Missing constants
3. Inconsistent naming conventions
```

## Phase 2: Create Your Refactoring Plan

### Step 1: Prioritize Refactorings

Work with your AI to order the refactorings. Ask:

```
Based on these code smells, what order should I tackle them in?
Consider:
- Which fixes will make other fixes easier?
- Which are highest risk vs lowest risk?
- Which provide the most value?
- What's the logical sequence?

Create a numbered refactoring plan with:
- Task name
- What will be changed
- Why it matters
- Estimated time
- Risk level
- Dependencies (what must be done first)
```

### Step 2: Document Your Plan

Create a file `REFACTORING-PLAN.md` in this directory:

```markdown
# Refactoring Plan for Stinky Library System

## Overview
[Summary of current state and goals]

## Code Smells Identified
[Your comprehensive list from Phase 1]

## Refactoring Tasks (in order)

### Task 1: [Name]
**What:** [Detailed description]
**Why:** [Why this is important]
**Files affected:** [List files]
**Time estimate:** [Hours]
**Risk:** [Low/Medium/High]
**Dependencies:** [None or "Must complete Task X first"]
**Success criteria:**
- [ ] All tests pass
- [ ] [Specific metric improved]
- [ ] [Specific behavior maintained]

### Task 2: [Name]
...

## Metrics to Track
- Function length (before/after)
- Cyclomatic complexity (before/after)
- Code duplication (before/after)
- Test coverage (before/after)

## Testing Strategy
[How will you verify each refactoring works?]
```

### Step 3: Review Your Plan (CRITICAL!)

**Read your entire plan carefully!**

Ask yourself:
- Does this order make sense?
- Are there any risky steps that should be broken down?
- Have I missed any major code smells?
- Is each task small enough to complete in one session?
- Can I test after each task?

**Get AI feedback on your plan:**
```
Here's my refactoring plan: [paste your plan]

Please review it and tell me:
1. Is the order logical?
2. Are any tasks too large?
3. Are there any risks I'm missing?
4. Any suggestions for improvement?
```

**Revise your plan based on feedback!**

### Step 4: Finalize Your Plan

Save your `REFACTORING-PLAN.md` and commit it:
```bash
git add REFACTORING-PLAN.md
git commit -m "docs: add refactoring plan"
```

You're now ready to start implementation!

## Phase 3: AI-Assisted Implementation

**This is a pair programming exercise!** You'll work WITH your AI to implement each refactoring.

### For Each Task in Your Plan

#### 1. Create a Branch
```bash
# Make sure you're in your work directory
cd work/lessons/Lesson-09

# Create a feature branch for this refactoring task
git checkout -b refactor/[task-name]
```

**Note:** You're working in `work/lessons/`, which is in `.gitignore`, so your commits won't affect the course repo.

#### 2. Run Tests (Before)
```bash
npm test
```
All should pass! This is your baseline.

#### 3. Ask Your AI to Implement the Refactoring

**This is the key step!** Work with your AI as a pair programming partner.

**Example prompt:**
```
I'm on task [X] of my refactoring plan: [task description]

Current code in [filename]:
[paste the relevant code]

Please refactor this code to:
1. [Specific goal from your plan]
2. [Another goal]

Requirements:
- All existing tests must still pass
- No change in functionality
- Follow [specific pattern or principle]

Please provide:
1. The complete refactored code
2. Explanation of what changed and why
3. Any new tests I should add
4. What to watch out for when testing
```

#### 4. Review the AI's Changes CAREFULLY

**DO NOT just copy/paste!** This is about comprehension:

- ✅ **Read every line** the AI changed
- ✅ **Understand WHY** each change was made
- ✅ **Ask questions** if something is unclear
- ✅ **Verify** it matches your refactoring plan
- ✅ **Check** for any introduced bugs

**Good follow-up questions:**
```
Why did you extract this into a separate function?
What's the benefit of using this pattern instead?
Could this change break anything?
Are there edge cases I should test?
```

#### 5. Apply and Test the Changes

**After you understand the refactoring:**

```bash
# Copy the AI's code into your files
# (Don't just paste blindly - type it out to internalize it!)

# Run tests immediately
npm test
```

**If tests fail:**
```
Ask your AI:
"The tests are failing with this error: [paste error]
What went wrong in the refactoring?"
```

#### 6. Run Tests (After Each Change)
```bash
npm test
```
Tests should STILL pass!

#### 7. Verify Functionality in the CLI
```bash
npm start
```
Manually test the affected features. Does everything still work?

#### 8. Check Metrics
```bash
npm run test:coverage
```
Coverage should stay the same or improve!

#### 9. Review the Changes One More Time
```bash
git diff
```
Read through EVERY change before committing. Can you explain each one?

#### 10. Commit with a Detailed Message
```bash
git add .
git commit -m "refactor: [clear description of what changed and why]"
```

**Good commit message:**
```
refactor: extract magic numbers to named constants in checkout.ts

- Replaced hardcoded 14 with MAX_BORROW_DAYS
- Replaced 0.5 with DAILY_LATE_FEE
- Added constants module with clear documentation

Makes fee calculation logic much clearer and easier to modify.
```

#### 11. Document What You Learned
Add to your `REFACTORING-REPORT.md`:
```markdown
### Task X Completed: [Name]
**Date:** [Date]
**Time taken:** [Actual hours]
**Changes made:**
- [Specific change 1]
- [Specific change 2]

**Challenges faced:**
- [Challenge and how you solved it]

**Metrics before/after:**
- Function length: X → Y
- Tests passing: X → Y

**Lessons learned:**
- [What did you learn?]
```

### Your Role as the Reviewer

**The AI is your pair programming partner - it writes, you review!**

Think of this like code review in a professional setting:
- The AI implements the refactoring
- You review every change critically
- You test thoroughly
- You approve (commit) or request changes

### Questions to Ask While Reviewing

**About the refactoring:**
```
Why did you choose this approach over [alternative]?
What are the tradeoffs of this refactoring?
How does this improve the code quality?
What could go wrong with this change?
```

**About the code:**
```
Walk me through this function line by line.
Why is this parameter needed?
What does this pattern accomplish?
Could this be simplified further?
```

**About testing:**
```
What edge cases should I test?
Could this break any existing functionality?
Are there any integration issues to watch for?
Should I add new tests for this?
```

### If You Don't Understand Something

**NEVER commit code you don't understand!**

Ask your AI:
```
I don't understand [specific part]. 
Can you:
1. Explain it in simpler terms
2. Show me an example
3. Compare it to the old code
4. Explain the benefits
```

### If Tests Fail

```
The tests are failing with this error:
[paste exact error message]

The refactoring we just did was:
[brief description]

Please:
1. Explain why this error occurred
2. Show me what needs to be fixed
3. Explain how to prevent this in future refactorings
```

**Then review the fix just as carefully!**

## Guidelines for Success

### ✅ DO:
- Run tests after EVERY change
- Commit frequently with clear messages
- Use your IDE's refactoring tools
- Ask your AI for help when stuck
- Pair program with classmates
- Review your plan regularly
- Take breaks between tasks
- Celebrate small wins!

### ❌ DON'T:
- Change functionality
- Skip tests
- Make huge commits
- Refactor multiple things at once
- Ignore failing tests
- Copy/paste without understanding
- Rush through the plan
- Skip the planning phase

## How to Know You're Making Progress

### The Test Suite is Your Safety Net
```bash
npm test  # Should always pass!
```
If tests pass, you haven't broken functionality. ✅

### The CLI Shows Real Improvements
```bash
npm start
```
After refactoring, does the app:
- Feel snappier?
- Have clearer error messages?
- Make more sense to use?

### You Can Explain the Code
The ultimate test:
- Can you explain what each function does?
- Do the names make sense?
- Would you be able to add a new feature easily?

**If YES, you've succeeded!** 🎉

### Some Numbers (If You're Curious)

**Before refactoring:**
- Longest function: ~200 lines (checkout.ts)
- Magic numbers: 50+
- Code duplication: Everywhere!
- Test coverage: ~65%

**After some refactoring, you might see:**
- Longest function: <50 lines
- Magic numbers: Getting fewer!
- Clearer organization
- Maybe better coverage

**But remember:** The metrics matter less than your understanding!

## Optional: Document Your Journey

If you want to track your work (great for learning!), consider creating:

### REFACTORING-PLAN.md (Optional)
Your analysis and strategy:
- Code smells you found
- What you want to fix
- Why and in what order

### REFACTORING-NOTES.md (Optional)
Your reflections as you work:
- What surprised you
- What was harder than expected
- Cool things you learned
- Questions that came up

### Git Commits (Recommended)
Even for experimentation, committing helps you:
- Try things without fear (can always revert!)
- See your progress
- Learn from your own history
- Practice good commit habits

**No formal deliverables required - this is just for YOU!**

## Common Questions

### "Where do I start?"
Start with Phase 1 - explore the code with your AI. Don't skip the planning!

### "This code is SO BAD! What do I fix first?"
That's what your AI will help you figure out in your refactoring plan!

### "Can I use AI to write the refactored code?"
Yes, but YOU must:
- Understand every line it generates
- Verify it's correct
- Test thoroughly
- Make it yours (don't just copy/paste)

### "What if my tests fail after refactoring?"
1. Read the error carefully
2. Compare your changes to the original
3. Ask your AI: "Why would this test fail after my refactoring?"
4. Use `git diff` to see what changed
5. If needed, roll back and try again

### "What if I find more code smells during refactoring?"
Great! Add them to your plan and prioritize them.

### "Can I change my plan mid-way?"
Yes! Update your `REFACTORING-PLAN.md` and note why you changed it.

## Tips for Working with AI

### Good Prompts:
✅ "Explain why this code has high cyclomatic complexity"
✅ "Show me how to extract this magic number to a constant"
✅ "What are the risks of refactoring this function?"
✅ "Review my refactoring plan for this task"

### Bad Prompts:
❌ "Fix all the code"
❌ "Just rewrite everything"
❌ "Make it perfect"

### Best Practice:
1. **Ask for analysis first** before solutions
2. **Request step-by-step** guidance
3. **Verify with tests** after every AI suggestion
4. **Understand** before implementing

## How Much Should I Do?

**This is self-paced and optional!** Here are some ways to approach it:

**Minimal (1-2 hours):**
- Just explore the code with AI
- Identify the worst code smells
- Try fixing ONE easy thing

**Medium (4-6 hours):**
- Complete Phase 1 & 2 (analysis and planning)
- Implement 2-3 refactorings
- See meaningful improvements

**Full Exploration (10+ hours):**
- Work through your complete refactoring plan
- Transform the entire codebase
- Document your journey

**Choose based on your curiosity and available time!**

## What You Might Learn

If you dive into this experiment, you'll discover:

**About Code Quality:**
- What makes code "bad" (beyond just "it works")
- How small changes compound into big improvements
- Why naming, organization, and structure matter

**About Refactoring:**
- How to improve code without breaking it
- The value of tests as a safety net
- When to refactor vs when to rewrite

**About AI Collaboration:**
- How to work WITH AI (not just copy/paste)
- What questions to ask
- How to review AI-generated code
- When to trust AI vs when to push back

**About Yourself:**
- Your refactoring instincts
- What code patterns annoy you
- How you approach large problems
- Your preferences for code organization

## Resources

- **Your AI Assistant** - Your primary tool for this exercise!
- [Refactoring Catalog](https://refactoring.com/catalog/)
- [Code Smells](https://refactoring.guru/refactoring/smells)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
- **Your classmates** - Discuss strategies and challenges
- **Your instructor** - Office hours for stuck points

## Getting Help / Sharing Ideas

### Your AI is Your Main Partner
Ask it anything:
- "Why is this code bad?"
- "How would you refactor this?"
- "What's this pattern called?"
- "Am I missing something?"

### Classmates are Great Resources
Consider:
- Comparing what code smells you each found
- Discussing different refactoring approaches
- Pair programming on refactorings
- Reviewing each other's work

### Instructor is Available
- Questions about the exercise
- Cool patterns you discovered
- Ideas for extending this
- Just want to chat about code quality

**This is self-directed learning - explore at your own pace!**

---

## Final Thoughts

**There's no "right" amount to do.** Some possibilities:

**If you have 30 minutes:**
- Just run the CLI and experience the terrible code
- Identify 5 code smells with your AI
- Fix one easy thing

**If you have a few hours:**
- Complete the discovery phase
- Create a refactoring plan
- Implement 2-3 refactorings
- See real improvement!

**If you get hooked:**
- Transform the whole codebase
- Try different refactoring approaches
- See how much you can improve it
- Share your results with classmates!

**The goal isn't to finish—it's to explore and learn!**

Some students will barely touch this. Others will spend weeks perfecting it. Both are totally fine! This is about **your curiosity**, not completing an assignment.

---

**Have fun making terrible code better! 🎉**

**And remember:** Every professional codebase has parts that look like this. Now you know how to fix them!

## Appendix: Hints About Code Smells

If you're struggling to find code smells, look for:

### In Functions:
- Length (how many lines?)
- Complexity (how many if/else, loops?)
- Single responsibility (does it do one thing?)
- Parameters (more than 3-4 is suspicious)

### In Files:
- Size (>500 lines is a smell)
- Cohesion (does everything relate?)
- Coupling (dependencies on other files)

### In Names:
- Clarity (what does `f1()` do?)
- Consistency (same style everywhere?)
- Honesty (name matches what it does?)

### In Tests:
- Duplication (same setup repeated?)
- Independence (can run in any order?)
- Clarity (easy to understand?)

### In Data:
- Encapsulation (is state hidden?)
- Mutability (can it be changed?)
- Globals (are they necessary?)

**Use these as a checklist when analyzing code with your AI!**
