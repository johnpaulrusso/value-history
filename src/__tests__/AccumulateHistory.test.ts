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