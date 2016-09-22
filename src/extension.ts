'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

//interface for a checkbox
interface Checkbox {
    checked: boolean;
    position: vscode.Position;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {

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
};

const getConfig = (config: string): any =>
    vscode.workspace.getConfiguration('markdown-checkbox').get(config);

// create a new checkbox at the current cursor position
const createCheckbox = (editor: vscode.TextEditor): void => {
    let withBulletPoint = getConfig('withBulletPoint');
    let typeOfBulletPoint = getConfig('typeOfBulletPoint');
    const cursorPosition = getCursorPosition();

    const line = editor.document.lineAt(getCursorPosition().line);
    let hasBullet = lineHasBulletPointAlready(line);
    if (lineHasCheckbox(line) === null) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    }
};

// give the information if the line has already a bullet point
const lineHasBulletPointAlready = (line: vscode.TextLine): any => {
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
};

// mark a checkbox as checked or unchecked
const toggleCheckbox = () => {
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
};

// check if line has a checkbox (-1 = no checkbox, 0 = unmarked, 1 = marked)
const lineHasCheckbox = (line: vscode.TextLine): Checkbox => {
    var lineText = line.text.toString();
    var cbPosition = lineText.indexOf('[ ]');
    var cbPositionMarked = lineText.indexOf('[X]');

    if (cbPosition > -1) {
        return { checked: false, position: new vscode.Position(line.lineNumber, cbPosition) };
    } else if (cbPositionMarked > -1) {
        return { checked: true, position: new vscode.Position(line.lineNumber, cbPositionMarked) };
    } else {
        return null;
    }
};

// mark or unmark the checkbox of a given line in the editor
const toggleCheckboxOfLine = (line: vscode.TextLine): any => {
    let lhc = lineHasCheckbox(line);

    console.log(lineHasCheckbox);

    if (lhc) {
        if (!lhc.checked) {
            return markField(lhc.position, 'X');
        } else {
            return markField(lhc.position, ' ');
        }
    }

    return null;
};

// marks the field inside the checkbox with a character (returns a promise)
const markField = (checkboxPosition: vscode.Position, char: string): Thenable<boolean> => {
    return getEditor().edit((editBuilder: vscode.TextEditorEdit) => {        
        editBuilder.replace(new vscode.Range(
            new vscode.Position(checkboxPosition.line, checkboxPosition.character + 1),
            new vscode.Position(checkboxPosition.line, checkboxPosition.character + 2)
        ), char);

        let italicWhenChecked = getConfig('italicWhenChecked');
        let strikeThroughWhenChecked = getConfig('strikeThroughWhenChecked');

        let line = getEditor().document.lineAt(checkboxPosition.line);
        let lhc = lineHasCheckbox(line);
        let lineText = line.text.trim();
        let textWithoutCheckbox = lineText.substr(checkboxPosition.character + (lhc.position.character > 2 ? 0 : 4), lineText.length).trim();

        if (!lhc.checked && textWithoutCheckbox.length > 0) {
            let newText = (strikeThroughWhenChecked ? '~~' : '') + (italicWhenChecked ? '*' : '') + textWithoutCheckbox + (italicWhenChecked ? '*' : '') + (strikeThroughWhenChecked ? '~~' : '');
            editBuilder.replace(new vscode.Range(
                new vscode.Position(checkboxPosition.line, checkboxPosition.character + 4),
                new vscode.Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
        else if (lhc.checked) {
            let newText = textWithoutCheckbox.replace(/~~/g, '').replace(/\*/g, '');
            editBuilder.replace(new vscode.Range(
                new vscode.Position(checkboxPosition.line, checkboxPosition.character + 4),
                new vscode.Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
    });
};

// returns the current cursor position
const getCursorPosition = (): vscode.Position => {
    return getEditor().selection.active;
};

// returns the active editor of vs code
const getEditor = (): vscode.TextEditor => {
    return vscode.window.activeTextEditor;
};

// this method is called when your extension is deactivated
export const deactivate = () => {}