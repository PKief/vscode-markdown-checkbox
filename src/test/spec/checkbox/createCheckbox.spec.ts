import * as assert from 'assert';
import * as vscode from 'vscode';
import { createCheckbox } from '../../../createCheckbox';
import { getConfig, getDateString, getEditor } from '../../../helpers';
import { setSettingsToDefault } from '../defaultSettings';

describe('create checkboxes', () => {
  beforeEach(async () => {
    await setSettingsToDefault();
  });

  it('should create checkbox with new bullet point', async () => {
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

  it('should be created without new bullet point (already has bullet point)', async () => {
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

  it('should be created without new bullet point (withBulletPoint false)', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: 'this is a text',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // update config to use configured checkmark
    await vscode.workspace
      .getConfiguration('markdown-checkbox')
      .update('withBulletPoint', false);

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
    const expectedResult = `[ ] this is a text`;

    assert.strictEqual(content, expectedResult);
  });

  it('should create checkboxes with new bullet points', async () => {
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

  it('should remove checkboxes if they already exists', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content:
        '[ ] this is a text\n[ ] this is a second text\n- [ ] this is a third text',
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
    const expectedResult = `this is a text\nthis is a second text\n- this is a third text`;

    assert.strictEqual(content, expectedResult);
  });

  it('should create checkbox with begin date', async () => {
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

    const dateNow = getDateString(new Date());
    const content = editor.document.getText();
    const typeOfBulletPoint = getConfig<string>('typeOfBulletPoint');
    const expectedResult = `${typeOfBulletPoint} [ ] ${dateNow} this is a text`;

    assert.strictEqual(content, expectedResult);
  });
});
