# ☑ Markdown checkbox
## Description
With this extension for Visual Studio Code it's possible to create your todo list in markdown. The extension provides shortcuts and some workspace configurations so you can create a checkbox and mark it quickly and smoothly.  

## How to use

![Preview](https://raw.githubusercontent.com/PKief/vscode-extension-markdown-checkbox/withimages/images/preview.gif)

## Keybindings
Create a checkbox:

> Press `ctrl+shift+c`

Mark it as done:

> Press `ctrl+shift+enter`


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
Italic font style of line of the checkbox after the checkbox has been checked (*disabled by default*):

    options: true | false
  
```json
"markdown-checkbox.italicWhenChecked": false
```
Preview
* [X] *added bullet points*

### Strikethrough
Strikethrough the line of the checkbox after the checkbox has been checked (*disabled by default*):

    options: true | false
  
```json
"markdown-checkbox.strikeThroughWhenChecked": false
```
Preview:
* [X] ~~*added bullet points*~~

### Checkbox position
Create the checkbox always at the beginning of a line (*default*) or at the current cursor position.

**Important:** If you select the "cursor" option, the strikethrough and the italic style will not be available! And it is recommended that you turn the bullet points option to false! This is only if you want your checkbox not at the beginning of the line. I cannot imagine a use case for it, but you have the possibility to do what you want ;)

    options: "line" | "cursor"

```json
"markdown-checkbox.checkboxPosition": "line"
```

## Latest update

* [X] added bullet points
* [X] added workspace settings 
* [X] possibility to strikethrough the "checked" lines
* [X] possibility to show the "checked" line in italic 
* [X] fixed bugs
* [X] improved flow

## License
MIT