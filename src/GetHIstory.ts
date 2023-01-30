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
                historyArray.push(convertValueToHistoryRecord(originalValue)); //Need to convert this to a "history" record.
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

/**
 * If two objects have a different set of keys, treat them as completely different objects.
 * This removes the need for the "newKeys" property.
 * @param originalObject 
 * @param finalObject 
 * @returns 
 */
function getHistoryObject(originalObject: Object, finalObject: Object) : ICompressedObjectHistory | undefined
{
    let result: ICompressedObjectHistory | undefined = NO_HISTORIC_CHANGES;
    let compressedObjectHistory: ICompressedObjectHistory = {
        changes: [],
        sameKeys: false
    }

    let originalKeys = Object.entries(originalObject).map(([key, _]) => key);
    let finalKeys = Object.entries(finalObject).map(([key, _]) => key);

    let valuesHaveSameLength: boolean = originalKeys.length === finalKeys.length;
    let valuesHaveSameKeys: boolean = false;
    if(valuesHaveSameLength)
    {
        valuesHaveSameKeys = originalKeys.findIndex(oKey => !finalKeys.includes(oKey)) === -1;
    }

    if(valuesHaveSameLength && valuesHaveSameKeys)
    {
        originalKeys.forEach((key) => {
            //Both objects have the key, so get the history!
            let originalValue = originalObject[key as keyof typeof originalObject];
            let finalValue = finalObject[key as keyof typeof finalObject];
            let historyValue = GetHistory(originalValue, finalValue);
            if(historyValue !== NO_HISTORIC_CHANGES)
            {
                compressedObjectHistory.changes.push({key: key, history: historyValue})
            }
        });
        compressedObjectHistory.sameKeys = true;
    }
    else
    {
        compressedObjectHistory = convertValueToHistoryRecord(originalObject);
    }

    if(compressedObjectHistory.changes.length !== 0)
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
                length: value.length, 
                changes: value.map((arrVal, index) => {
                    if(arrVal === Object(arrVal))
                    {
                        return {index: index, history: convertValueToHistoryRecord(arrVal)};
                    }
                    else
                    {
                        return {index: index, history: arrVal};
                    }
                })
            }
        }
        else
        {
            result = {
                sameKeys: false,
                changes: Object.entries(value).map(entry => {
                    let objKey = entry[0];
                    let objVal = entry[1];
                    if( objVal === Object(objVal))
                    {
                        return {key: objKey, history: convertValueToHistoryRecord(objVal)};
                    }
                    else
                    {
                        return {key: objKey, history: objVal};
                    }
                    
                })
            }
        }
    }
    return result;
}