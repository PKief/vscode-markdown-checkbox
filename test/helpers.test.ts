import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getPlainLineText, lineHasCheckbox, lineHasBulletPointAlready, getEditor, getAllCheckboxes } from '../src/helpers';
import Checkbox from '../src/checkbox';

suite('helpers', () => {
    test('should return plain checkbox text', () => {
        const checkboxText = '* [ ] this is the text';
        const expectedText = 'this is the text';
        const result = getPlainLineText(checkboxText);
        assert.equal(result, expectedText);
    });

    test('should check if the line has an unchecked checkbox', () => {
        const line: vscode.TextLine = {
            firstNonWhitespaceCharacterIndex: 0,
            isEmptyOrWhitespace: false,
            lineNumber: 1,
            range: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            rangeIncludingLineBreak: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            text: '* [ ] this is the text'
        };

        const expectedResult: Checkbox = { checked: false, position: new vscode.Position(1, 2), text: 'this is the text', lineNumber: 1 };
        assert.deepEqual(lineHasCheckbox(line), expectedResult);
    });

    test('should check if the line has a checked checkbox', () => {
        const line: vscode.TextLine = {
            firstNonWhitespaceCharacterIndex: 0,
            isEmptyOrWhitespace: false,
            lineNumber: 1,
            range: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            rangeIncludingLineBreak: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            text: '* [X] this is the text'
        };

        const expectedResult: Checkbox = { checked: true, position: new vscode.Position(1, 2), text: 'this is the text', lineNumber: 1 };
        assert.deepEqual(lineHasCheckbox(line), expectedResult);
    });

    test('should check if the line has a bullet point already', () => {
        const line: vscode.TextLine = {
            firstNonWhitespaceCharacterIndex: 0,
            isEmptyOrWhitespace: false,
            lineNumber: 1,
            range: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            rangeIncludingLineBreak: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            text: '* this is the text'
        };

        assert.equal(lineHasBulletPointAlready(line).bullet, true);
        assert.equal(lineHasBulletPointAlready(line).pos, 2);
    });

    test('should check if the line has no bullet points', () => {
        const line: vscode.TextLine = {
            firstNonWhitespaceCharacterIndex: 0,
            isEmptyOrWhitespace: false,
            lineNumber: 1,
            range: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            rangeIncludingLineBreak: new vscode.Range(new vscode.Position(1, 10), new vscode.Position(1, 20)),
            text: 'this is the text'
        };

        assert.equal(lineHasBulletPointAlready(line).bullet, false);
        assert.equal(lineHasBulletPointAlready(line).pos, 0);
    });

    test('should get all checkboxes in a document', async () => {
        const editor = getEditor();
        await editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(
                0,
                0
            ), '* [ ] this is the text\n* [X] this is another text');
        });
        const allCheckboxes = getAllCheckboxes();
        const expectedResult: Checkbox[] = [{
            checked: false,
            position: new vscode.Position(0, 2),
            text: 'this is the text',
            lineNumber: 0,
        }, {
            checked: true,
            position: new vscode.Position(1, 2),
            text: 'this is another text',
            lineNumber: 1,
        }];

        assert.deepEqual(allCheckboxes, expectedResult);
    });
});
