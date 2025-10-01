#!/bin/bash

if tmux has-session -t CV 2>/dev/null; then
  tmux attach -t CV

else
  tmux new -d -s CV
  tmux send-keys -t CV "cd ~/REPO1/cv" C-m
  tmux ls
  # tmux attach -t CV
fi