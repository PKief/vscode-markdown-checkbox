# Markdown checkbox
![Version](http://vsmarketplacebadge.apphb.com/version/PKief.markdown-checkbox.svg)
![Installs](http://vsmarketplacebadge.apphb.com/installs/PKief.markdown-checkbox.svg)
![Ratings](http://vsmarketplacebadge.apphb.com/rating-short/PKief.markdown-checkbox.svg)
  
## Description
With this extension for Visual Studio Code it's possible to create your todo list in markdown. The extension provides shortcuts and some workspace configurations so you can create a checkbox and mark it quickly and smoothly.

## How to use
![Preview](https://raw.githubusercontent.com/PKief/vscode-extension-markdown-checkbox/master/images/preview.gif)

## Information in status bar
![Preview of status bar information](https://raw.githubusercontent.com/PKief/vscode-extension-markdown-checkbox/master/images/statusbar_preview.png)

*You have to create at least one checkbox to see this information.*

## Keybindings
Create a checkbox:

> `ctrl + shift + c` or ⌘⇧c (Mac)

Toggle checkbox:

> `ctrl + shift + enter` or ⇧Enter (Mac)


## Configuration
You can customize this extension with the following options.

> *File -> Preferences -> Workspace Settings*


### Need a bullet point?
Do you need a bullet point before the created checkbox? Select true (*default*) for this:

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

## Latest update

* [X] added status bar item to show status of all checkboxes

## License
MIT
