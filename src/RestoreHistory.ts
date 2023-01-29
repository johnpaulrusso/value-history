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
                if(history.hasOwnProperty("length"))
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
                if(history.hasOwnProperty("newKeys"))
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

    if(array.length > history.length)
    {
        result = array.slice(0, history.length);
    }

    history.changes.forEach((change) => {
        if(change.index < history.length)
        {
            if(change.index < array.length)
            {
                result[change.index] = RestoreHistory(array[change.index], change.history);
            }
            else 
            {
                result.push(change.history)
            }
        }   
        else
        {
            throw new Error("Invalid History.");
        }
    });

    if(result.length < history.length)
    {
        throw new Error("Insufficient History.");
    }

    return result;
}

function RestoreObjectHistory(obj: Object, history: ICompressedObjectHistory) : Object
{
    let result = obj;

    //Delete any keys that are new to the value.
    history.newKeys.forEach(newKey => {
        if(result.hasOwnProperty(newKey))
        {
            delete result[newKey as keyof typeof result];
        }
    });
    
    history.changes.forEach(change => {
        result[change.key as keyof typeof result] = RestoreHistory(result[change.key as keyof typeof result], change.history);
    });

    return result;
}