# Linux & Rsync Cheatsheet

## File Synchronization & Backups
- **Local Copy with Progress** (`rsync -avhP source/ dest/`): `-a` (archive mode), `-v` (verbose), `-h` (human-readable sizes), `-P` (shows progress and enables partial resume).
- **Remote Sync over SSH** (`rsync -avz -e ssh user@remote:/path/to/src /local/dest`): `-z` compresses file data during transfer over SSH.
- **Sync with Deletion** (`rsync -avz --delete source/ remote:/dest/`): `--delete` removes destination files that no longer exist in the source directory.
