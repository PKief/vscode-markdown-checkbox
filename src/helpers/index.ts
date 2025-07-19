import * as vscode from 'vscode';
import { Position, TextEditor, TextLine } from 'vscode';
import { Checkbox } from '../models/checkbox';

// Cache for checkbox scanning results
interface CheckboxCache {
  documentUri: string;
  documentVersion: number;
  checkboxes: Checkbox[];
}

let checkboxCache: CheckboxCache | null = null;

/** Get the current cursor position */
export const getCursorPosition = (): Position => {
  return getEditor().selection.active;
};

/** Get the active editor of VS Code */
export const getEditor = (): TextEditor => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor;
  } else {
    throw new Error('Could not load the VS Code editor instance.');
  }
};

/** Give the information if the line has already a bullet point */
export const lineHasBulletPointAlready = (
  line: TextLine
): { pos: number; bullet: boolean } => {
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

/** Get the checkbox of a specific line */
export const getCheckboxOfLine = (line: TextLine): Checkbox | undefined => {
  const lineText = line.text;

  // Use a single regex to find checkbox patterns more efficiently
  const checkboxMatch = lineText.match(/\[(.?)\]/);
  if (!checkboxMatch) {
    return undefined;
  }

  const checkboxChar = checkboxMatch[1];
  const isChecked = checkboxChar !== ' ' && checkboxChar !== '';
  const position = checkboxMatch.index!;
  const plainText = getPlainLineText(lineText);

  return {
    checked: isChecked,
    position: new Position(line.lineNumber, position),
    text: plainText,
    lineNumber: line.lineNumber,
  };
};

/** Get a list of all checkboxes in a document */
export const getAllCheckboxes = (): Checkbox[] => {
  const editor = getEditor();
  const document = editor.document;

  // Check if we can use cached results
  if (
    checkboxCache &&
    checkboxCache.documentUri === document.uri.toString() &&
    checkboxCache.documentVersion === document.version
  ) {
    return checkboxCache.checkboxes;
  }

  // Scan document for checkboxes
  const result: Checkbox[] = [];
  const lineCount = document.lineCount;

  // Optimize by processing lines in batches and using more efficient scanning
  for (let l = 0; l < lineCount; l++) {
    const line = document.lineAt(l);

    // Quick check: skip lines that definitely don't contain checkboxes
    if (!line.text.includes('[')) {
      continue;
    }

    const checkbox = getCheckboxOfLine(line);
    if (checkbox) {
      result.push(checkbox);
    }
  }

  // Update cache
  checkboxCache = {
    documentUri: document.uri.toString(),
    documentVersion: document.version,
    checkboxes: result,
  };

  return result;
};

/** Clear the checkbox cache (useful when document changes significantly) */
export const clearCheckboxCache = (): void => {
  checkboxCache = null;
};

/** Get the plain text of a line without the checkbox. */
export const getPlainLineText = (text: string) => {
  return text.replace(/(\*|-|\+)\s*\[.?\]\s*/gi, '');
};

/** Get the value of a workspace config property */
export const getConfig = <T>(config: string): T =>
  vscode.workspace.getConfiguration('markdown-checkbox').get<T>(config) as T;

/** Determine whether a given language ID of the configuration is valid to activate this extension. */
export const isActivationLanguageId = (languageId: string): boolean => {
  const config = getConfig<string | string[]>('languages');

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

/** Get the current date as string. */
export const getDateString = (now: Date) => {
  const leadingZero = (n: number) => (n < 10 ? '0' + n : n);
  const year = now.getFullYear().toString();
  const month = leadingZero(now.getMonth() + 1);
  const date = leadingZero(now.getDate());
  return `${year}-${month}-${date}`;
};
