import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export function AccumulateHistory(olderHistory: any, newerHistory: any) : any
{
    let result: any = NO_HISTORIC_CHANGES;

    if(olderHistory !== NO_HISTORIC_CHANGES)
    {
        if(newerHistory === NO_HISTORIC_CHANGES)
        {
            result = olderHistory;
        }
        else if(olderHistory === Object(olderHistory))
        {
            if(Object(olderHistory).hasOwnProperty("length")) //olderHistory is compressed array history.
            {
                if(Object(newerHistory).hasOwnProperty("length"))
                {
                    result = AccumulateArrayHistory(olderHistory, newerHistory);
                }
                else //newer history is NOT compressed array history.
                {
                    throw new ValueHistoryTypeMismatchError("Incompatible Histories - older is an array history and newer is not.");
                }
            }
            else if(Object(olderHistory).hasOwnProperty("sameKeys")) //olderHistory is compressed object history.
            {
                if(Object(newerHistory).hasOwnProperty("sameKeys"))
                {
                    result = AccumulateObjectHistory(olderHistory, newerHistory);
                }
                else //newer history is NOT compressed array history.
                {
                    throw new ValueHistoryTypeMismatchError("Incompatible Histories - older is an object history and newer is not.");
                }
            }
            else if(Object.prototype.toString.call(olderHistory) === '[object Date]')
            {
                if(Object.prototype.toString.call(newerHistory) === '[object Date]')
                {
                    result = olderHistory; 
                }
                else
                {
                    throw new ValueHistoryTypeMismatchError("Incompatible Histories - older history is a Date and newer is not.");
                }
                
            }
            else
            {
                throw new ValueHistoryTypeMismatchError("Incompatible Histories - Unrecognized history types.");
            }
        }
        else //olderHistory is Primitive
        {
            if(newerHistory !== Object(newerHistory)) //newerHistory is also Primitive
            {
                result = olderHistory; 
            }
            else
            {
                throw new ValueHistoryTypeMismatchError("Incompatible Histories - older is a primitive history and newer is an array or object history.");
            }
        }
    }

    return result;
}

export function AccumulateArrayHistory(olderHistory: ICompressedArrayHistory, newerHistory: ICompressedArrayHistory) : ICompressedArrayHistory 
{
    let result: ICompressedArrayHistory = {
        length: 0,
        changes: []
    }

    //Always use the oldest length
    result.length = olderHistory.length;

    //first accumulate all the older changes, all are needed.
    olderHistory.changes.forEach(olderChange => {
        //if there is a corresponding newer change, accumulate!
        let newerChange = newerHistory.changes.find(newerChange => newerChange.index === olderChange.index);
        if(newerChange)
        {
            result.changes.push({index: olderChange.index, history: AccumulateHistory(olderChange.history, newerChange.history)});
        }
        else
        {
            result.changes.push(olderChange);
        }
        
    });

    newerHistory.changes.forEach(newerChange => {
        //Only take the newer change if its index is less than the older length AND the older history doesn't have a change to the same index.
        if((newerChange.index < result.length) && (result.changes.findIndex(olderChange => olderChange.index === newerChange.index) === -1))
        {
            result.changes.push(newerChange);
        }
    });

    result.changes.sort((c1: {index: number, history: any}, c2: {index: number, history: any}) => {
       return c1.index - c2.index
    })

    return result;
}

export function AccumulateObjectHistory(olderHistory: ICompressedObjectHistory, newerHistory: ICompressedObjectHistory) : ICompressedObjectHistory 
{
    let result: ICompressedObjectHistory = {
        sameKeys: olderHistory.sameKeys && newerHistory.sameKeys,
        changes: []
    }

    //first accumulate all the older changes, all are needed.
    olderHistory.changes.forEach(olderChange => {
        result.changes.push(olderChange);
    });

    if(olderHistory.sameKeys)
    {
        newerHistory.changes.forEach(newerChange => {
            //Only take the newer change if the older history doesn't have a change to the same key.
            if(result.changes.findIndex(olderChange => olderChange.key === newerChange.key) === -1)
            {
                result.changes.push(newerChange);
            }
        });
    }

    return result;
}