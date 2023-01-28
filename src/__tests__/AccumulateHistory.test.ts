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
    it('should throw an error if older history is a primitive and newer history is an array.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, [1,2,3])}).toThrow("Incompatible Histories - older: " + 1 + " newer: " + [1,2,3].toString());
    });
    it('should throw an error if older history is a primitive and newer history is an object.', () => {
      expect(() => {valuehistory.AccumulateHistory(1, {v1: 1, v2: 2, v3: 3})}).toThrow("Incompatible Histories - older: " + 1 + " newer: " + {v1: 1, v2: 2, v3: 3}.toString());
    });
  });
  