import {
  Disposable,
  StatusBarAlignment,
  StatusBarItem,
  window,
  workspace,
} from 'vscode';
import * as vscode from 'vscode';
import * as helpers from './helpers';

export class CheckboxStatus {
  private statusBarItem!: StatusBarItem;

  public updateCheckboxStatus() {
    if (!this.statusBarItem) {
      this.statusBarItem = window.createStatusBarItem(
        StatusBarAlignment.Right,
        200
      );
      this.statusBarItem.command = 'markdown-checkbox.showQuickPick';
    }

    const editor = window.activeTextEditor;
    if (!editor) {
      this.statusBarItem.hide();
      return;
    }

    const showStatusBarItem = helpers.getConfig<boolean>('showStatusBarItem');

    if (helpers.shouldActivate() && showStatusBarItem) {
      const allCheckboxes = helpers.getAllCheckboxes();

      if (allCheckboxes.length === 0) {
        this.statusBarItem.hide();
        return;
      }

      const checkedCheckboxes = allCheckboxes.filter((cb) => cb.checked);

      // update status bar
      this.statusBarItem.text =
        checkedCheckboxes.length +
        '/' +
        allCheckboxes.length +
        '  $(checklist)';
      this.statusBarItem.tooltip =
        checkedCheckboxes.length +
        ' of ' +
        allCheckboxes.length +
        ' checked checkboxes';
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  public dispose() {
    this.statusBarItem.dispose();
  }
}

export class CheckboxStatusController {
  private checkboxStatus: CheckboxStatus;
  private disposable: Disposable;
  private updateTimeout: NodeJS.Timeout | undefined;

  constructor(checkboxStatus: CheckboxStatus) {
    this.checkboxStatus = checkboxStatus;
    this.checkboxStatus.updateCheckboxStatus();

    const subscriptions: Disposable[] = [];
    workspace.onDidChangeTextDocument(
      this.onTextDocumentChange,
      this,
      subscriptions
    );
    window.onDidChangeActiveTextEditor(this.onEvent, this, subscriptions);

    this.disposable = Disposable.from(...subscriptions);
  }

  private onTextDocumentChange(event: vscode.TextDocumentChangeEvent) {
    // Only clear cache if the changes might affect checkboxes
    const hasCheckboxRelatedChanges = event.contentChanges.some((change) => {
      const text = change.text;
      const rangeText = event.document.getText(change.range);

      // Check if the change involves checkbox-related content
      return (
        text.includes('[') ||
        text.includes(']') ||
        rangeText.includes('[') ||
        rangeText.includes(']')
      );
    });

    if (hasCheckboxRelatedChanges) {
      helpers.clearCheckboxCache();
    }

    // Debounce status bar updates to avoid excessive calls during rapid typing
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.checkboxStatus.updateCheckboxStatus();
    }, 300); // 300ms debounce
  }

  private onEvent() {
    // Clear cache when switching documents
    helpers.clearCheckboxCache();
    this.checkboxStatus.updateCheckboxStatus();
  }

  public dispose() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.disposable.dispose();
  }
}
