export function binarySearch<T>(sortedArray: T[], value: T) {
    if (value == null) return -1;
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
        } else {
            low = mid + 1;
        }
    }
    return -1;
}

export function sortedArrayIncldues<T>(sortedArray: T[], value: T) {
    return binarySearch(sortedArray, value) !== -1;
}

export default function filterSortedArrayByPrefix(sortedArray: string[], prefix: string) {
    if (!prefix) return sortedArray;
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
        } else {
            low = mid + 1;
        }
    }

    if (startMatchIndex === -1) {
        return [];
    }

    // Find the end index of the matching range
    let endMatchIndex = startMatchIndex;

    while (
        endMatchIndex < sortedArray.length &&
        sortedArray[endMatchIndex].slice(0, prefixLength) === prefix
    ) {
        endMatchIndex++;
    }

    return sortedArray.slice(startMatchIndex, endMatchIndex);
}
