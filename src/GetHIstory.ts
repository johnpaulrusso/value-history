//------ GetHistory ------//

import {ValueHistoryTypeMismatchError, NO_HISTORIC_CHANGES, type ICompressedArrayHistory, type ICompressedObjectHistory} from "./Types";

export function GetHistory(originalValue: any, finalValue: any) : any 
{
    let result: any = NO_HISTORIC_CHANGES;

    if(originalValue === Object(originalValue))
    {
        if(Array.isArray(originalValue))
        {
            if(!Array.isArray(finalValue))
            {
                throw new ValueHistoryTypeMismatchError("Original value is an array and final value is: " + typeof(finalValue));
            }
            else
            {
                return getHistoryArray(originalValue, finalValue);
            }
        }
        else //originalValue is an Object
        {
            if(finalValue !== Object(finalValue))
            {
                throw new ValueHistoryTypeMismatchError("Original value is an object and final value is: " + typeof(finalValue));
            }
            else if(Array.isArray(finalValue))
            {
                throw new ValueHistoryTypeMismatchError("Original value is an object and final value is: array.");
            }
            else
            {
                return getHistoryObject(originalValue, finalValue);
            }
        }
    }
    else
    {
        //PRIMITIVE
        if(finalValue === Object(finalValue))
        {
            if(Array.isArray(finalValue))
            {
                throw new ValueHistoryTypeMismatchError("Original value is a primitive and final value is: array.");
            }
            else
            {
                throw new ValueHistoryTypeMismatchError("Original value is a primitive and final value is: " + typeof(finalValue));
            }
        }
        else
        {
            result = getHistoryPrimitive(originalValue, finalValue);
        }
    }

    return result;
}

function getHistoryPrimitive(originalValue: any, finalValue: any) : any
{
    return originalValue === finalValue ? NO_HISTORIC_CHANGES : originalValue;
}

function getHistoryArray(originalArray: Array<any>, finalArray: Array<any>) : ICompressedArrayHistory | undefined
{
    let result: any = NO_HISTORIC_CHANGES;
    let OL = originalArray.length;
    let FL = finalArray.length;

    let historyArray: Array<any> = []
    let compressedArrayHistory: ICompressedArrayHistory = {
        length: OL,
        changes: []
    }

    if(OL < FL) //Gained one or more values
    {
        finalArray.forEach((finalValue, index) => {
            if(index < OL)
            {
                let history = GetHistory(originalArray[index], finalValue);
                historyArray.push(history);
            }
        })
    }
    else if(OL > FL) //Lost one or more values
    {
        originalArray.forEach((originalValue, index) => {
            if(index < FL)
            {
                let history = GetHistory(originalValue, finalArray[index]);
                historyArray.push(history);
            }
            else
            {
                compressedArrayHistory.changes.push({index: index, history: originalValue})
            }
        })
    }
    else //Same length
    {
        originalArray.forEach((originalValue, index) => {
            let history = GetHistory(originalValue, finalArray[index]);
            historyArray.push(history);
        })
    }

    //Compress history array.
    historyArray.forEach((history, index) => {
        if(history !== NO_HISTORIC_CHANGES)
        {
            compressedArrayHistory.changes.push({index: index, history: history})
        }
    });
    
    if(OL !== FL || compressedArrayHistory.changes.length !== 0)
    {
        result = compressedArrayHistory;
    } 

    return result;
}

function getHistoryObject(originalObject: Object, finalObject: Object) : ICompressedObjectHistory | undefined
{
    let result: ICompressedObjectHistory | undefined = NO_HISTORIC_CHANGES;

    let originalKeys = Object.entries(originalObject).map(([key, value]) => key);
    let finalKeys = Object.entries(finalObject).map(([key, value]) => key);

    let allKeys: Array<string> = originalKeys.concat(finalKeys);
    let allKeysUnique = allKeys.filter((key, index) => allKeys.indexOf(key) === index);

    let history: Object = {};
    let compressedObjectHistory: ICompressedObjectHistory = {
        changes: [],
        newKeys: []
    }

    allKeysUnique.forEach((key) => {
        
        if(originalKeys.includes(key) && !finalKeys.includes(key))
        {
            //Only the old object has the key, so add it directly to the compressed changes.
            let originalValue = originalObject[key as keyof typeof originalObject];
            compressedObjectHistory.changes.push({key: key, history: originalValue})
        }
        else if(!originalKeys.includes(key) && finalKeys.includes(key))
        {
            //New key!
            compressedObjectHistory.newKeys.push(key);
        }
        else //Both 
        {
            //Both objects have the key, so get the history!
            let originalValue = originalObject[key as keyof typeof originalObject];
            let finalValue = finalObject[key as keyof typeof finalObject];
            let historyValue = GetHistory(originalValue, finalValue);
            if(historyValue !== NO_HISTORIC_CHANGES)
            {
                compressedObjectHistory.changes.push({key: key, history: historyValue})
            }
        }
    });

    if(compressedObjectHistory.changes.length !== 0 || compressedObjectHistory.newKeys.length !== 0)
    {
        result = compressedObjectHistory;
    }

    return result;
}
//------ GetHistory ------//