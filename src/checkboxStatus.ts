import {
  Disposable,
  StatusBarAlignment,
  StatusBarItem,
  window,
  workspace,
} from 'vscode';
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

  constructor(checkboxStatus: CheckboxStatus) {
    this.checkboxStatus = checkboxStatus;
    this.checkboxStatus.updateCheckboxStatus();

    const subscriptions: Disposable[] = [];
    workspace.onDidChangeTextDocument(this.onEvent, this, subscriptions);
    window.onDidChangeActiveTextEditor(this.onEvent, this, subscriptions);

    this.disposable = Disposable.from(...subscriptions);
  }

  private onEvent() {
    this.checkboxStatus.updateCheckboxStatus();
  }

  public dispose() {
    this.disposable.dispose();
  }
}
