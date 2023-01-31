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
            valuehistory.RestoreHistory(1,  {i:3, c: [{i: 1, h: 1}]})
        }).toThrow("Value is a primitive and history is not.");
    });
    it('should throw an error if final value is a primitive and history value is for an object.', () => {
        expect(() => {
            valuehistory.RestoreHistory(1,  {newKeys: [], c: [{k: "v1", h: 1}]})
        }).toThrow("Value is a primitive and history is not.");
    });
});

describe('Restore History (w/ Arrays)', () => {

    it('should restore an array if NO_HISTORIC_CHANGES is applied to the array.', () => {
        expect(valuehistory.RestoreHistory([1,2,3], valuehistory.NO_HISTORIC_CHANGES)).toEqual([1,2,3])
    });
    it('should restore the history value if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory([1], {l:1, c: [{i: 0, h: 1}]})).toEqual([1]);
    });
    it('should restore the history value if final value is not the same as history.', () => {
        expect(valuehistory.RestoreHistory([2], {l:1, c: [{i: 0, h: 1}]})).toEqual([1]);
    });
    it('should restore the history to empty array if history length is zero.', () => {
        expect(valuehistory.RestoreHistory([1], {l:0, c: []})).toEqual([]);
    });
    it('should restore the history to an array that is shorter than the original.', () => {
        expect(valuehistory.RestoreHistory([1,2], {l:1, c: []})).toEqual([1]);
    });
    it('should restore the history to an array that is longer than the original.', () => {
        expect(valuehistory.RestoreHistory([1], {l:2, c: [{i: 1, h: 2}]})).toEqual([1,2]);
    });
    it('should restore the history from an empty array.', () => {
        expect(valuehistory.RestoreHistory([], {l:1, c: [{i: 0, h: 2}]})).toEqual([2]);
    });
    it('should restore the history to an empty array.', () => {
        expect(valuehistory.RestoreHistory([2], {l:0, c: []})).toEqual([]);
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1], {l:3, c: [{i: 1, h: 1}]})
        }).toThrow("Insufficient History.");
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1], {l:3, c: [{i: 4, h: 1}]})
        }).toThrow("Invalid History.");
    });
    it('should throw an error if final value is an array and history value is for a primitive.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1,2,3], 1)
        }).toThrow("Value is an array and history is not.");
    });
    it('should throw an error if final value is an array and history value is for an object.', () => {
        expect(() => {
            valuehistory.RestoreHistory([1,2,3], {c: [{k: "v1", h: 1}]})
        }).toThrow("Value is an array and history is not.");
    });
});

describe('Restore History (w/ Objects)', () => {

    it('should restore an object if NO_HISTORIC_CHANGES is applied to the object.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, valuehistory.NO_HISTORIC_CHANGES)).toEqual({v1: 1, v2: 2, v3: 3});
    });
    it('should restore the history if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {c: []})).toEqual({v1: 1, v2: 2, v3: 3});
    });
    it('should restore the history if final value is NOT the same as history and history has no new keys.', () => {   
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {c: [{k: "v1", h: 0}]})).toEqual({v1: 0, v2: 2, v3: 3});
    });
    it('should restore the history if there are no new keys and the history contains a key that the value does not have.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2},  {c: [], o: {v3: 3}})).toEqual({v3: 3});
    });
    it('should restore the history if there are one or more new keys and the history contains no changes.', () => {
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {c: [], o: {v1: 1, v2: 2}})).toEqual({v1: 1, v2: 2});
    });
    it('should restore the history if there are one or more new keys and the history contains one ore more changes.', () => {        
        expect(valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3},  {c: [{k: "v2", h: 0}]})).toEqual({v1: 1, v2: 0, v3: 3});
    });
    it('should throw an error if final value is an object and history value is for a primitive.', () => {
        expect(() => {
            valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, 1)
        }).toThrow("Value is an object and history is not.");
    });
    it('should throw an error if final value is an object and history value is for an array.', () => {
        expect(() => {
            valuehistory.RestoreHistory({v1: 1, v2: 2, v3: 3}, {l:3, c: [{i: 4, h: 1}]})
        }).toThrow("Value is an object and history is not.");
    });
});

describe('Restore History (w/ Arrays of Objects)', () => {
    it('should restore an array of objects', () => {
        expect(valuehistory.RestoreHistory([{v1: 1}], {l:1, c: [{i: 0, h: {sameKeys: true, c: [{k: "v1", h: 2}]}}]})).toEqual([{v1: 2}]);
    });
    it('should restore an array of objects from an empty array', () => {
        expect(valuehistory.RestoreHistory([], {l:1, c: [{i: 0, h: {c: [], o: {v1: 2}}}]})).toEqual([{v1: 2}]);
    });
    it('should restore an array of objects to an empty array', () => {
        expect(valuehistory.RestoreHistory([{v1: 2}], {l:0, c: []})).toEqual([]);
    });
});

describe('Restore History (w/ Arrays of Objects)', () => {
    it('should restore an array of objects with different keys', () => {
        expect(valuehistory.RestoreHistory([{v1: 1}], {l:1, c: [{i: 0, h: {c: [], o: {v2: 2}}}]})).toEqual([{v2: 2}]);
    });
});

describe('Restore History (w/ Arrays of Arrays)', () => {
    it('should restore deeply nested arrays', () => {
        let v0 = [[[1]],[[2]]];
        let v1 = [[[1]],[[3]]];
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
    it('should restore an array of arrays from an empty array', () => {
        let v0: any[] = [];
        let v1: any[] = [[1]];
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
    it('should restore an array of arrays to an empty array', () => {
        let v0 = [[1]];
        let v1 = [[0]];
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
});

describe('Restore History (w/ Arrays of Objects)', () => {
    it('should restore deeply nested arrays of objects.', () => {
        let v0 = [[[{v1: 1}]],[[{v2: 2}]]];
        let v1 = [[[{v1: 1}]],[[{v2: 3}]]];
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
});

describe('Restore History (w/ Arrays of Objects)', () => {
    it('should restore an array of objects with different keys', () => {
        let v0 = {v3: {v4: 2}}
        let v1 = {v2: {v1: 2}}
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
});

describe('Restore History (w/ Arrays of Objects)', () => {
    it('should restore an array of objects with different keys', () => {
        let v0 = {v3: {v4: [1,2]}}
        let v1 = {v2: {v1: [1]}}
        let h = valuehistory.GetHistory(v0, v1);
        expect(valuehistory.RestoreHistory(v1, h)).toEqual(v0);
    });
});

describe('Restore History (w/ Dates)', () => {
    
    it('should restore history to a Date.', () => {
        let vf = new Date(2022, 2);
        let h = new Date(2021, 5);
        expect(valuehistory.RestoreHistory(vf, h)).toBe(h)
    });
    it('should throw an error if final value is a Date and history is not.', () => {
        let vf = new Date(2022, 2);
        let h = {v1: 1};
        expect(() => {
            valuehistory.RestoreHistory(vf,  h)
        }).toThrow("Value is a Date and history is not.");
    });
});