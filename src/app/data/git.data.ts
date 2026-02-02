import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const GIT_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Git,
    header: 'How to revert a specific commit while keeping subsequent commits',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Scenario: Revert commit A but keep commit B',
        description: 'A user added 2 commits A then B which were already pushed. Now user wants to revert A and only keep B.',
        body: `# Initial state: both commits are pushed
# A (older) <- B (newer) <- HEAD

# Step 1: Revert commit A (creates a new commit that undoes A)
[[MARK]]git revert <commit-A-hash>[[/MARK]]

# This creates a new commit that reverses the changes from commit A
# The history now looks like:
# A <- B <- Revert-A <- HEAD

# If there are conflicts during the revert, resolve them:
[[MARK]]git status[[/MARK]]                    # See conflicted files
# Edit the conflicted files to resolve issues
[[MARK]]git add <resolved-files>[[/MARK]]      # Stage resolved files
[[MARK]]git revert --continue[[/MARK]]         # Complete the revert

# Step 2: Push the revert commit
[[MARK]]git push origin <branch-name>[[/MARK]]`,
        output: `[main abc1234] Revert "commit A message"
 1 file changed, 10 deletions(-)
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 300 bytes | 300.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To github.com:user/repo.git
   def5678..abc1234  main -> main`
      },
      {
        title: 'Alternative: Interactive rebase (if not pushed yet)',
        description: 'If the commits were not yet pushed, you can use interactive rebase to remove commit A entirely.',
        body: `# WARNING: Only use if commits are NOT pushed or you're working alone
# This rewrites history!

# Start interactive rebase from before commit A
[[MARK]]git rebase -i <commit-before-A-hash>[[/MARK]]

# In the editor that opens, you'll see:
# pick <hash-A> commit A message
# pick <hash-B> commit B message

# Change 'pick' to 'drop' for commit A:
# drop <hash-A> commit A message
# pick <hash-B> commit B message

# Save and close the editor
# Git will replay commit B without commit A

# Force push (only if already pushed and you're sure!)
[[MARK]]git push --force-with-lease origin <branch-name>[[/MARK]]`,
        output: `Successfully rebased and updated refs/heads/main.`
      },
      {
        title: 'Verify the result',
        body: `# View the commit history
[[MARK]]git log --oneline -5[[/MARK]]

# See what changed in the revert commit
[[MARK]]git show HEAD[[/MARK]]

# Compare current state with remote
[[MARK]]git diff origin/<branch-name>[[/MARK]]`,
        output: `abc1234 (HEAD -> main) Revert "commit A message"
def5678 commit B message
ghi9012 commit A message
jkl3456 previous commit`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Git,
    header: 'How to squash commits (combine multiple commits into one)',
    categories: [Category.Basic],
    sections: [
      {
        title: 'View current commit history',
        description: 'Check the commits you want to squash together.',
        body: `# View the commit history
[[MARK]]git log --oneline[[/MARK]]`,
        output: `789abc3 Fix bug in feature X
456def2 Add more tests for feature X
123abc1 Implement feature X
789xyz0 Initial commit`
      },
      {
        title: 'Start interactive rebase',
        description: 'Rebase the last 3 commits interactively to squash them.',
        body: `# Interactive rebase for last 3 commits
[[MARK]]git rebase -i HEAD~3[[/MARK]]

# Alternative: Use commit hash directly
# git rebase -i 789xyz0

# In the editor that opens, you'll see:
# pick 123abc1 Implement feature X
# pick 456def2 Add more tests for feature X
# pick 789abc3 Fix bug in feature X

# Change 'pick' to 'squash' (or 's') for commits to merge:
# pick 123abc1 Implement feature X
# squash 456def2 Add more tests for feature X
# squash 789abc3 Fix bug in feature X

# Save and close the editor
# Git will combine all squashed commits into the 'pick' commit`,
        output: `[detached HEAD abc1234] Implement feature X
 Date: Mon Jan 20 10:00:00 2026 +0100
 3 files changed, 150 insertions(+), 5 deletions(-)
Successfully rebased and updated refs/heads/main.`
      },
      {
        title: 'Edit the combined commit message',
        description: 'After selecting commits to squash, Git opens another editor to compose the final commit message.',
        body: `# Git will show all commit messages:
# This is a combination of 3 commits.
# This is the 1st commit message:

Implement feature X

# This is the commit message #2:

Add more tests for feature X

# This is the commit message #3:

Fix bug in feature X

# Edit to create a single, clear commit message
# Then save and close the editor`,
        output: `[detached HEAD abc1234] Implement feature X
 Date: Mon Jan 20 10:00:00 2026 +0100
 3 files changed, 150 insertions(+), 5 deletions(-)`
      },
      {
        title: 'Verify the squashed result',
        body: `# View the new commit history
[[MARK]]git log --oneline[[/MARK]]

# See all changes in the squashed commit
[[MARK]]git show HEAD[[/MARK]]`,
        output: `abc1234 Implement feature X
789xyz0 Initial commit`
      },
      {
        title: 'Push the squashed commits',
        description: 'If the commits were already pushed, you need to force push. Otherwise, a normal push is sufficient.',
        body: `# If commits were already pushed (rewrites history!)
[[MARK]]git push --force-with-lease origin <branch-name>[[/MARK]]

# If commits were only local
[[MARK]]git push origin <branch-name>[[/MARK]]`,
        output: `Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 350 bytes | 350.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To github.com:user/repo.git
   789xyz0..abc1234  main -> main`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Git,
    header: 'Using fixup to combine commits without editing messages',
    categories: [Category.Basic],
    sections: [
      {
        title: 'When to use fixup vs squash',
        description: 'Use fixup when you want to discard the commit messages of later commits and keep only the first commit\'s message.',
        body: `# Scenario: You made a main commit, then small fixes
[[MARK]]git log --oneline[[/MARK]]`,
        output: `def5678 Fix typo in documentation
abc3456 Fix missing import
123abc1 Add user authentication feature
789xyz0 Initial commit`
      },
      {
        title: 'Using fixup instead of squash',
        description: 'Fixup automatically discards the commit messages of the fixup commits, keeping only the picked commit\'s message.',
        body: `# Interactive rebase for last 3 commits
[[MARK]]git rebase -i HEAD~3[[/MARK]]

# In the editor:
# pick 123abc1 Add user authentication feature
# pick abc3456 Fix missing import
# pick def5678 Fix typo in documentation

# Change to fixup (or f):
# pick 123abc1 Add user authentication feature
# fixup abc3456 Fix missing import
# fixup def5678 Fix typo in documentation

# Save and close
# Git will combine all commits but ONLY keep the first message
# No second editor opens - it's automatic!`,
        output: `[detached HEAD xyz9876] Add user authentication feature
 Date: Mon Jan 20 10:00:00 2026 +0100
 3 files changed, 85 insertions(+), 2 deletions(-)
Successfully rebased and updated refs/heads/main.`
      },
      {
        title: 'Verify the result',
        body: `[[MARK]]git log --oneline[[/MARK]]`,
        output: `xyz9876 Add user authentication feature
789xyz0 Initial commit`
      },
      {
        title: 'Key differences: squash vs fixup',
        description: 'Understanding when to use each command.',
        body: `# SQUASH:
# - Opens editor to combine/edit commit messages
# - Use when commit messages are meaningful and should be preserved
# Example: Combining related features with descriptive messages

# FIXUP:
# - Automatically discards fixup commit messages
# - No editor opens for commit message
# - Use for small fixes, typos, forgotten changes
# - Faster workflow for cleanup commits

# Quick fixup workflow during development:
[[MARK]]git commit -m "Add feature"[[/MARK]]
# ... realize you forgot something ...
[[MARK]]git add forgotten-file.txt[[/MARK]]
[[MARK]]git commit --fixup HEAD[[/MARK]]  # Creates "fixup! Add feature"
# ... later ...
[[MARK]]git rebase -i --autosquash HEAD~2[[/MARK]]  # Automatically arranges fixup commits`
      }
    ]
  }
];
