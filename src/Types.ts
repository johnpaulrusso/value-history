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
    changes: Array<{key: string, history: any}> //If sameKeys is true, this will be populated.
    rawObj?: Object //If sameKeys is false, this will be populated.
}
