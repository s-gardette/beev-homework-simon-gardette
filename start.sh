#!/usr/bin/env sh

SESSION="beev"

# If session exists just attach
tmux has-session -t "$SESSION" 2>/dev/null
if [ $? -eq 0 ]; then
	tmux attach -t "$SESSION"
	exit 0
fi

# Start docker compose services in detached mode
tmux new-session -d -s "$SESSION" -n init
tmux send-keys -t "$SESSION:init" 'echo "Starting database and redis..."' C-m
docker compose up database redis -d
tmux kill-session -t "$SESSION:init"

# Create session detached and set up windows
tmux new-session -d -s "$SESSION" -n logs
tmux send-keys -t "$SESSION:logs" 'docker compose logs -f' C-m

tmux new-window -t "$SESSION" -n backend
tmux send-keys -t "$SESSION:backend" 'pnpm run dev:backend' C-m

tmux new-window -t "$SESSION" -n frontend
tmux send-keys -t "$SESSION:frontend" 'pnpm run dev:frontend' C-m

# Select the logs window and attach
tmux select-window -t "$SESSION:logs"
tmux attach -t "$SESSION"


# note : use `tmux kill-session -t beev` to stop everything