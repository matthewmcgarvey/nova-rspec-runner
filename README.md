# Nova RSpec Runner

This extension was purely to learn about Nova and should not in any way be considered "good".
I made this the first day of trying Nova and was trying to port an extension I use on VSCode.

## Findings

- Cannot access user terminals (makes sense with the whole entitlements thing that being able to write to a user's terminal would not be safe)
- TreeView's are the only visual panel for long content you can add other than opening a document
- Line numbers are incredibly difficult to determine when Nova only gives you character count

## Publishing

- Update `RSpecRunner.novaextension/CHANGELOG.md` with the next version number and a description of changes.
- Update the version number in `RSpecRunner.novaextension/extension.json`
- Run `npm install`
- Run `npm run-script build`
- In Nova select `Submit to the Extension Library...` in the `Extensions` memu
