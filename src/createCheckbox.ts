import { Position, TextEditor, TextEditorEdit, TextLine } from 'vscode';
import * as helpers from './helpers';

/** Create a new checkbox at selected lines or the current cursor position */
export const createCheckbox = async (editor: TextEditor) => {
    const selection = editor.selection;

    for (let r = selection.start.line; r <= selection.end.line; r++) {
        const line = editor.document.lineAt(r);
        await createCheckboxOfLine(editor, line);
    }
};

const createCheckboxOfLine = (editor: TextEditor, line: TextLine): Thenable<boolean> => {
    const withBulletPoint = helpers.getConfig<boolean>('withBulletPoint');
    const typeOfBulletPoint = helpers.getConfig<string>('typeOfBulletPoint');
    const hasBullet = helpers.lineHasBulletPointAlready(line);

    if (!helpers.getCheckboxOfLine(line)) {
        return editor.edit((editBuilder: TextEditorEdit) => {
            editBuilder.insert(new Position(
                line.lineNumber,
                hasBullet.pos
            ), (withBulletPoint && !hasBullet.bullet ? typeOfBulletPoint + ' ' : '') + '[ ] ');
        });
    } else {
        return Promise.resolve(undefined);
    }
};
