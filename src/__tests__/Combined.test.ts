import * as valuehistory from '../ValueHistory'

describe('Get, Accumulate, and Restore History', () => {
    it('should get, accumulate, and restore a primitive', () => {
        let v0 = 0;
        let v1 = 1
        let vf = 2;
        let h01 = valuehistory.GetHistory(v0, v1);
        let h1f = valuehistory.GetHistory(v1, vf);
        let h0f = valuehistory.GetHistory(v0, vf);
        let h0f_acc = valuehistory.AccumulateHistory(h01, h1f);

        let v0_restored = valuehistory.RestoreHistory(vf, h0f);
        let v0_restored_acc = valuehistory.RestoreHistory(vf, h0f_acc);

        expect(v0_restored).toBe(v0_restored_acc);
        expect(h0f).toBe(h0f_acc);
    });

    it('should get, accumulate, and restore arrays', () => {
        let v0 = [1,2,3,4];
        let v1 = [1,0,3];
        let vf = [1,0,3,5];
        let h01 = valuehistory.GetHistory(v0, v1);
        let h1f = valuehistory.GetHistory(v1, vf);
        let h0f = valuehistory.GetHistory(v0, vf);
        let h0f_acc = valuehistory.AccumulateHistory(h01, h1f);

        let v0_restored = valuehistory.RestoreHistory(vf, h0f);
        let v0_restored_acc = valuehistory.RestoreHistory(vf, h0f_acc);

        expect(v0_restored).toStrictEqual(v0_restored_acc);
        expect(h0f).toStrictEqual(h0f_acc);
    });

    it('should get, accumulate, and restore objects', () => {
        let v0 = {v1: 1, v2: 2, v3: 3, v4: 4};
        let v1 = {v1: 1, v2: 0, v3: 3};
        let vf = {v1: 1, v2: 0, v3: 3, v5: 5};
        let h01 = valuehistory.GetHistory(v0, v1);
        let h1f = valuehistory.GetHistory(v1, vf);
        let h0f = valuehistory.GetHistory(v0, vf);
        let h0f_acc = valuehistory.AccumulateHistory(h01, h1f);

        let v0_restored = valuehistory.RestoreHistory(vf, h0f);
        let v0_restored_acc = valuehistory.RestoreHistory(vf, h0f_acc);

        expect(v0_restored).toStrictEqual(v0_restored_acc);
        expect(h0f).toStrictEqual(h0f_acc);
    });

    it('should get, accumulate, and restore arrays or arrays', () => {
        let v0 = [[1],[2],[3],[4]];
        let v1 = [[1],[0,2],[3]];
        let vf = [[1,2], [1], [0], [3,5]];
        let h01 = valuehistory.GetHistory(v0, v1);
        let h1f = valuehistory.GetHistory(v1, vf);
        let h0f = valuehistory.GetHistory(v0, vf);
        let h0f_acc = valuehistory.AccumulateHistory(h01, h1f);

        let v0_restored = valuehistory.RestoreHistory(vf, h0f);
        let v0_restored_acc = valuehistory.RestoreHistory(vf, h0f_acc);

        expect(h0f).toStrictEqual(h0f_acc);
        expect(v0_restored).toStrictEqual(v0_restored_acc);
    });



    it('should get, accumulate, and restore arrays of objects', () => {
        let v0 = [{v1: 1, v2: 2, v3: 3, v4: 4}, {v11: 11, v12: 12}];
        let v1 = [{v1: 1, v2: 0, v3: 3}];
        let vf = [{v1: 1, v2: 0, v3: 3, v5: 5}, {v11: 11, v13: 13}];
        let h01 = valuehistory.GetHistory(v0, v1);
        let h1f = valuehistory.GetHistory(v1, vf); 
        let h0f = valuehistory.GetHistory(v0, vf);
        let h0f_acc = valuehistory.AccumulateHistory(h01, h1f);
        expect(h0f).toStrictEqual(h0f_acc);

        let v0_restored = valuehistory.RestoreHistory(vf, h0f);
        let v0_restored_acc = valuehistory.RestoreHistory(vf, h0f_acc);
        expect(v0_restored).toStrictEqual(v0_restored_acc); 
    });
  });
  