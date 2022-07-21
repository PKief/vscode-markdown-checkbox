import * as vscode from 'vscode';

/**
 * Helper function to set all settings to default values before each test
 */
export const setSettingsToDefault = async () => {
  const extensionName = 'markdown-checkbox';
  const defaultSettings = {
    checkmark: 'X',
    languages: ['markdown'],
    withBulletPoint: true,
    typeOfBulletPoint: '*',
    strikeThroughWhenChecked: true,
    italicWhenChecked: true,
    dateWhenChecked: true,
    showStatusBarItem: true,
    dateFormat: 'YYYY-MM-DD',
  };
  await Promise.all(
    Object.entries(defaultSettings).map(async ([key, value]) => {
      return await vscode.workspace
        .getConfiguration(extensionName)
        .update(key, value);
    })
  );
};
