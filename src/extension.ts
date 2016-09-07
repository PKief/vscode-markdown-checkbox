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

    context.subscriptions.push(extMarkCheckbox,extCreateCheckbox);
}

// create a new checkbox at the current cursor position
function createCheckbox(editor: vscode.TextEditor) {
    const cursorPosition = getCursorPosition();

    editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(new vscode.Position(
            cursorPosition.line,
            cursorPosition.character
        ), '[ ] ');
    });
}

// mark a checkbox as checked or unchecked
function toggleCheckbox() {
    // the position object gives you the line and character where the cursor is
    const cursorPosition = getCursorPosition();
    const lineText = getEditor().document.lineAt(cursorPosition.line).text.toString();

    const cbPosition = lineText.indexOf('[ ]');
    const cbPositionMarked = lineText.indexOf('[X]');

    const lineHasCheckbox = (cbPosition > -1 || cbPositionMarked > -1);

    if (lineHasCheckbox) {
        if (cbPosition > -1) {
            markField(cbPosition, 'X');
        } else if (cbPositionMarked > -1) {
            markField(cbPositionMarked, ' ');
        }
    }
}

// returns the current cursor position
function getCursorPosition(): vscode.Position {
    return getEditor().selection.active;
}

// returns the active editor of vs code
function getEditor(): vscode.TextEditor {
    return vscode.window.activeTextEditor;
}

// mark the field inside the checkbox with a character
function markField(checkboxPosition: number, character: string) {
    // vscode.window.showInformationMessage(checkboxPosition.toString());    
    const cursorPosition = getCursorPosition();
    getEditor().edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.replace(new vscode.Range(
            new vscode.Position(cursorPosition.line, checkboxPosition + 1),
            new vscode.Position(cursorPosition.line, checkboxPosition + 2)
        ), character);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}