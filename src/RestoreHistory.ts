import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export class ValueRestorationWrapper
{
    valueToRestore: any
    constructor(valueToRestore: any)
    {
        this.valueToRestore = valueToRestore;
    }
}

/**
 * RestoreHistory restores a "final" value to its "original" value using a history record.
 * A wrapper object must be used so that primitives are not lost via pass-by-value.
 * @param valueRestorationWrapper 
 * @param history 
 */
export function RestoreHistory(valueRestorationWrapper: ValueRestorationWrapper, history: any) 
{
    if(history !== NO_HISTORIC_CHANGES)
    {
        if(valueRestorationWrapper.valueToRestore === Object(valueRestorationWrapper.valueToRestore))
        {
            if(Array.isArray(valueRestorationWrapper.valueToRestore))
            {
                if(history.hasOwnProperty("length"))
                {
                    RestoreArrayHistory(valueRestorationWrapper, history as ICompressedArrayHistory);
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
                    RestoreObjectHistory(valueRestorationWrapper, history as ICompressedObjectHistory);
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
                valueRestorationWrapper.valueToRestore = history;
            }
        }
    }
}

function RestoreArrayHistory(arrayWrapper: ValueRestorationWrapper, history: ICompressedArrayHistory) 
{
    let array = arrayWrapper.valueToRestore as Array<any>;

    if(array.length > history.length)
    {
        array = array.slice(0, history.length);
    }

    history.changes.forEach((change) => {
        if(change.index < history.length)
        {
            if(change.index < array.length)
            {
                let valueWrapper = new ValueRestorationWrapper(array[change.index]);
                RestoreHistory(valueWrapper, change.history);
                array[change.index] = valueWrapper.valueToRestore;
            }
            else 
            {
                array.push(change.history)
            }
        }   
        else
        {
            throw new Error("Invalid History.");
        }
    });

    if(array.length < history.length)
    {
        throw new Error("Insufficient History.");
    }

    arrayWrapper.valueToRestore = array;
}

function RestoreObjectHistory(objectWrapper: ValueRestorationWrapper, history: ICompressedObjectHistory) 
{
    let obj = objectWrapper.valueToRestore as Object;

    //Delete any keys that are new to the value.
    history.newKeys.forEach(newKey => {
        if(obj.hasOwnProperty(newKey))
        {
            delete obj[newKey as keyof typeof obj];
        }
    });
    
    history.changes.forEach(change => {
        let objWrapper = new ValueRestorationWrapper(obj[change.key as keyof typeof obj]);
        RestoreHistory(objWrapper, change.history);
        obj[change.key as keyof typeof obj] = objWrapper.valueToRestore;
    });

    objectWrapper.valueToRestore = obj;
}