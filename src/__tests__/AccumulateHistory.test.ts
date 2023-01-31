import * as valuehistory from '../ValueHistory'

describe('Accumulate History (w/ Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES both history items are NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, valuehistory.NO_HISTORIC_CHANGES)).toBe(valuehistory.NO_HISTORIC_CHANGES)
    });
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, 2)).toBe(2)
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(1, valuehistory.NO_HISTORIC_CHANGES)).toBe(1)
    });
    it('should return the older history item even if the newer history item is not NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory(1, 2)).toBe(1)
    });
    it('should throw an error if older history is a primitive and newer history is an array history.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, {l:3, c: [{i: 1, h: 1}]})}).toThrow("Incompatible Histories - older is a primitive history and newer is an array or object history.");
    });
    it('should throw an error if older history is a primitive and newer history is an object.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, {c: [{k: "1", h: 1}]})}).toThrow("Incompatible Histories - older is a primitive history and newer is an array or object history.");
    });
  });
     
  describe('Accumulate History (w/ Arrays of Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, {l:3, c: [{i: 1, h: 2}]})).toStrictEqual({l:3, c: [{i: 1, h: 2}]})
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, valuehistory.NO_HISTORIC_CHANGES)).toStrictEqual({l:3, c: [{i: 1, h: 1}]})
      });
    it('should return compressed array history if arrays are the same length and the same index changed in both histories.', () => {
      expect(valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, 
                                            {l:3, c: [{i: 1, h: 2}]})
                                    ).toStrictEqual({l:3, c: [{i: 1, h: 1}]})
    });
    it('should return compressed array history if arrays are the same length and a different index changed in both histories.', () => {
        expect(valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, 
                                              {l:3, c: [{i: 2, h: 2}]})
                                      ).toStrictEqual({l:3, c: [{i: 1, h: 1}, {i: 2, h: 2}]})
    });
    
    it('should return compressed array history if arrays are different lengths and have no changes.', () => {
        expect(valuehistory.AccumulateHistory({l:4, c: []}, 
                                              {l:3, c: []})
                                      ).toStrictEqual({l:4, c: []})
    });
    it('should return compressed array history if older array history has a longer length.', () => {
        expect(valuehistory.AccumulateHistory({l:4, c: [{i: 1, h: 1}]}, 
                                              {l:3, c: [{i: 5, h: 2}]})
                                      ).toStrictEqual({l:4, c: [{i: 1, h: 1}]})
    });
    it('should return compressed array history if older array history has a shorter length.', () => {
        expect(valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, 
                                              {l:4, c: [{i: 3, h: 2}]})
                                      ).toStrictEqual({l:3, c: [{i: 1, h: 1}]})
    });
    it('should throw an error if original value is an array history and final value is an object history.', () => {
        expect(() => {valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, 1)})
          .toThrow("Incompatible Histories - older is an array history and newer is not.");
      });
    it('should throw an error if original value is an array history and final value is an object history.', () => {
      expect(() => {valuehistory.AccumulateHistory({l:3, c: [{i: 1, h: 1}]}, {c: [{k: "1", h: 1}]})})
        .toThrow("Incompatible Histories - older is an array history and newer is not.");
    });
  });

  describe('Accumulate History (w/ Objects of Primitives)', () => {
    it('should return NO_HISTORIC_CHANGES if the older history item is NO_HISTORIC_CHANGES', () => {
      expect(valuehistory.AccumulateHistory(valuehistory.NO_HISTORIC_CHANGES, {c: [{k: "1", h: 1}]})).toStrictEqual({c: [{k: "1", h: 1}]})
    });
    it('should return the older history item if the newer history item is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.AccumulateHistory({c: [{k: "1", h: 1}]}, valuehistory.NO_HISTORIC_CHANGES)).toStrictEqual({c: [{k: "1", h: 1}]})
      });
    it('should return compressed object history if no rawObj is present and the same key changed in both histories.', () => {
      expect(valuehistory.AccumulateHistory({c: [{k: "v1", h: 1}]}, 
                                            {c: [{k: "v1", h: 2}]})
                                    ).toStrictEqual({c: [{k: "v1", h: 1}]})
    });
    it('should return compressed object history if no rawObj is present and a different keys changed in both histories.', () => {
        expect(valuehistory.AccumulateHistory({c: [{k: "v1", h: 1}]}, 
                                              {c: [{k: "v2", h: 2}]})
                                      ).toStrictEqual({c: [{k: "v1", h: 1}, {k: "v2", h: 2}]})
    });
    
    it('should return the older history if rawObj is present in the older history', () => {
        expect(valuehistory.AccumulateHistory({c: [], o: {v1: 1, v2: 2}}, 
                                              {c: [{k: "v2", h: 2}]})
                                      ).toStrictEqual({c: [], o: {v1: 1, v2: 2}})
    });

    it('should return ignore rawObj in newer history if rawObj is not present in the older history', () => {
        expect(valuehistory.AccumulateHistory({c: [{k: "v1", h: 2}]}, 
                                              {c: [], o: {v1: 1, v2: 2}})
                                      ).toStrictEqual({c: [{k: "v1", h: 2}]})
    });
    it('should throw an error if newer object history has both changes and a raw object.', () => {
        expect(() => {
          valuehistory.AccumulateHistory({c: [{k: "v1", h: 1}]}, 
                                         {c: [{k: "v1", h: 2}], o: {v1: 1, v2: 2}})
        }).toThrow("Incompatible Histories - object history cannot contain both changes and a raw object.");
    });
    it('should throw an error if older object history has both changes and a raw object.', () => {
      expect(() => {
        valuehistory.AccumulateHistory({c: [{k: "v1", h: 1}], o: {v1: 1, v2: 2}}, 
                                       {c: [{k: "v1", h: 2}]})
      }).toThrow("Incompatible Histories - object history cannot contain both changes and a raw object.");
  });
    it('should throw an error if original value is an object history and final value is an array history.', () => {
      expect(() => {valuehistory.AccumulateHistory({c: [{k: "v1", h: 1}]}, {l:4, c: [{i: 3, h: 2}]})})
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
   