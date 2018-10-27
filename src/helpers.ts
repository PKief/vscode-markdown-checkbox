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
export const lineHasBulletPointAlready = (line: TextLine): { pos: number, bullet: boolean } => {
    const fstChar = line.firstNonWhitespaceCharacterIndex;

    switch (line.text.charAt(fstChar)) {
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
        const line = editor.document.lineAt(l);
        const lhc = lineHasCheckbox(line);
        if (lhc) {
            result.push(lhc);
        }
    }
    return result;
};

/** Get the plain text of a line without the checkbox. */
export const getPlainLineText = (text: string) => {
    return text.replace(/(\*|-|\+)\s\[(\s|x)]\s/gi, '');
};

/** Get the value of a workspace config property */
export const getConfig = (config: string): any =>
    vscode.workspace.getConfiguration('markdown-checkbox').get(config);

/** Determine whether a given language ID of the configuration is valid to activate this extension. */
export const isActivationLanguageId = (languageId: string): boolean => {
    const config: string | string[] = getConfig('languages');

    if (!config) {
        return languageId === 'markdown';
    }

    if (typeof config === 'string') {
        return config === languageId;
    }

    return config.indexOf(languageId) !== -1;
};

/** Follow all the rules to determine if we should activate a command */
export const shouldActivate = (): boolean => {
    const editor = getEditor();

    if (!editor) {
        return false;
    }

    return isActivationLanguageId(editor.document.languageId);
};

