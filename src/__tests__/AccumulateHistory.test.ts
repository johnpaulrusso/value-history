import * as valuehistory from '../ValueHistory'

describe('Accumulate History (w/ Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES both history items are NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, valuehistory.NO_HISTORIC_CHANGES)).toBe(valuehistory.NO_HISTORIC_CHANGES)
    });
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, 2)).toBe(valuehistory.NO_HISTORIC_CHANGES)
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(1, valuehistory.NO_HISTORIC_CHANGES)).toBe(1)
    });
    it('should return the older history item even if the newer history item is not NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory(1, 2)).toBe(1)
    });
    it('should throw an error if older history is a primitive and newer history is an array history.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, {length: 3, changes: [{index: 1, history: 1}]})}).toThrow("Incompatible Histories - older is a primitive history and newer is an array or object history.");
    });
    it('should throw an error if older history is a primitive and newer history is an object.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, {newKeys: [], changes: [{key: "1", history: 1}]})}).toThrow("Incompatible Histories - older is a primitive history and newer is an array or object history.");
    });
  });
     
  describe('Accumulate History (w/ Arrays of Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, {length: 3, changes: [{index: 1, history: 2}]})).toBe(valuehistory.NO_HISTORIC_CHANGES)
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, valuehistory.NO_HISTORIC_CHANGES)).toStrictEqual({length: 3, changes: [{index: 1, history: 1}]})
      });
    it('should return compressed array history if arrays are the same length and the same index changed in both histories.', () => {
      expect(valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, 
                                            {length: 3, changes: [{index: 1, history: 2}]})
                                    ).toStrictEqual({length: 3, changes: [{index: 1, history: 1}]})
    });
    it('should return compressed array history if arrays are the same length and a different index changed in both histories.', () => {
        expect(valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, 
                                              {length: 3, changes: [{index: 2, history: 2}]})
                                      ).toStrictEqual({length: 3, changes: [{index: 1, history: 1}, {index: 2, history: 2}]})
    });
    
    it('should return compressed array history if arrays are different lengths and have no changes.', () => {
        expect(valuehistory.AccumulateHistory({length: 4, changes: []}, 
                                              {length: 3, changes: []})
                                      ).toStrictEqual({length: 4, changes: []})
    });
    it('should return compressed array history if older array history has a longer length.', () => {
        expect(valuehistory.AccumulateHistory({length: 4, changes: [{index: 1, history: 1}]}, 
                                              {length: 3, changes: [{index: 5, history: 2}]})
                                      ).toStrictEqual({length: 4, changes: [{index: 1, history: 1}]})
    });
    it('should return compressed array history if older array history has a shorter length.', () => {
        expect(valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, 
                                              {length: 4, changes: [{index: 3, history: 2}]})
                                      ).toStrictEqual({length: 3, changes: [{index: 1, history: 1}]})
    });
    it('should throw an error if original value is an array history and final value is an object history.', () => {
        expect(() => {valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, 1)})
          .toThrow("Incompatible Histories - older is an array history and newer is not.");
      });
    it('should throw an error if original value is an array history and final value is an object history.', () => {
      expect(() => {valuehistory.AccumulateHistory({length: 3, changes: [{index: 1, history: 1}]}, {newKeys: [], changes: [{key: "1", history: 1}]})})
        .toThrow("Incompatible Histories - older is an array history and newer is not.");
    });
  });

  describe('Accumulate History (w/ Objects of Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, {sameKeys: true, changes: [{key: "1", history: 1}]})).toBe(valuehistory.NO_HISTORIC_CHANGES)
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "1", history: 1}]}, valuehistory.NO_HISTORIC_CHANGES)).toStrictEqual({sameKeys: true, changes: [{key: "1", history: 1}]})
      });
    it('should return compressed object history if new keys are both empty and the same key changed in both histories.', () => {
      expect(valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v1", history: 1}]}, 
                                            {sameKeys: true, changes: [{key: "v1", history: 2}]})
                                    ).toStrictEqual({sameKeys: true, changes: [{key: "v1", history: 1}]})
    });
    it('should return compressed object history if new keys are both empty and a different keys changed in both histories.', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v1", history: 1}]}, 
                                              {sameKeys: true, changes: [{key: "v2", history: 2}]})
                                      ).toStrictEqual({sameKeys: true, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}]})
    });
    
    it('should remove newKeys that are present in the older history item', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: false, changes: [{key: "v1", history: 1}]}, 
                                              {sameKeys: true, changes: [{key: "v2", history: 2}]})
                                      ).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}]})
    });
    it('should carry over keys that are present in the newer history but not the older history item (part 1)', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v1", history: 1}]}, 
                                              {sameKeys: false, changes: [{key: "v2", history: 2}]})
                                      ).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}]})
    });
    it('should carry over keys that are present in the newer history and the older history item', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}]}, 
                                              {sameKeys: false, changes: [{key: "v2", history: 2}]})
                                      ).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}, {key: "v2", history: 2}]})
    });
    it('should carry over keys that are present in the older history and NOT the newer history item', () => {
        expect(valuehistory.AccumulateHistory({sameKeys: false, changes: [{key: "v1", history: 1}]}, 
                                              {sameKeys: false, changes: [{key: "v2", history: 2}]})
                                      ).toStrictEqual({sameKeys: false, changes: [{key: "v1", history: 1}]})
    });
    it('should carry over keys that are present in the newer history but not the older history item (part 2)', () => {
      expect(valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v2", history: 2}, {key: "v4", history: 4}]}, 
                                            {sameKeys: false, changes: []})
                                    ).toStrictEqual({sameKeys: false, changes: [{key: "v2", history: 2}, {key: "v4", history: 4}]})
  });
    it('should throw an error if original value is an object history and final value is a primitive history.', () => {
        expect(() => {valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v1", history: 1}]}, 1)})
          .toThrow("Incompatible Histories - older is an object history and newer is not.");
    });
    it('should throw an error if original value is an object history and final value is an array history.', () => {
      expect(() => {valuehistory.AccumulateHistory({sameKeys: true, changes: [{key: "v1", history: 1}]}, {length: 4, changes: [{index: 3, history: 2}]})})
        .toThrow("Incompatible Histories - older is an object history and newer is not.");
    });
    it('should throw an error if original value is an unrecognized history type.', () => {
        expect(() => {valuehistory.AccumulateHistory({v1: 1, v2: 2}, {v1: 1, v2: 2})})
          .toThrow("Incompatible Histories - Unrecognized history types.");
      });
  });
  
describe('Accumulate History (w/ Array of Arrays)', () => {
  it('should accumulate history of arrays of arrays', () => {
    let v0 = [[1], [2]];
    let v1 = [[1]];
    let v2 = [[2]];
    let h01 = valuehistory.GetHistory(v0,v1);
    let h12 = valuehistory.GetHistory(v1,v2);
    let h02 = valuehistory.GetHistory(v0,v2);
    let h02_acc = valuehistory.AccumulateHistory(h01, h12);
    expect(h02).toStrictEqual(h02_acc);
  });
});

describe('Accumulate History (w/ Array of Objects)', () => {
  it('should accumulate history of arrays of objects', () => {
    let v0 = [{v1: 1}, {v2: 2}];
    let v1 = [{v1: 2}];
    let v2 = [{v1: 2}, {v3: 3}];
    let h01 = valuehistory.GetHistory(v0,v1);
    let h12 = valuehistory.GetHistory(v1,v2);
    let h02 = valuehistory.GetHistory(v0,v2);
    let h02_acc = valuehistory.AccumulateHistory(h01, h12);
    expect(h02).toStrictEqual(h02_acc);
  });
});

describe('Accumulate History (w/ Objects of Objects)', () => {
  it('should accumulate history of objects of objects', () => {
    let v0 = {v1: {v1: 1}, v2: {v2: 2}};
    let v1 = {v1: {v1: 2}};
    let v2 = {v1: {v1: 1}, v3: {v3: 2}};
    let h01 = valuehistory.GetHistory(v0,v1);
    let h12 = valuehistory.GetHistory(v1,v2);
    let h02 = valuehistory.GetHistory(v0,v2);
    let h02_acc = valuehistory.AccumulateHistory(h01, h12);
    expect(h02).toStrictEqual(h02_acc);
  });
});

describe('Accumulate History (w/ Dates)', () => {
  it('should return the historic Date if both value and history are Dates.', () => {
    let h0 = new Date(2022, 2);
    let h1 = new Date(2021, 1);
    expect(valuehistory.AccumulateHistory(h0, h1)).toBe(h0);
  });
  it('should throw an error if the older history is a Date and history is not.', () => {
    let v = new Date(2022, 2);
    let h = [2,3];
    expect(() => {valuehistory.AccumulateHistory(v, h)})
      .toThrow("Incompatible Histories - older history is a Date and newer is not.");
  });
});
   