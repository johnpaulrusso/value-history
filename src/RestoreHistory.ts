import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export function RestoreHistory(finalValue: any, history: any) : any
{
    let originalValue = NO_HISTORIC_CHANGES;

    if(history === NO_HISTORIC_CHANGES)
    {
        originalValue = finalValue;
    }
    else
    {
        if(history === Object(history))
        {
            throw new ValueHistoryTypeMismatchError("Final value is a primitive and history is not.");
        }   
        else
        {
            originalValue = history;
        }
    }

    return originalValue;
}