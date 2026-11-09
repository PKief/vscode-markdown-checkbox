import { beforeEach, describe, expect, it } from 'vitest';
import { Position, Range, type TextLine } from 'vscode';
import { resetVscode, window, workspace } from '../vscode.mock';
import {
  getAllCheckboxes, getPlainLineText, getCheckboxOfLine, getDateString, getEditor, isActivationLanguageId,
  lineHasBulletPointAlready, shouldActivate,
} from './index';

beforeEach(resetVscode);

const line = (text: string): TextLine => {
  const start = new Position(0, 0);
  const end = new Position(0, text.length);
  return {
    text,
    firstNonWhitespaceCharacterIndex: text.search(/\S/) < 0 ? text.length : text.search(/\S/),
    lineNumber: 0,
    isEmptyOrWhitespace: text.trim().length === 0,
    range: new Range(start, end),
    rangeIncludingLineBreak: new Range(start, end),
  };
};

describe('helpers', () => {
  it.each(['* item', '+ item', '- item', '  - item'])('recognizes a bullet in %s', (text) => {
    expect(lineHasBulletPointAlready(line(text))).toEqual({
      pos: text.search(/\S/) + 2, bullet: true,
    });
  });

  it('does not treat plain text as a bullet', () => {
    expect(lineHasBulletPointAlready(line('plain text')).bullet).toBe(false);
  });

  it.each([['[ ] task', false], ['- [X] task', true]])('recognizes %s', (text, checked) => {
    expect(getCheckboxOfLine(line(text as string))?.checked).toBe(checked);
  });

  it('ignores lines without checkboxes', () => {
    expect(getCheckboxOfLine(line('plain text'))).toBeUndefined();
  });

  it.each(['* [ ] task', '- [X] task', '+ [x] task'])('extracts plain text from %s', (text) => {
    expect(getPlainLineText(text)).toBe('task');
  });

  it('collects checkboxes across the active document', async () => {
    const document = await workspace.openTextDocument({
      content: '* [ ] first\nplain text\n- [X] second', language: 'markdown',
    });
    await window.showTextDocument(document);
    expect(getAllCheckboxes()).toEqual([
      { position: new Position(0, 2), checked: false, text: 'first', lineNumber: 0 },
      { position: new Position(2, 2), checked: true, text: 'second', lineNumber: 2 },
    ]);
  });

  it('formats local dates with leading zeros', () => {
    expect(getDateString(new Date(2025, 0, 2))).toBe('2025-01-02');
  });

  it('throws if no editor is active', () => {
    expect(getEditor).toThrow('Could not load the VS Code editor instance.');
  });

  it('uses configured language arrays, strings and markdown fallback', async () => {
    expect(isActivationLanguageId('markdown')).toBe(true);
    expect(isActivationLanguageId('plaintext')).toBe(false);
    await workspace.getConfiguration().update('languages', 'plaintext');
    expect(isActivationLanguageId('plaintext')).toBe(true);
    await workspace.getConfiguration().update('languages', undefined);
    expect(isActivationLanguageId('markdown')).toBe(true);
    expect(isActivationLanguageId('plaintext')).toBe(false);
  });

  it('activates for the current editor language', async () => {
    const document = await workspace.openTextDocument({ content: 'task', language: 'markdown' });
    await window.showTextDocument(document);
    expect(shouldActivate()).toBe(true);
    expect(getEditor().selection.active).toEqual(new Position(0, 0));
  });
});
