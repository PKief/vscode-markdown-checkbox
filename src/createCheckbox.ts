import * as vscode from 'vscode';
import * as helpers from './helpers';

// create a new checkbox at the current cursor position
export const createCheckbox = (editor: vscode.TextEditor): void => {
    let withBulletPoint = helpers.getConfig('withBulletPoint');
    let typeOfBulletPoint = helpers.getConfig('typeOfBulletPoint');
    const cursorPosition = helpers.getCursorPosition();

    const line = editor.document.lineAt(helpers.getCursorPosition().line);
    let hasBullet = helpers.lineHasBulletPointAlready(line);
    if (helpers.lineHasCheckbox(line) === null) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    }
};