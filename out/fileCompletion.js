"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
/**
 *
 * @param ctx
 * @param pathRange the range of the path without quote characters: "[./path/bla]"
 * @returns
 */
function fileCompletion(ctx, pathRange) {
    const path = ctx.lineText.substring(pathRange.start.character, ctx.position.character);
    if (path.indexOf('/') === -1) {
        return undefined;
    }
    if (ctx.document.uri.scheme !== 'file') {
        return undefined;
    }
    const position = ctx.position;
    const wdir = (0, node_path_1.resolve)((0, node_path_1.dirname)(ctx.document.fileName));
    const file = (0, node_path_1.resolve)(wdir, path);
    if (path.endsWith('/')) {
        // list files in file dir
        const range = new vscode_1.Range(position, position);
        return (0, node_fs_1.readdirSync)(file, { withFileTypes: true }).map((f) => createItem(f, path, range));
    }
    else {
        const dir = (0, node_path_1.dirname)(file);
        const name = (0, node_path_1.basename)(file);
        const range = new vscode_1.Range(new vscode_1.Position(position.line, position.character - name.length), position);
        return (0, node_fs_1.readdirSync)(dir, { withFileTypes: true }).filter(f => f.name.startsWith(name)).map((f) => createItem(f, path, range));
    }
}
exports.default = fileCompletion;
function createItem(file, dir, range) {
    const isDir = file.isDirectory();
    const item = new vscode_1.CompletionItem(file.name, isDir ? vscode_1.CompletionItemKind.Folder : vscode_1.CompletionItemKind.File);
    item.insertText = file.name + (isDir ? '/' : '');
    item.commitCharacters = ['/', '"', "'"];
    item.range = range;
    if (isDir) {
        item.command = {
            command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...'
        };
    }
    return item;
}
//# sourceMappingURL=fileCompletion.js.map