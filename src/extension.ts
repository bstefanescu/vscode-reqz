// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { CompletionItem, ExtensionContext, TextDocument, Position, languages } from 'vscode';
import { getCompletionItems } from './completion';
import CompletionContext from './CompletionContext';



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    const provider = languages.registerCompletionItemProvider('reqz', {
        provideCompletionItems(document: TextDocument, position: Position) {
            const ctx = new CompletionContext(document, position);
            return getCompletionItems(ctx);
        }
    });
    context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() { }

