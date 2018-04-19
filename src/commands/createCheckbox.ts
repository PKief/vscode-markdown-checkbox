import * as vscode from 'vscode';
import { createCheckbox } from '../createCheckbox';
import { getEditor } from '../helpers';

export const createCheckboxCommand = vscode.commands.registerCommand('markdown-checkbox.createCheckbox', () => {
    const editor = getEditor();

    if (!editor) {
        return;
    }

    const doc = editor.document;
    if (doc.languageId === 'markdown') {
        try {
            createCheckbox(editor);
        } catch (error) {
            console.log(error);
        }
    }
});
