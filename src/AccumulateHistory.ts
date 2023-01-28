import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export function AccumulateHistory(olderHistory: any, newerHistory: any) : any
{
    let result: any = NO_HISTORIC_CHANGES;

    if(olderHistory !== NO_HISTORIC_CHANGES)
    {
        if(olderHistory === Object(olderHistory))
        {

        }
        else //olderHistory is Primitive
        {
            
            if(newerHistory !== Object(newerHistory)) //newerHistory is also Primitive
            {
                result = olderHistory; 
            }
            else
            {
                throw new ValueHistoryTypeMismatchError("Incompatible Histories - older: " + olderHistory.toString() + " newer: " + newerHistory.toString());
            }
            
        }

        result = olderHistory;
    }

    return result;
}