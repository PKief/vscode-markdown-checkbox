import * as vscode from 'vscode';
import Checkbox from './checkbox';
import { Position, TextEditor, TextLine } from 'vscode';

// returns the current cursor position
export const getCursorPosition = (): Position => {
    return getEditor().selection.active;
};

// returns the active editor of vs code
export const getEditor = (): TextEditor => {
    return vscode.window.activeTextEditor;
};

// give the information if the line has already a bullet point
export const lineHasBulletPointAlready = (line: TextLine): any => {
    let fstChar = line.firstNonWhitespaceCharacterIndex;    

    switch (line.text[fstChar]) {
        case '*':
        case '+':
        case '-':
            return { pos: fstChar + 2, bullet: true };
        default:
            return { pos: fstChar, bullet: false };
    }
};

// check if line has a checkbox (-1 = no checkbox, 0 = unmarked, 1 = marked)
export const lineHasCheckbox = (line: TextLine): Checkbox => {
    var lineText = line.text.toString();
    var cbPosition = lineText.indexOf('[ ]');
    var cbPositionMarked = lineText.indexOf('[X]');

    if (cbPosition > -1) {
        return { checked: false, position: new Position(line.lineNumber, cbPosition) };
    } else if (cbPositionMarked > -1) {
        return { checked: true, position: new Position(line.lineNumber, cbPositionMarked) };
    } else {
        return null;
    }
};

// returns the value of a workspace config property
export const getConfig = (config: string): any =>
    vscode.workspace.getConfiguration('markdown-checkbox').get(config);