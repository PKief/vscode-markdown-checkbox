import { Position } from 'vscode';

export interface Checkbox {
  checked: boolean;
  position: Position;
  text: string;
  lineNumber: number;
}
