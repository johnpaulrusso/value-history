import * as valuehistory from '../ValueHistory'

describe('Restore History (w/ Primitives)', () => {
    it('should return undefined if NO_HISTORIC_CHANGES is applied to undefined.', () => {
        expect(valuehistory.RestoreHistory(undefined, valuehistory.NO_HISTORIC_CHANGES)).toBe(undefined)
    });
    it('should return the history value if final value is undefined.', () => {
        expect(valuehistory.RestoreHistory(undefined, 1)).toBe(1)
    });
    it('should return the history value if final value is null.', () => {
        expect(valuehistory.RestoreHistory(null, 1)).toBe(1)
    });
    it('should return the history value if final value is the same as history.', () => {
        expect(valuehistory.RestoreHistory(1, 1)).toBe(1)
    });
    it('should return the final value if history is NO_HISTORIC_CHANGES', () => {
        expect(valuehistory.RestoreHistory(1, valuehistory.NO_HISTORIC_CHANGES)).toBe(1)
    });
    it('should return the history value if final value is not the same as history.', () => {
        expect(valuehistory.RestoreHistory(1, 2)).toBe(2)
    });
    it('should throw an error if final value is a primitive and history value is for an array.', () => {
        expect(() => {valuehistory.RestoreHistory(1, {length: 3, changes: [{index: 1, history: 1}]})}).toThrow("Final value is a primitive and history is not.");
    });
    it('should throw an error if final value is a primitive and history value is for an object.', () => {
        expect(() => {valuehistory.RestoreHistory(1, {newKeys: [], changes: [{key: "1", history: 1}]})}).toThrow("Final value is a primitive and history is not.");
    });
});
