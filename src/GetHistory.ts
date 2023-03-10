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
        else if(Object.prototype.toString.call(originalValue) === '[object Date]')
        {
            if(Object.prototype.toString.call(finalValue) === '[object Date]')
            {
                result = getHistoryPrimitive(originalValue, finalValue);
            }
            else
            {
                throw new ValueHistoryTypeMismatchError("Original value is a Date and final value is not.");
            }
        }
        else // originalValue is an Object
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
        // PRIMITIVE
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

function getHistoryArray(originalArray: any[], finalArray: any[]) : ICompressedArrayHistory | undefined
{
    let result: any = NO_HISTORIC_CHANGES;
    const OL = originalArray.length;
    const FL = finalArray.length;

    const historyArray: any[] = []
    const compressedArrayHistory: ICompressedArrayHistory = {
        l: OL,
        c: []
    }

    if(OL < FL) // Gained one or more values
    {
        finalArray.forEach((finalValue, index) => {
            if(index < OL)
            {
                const history = GetHistory(originalArray[index], finalValue);
                historyArray.push(history);
            }
        })
    }
    else if(OL > FL) // Lost one or more values
    {
        originalArray.forEach((originalValue, index) => {
            if(index < FL)
            {
                const history = GetHistory(originalValue, finalArray[index]);
                historyArray.push(history);
            }
            else
            {
                historyArray.push(convertValueToHistoryRecord(originalValue)); // Need to convert this to a "history" record.
            }
        })
    }
    else // Same length
    {
        originalArray.forEach((originalValue, index) => {
            const history = GetHistory(originalValue, finalArray[index]);
            historyArray.push(history);
        })
    }

    // Compress history array.
    historyArray.forEach((history, index) => {
        if(history !== NO_HISTORIC_CHANGES)
        {
            compressedArrayHistory.c.push({i: index, h: history})
        }
    });
    
    if(OL !== FL || compressedArrayHistory.c.length !== 0)
    {
        result = compressedArrayHistory;
    } 

    return result;
}

/**
 * If two objects have a different set of keys, treat them as completely different objects.
 * This removes the need for the "newKeys" property.
 * @param originalObject 
 * @param finalObject 
 * @returns 
 */
function getHistoryObject(originalObject: object, finalObject: object) : ICompressedObjectHistory | undefined
{
    let result: ICompressedObjectHistory | undefined = NO_HISTORIC_CHANGES;
    const compressedObjectHistory: ICompressedObjectHistory = {
        c: []
    }

    const originalKeys = Object.entries(originalObject).map(([key, _]) => key);
    const finalKeys = Object.entries(finalObject).map(([key, _]) => key);

    const valuesHaveSameLength: boolean = originalKeys.length === finalKeys.length;
    let valuesHaveSameKeys: boolean = false;
    if(valuesHaveSameLength)
    {
        valuesHaveSameKeys = originalKeys.findIndex(oKey => !finalKeys.includes(oKey)) === -1;
    }

    if(valuesHaveSameLength && valuesHaveSameKeys)
    {
        originalKeys.forEach((key) => {
            // Both objects have the key, so get the history!
            const originalValue = originalObject[key as keyof typeof originalObject];
            const finalValue = finalObject[key as keyof typeof finalObject];
            const historyValue = GetHistory(originalValue, finalValue);
            if(historyValue !== NO_HISTORIC_CHANGES)
            {
                compressedObjectHistory.c!.push({k: key, h: historyValue})
            }
        });
    }
    else
    {
        compressedObjectHistory.o = originalObject; // And everything in it.
    }

    if(compressedObjectHistory.c.length !== 0 || compressedObjectHistory.o)
    {
        result = compressedObjectHistory;
    }

    return result;
}


function convertValueToHistoryRecord(value: any) : any
{
    let result: any = value;
    if(value === Object(value))
    {
        if(Array.isArray(value))
        {
            result = {
                l: value.length, 
                c: value.map((arrVal, index) => {
                    if(arrVal === Object(arrVal))
                    {
                        return {i: index, h: convertValueToHistoryRecord(arrVal)};
                    }
                    else
                    {
                        return {i: index, h: arrVal};
                    }
                }) 
            } as ICompressedArrayHistory;
        }
        else
        {
            result = {
                c: [],
                o: value
            } as ICompressedObjectHistory;
        }
    }
    return result;
}