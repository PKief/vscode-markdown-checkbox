import * as glob from 'glob';
import * as Mocha from 'mocha';
import * as path from 'path';
import * as vscode from 'vscode';

export const run = (): Promise<void> => {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
    });
    mocha.useColors(true);

    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((c, e) => {
        glob('**/*.spec.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                return e(err);
            }

            // Add files to the test suite
            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                // Run the mocha test
                mocha.run(failures => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                });
            } catch (err) {
                e(err);
            }
        });
    });
};

/**
 * Helper function to set all settings to default values before each test
 */
export const useDefaultSettings = async () => {
    await vscode.workspace.getConfiguration('markdown-checkbox').update('checkmark', 'X');
    await vscode.workspace.getConfiguration('markdown-checkbox').update('languages', ['markdown']);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('withBulletPoint', true);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('typeOfBulletPoint', '*');
    await vscode.workspace.getConfiguration('markdown-checkbox').update('strikeThroughWhenChecked', true);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('italicWhenChecked', true);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('dateWhenChecked', true);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('showStatusBarItem', true);
    await vscode.workspace.getConfiguration('markdown-checkbox').update('dateFormat', 'YYYY-MM-DD');
};