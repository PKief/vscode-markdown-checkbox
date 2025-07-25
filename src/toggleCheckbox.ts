import * as vscode from 'vscode';
import { Position, Range, TextEditorEdit } from 'vscode';
import * as helpers from './helpers';
const moment = require('moment');

/** Mark a checkbox as checked or unchecked */
export const toggleCheckbox = async () => {
  // the position object gives you the line and character where the cursor is
  const editor = helpers.getEditor();
  if (editor.selection.isEmpty) {
    const cursorPosition = helpers.getCursorPosition();
    const line = editor.document.lineAt(cursorPosition.line);
    await toggleCheckboxOfLine(line);
    const endLine = editor.document.lineAt(editor.selection.end.line);
    const selectionPosition = new vscode.Position(endLine.lineNumber, 20000);
    helpers.getEditor().selection = new vscode.Selection(
      selectionPosition,
      selectionPosition
    );
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
export const toggleCheckboxOfLine = (
  line: vscode.TextLine,
  checkIt?: boolean
) => {
  const checkbox = helpers.getCheckboxOfLine(line);

  // no action required
  if (
    !checkbox ||
    (!checkbox.checked && checkIt === false) ||
    (checkbox.checked === true && checkIt === true)
  ) {
    return Promise.resolve(undefined);
  }

  let value = ' ';

  // if the checkbox is not checked or it must be checked
  if (checkIt === true || (checkIt === undefined && !checkbox.checked)) {
    value = helpers.getConfig<string>('checkmark');
  }

  return markField(checkbox.position, value);
};

/** Marks the field inside the checkbox with a character */
const markField = (
  checkboxPosition: Position,
  replacement: string
): Thenable<boolean> => {
  const editor = helpers.getEditor();
  const checkmark = helpers.getConfig<string>('checkmark');

  return editor.edit((editBuilder: TextEditorEdit) => {
    editBuilder.replace(
      new Range(
        new Position(checkboxPosition.line, checkboxPosition.character + 1),
        new Position(
          checkboxPosition.line,
          checkboxPosition.character +
            (replacement !== ' ' ? 2 : checkmark.length + 1)
        )
      ),
      replacement
    );

    // get settings from config
    const italicWhenChecked = helpers.getConfig<boolean>('italicWhenChecked');
    const strikeThroughWhenChecked = helpers.getConfig<boolean>(
      'strikeThroughWhenChecked'
    );
    const dateWhenChecked = helpers.getConfig<boolean>('dateWhenChecked');
    const dateFormat = helpers.getConfig<string>('dateFormat');

    // get line of the checkbox
    const line = editor.document.lineAt(checkboxPosition.line);
    const lhc = helpers.getCheckboxOfLine(line);
    const lineText = line.text;
    const textWithoutCheckbox = lineText
      .substr(checkboxPosition.character + 4, lineText.length)
      .trim();

    // respect trailing whitespace
    const foundTrailingWhitespace = lineText
      .substr(checkboxPosition.character + 4, lineText.length)
      .match(/[\s\n\r]*$/);
    const whitespace = foundTrailingWhitespace?.join('') || '';

    if (lhc && !lhc.checked && textWithoutCheckbox.length > 0) {
      let newText = textWithoutCheckbox;

      // apply different formats to highlight checked status
      if (italicWhenChecked) {
        newText = `*${newText}*`;
      }
      if (strikeThroughWhenChecked) {
        newText = `~~${newText}~~`;
      }
      if (dateWhenChecked) {
        const date = moment(new Date()).format(dateFormat);
        const decoratedDate = helpers
          .getConfig<string>('dateTemplate')
          .replace('{date}', date);
        newText = `${newText} ${decoratedDate}${whitespace}`;
      }

      editBuilder.replace(
        new Range(
          new Position(checkboxPosition.line, checkboxPosition.character + 4),
          new Position(checkboxPosition.line, line.text.length)
        ),
        newText
      );
    } else if (lhc && lhc.checked) {
      let newText = textWithoutCheckbox;

      // Remove strikethrough formatting (outermost ~~ pairs) if present
      if (strikeThroughWhenChecked && newText.startsWith('~~')) {
        // Remove the date first to avoid interfering with strikethrough detection
        let tempText = newText;
        let datePart = '';
        if (dateWhenChecked) {
          const dateMatch = tempText.match(/(\s+\[[^[]+?\])$/);
          if (dateMatch) {
            datePart = dateMatch[1];
            tempText = tempText.substring(0, tempText.length - datePart.length);
          }
        }

        // Now remove strikethrough from the main text
        if (tempText.startsWith('~~') && tempText.endsWith('~~')) {
          tempText = tempText.substring(2, tempText.length - 2);
        }

        newText = tempText + datePart;
      }

      // Remove italic formatting (outermost * pairs) if present
      if (italicWhenChecked) {
        // Remove the date first to avoid interfering with italic detection
        let tempText = newText;
        let datePart = '';
        if (dateWhenChecked) {
          const dateMatch = tempText.match(/(\s+\[[^[]+?\])$/);
          if (dateMatch) {
            datePart = dateMatch[1];
            tempText = tempText.substring(0, tempText.length - datePart.length);
          }
        }

        // Now remove italic from the main text only if it wraps the entire content
        if (
          tempText.startsWith('*') &&
          tempText.endsWith('*') &&
          tempText.length > 2
        ) {
          // Check if these are the outermost asterisks (not part of **bold**)
          const inner = tempText.substring(1, tempText.length - 1);
          // Only remove if the inner content doesn't start/end with * (avoiding **bold** cases)
          if (!inner.startsWith('*') && !inner.endsWith('*')) {
            tempText = inner;
          }
        }

        newText = tempText + datePart;
      }

      // remove the date string
      if (dateWhenChecked) {
        newText = newText.replace(/\s+\[[^[]+?\]$/, '') + whitespace;
      }

      editBuilder.replace(
        new Range(
          new Position(checkboxPosition.line, checkboxPosition.character + 4),
          new Position(checkboxPosition.line, line.text.length)
        ),
        newText
      );
    }
  });
};
