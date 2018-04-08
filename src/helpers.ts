import * as vscode from 'vscode';
import { Position, TextEditor, TextLine } from 'vscode';
import Checkbox from './checkbox';

/** Get the current cursor position */
export const getCursorPosition = (): Position => {
    return getEditor().selection.active;
};

/** Get the active editor of VS Code */
export const getEditor = (): TextEditor => {
    return vscode.window.activeTextEditor;
};

/** Give the information if the line has already a bullet point */
export const lineHasBulletPointAlready = (line: TextLine): any => {
    const fstChar = line.firstNonWhitespaceCharacterIndex;

    switch (line.text[fstChar]) {
        case '*':
        case '+':
        case '-':
            return { pos: fstChar + 2, bullet: true };
        default:
            return { pos: fstChar, bullet: false };
    }
};

/** Check if a line has a checkbox */
export const lineHasCheckbox = (line: TextLine): Checkbox => {
    const lineText = line.text.toString();
    const cbPosition = lineText.indexOf('[ ]');
    const cbPositionMarked = lineText.search(/\[x\]/gi);
    const plainText = getPlainLineText(lineText);

    if (cbPosition > -1) {
        return { checked: false, position: new Position(line.lineNumber, cbPosition), text: plainText, lineNumber: line.lineNumber };
    } else if (cbPositionMarked > -1) {
        return { checked: true, position: new Position(line.lineNumber, cbPositionMarked), text: plainText, lineNumber: line.lineNumber };
    } else {
        return undefined;
    }
};

/** Get a list of all checkboxes in a document */
export const getAllCheckboxes = (): Checkbox[] => {
    const editor = getEditor();
    const doc = editor.document;
    const lineCount = editor.document.lineCount;
    const result = [];
    for (let l = 0; l < lineCount; l++) {
        if (lineHasCheckbox(editor.document.lineAt(l))) {
            result.push(lineHasCheckbox(editor.document.lineAt(l)));
        }
    }
    return result;
};

/** Get the plain text of a line without the checkbox. */
const getPlainLineText = (text: string) => {
    return text.replace(/(\*|-|\+)\s\[(\s|x)]\s/gi, '');
};

/** Get the value of a workspace config property */
export const getConfig = (config: string): any =>
    vscode.workspace.getConfiguration('markdown-checkbox').get(config);
