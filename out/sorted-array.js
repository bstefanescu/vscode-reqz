"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_sorted = Symbol('is_sorted');
function SortedArray(arr) {
    if (!arr[is_sorted]) {
        arr.sort();
        arr[is_sorted] = true;
    }
    return arr;
}
exports.default = SortedArray;
//# sourceMappingURL=sorted-array.js.map