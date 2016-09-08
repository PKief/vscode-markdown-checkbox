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
    const cursorPosition = getCursorPosition();
    if (editor.selection.isEmpty) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(
                cursorPosition.line,
                cursorPosition.character
            ), '[ ] ');
        });
    } else {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(editor.selection, '[ ] ');
        });
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

// mark or unmark the checkbox of a given line in the editor
function toggleCheckboxOfLine(line: vscode.TextLine) {
    var lineText = line.text.toString();
    var cbPosition = lineText.indexOf('[ ]');
    var cbPositionMarked = lineText.indexOf('[X]');

    var lineHasCheckbox = (cbPosition > -1 || cbPositionMarked > -1);

    if (lineHasCheckbox) {
        if (cbPosition > -1) {
            return markField(new vscode.Position(line.lineNumber, cbPosition), 'X');
        } else if (cbPositionMarked > -1) {
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