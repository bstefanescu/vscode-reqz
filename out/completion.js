"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletionItems = void 0;
const vscode_1 = require("vscode");
const fileCompletion_1 = require("./fileCompletion");
function argFileCompletor(ctx) {
    const args = ctx.directiveArgs;
    const index = ctx.getCurrentArgIndex();
    if (index !== 0) {
        return undefined; // we are not in the file argument
    }
    const fileArg = args[0];
    const offset = ctx.position.character;
    if (fileArg && (fileArg.q === '"' || fileArg.q === "'")) {
        if (offset > fileArg.start && offset < fileArg.end) {
            const range = new vscode_1.Range(ctx.position.line, fileArg.start + 1, ctx.position.line, fileArg.end - 1);
            return (0, fileCompletion_1.default)(ctx, range);
        }
    }
    return undefined;
}
const COMPLETORS = {
    "run": (ctx) => {
        let r = argFileCompletor(ctx);
        if (!r) {
            const index = ctx.getCurrentArgIndex();
            console.log('!!!!!!!!!!', index, ctx.getCurrentArg());
            if (index === 1) {
                const arg = ctx.getCurrentArg();
                if (arg) {
                    if ('using'.startsWith(arg.value)) {
                        const item = new vscode_1.CompletionItem('using', vscode_1.CompletionItemKind.Keyword);
                        item.commitCharacters = [' '];
                        item.insertText = 'using {';
                        r = [item];
                    }
                }
                else {
                    const item = new vscode_1.CompletionItem('using', vscode_1.CompletionItemKind.Keyword);
                    item.commitCharacters = [' '];
                    item.insertText = 'using {';
                    r = [item];
                }
            }
        }
        return r;
    },
    "import": argFileCompletor,
    "include": argFileCompletor
};
// prefix is either empty, either it doesn't contain leading spaces. 
function getCompletionItems(ctx) {
    if (ctx.lineIsEmpty) {
        const r = ctx.keywords.map(name => ctx.getDirectiveCompletionItem(name));
        return r;
    }
    const position = ctx.position;
    if (ctx.directiveRange) {
        if (position.isBefore(ctx.directiveRange.end)) {
            return undefined;
        }
        else if (position.isAfter(ctx.directiveRange.end)) {
            // complete directive args 
            const completorFn = COMPLETORS[ctx.directiveToken];
            if (completorFn) {
                return completorFn(ctx);
            }
        }
        else {
            // complete the directive keyword
            const token = ctx.directiveToken;
            const offset = position.character - ctx.directiveRange.start.character;
            const prefix = token.substring(0, offset);
            return ctx.keywordsByPrefix(prefix).map(name => ctx.getDirectiveCompletionItem(name));
        }
    }
    return undefined;
}
exports.getCompletionItems = getCompletionItems;
//# sourceMappingURL=completion.js.map