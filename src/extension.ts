'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Checkbox from './checkbox';
import * as helpers from './helpers';
import { createCheckbox } from './createCheckbox';
import { toggleCheckbox } from './toggleCheckbox';

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
        var editor = helpers.getEditor();
        if (!editor) {
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            toggleCheckbox();
        }
    });

    let extCreateCheckbox = vscode.commands.registerCommand('extension.createCheckbox', () => {
        var editor = helpers.getEditor();
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


// this method is called when your extension is deactivated
export const deactivate = () => {}