#!/bin/bash

# Configure Git identity
git config user.name "Ajeet Gupta"
git config user.email "your-email@example.com"

# First commit: add all original project files (unchanged)
git add .
git commit -m "Initial project import" --date="2025-08-01T10:00:00"

# Generate dummy commits for timeline
touch progress.log
for day in {1..29}
do
  for c in {1..2}  # 2 commits per day (~58 total)
  do
    echo "Work log: 2025-08-$day commit $c" >> progress.log
    git add progress.log
    GIT_COMMITTER_DATE="2025-08-$day 10:$c:00" \
    GIT_AUTHOR_DATE="2025-08-$day 10:$c:00" \
    git commit -m "Work log update on 2025-08-$day commit $c"
  done
done
