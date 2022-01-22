import * as assert from 'assert';
import * as vscode from 'vscode';
import { useDefaultSettings } from '..';
import * as helpers from '../../../helpers';
import { Checkbox } from '../../../models/checkbox';

describe('helpers', () => {
  beforeEach(async () => {
    await useDefaultSettings();
  });

  it('should return plain checkbox text', () => {
    const checkboxText = '* [ ] this is the text';
    const expectedText = 'this is the text';
    const result = helpers.getPlainLineText(checkboxText);
    assert.strictEqual(result, expectedText);
  });

  it('should check if the line has an unchecked checkbox', () => {
    const line: vscode.TextLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      lineNumber: 1,
      range: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      rangeIncludingLineBreak: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      text: '* [ ] this is the text',
    };

    const expectedResult: Checkbox = {
      checked: false,
      position: new vscode.Position(1, 2),
      text: 'this is the text',
      lineNumber: 1,
    };
    assert.deepStrictEqual(helpers.getCheckboxOfLine(line), expectedResult);
  });

  it('should check if the line has a checked checkbox', () => {
    const line: vscode.TextLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      lineNumber: 1,
      range: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      rangeIncludingLineBreak: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      text: '* [X] this is the text',
    };

    const expectedResult: Checkbox = {
      checked: true,
      position: new vscode.Position(1, 2),
      text: 'this is the text',
      lineNumber: 1,
    };
    assert.deepStrictEqual(helpers.getCheckboxOfLine(line), expectedResult);
  });

  it('should check if the line has a bullet point already', () => {
    const lineWithDefaultBulletPoint: vscode.TextLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      lineNumber: 1,
      range: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      rangeIncludingLineBreak: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      text: '* this is the text',
    };

    // default bullet point
    assert.strictEqual(
      helpers.lineHasBulletPointAlready(lineWithDefaultBulletPoint).bullet,
      true
    );
    assert.strictEqual(
      helpers.lineHasBulletPointAlready(lineWithDefaultBulletPoint).pos,
      2
    );

    const lineWithoutBulletPoint: vscode.TextLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      lineNumber: 1,
      range: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      rangeIncludingLineBreak: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      text: 'this is the text',
    };

    // no bullet point at all
    assert.strictEqual(
      helpers.lineHasBulletPointAlready(lineWithoutBulletPoint).bullet,
      false
    );
    assert.strictEqual(
      helpers.lineHasBulletPointAlready(lineWithoutBulletPoint).pos,
      0
    );
  });

  it('should check if the line has no bullet points', () => {
    const line: vscode.TextLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      lineNumber: 1,
      range: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      rangeIncludingLineBreak: new vscode.Range(
        new vscode.Position(1, 10),
        new vscode.Position(1, 20)
      ),
      text: 'this is the text',
    };

    assert.strictEqual(helpers.lineHasBulletPointAlready(line).bullet, false);
    assert.strictEqual(helpers.lineHasBulletPointAlready(line).pos, 0);
  });

  it('should get all checkboxes in a document', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: '* [ ] this is the text\n* [X] this is another text',
      language: 'markdown',
    });
    await vscode.window.showTextDocument(newDocument);

    const allCheckboxes = helpers.getAllCheckboxes();
    const expectedResult: Checkbox[] = [
      {
        checked: false,
        position: new vscode.Position(0, 2),
        text: 'this is the text',
        lineNumber: 0,
      },
      {
        checked: true,
        position: new vscode.Position(1, 2),
        text: 'this is another text',
        lineNumber: 1,
      },
    ];

    assert.deepStrictEqual(allCheckboxes, expectedResult);
  });

  it('should be activated for specific language IDs', async () => {
    // create new document
    const newDocument = await vscode.workspace.openTextDocument({
      content: 'Check language IDs of extension config...',
      language: 'xml',
    });
    await vscode.window.showTextDocument(newDocument);

    // specify language IDs in the configuration
    await vscode.workspace
      .getConfiguration('markdown-checkbox')
      .update('languages', ['markdown', 'xml']);

    assert.deepStrictEqual(helpers.shouldActivate(), true);
  });

  it('should print a date as string', async () => {
    const date = new Date('Mon Jan 28 2019');
    const result = helpers.getDateString(date);
    assert.deepStrictEqual(result, '2019-01-28');
  });
});
