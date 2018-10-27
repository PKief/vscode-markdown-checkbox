import { Position, TextEditor, TextEditorEdit } from 'vscode';
import * as helpers from './helpers';

/** Create a new checkbox at the current cursor position */
export const createCheckbox = (editor: TextEditor): any => {
    const withBulletPoint = helpers.getConfig<boolean>('withBulletPoint');
    const typeOfBulletPoint = helpers.getConfig<string>('typeOfBulletPoint');
    const cursorPosition = helpers.getCursorPosition();

    const line = editor.document.lineAt(cursorPosition.line);
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
