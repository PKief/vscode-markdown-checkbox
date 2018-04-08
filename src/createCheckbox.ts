import { Position, TextEditor, TextEditorEdit } from 'vscode';
import * as helpers from './helpers';

/** create a new checkbox at the current cursor position */
export const createCheckbox = (editor: TextEditor): any => {
    const withBulletPoint = helpers.getConfig('withBulletPoint');
    const typeOfBulletPoint = helpers.getConfig('typeOfBulletPoint');
    const cursorPosition = helpers.getCursorPosition();

    const line = editor.document.lineAt(helpers.getCursorPosition().line);
    const hasBullet = helpers.lineHasBulletPointAlready(line);
    if (!helpers.lineHasCheckbox(line)) {
        return editor.edit((editBuilder: TextEditorEdit) => {
            editBuilder.insert(new Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    }
    return undefined;
};
