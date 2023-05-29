interface IToken {
    spaces: string;
    value: string;
    start: number;
    end: number;
}

export interface ILineArg {
    q?: string;
    fragment?: boolean;
    left?: boolean;
    right?: boolean;
    value: string;
    start: number;
    end: number
}


export class LineTokenizer {
    rx = /(\s*)(\S+)/g;

    next(text: string, offset: number): IToken | null {
        const lastIndex = this.rx.lastIndex || 0;
        const m = this.rx.exec(text);
        if (m) {
            const spaces = m[1] || '';
            return {
                spaces,
                value: m[2] || '',
                start: offset + lastIndex + (spaces ? spaces.length : 0),
                end: offset + this.rx.lastIndex,
                //remaining: text.substring(m[0].length)
            }
        } else {
            return null;
        }
    }
}

export class LineParser {
    args: ILineArg[] = [];
    lastArg: ILineArg | null = null;

    readToken(token: IToken) {
        const args = this.args;
        const lastArg = args[args.length - 1];
        const text = token.value;
        const fc = text[0];

        if (lastArg && lastArg.fragment) {
            lastArg.value += token.spaces + text;
            lastArg.end = token.end;
            if (text.endsWith(lastArg.q!) && !text.endsWith('\\' + lastArg.q)) {
                // close the fragment
                lastArg.fragment = false;
            }
        } else if (fc === '"' || fc === "'" || fc === "`") {
            this.lastArg = {
                value: token.value,
                start: token.start,
                end: token.end,
                q: fc,
            }
            if (!text.endsWith(fc) || text[text.length - 2] === '\\') {
                this.lastArg.fragment = true;
            }
            args.push(this.lastArg);
        } else {
            this.lastArg = {
                value: token.value,
                start: token.start,
                end: token.end,
            }
            args.push(this.lastArg);
        }
    }

    parse(text: string, offset: number = 0) {
        const tokenizer = new LineTokenizer();
        let start = offset;
        let token: IToken | null = tokenizer.next(text, offset);
        while (token) {
            this.readToken(token);
            token = tokenizer.next(text, offset);
        }
        return this.args;
    }
}
