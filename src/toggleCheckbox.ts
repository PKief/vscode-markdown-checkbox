import * as vscode from 'vscode';
import { lineHasCheckbox } from './helpers';
import { getEditor } from './helpers';
import { getCursorPosition } from './helpers';
import { getConfig } from './helpers';
import { Position, Range, TextEditorEdit, TextDocument } from 'vscode';

/** mark a checkbox as checked or unchecked */
export const toggleCheckbox = () => {
    // the position object gives you the line and character where the cursor is
    const editor = getEditor();
    if (editor.selection.isEmpty) {
        let cursorPosition = getCursorPosition();
        let line = editor.document.lineAt(cursorPosition.line);
        toggleCheckboxOfLine(line);
        let endLine = editor.document.lineAt(editor.selection.end.line);
        getEditor().selection = new vscode.Selection(new vscode.Position(endLine.lineNumber, 20000), new vscode.Position(endLine.lineNumber, 20000));
    } else {
        let lines = [];
        let selection = editor.selection;
        for (let r = selection.start.line; r <= selection.end.line; r++) {
            lines.push(editor.document.lineAt(r));
        }
        toggleLine(0);
        function toggleLine(index) {
            if (lines.length > index) {
                if (toggleCheckboxOfLine(lines[index])) {
                    toggleCheckboxOfLine(lines[index]).then(() => {
                        toggleLine(++index);
                    });
                } else {
                    toggleLine(++index);
                }
            }
        }
    }
};

/** mark or unmark the checkbox of a given line in the editor */
export const toggleCheckboxOfLine = (line: vscode.TextLine): any => {
    let lhc = lineHasCheckbox(line);

    if (lhc) {
        if (!lhc.checked) {
            return markField(lhc.position, 'X');
        } else {
            return markField(lhc.position, ' ');
        }
    }

    return null;
};

/** marks the field inside the checkbox with a character */
export const markField = (checkboxPosition: Position, char: string, editor = getEditor()): Thenable<boolean> => {
    return editor.edit((editBuilder: TextEditorEdit) => {
        editBuilder.replace(new Range(
            new Position(checkboxPosition.line, checkboxPosition.character + 1),
            new Position(checkboxPosition.line, checkboxPosition.character + 2)
        ), char);

        let italicWhenChecked = getConfig('italicWhenChecked');
        let strikeThroughWhenChecked = getConfig('strikeThroughWhenChecked');
        // JC: load the date setting from config
        let dateWhenChecked = getConfig('dateWhenChecked');

        let line = editor.document.lineAt(checkboxPosition.line);
        let lhc = lineHasCheckbox(line);
        let lineText = line.text;
        let textWithoutCheckbox = lineText.substr(checkboxPosition.character + 4, lineText.length).trim();

        if (!lhc.checked && textWithoutCheckbox.length > 0) {
            let newText = (strikeThroughWhenChecked ? '~~' : '') + (italicWhenChecked ? '*' : '') + textWithoutCheckbox + (italicWhenChecked ? '*' : '') + (strikeThroughWhenChecked ? '~~' : '');
            // JC: add the date string
            let date_now = new Date().toISOString().slice(0,10);
            newText = newText  + (dateWhenChecked ? '[' + date_now + ']' : '');
            
            editBuilder.replace(new Range(
                new Position(checkboxPosition.line, checkboxPosition.character + 4),
                new Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
        else if (lhc.checked) {
            let newText = textWithoutCheckbox.replace(/~~/g, '').replace(/\*/g, '');
            // JC: remove the date string
            newText = newText.replace(/\[\d{4}[\-]\d{2}[\-]\d{2}\]$/, '');

            editBuilder.replace(new Range(
                new Position(checkboxPosition.line, checkboxPosition.character + 4),
                new Position(checkboxPosition.line, line.text.length)
            ), newText);
        }
    });
};
