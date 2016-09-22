//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import * as helpers from '../src/helpers';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

    suite('helpers', () => {
        test("getCursorPosition", () => {
            const curPosition = helpers.getCursorPosition();
            assert.equal(curPosition.character, 0, 'cursor has the wrong position');
        })
        test("getEditor", () => {
            const curPosition = helpers.getCursorPosition();
            assert.ok(helpers.getEditor(), 'editor not available');
        })
        test("lineHasBulletPointAlready", () => {
            const line = vscode.window.activeTextEditor.document.lineAt(0);
            assert.equal(helpers.lineHasBulletPointAlready(line),{pos: 0, bullet: false});                      
        })
    });
});