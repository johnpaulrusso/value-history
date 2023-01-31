import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export function AccumulateHistory(olderHistory: any, newerHistory: any) : any
{
    let result: any = NO_HISTORIC_CHANGES;

    if(olderHistory === NO_HISTORIC_CHANGES)
    {
        result = newerHistory;
    }
    else if(newerHistory === NO_HISTORIC_CHANGES)
    {
        result = olderHistory;
    }
    else if(olderHistory === Object(olderHistory))
    {
        if(Object(olderHistory).hasOwnProperty("l")) // olderHistory is compressed array history.
        {
            if(Object(newerHistory).hasOwnProperty("l"))
            {
                result = AccumulateArrayHistory(olderHistory, newerHistory);
            }
            else // newer history is NOT compressed array history.
            {
                throw new ValueHistoryTypeMismatchError("Incompatible Histories - older is an array history and newer is not.");
            }
        }
        else if(Object(olderHistory).hasOwnProperty("c")) // olderHistory is compressed object history.
        {
            if(Object(newerHistory).hasOwnProperty("c") && !Object(newerHistory).hasOwnProperty("l"))
            {
                result = AccumulateObjectHistory(olderHistory, newerHistory);
            }
            else // newer history is NOT compressed array history.
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
    else // olderHistory is Primitive
    {
        if(newerHistory !== Object(newerHistory)) // newerHistory is also Primitive
        {
            result = olderHistory; 
        }
        else
        {
            throw new ValueHistoryTypeMismatchError("Incompatible Histories - older is a primitive history and newer is an array or object history.");
        }
    }

    return result;
}

export function AccumulateArrayHistory(olderHistory: ICompressedArrayHistory, newerHistory: ICompressedArrayHistory) : ICompressedArrayHistory 
{
    const result: ICompressedArrayHistory = {
        l: 0,
        c: []
    }

    // Always use the oldest length
    result.l = olderHistory.l;

    // first accumulate all the older changes, all are needed.
    olderHistory.c.forEach(olderChange => {
        // if there is a corresponding newer change, accumulate!
        const coorespondingNewerChange = newerHistory.c.find(newerChange => newerChange.i === olderChange.i);
        if(coorespondingNewerChange)
        {
            result.c.push({i: olderChange.i, h: AccumulateHistory(olderChange.h, coorespondingNewerChange.h)});
        }
        else
        {
            result.c.push(olderChange);
        }
        
    });

    newerHistory.c.forEach(newerChange => {
        // Only take the newer change if its index is less than the older length AND the older history doesn't have a change to the same index.
        if((newerChange.i < result.l) && (result.c.findIndex(olderChange => olderChange.i === newerChange.i) === -1))
        {
            result.c.push(newerChange);
        }
    });

    result.c.sort((c1: {i: number, h: any}, c2: {i: number, h: any}) => {
       return c1.i - c2.i
    })

    return result;
}

export function AccumulateObjectHistory(olderHistory: ICompressedObjectHistory, newerHistory: ICompressedObjectHistory) : ICompressedObjectHistory 
{
    const result: ICompressedObjectHistory = {
        c: []
    }

    // If the older history has a raw Obj, we need that.
    if(olderHistory.hasOwnProperty("o"))
    {
        result.o = olderHistory.o;

        if(olderHistory.c.length > 0)
        {
            throw new Error("Incompatible Histories - object history cannot contain both changes and a raw object.");
        }
    }
    else if(newerHistory.hasOwnProperty("o") && newerHistory.c.length > 0)
    {
        throw new Error("Incompatible Histories - object history cannot contain both changes and a raw object.");
    }
    else
    {
        // accumulate all the older changes, all are needed. This could be empty.
        olderHistory.c.forEach(olderChange => {
            result.c.push(olderChange);
        });

        // Only take the newer changes if rawObj does not exist on the older history.
        if(!olderHistory.hasOwnProperty("o"))
        {
            newerHistory.c.forEach(newerChange => {
                // Only take the newer change if the older history doesn't have a change to the same key.
                if(result.c.findIndex(olderChange => olderChange.k === newerChange.k) === -1)
                {
                    result.c.push(newerChange);
                }
            });
        }
    }

    return result;
}