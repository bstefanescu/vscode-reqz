import { CompletionItem, CompletionItemKind, Position, Range, TextDocument } from "vscode";
import filterSortedArrayByPrefix, { binarySearch, sortedArrayIncldues as sortedArrayIncludes } from "./binary-search";
import SortedArray from "./sorted-array";
import { ILineArg, LineParser } from "./line-parser";


const KEYWORDS = [
    "import", "include", "run", "prompt", "var", "set", "inspect", "echo", "query", "body", "header", "headers",
    'TRACE', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'
]

const DIRECTIVE_RX = /^\s*(@?[a-zA-Z_][a-zA-Z0-9_]*)(\s.*)?$/;

export default class CompletionContext {

    keywords: string[];
    document: TextDocument;
    position: Position;
    lineIsEmpty: boolean;

    directiveRange?: Range;
    directiveToken?: string;
    _directiveArgs?: ILineArg[];

    constructor(document: TextDocument, position: Position) {
        const keywords = SortedArray(KEYWORDS);
        this.keywords = keywords;
        this.document = document;
        this.position = position;
        this.lineIsEmpty = document.lineAt(position).text.trim().length === 0;

        const text = this.line.text;
        if (!this.lineIsEmpty) {
            const m = DIRECTIVE_RX.exec(text);
            if (m) {
                const token = m[1];
                this.directiveRange = new Range(new Position(this.position.line, m.index), new Position(this.position.line, m.index + token.length))
                this.directiveToken = token;
            }
        }
        this.getDirectiveCompletionItem = this.getDirectiveCompletionItem.bind(this);
    }

    get directive() {
        if (this.directiveToken && this.isKeyword(this.directiveToken)) {
            return this.directiveToken;
        }
        return undefined;
    }

    isKeyword(value: string) {
        return sortedArrayIncludes(this.keywords, value);
    }

    get line() {
        return this.document.lineAt(this.position);
    }

    get lineText() {
        return this.document.lineAt(this.position).text;
    }

    get directiveArgs() {
        if (!this._directiveArgs) {
            if (this.directiveRange) {
                const start = this.directiveRange.end.character;
                const argsText = this.lineText.substring(start);
                this._directiveArgs = new LineParser().parse(argsText, start);
            }
        }
        return this._directiveArgs;
    }

    getCurrentArgIndex() {
        const args = this.directiveArgs;
        const offset = this.position.character;
        if (args) {
            for (let i = 0, l = args.length; i < l; i++) {
                const arg = args[i];
                if (offset >= arg.start && offset <= arg.end) {
                    return i;
                }
            }
            // after all args
            if (args.length > 0 && args[args.length - 1].end < offset) {
                return args.length;
            }
        }
        return -1;
    }

    getCurrentArg() {
        const index = this.getCurrentArgIndex();
        if (index > -1) {
            return this.directiveArgs![index];
        }
        return null;
    }


    keywordsByPrefix(prefix: string) {
        return filterSortedArrayByPrefix(this.keywords, prefix);
    }

    getDirectiveCompletionItem(name: string) {
        const range = this.directiveRange;
        const item = new CompletionItem(name, CompletionItemKind.Keyword);
        if (range) {
            item.range = range;
        }
        item.insertText = name + ' ';
        return item;
    }

}
