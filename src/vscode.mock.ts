// In-memory subset of the VS Code API used by the checkbox unit tests.
export class Position {
  constructor(public line: number, public character: number) {}
  with(line = this.line, character = this.character) {
    return new Position(line, character);
  }
}

export class Range {
  start: Position;
  end: Position;
  constructor(start: Position, end: Position) {
    const forward = start.line < end.line || (start.line === end.line && start.character <= end.character);
    this.start = forward ? start : end;
    this.end = forward ? end : start;
  }
}

export class Selection extends Range {
  constructor(public anchor: Position, public active: Position) {
    super(anchor, active);
  }
  get isEmpty() {
    return this.start.line === this.end.line && this.start.character === this.end.character;
  }
}

class Document {
  constructor(private content: string, public languageId: string) {}
  getText() { return this.content; }
  get lineCount() { return this.content.split('\n').length; }
  lineAt(line: number) {
    const text = this.content.split('\n')[line];
    if (text === undefined) throw new Error(`Invalid line ${line}`);
    return {
      text,
      lineNumber: line,
      firstNonWhitespaceCharacterIndex: text.search(/\S/) === -1 ? text.length : text.search(/\S/),
      range: new Range(new Position(line, 0), new Position(line, text.length)),
      isEmptyOrWhitespace: text.trim().length === 0,
    };
  }
  offsetAt(position: Position) {
    const lines = this.content.split('\n');
    return lines.slice(0, position.line).reduce((offset, line) => offset + line.length + 1, 0)
      + Math.min(position.character, lines[position.line]!.length);
  }
  apply(edits: { start: number; end: number; text: string }[]) {
    for (const edit of edits.sort((a, b) => b.start - a.start)) {
      this.content = this.content.slice(0, edit.start) + edit.text + this.content.slice(edit.end);
    }
  }
}

class Editor {
  selection = new Selection(new Position(0, 0), new Position(0, 0));
  constructor(public document: Document) {}
  async edit(callback: (builder: {
    insert: (position: Position, text: string) => void;
    replace: (range: Range, text: string) => void;
    delete: (range: Range) => void;
  }) => void) {
    const edits: { start: number; end: number; text: string }[] = [];
    const replace = (range: Range, text: string) => edits.push({
      start: this.document.offsetAt(range.start), end: this.document.offsetAt(range.end), text,
    });
    callback({
      insert: (position, text) => { replace(new Range(position, position), text); },
      replace: (range, text) => { replace(range, text); },
      delete: (range) => { replace(range, ''); },
    });
    this.document.apply(edits);
    return true;
  }
}

const defaults: Record<string, unknown> = {
  checkmark: 'X', languages: ['markdown'], withBulletPoint: true,
  typeOfBulletPoint: '*', strikeThroughWhenChecked: true, italicWhenChecked: true,
  dateWhenChecked: true, showStatusBarItem: true, dateFormat: 'YYYY-MM-DD',
  dateTemplate: '[{date}]', quickPickEscBehavior: 'doNothing',
};
let settings = structuredClone(defaults);
export const window = {
  activeTextEditor: undefined as Editor | undefined,
  async showTextDocument(document: Document) {
    const editor = new Editor(document);
    window.activeTextEditor = editor;
    return editor;
  },
};
export const workspace = {
  async openTextDocument(options: { content: string; language: string }) {
    return new Document(options.content, options.language);
  },
  getConfiguration(_section?: string) {
    return {
      get<T>(key: string) { return settings[key] as T; },
      async update(key: string, value: unknown) { settings[key] = value; },
    };
  },
};
export const resetVscode = () => {
  settings = structuredClone(defaults);
  window.activeTextEditor = undefined;
};
