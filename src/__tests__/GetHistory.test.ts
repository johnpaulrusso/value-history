

import * as valuehistory from '../ValueHistory'

describe('Get History (w/ Primitives)', () => {
  it('should return NO_HISTORIC_CHANGES if primitive values are the same type and value', () => {
    expect(valuehistory.GetHistory(1, 1)).toBe(valuehistory.NO_HISTORIC_CHANGES)
  });
  it('should return the original value if primitive values are NOT the same type and value', () => {
    expect(valuehistory.GetHistory(1, 2)).toBe(1)
  });
  it('should throw an error if original value is a primitive and final value is an array.', () => {
    expect(() => {valuehistory.GetHistory(1, [1,2,3])}).toThrow("Original value is a primitive and final value is: array");
  });
  it('should throw an error if original value is a primitive and final value is an object.', () => {
    expect(() => {valuehistory.GetHistory(1, {v1: 1, v2: 2, v3: 3})}).toThrow("Original value is a primitive and final value is: " + typeof({v1: 1, v2: 2, v3: 3}));
  });
});


describe('Get History (w/ Arrays of Primitives)', () => {
  it('should return NO_HISTORIC_CHANGES if arrays are the same length and contain no elements with changes.', () => {
    expect(valuehistory.GetHistory([1,2,3], [1,2,3])).toBe(valuehistory.NO_HISTORIC_CHANGES)
  });
  it('should return compressed array history if arrays are the same length and contain one or more elements with changes.', () => {
    expect(valuehistory.GetHistory([1,2,3], [1,9,3])).toStrictEqual({length: 3, changes: [{index: 1, history: 2}]})
  });
  it('should return compressed array history with no changes if the new array is longer than the old array but no existing elements changed.', () => {
    expect(valuehistory.GetHistory([1,2,3], [1,2,3,4])).toStrictEqual({length: 3, changes: []})
  });
  it('should return compressed array history with no changes if the new array is longer than the old array and one or more existing elements changed.', () => {
    expect(valuehistory.GetHistory([1,2,3], [0,2,3,4])).toStrictEqual({length: 3, changes: [{index: 0, history: 1}]})
  });
  it('should return compressed array history with one or more changes if the old array is longer than the new array but no existing elements changed.', () => {
    expect(valuehistory.GetHistory([1,2,3,4], [1,2,3])).toStrictEqual({length: 4, changes: [{index: 3, history: 4}]})
  });
  it('should throw an error if original value is an array and final value is a primitive.', () => {
    expect(() => {valuehistory.GetHistory([1,2,3], 1)}).toThrow("Original value is an array and final value is: " + typeof(1));
  });
  it('should throw an error if original value is an array and final value is an object.', () => {
    expect(() => {valuehistory.GetHistory([1,2,3], {v1: 1, v2: 2, v3: 3})}).toThrow("Original value is an array and final value is: " + typeof({v1: 1, v2: 2, v3: 3}));
  });
});


describe('Get History (w/ Objects of Primitives)', () => {
  it('should return compressed object history if objects have the same keys but one or more different values', () => {
    expect(valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, {v1: 1, v2: 9, v3: 3})).toStrictEqual({sameKeys: true, changes: [{key: "v2", history: 2}]})
  });
  it('should return compressed object history if final object has less keys than the original object', () => {
    expect(valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, {v1: 1, v3: 3})).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}, {key: "v3", history: 3}]})
  });
  it('should return compressed object history if final object has more keys than the original object', () => {
    expect(valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, {v1: 1, v2: 2, v3: 3, v4: 4})).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}, {key: "v3", history: 3}]})
  });
  it('should return compressed object history if objects have the same number of keys but the keys are not all the same', () => {
    expect(valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, {v2: 2, v3: 3, v4: 4})).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}, {key: "v3", history: 3}]})
  });
  it('should return NO_HISTORIC_CHANGES if object contents are identical', () => {
    expect(valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, {v1: 1, v2: 2, v3: 3})).toBe(valuehistory.NO_HISTORIC_CHANGES)
  });
  it('should throw an error if original value is an object and final value is a primitive.', () => {
    expect(() => {valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, 1)}).toThrow("Original value is an object and final value is: " + typeof(1));
  });
  it('should throw an error if original value is an object and final value is an array.', () => {
    expect(() => {valuehistory.GetHistory({v1: 1, v2: 2, v3: 3}, [1,2,3])}).toThrow("Original value is an object and final value is: array")
  });
});

describe('Get History (w/ Array of Arrays)', () => {
  it('should get history of objects of arrays', () => {
    let v0 = [[1], [2]];
    let v1 = [[1,2]];
    let expected = {length: 2, changes: [{index: 0, history: {length: 1, changes: []}},{index: 1, history: {length: 1, changes: [{index: 0, history: 2}]}}]}
    expect(valuehistory.GetHistory(v0, v1)).toStrictEqual(expected);
  });
});


describe('Get History (w/ Arrays of Objects)', () => {
  it('should get history of arrays of objects', () => {
    let v0 = [{v1: 1, v2: 2, v3: 3, v4: 4}, {v11: 11, v12: 12}];
    let v1 = [{v1: 1, v2: 0, v3: 3}];
    let expected = {length: 2, changes: [{index: 0, history: {sameKeys: false, changes: [{key: "v1", history: 1},{key: "v2", history: 2},{key: "v3" , history: 3}, {key: "v4" , history: 4}]}}, {index: 1, history: {sameKeys: false, changes: [{key: "v11", history: 11}, {key: "v12" , history: 12}]}}]};
    expect(valuehistory.GetHistory(v0, v1)).toStrictEqual(expected);
  });
});


describe('Get History (w/ Objects of Arrays)', () => {
  it('should get history of objects of arrays', () => {
    let v0 = {v1: [1,2,3,4], v2: [1]};
    let v1 ={v1: [1,2,3]};
    let expected = {sameKeys: false, changes: [{key: "v1", history: {length: 4, changes: [{index: 0, history: 1},{index: 1, history: 2},{index: 2, history: 3},{index: 3, history: 4}]}}, {key: "v2", history: {length: 1, changes: [{index: 0, history: 1}]}}]}
    expect(valuehistory.GetHistory(v0, v1)).toStrictEqual(expected);
  });
});

describe('Get History (w/ Objects of Arrays of Arrays)', () => {
  it('should get history of objects of arrays', () => {
    let v0 = {v1: [[1]], v2: [1]};
    let v1 ={v1: [1,2,3]};
    let expected = {sameKeys: false, changes: [{key: "v1", history: {length: 1, changes: [{index: 0, history: {length: 1, changes: [{index: 0, history: 1}]}}]}}, {key: "v2", history: {length: 1, changes: [{index: 0, history: 1}]}}]}
    expect(valuehistory.GetHistory(v0, v1)).toStrictEqual(expected);
  });
});