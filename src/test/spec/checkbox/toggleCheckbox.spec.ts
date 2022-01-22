import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDateString, getEditor } from '../../../helpers';
import { toggleCheckbox } from '../../../toggleCheckbox';
import { useDefaultSettings } from '..';

describe('toggle checkboxes', () => {
  beforeEach(async () => {
    await useDefaultSettings();
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

    assert.equal(content, expectedResult);
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

    assert.equal(content, expectedResult);
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

    assert.equal(content, expectedResult);
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

    assert.equal(content, expectedResult);
  });
});
