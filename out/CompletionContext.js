"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const binary_search_1 = require("./binary-search");
const sorted_array_1 = require("./sorted-array");
const line_parser_1 = require("./line-parser");
const KEYWORDS = [
    "import", "include", "run", "prompt", "var", "set", "inspect", "echo", "query", "body", "header", "headers",
    'TRACE', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'
];
const DIRECTIVE_RX = /^\s*(@?[a-zA-Z_][a-zA-Z0-9_]*)(\s.*)?$/;
class CompletionContext {
    constructor(document, position) {
        const keywords = (0, sorted_array_1.default)(KEYWORDS);
        this.keywords = keywords;
        this.document = document;
        this.position = position;
        this.lineIsEmpty = document.lineAt(position).text.trim().length === 0;
        const text = this.line.text;
        if (!this.lineIsEmpty) {
            const m = DIRECTIVE_RX.exec(text);
            if (m) {
                const token = m[1];
                this.directiveRange = new vscode_1.Range(new vscode_1.Position(this.position.line, m.index), new vscode_1.Position(this.position.line, m.index + token.length));
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
    isKeyword(value) {
        return (0, binary_search_1.sortedArrayIncldues)(this.keywords, value);
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
                this._directiveArgs = new line_parser_1.LineParser().parse(argsText, start);
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
            return this.directiveArgs[index];
        }
        return null;
    }
    keywordsByPrefix(prefix) {
        return (0, binary_search_1.default)(this.keywords, prefix);
    }
    getDirectiveCompletionItem(name) {
        const range = this.directiveRange;
        const item = new vscode_1.CompletionItem(name, vscode_1.CompletionItemKind.Keyword);
        if (range) {
            item.range = range;
        }
        item.insertText = name + ' ';
        return item;
    }
}
exports.default = CompletionContext;
//# sourceMappingURL=CompletionContext.js.map