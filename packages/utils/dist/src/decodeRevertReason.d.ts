/**
 * helper to decode revert data into its string representation
 * @param data revert data or an exception thrown by eth_call
 * @param nullIfNoMatch true to return null if not found. otherwise, return input data as-is
 */
export declare function decodeRevertReason(data: string | Error, nullIfNoMatch?: boolean): string | null;
export declare function rethrowWithRevertReason(e: Error): never;
