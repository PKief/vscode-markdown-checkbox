'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-checkbox" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let extMarkCheckbox = vscode.commands.registerCommand('extension.markCheckbox', () => {
        // Display a message box to the user
        // vscode.window.showInformationMessage('Create cb!');
        var editor = getEditor();
        if (!editor) {
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            toggleCheckbox();
        }
    });

    let extCreateCheckbox = vscode.commands.registerCommand('extension.createCheckbox', () => {
        var editor = getEditor();
        if (!editor) {
            return;
        }
        let doc = editor.document;
        if (doc.languageId === "markdown") {
            createCheckbox(editor);
        }
    });

    context.subscriptions.push(extMarkCheckbox, extCreateCheckbox);
}

// create a new checkbox at the current cursor position
function createCheckbox(editor: vscode.TextEditor) {
    let withBulletPoint = vscode.workspace.getConfiguration('markdown-checkbox').get('withBulletPoint');
    let typeOfBulletPoint = vscode.workspace.getConfiguration('markdown-checkbox').get('typeOfBulletPoint');
    const cursorPosition = getCursorPosition();

    const line = editor.document.lineAt(getCursorPosition().line);
    let hasBullet = lineHasBulletPointAlready(line);    
    if (lineHasCheckbox(line) < 0) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    }
}

// give the information if the line has already a bullet point
function lineHasBulletPointAlready(line: vscode.TextLine): any {
    let fstChar = line.firstNonWhitespaceCharacterIndex;
    // console.log('firstChar: ' + line.text[fstChar]);

    switch (line.text[fstChar]) {
        case '*':
        case '+':
        case '-':
            return { pos: fstChar + 2, bullet: true };
        default:
            return { pos: fstChar, bullet: false };
    }
}

// mark a checkbox as checked or unchecked
function toggleCheckbox() {
    // the position object gives you the line and character where the cursor is
    var editor = getEditor();
    if (editor.selection.isEmpty) {
        var cursorPosition = getCursorPosition();
        var line = editor.document.lineAt(cursorPosition.line);
        toggleCheckboxOfLine(line);
        var endLine = editor.document.lineAt(editor.selection.end.line);
        getEditor().selection = new vscode.Selection(new vscode.Position(endLine.lineNumber, 20000), new vscode.Position(endLine.lineNumber, 20000));
    } else {
        let lines = [];
        var selection = editor.selection;
        for (var r = selection.start.line; r <= selection.end.line; r++) {
            lines.push(editor.document.lineAt(r));
        }
        toggleLine(0);
        function toggleLine(index) {
            if (lines.length > index) {
                if (toggleCheckboxOfLine(lines[index])) {
                    toggleCheckboxOfLine(lines[index]).then(() => {
                        toggleLine(++index);
                    });
                } else {
                    toggleLine(++index);
                }
            }
        }
    }
}

// check if line has a checkbox (-1 = no checkbox, 0 = unmarked, 1 = marked)
function lineHasCheckbox(line: vscode.TextLine) {
    var lineText = line.text.toString();
    var cbPosition = lineText.indexOf('[ ]');
    var cbPositionMarked = lineText.indexOf('[X]');

    if (cbPosition > -1) {
        return 0;
    } else if (cbPositionMarked > -1) {
        return 1;
    } else {
        return -1;
    }
}

// mark or unmark the checkbox of a given line in the editor
function toggleCheckboxOfLine(line: vscode.TextLine) {
    var lineText = line.text.toString();
    var cbPosition = lineText.indexOf('[ ]');
    var cbPositionMarked = lineText.indexOf('[X]');

    // var lineHasCheckbox = (cbPosition > -1 || cbPositionMarked > -1);
    let lhc = lineHasCheckbox(line);

    if (lhc !== -1) {
        if (lhc === 0) {
            return markField(new vscode.Position(line.lineNumber, cbPosition), 'X');
        } else if (lhc === 1) {
            return markField(new vscode.Position(line.lineNumber, cbPositionMarked), ' ');
        }
    }

    return null;
}

// marks the field inside the checkbox with a character (returns a promise)
function markField(checkboxPosition: vscode.Position, char: string) {
    return getEditor().edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.replace(new vscode.Range(
            new vscode.Position(checkboxPosition.line, checkboxPosition.character + 1),
            new vscode.Position(checkboxPosition.line, checkboxPosition.character + 2)
        ), char);

        let italicWhenChecked = vscode.workspace.getConfiguration('markdown-checkbox').get('italicWhenChecked');
        let strikeThroughWhenChecked = vscode.workspace.getConfiguration('markdown-checkbox').get('strikeThroughWhenChecked');

        let line = getEditor().document.lineAt(checkboxPosition.line);
        let lhc = lineHasCheckbox(line);
        let lineText = line.text.trim();
        let textWithoutCheckbox = lineText.substr(checkboxPosition.character + 4, lineText.length).trim();

        if (lhc === 0 && textWithoutCheckbox.length > 0) {
            let newText = (strikeThroughWhenChecked ? '~~' : '') + (italicWhenChecked ? '*' : '') + textWithoutCheckbox + (italicWhenChecked ? '*' : '') + (strikeThroughWhenChecked ? '~~' : '');
            editBuilder.replace(new vscode.Range(
                new vscode.Position(checkboxPosition.line, checkboxPosition.character + 4),
                new vscode.Position(checkboxPosition.line, line.text.length)
            ), newText);
        } else if (lhc === 1) {
            let newText = textWithoutCheckbox.replace(/~~/g, '').replace(/\*/g, '');
            editBuilder.replace(new vscode.Range(
                new vscode.Position(checkboxPosition.line, checkboxPosition.character + 4),
                new vscode.Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
    });
}

// returns the current cursor position
function getCursorPosition(): vscode.Position {
    return getEditor().selection.active;
}

// returns the active editor of vs code
function getEditor(): vscode.TextEditor {
    return vscode.window.activeTextEditor;
}

// this method is called when your extension is deactivated
export function deactivate() {
}