import * as valuehistory from '../ValueHistory'

describe('Restore History (w/ Primitives)', () => {
    it('should return undefined if NO_HISTORIC_CHANGES is applied to undefined.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(undefined);
        valuehistory.RestoreHistory(wrapper, valuehistory.NO_HISTORIC_CHANGES)
        expect(wrapper.valueToRestore).toBe(undefined)
    });
    it('should return the history value if final value is undefined.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(undefined);
        valuehistory.RestoreHistory(wrapper, 1)
        expect(wrapper.valueToRestore).toBe(1)
    });
    it('should return the history value if final value is null.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(null);
        valuehistory.RestoreHistory(wrapper, 1)
        expect(wrapper.valueToRestore).toBe(1)
    });
    it('should return the history value if final value is the same as history.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(1);
        valuehistory.RestoreHistory(wrapper, 1)
        expect(wrapper.valueToRestore).toBe(1)
    });
    it('should return the final value if history is NO_HISTORIC_CHANGES', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(1);
        valuehistory.RestoreHistory(wrapper, valuehistory.NO_HISTORIC_CHANGES)
        expect(wrapper.valueToRestore).toBe(1)
    });
    it('should return the history value if final value is not the same as history.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper(1);
        valuehistory.RestoreHistory(wrapper, 2)
        expect(wrapper.valueToRestore).toBe(2)
    });
    it('should throw an error if final value is a primitive and history value is for an array.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper(1);
            valuehistory.RestoreHistory(wrapper,  {length: 3, changes: [{index: 1, history: 1}]})
        }).toThrow("Final value is a primitive and history is not.");
    });
    it('should throw an error if final value is a primitive and history value is for an object.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper(1);
            valuehistory.RestoreHistory(wrapper,  {newKeys: [], changes: [{key: "v1", history: 1}]})
        }).toThrow("Final value is a primitive and history is not.");
    });
});

describe('Restore History (w/ Arrays)', () => {

    it('should return an array if NO_HISTORIC_CHANGES is applied to the array.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([1,2,3]);
        valuehistory.RestoreHistory(wrapper, valuehistory.NO_HISTORIC_CHANGES)
        expect(wrapper.valueToRestore).toStrictEqual([1,2,3]);
    });
    it('should return the history value if final value is the same as history.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([1]);
        valuehistory.RestoreHistory(wrapper,  {length: 1, changes: [{index: 0, history: 1}]})
        expect(wrapper.valueToRestore).toStrictEqual([1]);
    });
    it('should return the history value if final value is not the same as history.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([2]);
        valuehistory.RestoreHistory(wrapper,  {length: 1, changes: [{index: 0, history: 1}]})
        expect(wrapper.valueToRestore).toStrictEqual([1]);
    });
    it('should return the history to empty array if history length is zero.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([1]);
        valuehistory.RestoreHistory(wrapper,  {length: 0, changes: []})
        expect(wrapper.valueToRestore).toStrictEqual([]);
    });
    it('should return the history to an array that is shorter than the original.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([1,2]);
        valuehistory.RestoreHistory(wrapper,  {length: 1, changes: []})
        expect(wrapper.valueToRestore).toStrictEqual([1]);
    });
    it('should return the history to an array that is longer than the original.', () => {
        let wrapper = new valuehistory.ValueRestorationWrapper([1]);
        valuehistory.RestoreHistory(wrapper,  {length: 2, changes: [{index: 1, history: 2}]})
        expect(wrapper.valueToRestore).toStrictEqual([1,2]);
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper([1]);
            valuehistory.RestoreHistory(wrapper, {length: 3, changes: [{index: 1, history: 1}]})
        }).toThrow("Insufficient History.");
    });
    it('should throw an error if insufficient history is provided to construct the original array.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper([1]);
            valuehistory.RestoreHistory(wrapper, {length: 3, changes: [{index: 4, history: 1}]})
        }).toThrow("Invalid History.");
    });
    it('should throw an error if final value is an array and history value is for a primitive.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper([1,2,3]);
            valuehistory.RestoreHistory(wrapper, 1)
        }).toThrow("Final value is an array and history is not.");
    });
    it('should throw an error if final value is an array and history value is for an object.', () => {
        expect(() => {
            let wrapper = new valuehistory.ValueRestorationWrapper([1,2,3]);
            valuehistory.RestoreHistory(wrapper, {newKeys: [], changes: [{key: "v1", history: 1}]})
        }).toThrow("Final value is an array and history is not.");
    });
});