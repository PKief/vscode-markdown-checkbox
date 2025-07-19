import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDateString, getEditor } from '../../../helpers';
import { toggleCheckbox } from '../../../toggleCheckbox';
import { setSettingsToDefault } from '../defaultSettings';

describe('toggle checkboxes', () => {
  beforeEach(async () => {
    await setSettingsToDefault();
    const newDocument = await vscode.workspace.openTextDocument({
      content:
        '[ ] this is a text\n[ ] this is another text\n[ ] another new line',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);
  });

  it('should be toggled with selection', async () => {
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

    assert.strictEqual(content, expectedResult);
  });

  it('should be toggled without selection', async () => {
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

    assert.strictEqual(content, expectedResult);
  });

  it('should be toggled with trailing whitespace', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: '[ ] this is a text    ',
      language: 'markdown',
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
    const expectedResult = `[X] ~~*this is a text*~~ [${dateNow}]    `;

    assert.strictEqual(content, expectedResult);
  });

  it('should be toggled with configured checkmark', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content:
        '[ ] this is a text\n[ ] this is another text\n[ ] another new line',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // create a selection over the text to toggle all lines
    const editor = getEditor();
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(2, 100);
    const newSelection = new vscode.Selection(startPosition, endPosition);
    editor.selection = newSelection;

    // update config to use configured checkmark
    await vscode.workspace
      .getConfiguration('markdown-checkbox')
      .update('checkmark', 'x');
    await toggleCheckbox();

    const content = editor.document.getText();
    const dateNow = getDateString(new Date());
    const expectedResult = `[x] ~~*this is a text*~~ [${dateNow}]\n[x] ~~*this is another text*~~ [${dateNow}]\n[x] ~~*another new line*~~ [${dateNow}]`;

    assert.strictEqual(content, expectedResult);
  });

  it('should preserve bold formatting when unchecking', async () => {
    // create new document with bold formatting
    const newDocument = await vscode.workspace.openTextDocument({
      content: '[x] ~~*this is a **bold** action*~~ [2023-12-01]',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // position cursor on the checkbox line
    const editor = getEditor();
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(0, 0);
    const newSelection = new vscode.Selection(startPosition, endPosition);
    editor.selection = newSelection;

    await toggleCheckbox();

    const content = editor.document.getText();
    const expectedResult = '[ ] this is a **bold** action';

    assert.strictEqual(content, expectedResult);
  });

  it('should preserve bold formatting when toggling checkbox', async () => {
    // create new document with bold formatting
    const newDocument = await vscode.workspace.openTextDocument({
      content: '[ ] this is a **bold** action',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    // position cursor on the checkbox line
    const editor = getEditor();
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(0, 0);
    const newSelection = new vscode.Selection(startPosition, endPosition);
    editor.selection = newSelection;

    // check the checkbox
    await toggleCheckbox();

    let content = editor.document.getText();
    const dateNow = getDateString(new Date());
    let expectedResult = `[X] ~~*this is a **bold** action*~~ [${dateNow}]`;

    assert.strictEqual(content, expectedResult);

    // now uncheck it - this should preserve the bold formatting
    await toggleCheckbox();

    content = editor.document.getText();
    expectedResult = '[ ] this is a **bold** action';

    assert.strictEqual(content, expectedResult);
  });
});
