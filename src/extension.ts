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
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            toggleCheckbox(editor);
        }
    });

    context.subscriptions.push(extMarkCheckbox);

    let extCreateCheckbox = vscode.commands.registerCommand('extension.createCheckbox', () => {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let doc = editor.document;
        if (doc.languageId === "markdown") {
            createCheckbox(editor);
        }
    });

    context.subscriptions.push(extCreateCheckbox);
}

/** create a new checkbox at the current cursor position */
function createCheckbox(editor: vscode.TextEditor) {
    const cursorPosition = editor.selection.active.character;

    editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(new vscode.Position(
            editor.selection.active.line,
            editor.selection.active.character
        ), '[ ] ');
    });
}

/** mark a checkbox as checked or unchecked */
function toggleCheckbox(editor) {
    // the position object gives you the line and character where the cursor is
    const position = editor.selection.active;
    const lineText = editor.document.lineAt(position.line);
    
    const cbPosition = lineText.text.toString().indexOf('[ ]');
    const cbPositionMarked = lineText.text.toString().indexOf('[X]');

    const lineHasCheckbox = (cbPosition > -1 || cbPositionMarked > -1);    

    if (lineHasCheckbox) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            if (cbPosition > -1) {
                editBuilder.replace(new vscode.Range(
                    new vscode.Position(position.line, cbPosition + 1),
                    new vscode.Position(position.line, cbPosition + 2)
                ), 'X');
            } else if (cbPositionMarked > -1) {
                editBuilder.replace(new vscode.Range(
                    new vscode.Position(position.line, cbPositionMarked + 1),
                    new vscode.Position(position.line, cbPositionMarked + 2)
                ), ' ');
            }
        });
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}