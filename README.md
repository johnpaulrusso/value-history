# Value History
A simple module to calculate, accumulate, and restore the differences between two values. Supported values include primitives, dates, arrays, and JSON.
## Usage

### GetHistory
Values passed to GetHistory must be of the same type. This works for primitives, arrays, and objects. (Arrays are treated differently than objects even though they are also objects.) Calling this method on two different types will result in an error. (See below.)
#### Primitives
For primitives (and Dates) the history is simple the original value.
```javascript
let v0 = 1;
let vf = 2;
let history = GetHistory(v0, vf); // history = 1;
```

#### Arrays
The resulting history specifies that the array length used to be 3 and the value at index 1 used to be 2.
```javascript
let v0 = [1,2,3];
let vf = [1,0,3];
let history = GetHistory(v0, vf); // history = {l:3, c: [{i: 1, h: 2}]};
```

#### Objects
The resulting history specifies that the value at key 'v2' used to be 2.
```javascript
let v0 = {v1: 1, v2: 2, v3: 3};
let vf = {v1: 1, v2: 0, v3: 3};
let history = GetHistory(v0, vf); // history = {c: [{k: 'v2', h: 2}]};
```

#### Type Mismatch
```javascript
let v0 = [1,2,3];
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let history = GetHistory(v0, vf); // throws ValueHistoryTypeMismatchError
```

#### No History
```javascript
let v0 = [1,2,3];
let vf = [1,2,3];
let history = GetHistory(v0, vf); // returns NO_HISTORIC_CHANGES (undefined)
```
### AccumulateHistory
History records can be accumulated as follows:
#### Primitives
```javascript
let h0 = 1;
let hf = 2;
let history = AccumulateHistory(h0, hf); // history = 1;
```
#### Arrays
```javascript
let v0 = [1,2,3,4];
let v1 = [1,0,3];
let vf = [1,4,3];
let h0 = GetHistory(v0, v1); // h0 = {l:4, c: [{i: 1, h: 2}]};
let h1 = GetHistory(v1, vf); // h1 = {l:3, c: [{i: 1, h: 0}]};
let hf = AccumulateHistory(h0, hf); // hf = {l:4, c: [{i: 1, h: 2}]};
let hf2 = GetHistory(v0, vf); // hf2 === hf
```
#### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 4}
let v1 = {v1: 1, v2: 2, v3: 3}
let vf = {v1: 1, v2: 0, v3: 3};
let h0 = GetHistory(v0, v1); // h0 = {c: [{k: 'v3', h: 4}]};
let h1 = GetHistory(v1, vf); // h1 = {c: [{k: 'v2', h: 2}]};
let hf = AccumulateHistory(h0, hf); // hf = {c: [{k: 'v2', h: 2}, {k: 'v3', h: 4}]};
let hf2 = GetHistory(v0, vf); // hf2 === hf
```

### RestoreHistory
#### Primitives
```javascript
let vf = 1;
let h = 2;
let v0 = RestoreHistory(vf, h); // v0 = 2;
```
#### Arrays
```javascript
let v0 = [1,2,3,4];
let vf = [1,4,3];
let h = GetHistory(v0, vf); // h = {l:4, c: [{i: 1, h: 2}]};
let v0_restored = RestoreHistory(vf, h); // v0_restored === v0
```
#### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 3, v4: 5}
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let h = GetHistory(v0, vf); // h = {c: [{k: 'v2', h: 2}]};
let v0_restored = RestoreHistory(vf, h); // v0_restored === v0
```

