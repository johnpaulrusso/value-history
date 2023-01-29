import * as valuehistory from '../ValueHistory'

describe('Restore History (w/ Primitives)', () => {
    
    it('should restore undefined if NO_HISTORIC_CHANGES is applied to undefined.', () => {
        expect(valuehistory.RestoreHistory(undefined, valuehistory.NO_HISTORIC_CHANGES)).toBe(undefined)
    });
    it('should restore the history value if final value is undefined.', () => {
        expect(valuehistory.RestoreHistory(undefined, 1)).toBe(1)
    });
    it('should restore the history value if final value is null.', () => {
        expect(valuehistory.RestoreHistory(null, 1)).toBe(1)
    });
    it('should restore the history value if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory(1, 1)).toBe(1)
    });
    it('should restore the final value if history is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.RestoreHistory(1, valuehistory.NO_HISTORIC_CHANGES)).toBe(1)
    });
    it('should restore the history value if final value is not the same as history.', () => {
        expect(valuehistory.RestoreHistory(1, 2)).toBe(2)
    });
    it('should throw an error if final value is a primitive and history value is for an array.', () => {
        expect(() => {
            valuehistory.RestoreHistory(1,  {length: 3, changes: [{index: 1, history: 1}]})
        }).toThrow("Value is a primitive and history is not.");
    });
    it('should throw an error if final value is a primitive and history value is for an object.', () => {
        expect(() => {
            valuehistory.RestoreHistory(1,  {newKeys: [], changes: [{key: "v1", history: 1}]})
        }).toThrow("Value is a primitive and history is not.");
    });
});

describe('Restore History (w/ Arrays)', () => {

    it('should restore an array if NO_HISTORIC_CHANGES is applied to the array.', () => {
        expect(valuehistory.RestoreHistory([1,2,3], valuehistory.NO_HISTORIC_CHANGES)).toEqual([1,2,3])
    });
    it('should restore the history value if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory([1], {length: 1, changes: [{index: 0, history: 1}]})).toEqual([1]);
    });
    it('should restore the history value if final value is not the same as history.', () => {
        expect(valuehistory.RestoreHistory([2], {length: 1, changes: [{index: 0, history: 1}]})).toEqual([1]);
    });
    it('should restore the history to empty array if history length is zero.', () => {
        expect(valuehistory.RestoreHistory([1], {length: 0, changes: []})).toEqual([]);
    });
    it('should restore the history to an array that is shorter than the original.', () => {
        expect(valuehistory.RestoreHistory([1,2], {length: 1, changes: []})).toEqual([1]);
    });
    it('should restore the history to an array that is longer than the original.', () => {
        expect(valuehistory.RestoreHistory([1], {length: 2, changes: [{index: 1, history: 2}]})).toEqual([1,2]);
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1], {length: 3, changes: [{index: 1, history: 1}]})
        }).toThrow("Insufficient History.");
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1], {length: 3, changes: [{index: 4, history: 1}]})
        }).toThrow("Invalid History.");
    });
    it('should throw an error if final value is an array and history value is for a primitive.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1,2,3], 1)
        }).toThrow("Value is an array and history is not.");
    });
    it('should throw an error if final value is an array and history value is for an object.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1,2,3], {newKeys: [], changes: [{key: "v1", history: 1}]})
        }).toThrow("Value is an array and history is not.");
    });
});

describe('Restore History (w/ Objects)', () => {

    it('should restore an object if NO_HISTORIC_CHANGES is applied to the object.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, valuehistory.NO_HISTORIC_CHANGES)).toEqual({v1: 1, v2: 2, v3: 3});
    });
    it('should restore the history if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {newKeys: [], changes: []})).toEqual({v1: 1, v2: 2, v3: 3});
    });
    it('should restore the history if final value is NOT the same as history and history has no new keys.', () => {   
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {newKeys: [], changes: [{key: "v1", history: 0}]})).toEqual({v1: 0, v2: 2, v3: 3});
    });
    it('should restore the history if there are no new keys and the history contains a key that the value does not have.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2},  {newKeys: [], changes: [{key: "v3", history: 3}]})).toEqual({v1: 1, v2: 2, v3: 3});
    });
    it('should restore the history if there are one or more new keys and the history contains no changes.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {newKeys: ["v3"], changes: []})).toEqual({v1: 1, v2: 2});
    });
    it('should restore the history if there are one or more new keys and the history contains one ore more changes.', () => {        
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {newKeys: ["v3"], changes: [{key: "v2", history: 0}]})).toEqual({v1: 1, v2: 0});
    });
    it('should throw an error if final value is an object and history value is for a primitive.', () => {
        expect(() => {
            valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, 1)
        }).toThrow("Value is an object and history is not.");
    });
    it('should throw an error if final value is an object and history value is for an array.', () => {
        expect(() => {
            valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, {length: 3, changes: [{index: 4, history: 1}]})
        }).toThrow("Value is an object and history is not.");
    });
});