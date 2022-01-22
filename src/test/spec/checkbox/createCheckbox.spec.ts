import * as assert from 'assert';
import * as vscode from 'vscode';
import { createCheckbox } from '../../../createCheckbox';
import { getEditor, getConfig } from '../../../helpers';
import { useDefaultSettings } from '..';

describe('create checkboxes', () => {
  beforeEach(async () => {
    await useDefaultSettings();
  });

  it('should be created with new bullet point', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: 'this is a text',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // set the cursor to the current line
    const editor = getEditor();
    const position = editor.selection.active;
    const newCursorPosition = position.with(0, 0);
    const newSelection = new vscode.Selection(
      newCursorPosition,
      newCursorPosition
    );
    editor.selection = newSelection;

    await createCheckbox(editor);

    const content = editor.document.getText();
    const typeOfBulletPoint = getConfig<string>('typeOfBulletPoint');
    const expectedResult = `${typeOfBulletPoint} [ ] this is a text`;

    assert.strictEqual(content, expectedResult);
  });

  it('should be created without new bullet point', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: '- this is a text',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // set the cursor to the current line
    const editor = getEditor();
    const position = editor.selection.active;
    const newCursorPosition = position.with(0, 0);
    const newSelection = new vscode.Selection(
      newCursorPosition,
      newCursorPosition
    );
    editor.selection = newSelection;

    await createCheckbox(editor);

    const content = editor.document.getText();
    const expectedResult = `- [ ] this is a text`;

    assert.strictEqual(content, expectedResult);
  });

  it('should be created with new bullet points', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: 'this is a text\nthis is a second text\n- this is a third text',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // create a selection over the text
    const editor = getEditor();
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(2, 0);
    const newSelection = new vscode.Selection(startPosition, endPosition);
    editor.selection = newSelection;

    await createCheckbox(editor);

    const content = editor.document.getText();
    const typeOfBulletPoint = getConfig<string>('typeOfBulletPoint');
    const expectedResult = `${typeOfBulletPoint} [ ] this is a text\n${typeOfBulletPoint} [ ] this is a second text\n- [ ] this is a third text`;

    assert.strictEqual(content, expectedResult);
  });
});
