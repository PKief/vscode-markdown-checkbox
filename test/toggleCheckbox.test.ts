import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDateString, getEditor } from '../src/helpers';
import { toggleCheckbox } from '../src/toggleCheckbox';

suite('toggle checkboxes', () => {
    test('should be toggled with selection', async () => {
        // create new document
        const newDocument = await vscode.workspace.openTextDocument({
            content: '[ ] this is a text\n[ ] this is another text\n[ ] another new line',
            language: 'markdown'
        });
        await vscode.window.showTextDocument(newDocument);

        // create a selection over the text to toggle all lines
        const editor = getEditor();
        const startPosition = new vscode.Position(0, 0);
        const endPosition = new vscode.Position(2, 100);
        const newSelection = new vscode.Selection(startPosition, endPosition);
        editor.selection = newSelection;

        await toggleCheckbox();

        const content = editor.document.getText();
        const dateNow = getDateString(new Date());
        const expectedResult = `[X] ~~*this is a text*~~ [${dateNow}]\n[X] ~~*this is another text*~~ [${dateNow}]\n[X] ~~*another new line*~~ [${dateNow}]`;

        assert.equal(content, expectedResult);
    });

    test('should be toggled without selection', async () => {
        // create new document
        const newDocument = await vscode.workspace.openTextDocument({
            content: '[ ] this is a text\n[ ] this is another text\n[ ] another new line',
            language: 'markdown'
        });
        await vscode.window.showTextDocument(newDocument);

        // create a selection over the text to toggle all lines
        const editor = getEditor();
        const startPosition = new vscode.Position(0, 0);
        const endPosition = new vscode.Position(0, 0);
        const newSelection = new vscode.Selection(startPosition, endPosition);
        editor.selection = newSelection;

        await toggleCheckbox();

        const content = editor.document.getText();
        const dateNow = getDateString(new Date());
        const expectedResult = `[X] ~~*this is a text*~~ [${dateNow}]\n[ ] this is another text\n[ ] another new line`;

        assert.equal(content, expectedResult);
    });
});
