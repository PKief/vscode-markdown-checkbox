import * as helpers from './helpers';
import * as vscode from 'vscode';
import { Position, TextEditorEdit, TextEditor } from 'vscode';

/** create a new checkbox at the current cursor position */
export const createCheckbox = (editor: TextEditor): any => {
    const withBulletPoint = helpers.getConfig('withBulletPoint');
    const typeOfBulletPoint = helpers.getConfig('typeOfBulletPoint');
    const cursorPosition = helpers.getCursorPosition();

    const line = editor.document.lineAt(helpers.getCursorPosition().line);
    const hasBullet = helpers.lineHasBulletPointAlready(line);
    if (helpers.lineHasCheckbox(line) === null) {
        return editor.edit((editBuilder: TextEditorEdit) => {
            editBuilder.insert(new Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    }
    return null;
};