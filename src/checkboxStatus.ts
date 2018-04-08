import * as vscode from 'vscode';
import { Disposable, StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import * as helpers from './helpers';

export class CheckboxStatus {
    private _statusBarItem: StatusBarItem;

    public updateCheckboxStatus() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 200);
            this._statusBarItem.command = 'markdown-checkbox.showQuickPick';
        }

        const editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        const doc = editor.document;
        const showStatusBarItem = vscode.workspace.getConfiguration('markdown-checkbox').get('showStatusBarItem', true);

        if (doc.languageId === 'markdown' && showStatusBarItem) {
            const allCheckboxes = helpers.getAllCheckboxes();

            if (allCheckboxes.length === 0) {
                this._statusBarItem.hide();
                return;
            }

            const checkedCheckboxes = allCheckboxes.filter(cb => cb.checked);

            // update status bar
            this._statusBarItem.text = checkedCheckboxes.length + '/' + allCheckboxes.length + '  $(checklist)';
            this._statusBarItem.tooltip = checkedCheckboxes.length + ' of ' + allCheckboxes.length + ' checked checkboxes';
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

export class CheckboxStatusController {
    private _checkboxStatus: CheckboxStatus;
    private _disposable: Disposable;

    constructor(checkboxStatus: CheckboxStatus) {
        this._checkboxStatus = checkboxStatus;
        this._checkboxStatus.updateCheckboxStatus();

        const subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._checkboxStatus.updateCheckboxStatus();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
