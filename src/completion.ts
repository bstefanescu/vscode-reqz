import { CompletionItem, CompletionItemKind, Position, Range } from "vscode";
import CompletionContext from "./CompletionContext";
import fileCompletion from "./fileCompletion";


type ArgCompletorFn = (ctx: CompletionContext) => CompletionItem[] | undefined;

function argFileCompletor(ctx: CompletionContext) {
    const args = ctx.directiveArgs!;

    const index = ctx.getCurrentArgIndex();
    if (index !== 0) {
        return undefined; // we are not in the file argument
    }

    const fileArg = args[0];
    const offset = ctx.position.character;

    if (fileArg && (fileArg.q === '"' || fileArg.q === "'")) {
        if (offset > fileArg.start && offset < fileArg.end) {
            const range = new Range(ctx.position.line, fileArg.start + 1, ctx.position.line, fileArg.end - 1)
            return fileCompletion(ctx, range);
        }
    }

    return undefined;
}

const COMPLETORS: Record<string, ArgCompletorFn> = {
    "run": (ctx: CompletionContext) => {
        let r = argFileCompletor(ctx);
        if (!r) {
            const index = ctx.getCurrentArgIndex();
            console.log('!!!!!!!!!!', index, ctx.getCurrentArg());
            if (index === 1) {
                const arg = ctx.getCurrentArg();
                if (arg) {
                    if ('using'.startsWith(arg.value)) {
                        const item = new CompletionItem('using', CompletionItemKind.Keyword);
                        item.commitCharacters = [' '];
                        item.insertText = 'using {';
                        r = [item];
                    }
                } else {
                    const item = new CompletionItem('using', CompletionItemKind.Keyword);
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
}

// prefix is either empty, either it doesn't contain leading spaces. 
export function getCompletionItems(ctx: CompletionContext) {
    if (ctx.lineIsEmpty) {
        const r = ctx.keywords.map(name => ctx.getDirectiveCompletionItem(name));
        return r;
    }

    const position = ctx.position;
    if (ctx.directiveRange) {
        if (position.isBefore(ctx.directiveRange.end)) {
            return undefined;
        } else if (position.isAfter(ctx.directiveRange.end)) {
            // complete directive args 
            const completorFn = COMPLETORS[ctx.directiveToken!];
            if (completorFn) {
                return completorFn(ctx);
            }
        } else {
            // complete the directive keyword
            const token = ctx.directiveToken!;
            const offset = position.character - ctx.directiveRange.start.character;
            const prefix = token.substring(0, offset);
            return ctx.keywordsByPrefix(prefix).map(name => ctx.getDirectiveCompletionItem(name));
        }
    }
    return undefined;
}


