"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const completion_1 = require("./completion");
const CompletionContext_1 = require("./CompletionContext");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const provider = vscode_1.languages.registerCompletionItemProvider('reqz', {
        provideCompletionItems(document, position) {
            const ctx = new CompletionContext_1.default(document, position);
            return (0, completion_1.getCompletionItems)(ctx);
        }
    });
    context.subscriptions.push(provider);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map