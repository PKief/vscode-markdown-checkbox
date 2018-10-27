import * as vscode from 'vscode';
import { Position, Range, TextEditorEdit } from 'vscode';
import { getConfig, getCursorPosition, getEditor, lineHasCheckbox } from './helpers';

/** Mark a checkbox as checked or unchecked */
export const toggleCheckbox = async () => {
    // the position object gives you the line and character where the cursor is
    const editor = getEditor();
    if (editor.selection.isEmpty) {
        const cursorPosition = getCursorPosition();
        const line = editor.document.lineAt(cursorPosition.line);
        await toggleCheckboxOfLine(line);
        const endLine = editor.document.lineAt(editor.selection.end.line);
        const selectionPosition = new vscode.Position(endLine.lineNumber, 20000);
        getEditor().selection = new vscode.Selection(selectionPosition, selectionPosition);
    } else {
        const selection = editor.selection;

        // get all line numbers of the selection
        for (let r = selection.start.line; r <= selection.end.line; r++) {
            const line = editor.document.lineAt(r);
            await toggleCheckboxOfLine(line);
        }
    }
};

/** mark or unmark the checkbox of a given line in the editor */
export const toggleCheckboxOfLine = (line: vscode.TextLine, checkIt?: boolean) => {
    const lhc = lineHasCheckbox(line);

    // no edit action required
    if (!lhc || !lhc.checked && checkIt === false || lhc.checked === true && checkIt === true) {
        return Promise.resolve(undefined);
    }

    let value = ' ';

    // if the checkbox is not checked or it must be checked
    if (checkIt === true || checkIt === undefined && !lhc.checked) {
        value = 'X';
    }

    return markField(lhc.position, value);
};

/** Marks the field inside the checkbox with a character */
const markField = (checkboxPosition: Position, char: string, editor = getEditor()): Thenable<boolean> => {
    return editor.edit((editBuilder: TextEditorEdit) => {
        editBuilder.replace(new Range(
            new Position(checkboxPosition.line, checkboxPosition.character + 1),
            new Position(checkboxPosition.line, checkboxPosition.character + 2)
        ), char);

        // get settings from config
        const italicWhenChecked = getConfig<boolean>('italicWhenChecked');
        const strikeThroughWhenChecked = getConfig<boolean>('strikeThroughWhenChecked');
        const dateWhenChecked = getConfig<boolean>('dateWhenChecked');

        // get line of the checkbox
        const line = editor.document.lineAt(checkboxPosition.line);
        const lhc = lineHasCheckbox(line);
        const lineText = line.text;
        const textWithoutCheckbox = lineText.substr(checkboxPosition.character + 4, lineText.length).trim();

        if (!lhc.checked && textWithoutCheckbox.length > 0) {
            let newText = (strikeThroughWhenChecked ? '~~' : '') + (italicWhenChecked ? '*' : '') + textWithoutCheckbox + (italicWhenChecked ? '*' : '') + (strikeThroughWhenChecked ? '~~' : '');
            // add the date string
            const dateNow = new Date().toISOString().slice(0, 10);
            newText = newText + (dateWhenChecked ? ' [' + dateNow + ']' : '');

            editBuilder.replace(new Range(
                new Position(checkboxPosition.line, checkboxPosition.character + 4),
                new Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
        else if (lhc.checked) {
            let newText = textWithoutCheckbox.replace(/~~/g, '').replace(/\*/g, '');
            // remove the date string
            newText = newText.replace(/\s\[\d{4}[\-]\d{2}[\-]\d{2}\]$/, '');

            editBuilder.replace(new Range(
                new Position(checkboxPosition.line, checkboxPosition.character + 4),
                new Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
    });
};
