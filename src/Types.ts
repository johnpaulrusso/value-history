export const NO_HISTORIC_CHANGES: undefined = undefined;

export class ValueHistoryTypeMismatchError extends Error
{
    constructor(message: string)
    {
        super(message)
        this.name = "ValueHistoryTypeMismatchError"
    }
}

export interface ICompressedArrayHistory
{
    length: number
    changes: Array<{index: number, history: any}>
}

export interface ICompressedObjectHistory
{
    changes: Array<{key: string, history: any}>

    /** 
     * When restoring history, this list specifies keys that only exist in the newer state 
     * and should NOT be present in the restored state.
     */
    newKeys: Array<string>
}
