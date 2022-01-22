import * as vscode from 'vscode';
import * as helpers from '../helpers';
import { toggleCheckbox } from '../toggleCheckbox';

export const markCheckboxCommand = vscode.commands.registerCommand(
  'markdown-checkbox.markCheckbox',
  () => {
    if (!helpers.shouldActivate()) {
      return;
    }

    try {
      toggleCheckbox();
    } catch (error) {
      console.log(error);
    }
  }
);
