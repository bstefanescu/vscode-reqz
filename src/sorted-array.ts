const is_sorted = Symbol('is_sorted');

export default function SortedArray<T>(arr: T[]) {
    if (!(arr as any)[is_sorted]) {
        arr.sort();
        (arr as any)[is_sorted] = true;
    }
    return arr;
}
