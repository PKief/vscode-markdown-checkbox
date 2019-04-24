# Change Log
## 1.6.0 (2019-04-24)
### Features
- Configurable checkmark ([@PKief](https://github.com/PKief) in [#14](https://github.com/PKief/vscode-markdown-checkbox/pull/14))

## 1.5.0 (2019-03-16)
### Refactoring
- Bundle extension with webpack ([@PKief](https://github.com/PKief) in [#12](https://github.com/PKief/vscode-markdown-checkbox/pull/12))
  - Reduces extension size by 35 %
  - Faster extension startup activation
- CI Improvements

## 1.4.3 (2019-03-04)
### Bug Fixes
- Respect trailing whitespace on toggle ([issue #11](https://github.com/PKief/vscode-markdown-checkbox/issues/11))

## 1.4.2 (2019-01-28)
### Bug Fixes
- Fixed date timezone ([issue #10](https://github.com/PKief/vscode-markdown-checkbox/issues/10))

## 1.4.1 (2018-11-27)
### Bug Fixes
- Fixed security [issue](https://github.com/dominictarr/event-stream/issues/116) with event-stream dependency ([4e83234](https://github.com/PKief/vscode-markdown-checkbox/commit/4e83234))

## 1.4.0 (2018-10-28)
### Features
- Specify multiple language IDs for which the extension is activated ([@reedspool](https://github.com/reedspool) in [#9](https://github.com/PKief/vscode-markdown-checkbox/pull/9))

### Refactoring
- Improved code quality ([275d66d](https://github.com/PKief/vscode-markdown-checkbox/commit/275d66d))
- Updated tests ([6292b4a](https://github.com/PKief/vscode-markdown-checkbox/commit/6292b4a))
- Changed configuration title ([1c21b7f](https://github.com/PKief/vscode-markdown-checkbox/commit/1c21b7f))

## 1.3.0 (2018-04-22)
### Features
- Toggle all checkboxes in the document with the [Multi-Select QuickPick](https://github.com/PKief/vscode-markdown-checkbox/blob/master/README.md#pick-checkboxes)
- Rearranged context menu entries

### Other improvements
- Added tests
- Added CI tools

## 1.2.0 (2018-03-23)
### Features
- **status bar**: Added configuration to control the visibility of the status bar item ([6067ec9](https://github.com/PKief/vscode-markdown-checkbox/commit/6067ec9)), closes [#8](https://github.com/PKief/vscode-markdown-checkbox/issues/8)

## 1.1.1 (2018-01-09)
### Bug Fixes
- **status bar**: Status bar updates completed tasks if a lowercase 'x' is used ([515407e](https://github.com/PKief/vscode-markdown-checkbox/commit/515407e)), closes [#7](https://github.com/PKief/vscode-markdown-checkbox/issues/7)

## 1.1.0 (2017-11-23)
### Features
- **checkbox**: added date support ([@jcvtieck](https://github.com/jcvtieck) in [#6](https://github.com/PKief/vscode-markdown-checkbox/pull/6))

### Refactoring
- code refactoring
- reduced extension size

## 1.0.3 (2017-07-31)
- updated description
    - keybindings for Mac ([@mark-anders](https://github.com/mark-anders) in [#5](https://github.com/PKief/vscode-markdown-checkbox/pull/5))
- updated dependencies
- added tslint
- updated logo

## 1.0.2 (2016-10-09)
- added status bar item to show status of all checkboxes