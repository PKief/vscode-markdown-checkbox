import * as vscode from 'vscode';
import * as helpers from '../helpers';
import { toggleCheckbox } from '../toggleCheckbox';

export const markCheckboxCommand = vscode.commands.registerCommand('markdown-checkbox.markCheckbox', () => {
    const editor = helpers.getEditor();

    if (!editor) {
        return;
    }

    const doc = editor.document;

    if (doc.languageId === 'markdown') {
        try {
            toggleCheckbox();
        } catch (error) {
            console.log(error);
        }
    }
});
