"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedArrayIncldues = exports.binarySearch = void 0;
function binarySearch(sortedArray, value) {
    if (value == null)
        return -1;
    let low = 0;
    let high = sortedArray.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const currentItem = sortedArray[mid];
        if (currentItem === value) {
            return mid;
        }
        if (value < currentItem) {
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    return -1;
}
exports.binarySearch = binarySearch;
function sortedArrayIncldues(sortedArray, value) {
    return binarySearch(sortedArray, value) !== -1;
}
exports.sortedArrayIncldues = sortedArrayIncldues;
function filterSortedArrayByPrefix(sortedArray, prefix) {
    if (!prefix)
        return sortedArray;
    const prefixLength = prefix.length;
    let low = 0;
    let high = sortedArray.length - 1;
    let startMatchIndex = -1;
    // Perform binary search to find the start index of the matching range
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const currentItem = sortedArray[mid];
        if (currentItem.slice(0, prefixLength) >= prefix) {
            startMatchIndex = mid;
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    if (startMatchIndex === -1) {
        return [];
    }
    // Find the end index of the matching range
    let endMatchIndex = startMatchIndex;
    while (endMatchIndex < sortedArray.length &&
        sortedArray[endMatchIndex].slice(0, prefixLength) === prefix) {
        endMatchIndex++;
    }
    return sortedArray.slice(startMatchIndex, endMatchIndex);
}
exports.default = filterSortedArrayByPrefix;
//# sourceMappingURL=binary-search.js.map