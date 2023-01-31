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
    l: number
    c: {i: number, h: any}[]
}

export interface ICompressedObjectHistory
{
    c: {k: string, h: any}[] // If sameKeys is true, this will be populated.
    o?: object // If sameKeys is false, this will be populated.
}
