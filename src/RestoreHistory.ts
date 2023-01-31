import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

/**
 * RestoreHistory restores a "final" value to its "original" value using a history record.
 * A wrapper object must be used so that primitives are not lost via pass-by-value.
 * @param valueRestorationWrapper 
 * @param history 
 * @returns original value.
 */
export function RestoreHistory(value: any, history: any) : any
{
    //By default, the result is a clone of the value (history === NO_HSTORIC_CHANGES).
    //Cloning is necessary so that the method doesn't mutate the given value.
    let valueClone = structuredClone(value);
    return RestoreHistoryInternal(valueClone, history);
}

function RestoreHistoryInternal(value: any, history: any) : any
{
    let result = value;

    if(history !== NO_HISTORIC_CHANGES)
    {
        if(value === Object(value))
        {
            if(Array.isArray(value))
            {
                if(history.hasOwnProperty("l"))
                {
                    result = RestoreArrayHistory(value, history as ICompressedArrayHistory);
                }
                else
                {
                    throw new ValueHistoryTypeMismatchError("Value is an array and history is not.");
                }
            }
            else
            {
                if(Object.prototype.toString.call(value) === '[object Date]')
                {
                    if(Object.prototype.toString.call(history) === '[object Date]')
                    {
                        result = history;
                    }
                    else
                    {
                        throw new ValueHistoryTypeMismatchError("Value is a Date and history is not."); 
                    }
                }
                else if(history.hasOwnProperty("c") && !history.hasOwnProperty("l"))
                {
                    result = RestoreObjectHistory(value, history as ICompressedObjectHistory);
                }
                else 
                {
                    throw new ValueHistoryTypeMismatchError("Value is an object and history is not.");
                }
            }
        }   
        else
        {
            //primitive
            if(history === Object(history))
            {
                throw new ValueHistoryTypeMismatchError("Value is a primitive and history is not.");
            }
            else
            {
                result = history;
            }
        }
    }

    return result;
}

function RestoreArrayHistory(array: Array<any>, history: ICompressedArrayHistory) : Array<any>
{
    let result = array;

    if(array.length > history.l)
    {
        result = array.slice(0, history.l);
    }

    history.c.forEach((c) => {
        if(c.i < history.l)
        {
            if(c.i < array.length)
            {
                result[c.i] = RestoreHistory(array[c.i], c.h);
            }
            else 
            {
                result.push(c.h)
            }
        }   
        else
        {
            throw new Error("Invalid History.");
        }
    });

    if(result.length < history.l)
    {
        throw new Error("Insufficient History.");
    }

    return result;
}

function RestoreObjectHistory(obj: Object, history: ICompressedObjectHistory) : Object
{
    let result: Object = {};
    
    if(history.o)
    {
        result = history.o;
    }
    else
    {
        result = obj;
        history.c!.forEach(c => {
            result[c.k as keyof typeof result] = RestoreHistory(result[c.k as keyof typeof result], c.h);
        });
    }

    return result;
}
