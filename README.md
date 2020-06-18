# Markdown checkbox
[![Version](https://vsmarketplacebadge.apphb.com/version/PKief.markdown-checkbox.svg)](https://marketplace.visualstudio.com/items?itemName=PKief.markdown-checkbox)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/PKief.markdown-checkbox.svg)](https://marketplace.visualstudio.com/items?itemName=PKief.markdown-checkbox)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/PKief.markdown-checkbox.svg)](https://marketplace.visualstudio.com/items?itemName=PKief.markdown-checkbox)
[![Build Status](https://travis-ci.com/PKief/vscode-markdown-checkbox.svg?branch=master)](https://travis-ci.com/PKief/vscode-markdown-checkbox)
  
## Description
With this extension for Visual Studio Code it's possible to create todo lists in markdown. The extension provides shortcuts and some workspace configurations to create checkboxes and mark them with a shortcut.

## How to use
![Preview](https://raw.githubusercontent.com/PKief/vscode-extension-markdown-checkbox/master/images/preview.gif)

## Information in status bar
![Preview of status bar information](https://raw.githubusercontent.com/PKief/vscode-extension-markdown-checkbox/master/images/statusbar_preview.png)

*At least one checkbox must exist in a file to see this information.*

## Pick Checkboxes
Toggle all checkboxes in the current document with the Multi-Select QuickPick:

![Preview of Multi-Select QuickPick](images/pick_checkboxes.gif)

The QuickPick can be opened either from the command palette or by clicking on the status bar item.

## Keybindings

| Command           | Windows                                               | Mac                                             |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Create a checkbox | <kbd>CTRL</kbd> + <kbd>Shift</kbd> + <kbd>c</kbd>     | <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>c</kbd>     |
| Toggle checkbox   | <kbd>CTRL</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> | <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>Enter</kbd> |

These are the initial keyboard shortcuts, which can be customized by the [Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings) settings in VS Code.

## Configuration
This extension can be customized with the following options.

### Bullet points
If bullet points before the checkboxes are required, then they can be enabled with the following setting:

    options: true | false

```json
"markdown-checkbox.withBulletPoint": true
```
Example:
```
* [ ] todo
```

### Type of bullet points
Select a type of bullet point:

    options: "*" | "-" | "+"
  
```json
"markdown-checkbox.typeOfBulletPoint": "*"
```

Example
```
* [ ] asterisk
- [ ] minus
+ [ ] plus
```

### Type of checkmark
Select a type of checkmark:

    options: "X" | "x"
  
```json
"markdown-checkbox.checkmark": "X"
```

Example
```
- [X] uppercase checkmark
- [x] lowercase checkmark
```

### Italic
Italic font style of line of the checkbox after the checkbox has been checked:

    options: true | false
  
```json
"markdown-checkbox.italicWhenChecked": true
```
Preview
* [X] *this line is italic*

### Strikethrough
Strikethrough the line of the checkbox after the checkbox has been checked:

    options: true | false
  
```json
"markdown-checkbox.strikeThroughWhenChecked": true
```
Preview:
* [X] ~~*this line has been crossed out*~~

### Date when checked
Add date behind the checkbox item after the checkbox has been checked:

    options: true | false
  
```json
"markdown-checkbox.dateWhenChecked": true
```
Preview:
* [X] ~~*sample with date*~~ [2017-11-23]

### Format date
If dates are enabled, they can be formatted with the following user setting:

```json
"markdown-checkbox.dateFormat": "YYYY-MM-DD"
```

It makes use of the JavaScript library [moment.js](https://momentjs.com/docs/#/parsing/string-format/) which means that the date format patterns can be found there.

### Specify language IDs
Besides markdown, this extension can also be used for other languages in VS Code. The language IDs can be specified in the user settings like this:

```json
"markdown-checkbox.languages": [
    "markdown",
    "plaintext"
]
```