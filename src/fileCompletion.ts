import { CompletionItem, CompletionItemKind, Position, Range, TextDocument } from "vscode";
import { readdirSync, Dirent } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import CompletionContext from "./CompletionContext";


/**
 * 
 * @param ctx 
 * @param pathRange the range of the path without quote characters: "[./path/bla]" 
 * @returns 
 */
export default function fileCompletion(ctx: CompletionContext, pathRange: Range) {
    const path = ctx.lineText.substring(pathRange.start.character, ctx.position.character);

    if (path.indexOf('/') === -1) {
        return undefined;
    }

    if (ctx.document.uri.scheme !== 'file') {
        return undefined;
    }

    const position = ctx.position;
    const wdir = resolve(dirname(ctx.document.fileName));
    const file = resolve(wdir, path);
    if (path.endsWith('/')) {
        // list files in file dir
        const range = new Range(position, position);
        return readdirSync(file, { withFileTypes: true }).map((f: Dirent) => createItem(f, path, range));
    } else {
        const dir = dirname(file);
        const name = basename(file);
        const range = new Range(new Position(position.line, position.character - name.length), position);
        return readdirSync(dir, { withFileTypes: true }).filter(f => f.name.startsWith(name)).map((f: Dirent) => createItem(f, path, range));
    }
}


function createItem(file: Dirent, dir: string, range: Range) {
    const isDir = file.isDirectory();
    const item = new CompletionItem(file.name, isDir ? CompletionItemKind.Folder : CompletionItemKind.File);
    item.insertText = file.name + (isDir ? '/' : '');
    item.commitCharacters = ['/', '"', "'"];
    item.range = range;
    if (isDir) {
        item.command = {
            command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...'
        }
    }
    return item;
}