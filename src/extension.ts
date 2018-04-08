import * as vscode from 'vscode';
import { CheckboxStatus, CheckboxStatusController } from './checkboxStatus';
import { createCheckboxCommand } from './commands/createCheckbox';
import { markCheckboxCommand } from './commands/markCheckbox';
import { showQuickPickCommand } from './commands/quickpick';

export const activate = (context: vscode.ExtensionContext) => {
    // item in the status bar to show checkbox information
    const checkboxStatus = new CheckboxStatus();
    const controller = new CheckboxStatusController(checkboxStatus);

    // subscribe to changes to update the status bar
    context.subscriptions.push(checkboxStatus);
    context.subscriptions.push(controller);

    context.subscriptions.push(
        markCheckboxCommand,
        createCheckboxCommand,
        showQuickPickCommand
    );
};

// this method is called when the extension is deactivated
export const deactivate = () => { };
