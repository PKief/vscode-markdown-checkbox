import * as assert from 'assert';
import * as vscode from 'vscode';
import { createCheckbox } from '../../../createCheckbox';
import { getEditor } from '../../../helpers';

describe('create checkboxes', () => {
    it('should be created with new bullet point', async () => {
        // create new document
        const newDocument = await vscode.workspace.openTextDocument({
            content: 'this is a text',
            language: 'markdown'
        });
        await vscode.window.showTextDocument(newDocument);

        // set the cursor to the current line
        const editor = getEditor();
        const position = editor.selection.active;
        const newCursorPosition = position.with(0, 0);
        const newSelection = new vscode.Selection(newCursorPosition, newCursorPosition);
        editor.selection = newSelection;

        const result = await createCheckbox(editor);

        assert.equal(result, true);
    });

    it('should be created without new bullet point', async () => {
        // create new document
        const newDocument = await vscode.workspace.openTextDocument({
            content: '- this is a text',
            language: 'markdown'
        });
        await vscode.window.showTextDocument(newDocument);

        // set the cursor to the current line
        const editor = getEditor();
        const position = editor.selection.active;
        const newCursorPosition = position.with(0, 0);
        const newSelection = new vscode.Selection(newCursorPosition, newCursorPosition);
        editor.selection = newSelection;

        const result = await createCheckbox(editor);

        assert.equal(result, true);
    });
});
