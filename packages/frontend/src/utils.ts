export function ObjectEntries<K extends (string | number | symbol), V>(o: Record<K, V>) {
    return Object.entries(o) as [K, V][];
}