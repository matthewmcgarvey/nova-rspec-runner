# RSpec Commands for Nova

## Description

Provides three commands for running RSpec tests. Outputs any errors on their files.

## Shortcuts

```json
[
  {
    "title": "Run all specs",
    "command": "rspec-runner.allSpecs",
    "shortcut": "ctrl-r",
    "when": "editorHasFocus"
  },
  {
    "title": "Run specs in file",
    "command": "rspec-runner.fileSpecs",
    "shortcut": "ctrl-t",
    "when": "editorHasFocus",
    "filter": {
      "syntaxes": ["ruby"]
    }
  },
  {
    "title": "Run specs on line",
    "command": "rspec-runner.lineSpecs",
    "shortcut": "ctrl-l",
    "when": "editorHasFocus",
    "filter": {
      "syntaxes": ["ruby"]
    }
  }
]
```
