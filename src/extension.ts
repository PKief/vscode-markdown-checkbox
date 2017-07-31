'use strict';
import * as vscode from 'vscode';
import Checkbox from './checkbox';
import * as helpers from './helpers';
import { createCheckbox } from './createCheckbox';
import { toggleCheckbox } from './toggleCheckbox';
import { CheckboxStatus, CheckboxStatusController } from './checkboxStatus';

export const activate = (context: vscode.ExtensionContext) => {
    // item in the status bar to show checkbox information
    let checkboxStatus = new CheckboxStatus();
    let controller = new CheckboxStatusController(checkboxStatus);

    // subscribe to changes to update the status bar
    context.subscriptions.push(controller);
    context.subscriptions.push(checkboxStatus);

    let extMarkCheckbox = vscode.commands.registerCommand('extension.markCheckbox', () => {
        const editor = helpers.getEditor();
        if (!editor) {
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            toggleCheckbox();
        }
    });

    let extCreateCheckbox = vscode.commands.registerCommand('extension.createCheckbox', () => {
        const editor = helpers.getEditor();
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
export const deactivate = () => {
    // loadStatusBarItem();
};