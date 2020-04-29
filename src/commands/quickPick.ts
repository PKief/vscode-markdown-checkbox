import * as vscode from 'vscode';
import Checkbox from '../models/checkbox';
import { getAllCheckboxes, getEditor } from '../helpers';
import { toggleCheckboxOfLine } from '../toggleCheckbox';

/** Register command */
export const showQuickPickCommand = vscode.commands.registerCommand('markdown-checkbox.showQuickPick', () => {
    showQuickPick();
});

/** Command to toggle the folder icons. */
const showQuickPick = () => {
    const allCheckboxes: Checkbox[] = getAllCheckboxes();
    showQuickPickItems(allCheckboxes).then(handleQuickPickActions);
};

/** Show QuickPick items to select preferred configuration for the folder icons. */
const showQuickPickItems = (checkboxes: Checkbox[]) => {
    const pickItems: vscode.QuickPickItem[] = checkboxes.map(checkbox => {
        return {
            description: checkbox.text,
            picked: checkbox.checked,
            label: 'line ' + checkbox.lineNumber.toString(),
        } as vscode.QuickPickItem;
    });
    return vscode.window.showQuickPick(
        pickItems, {
            placeHolder: 'Toggle checkboxes',
            ignoreFocusOut: false,
            matchOnDescription: true,
            canPickMany: true,
        });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = async (items: vscode.QuickPickItem[]) => {
    const allCheckboxes: Checkbox[] = getAllCheckboxes();

    // get all line numbers that must be checked
    const linesToCheck: number[] = items.map(i => parseInt(getLineNumberOfLabel(i.label)));

    // get all line numbers that must be unchecked
    const linesToUncheck = allCheckboxes.filter(c => !linesToCheck.some(l => l === c.lineNumber)).map(c => c.lineNumber);

    const editor = getEditor();

    // check the checked items by the quickpick
    for (let lineNumber of linesToCheck) {
        const line = editor.document.lineAt(lineNumber);
        await toggleCheckboxOfLine(line, true);
    }

    // uncheck the items that are not returned by the quick pick
    for (let lineNumber of linesToUncheck) {
        const line = editor.document.lineAt(lineNumber);
        await toggleCheckboxOfLine(line, false);
    }
};

// Get the line number out of the label of a quick pick item
const getLineNumberOfLabel = (label: string) => label.match(/\d+/)[0];
