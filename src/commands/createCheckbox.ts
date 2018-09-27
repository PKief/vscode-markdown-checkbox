import * as vscode from 'vscode';
import { createCheckbox } from '../createCheckbox';
import * as helpers from '../helpers';

export const createCheckboxCommand = vscode.commands.registerCommand('markdown-checkbox.createCheckbox', () => {
    if (! helpers.shouldActivate()) {
        return;
    }

    try {
        createCheckbox(helpers.getEditor());
    } catch (error) {
        console.log(error);
    }
});
