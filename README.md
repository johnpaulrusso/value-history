# Value History
A simple module to calculate, accumulate, and restore(TBD) the differences between two values.
## Usage

### GetHistory
Values passed to GetHistory must be of the same type. This works for primitives, arrays, and objects. (Arrays are treated differently than objects even though they are also objects.) Calling this method on two different types will result in an error. (See below.)
#### Primitives
```javascript
let v0 = 1;
let vf = 2;
let history = GetHistory(v0, vf); // history = 1;
```

#### Arrays
```javascript
let v0 = [1,2,3];
let vf = [1,0,3];
let history = GetHistory(v0, vf); // history = {length: 2, changes: [{index: 1, history: 2}]};
```

#### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 3};
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let history = GetHistory(v0, vf); // history = {changes: [{key: 'v2', history: 2}], newKeys: ['v4']};
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
let h0 = GetHistory(v0, v1); // h0 = {length: 4, changes: [{index: 1, history: 2}]};
let h1 = GetHistory(v1, vf); // h1 = {length: 3, changes: [{index: 1, history: 0}]};
let hf = AccumulateHistory(h0, hf); // hf = {length: 4, changes: [{index: 1, history: 2}]};
let hf2 = GetHistory(v0, vf); // hf2 === hf
```
#### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 3, v5: 5}
let v1 = {v1: 1, v2: 2, v3: 3}
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let h0 = GetHistory(v0, v1); // h0 = {changes: [{key: 'v5', history: 5}], newKeys: []};
let h1 = GetHistory(v1, vf); // h1 = {changes: [{key: 'v2', history: 2}], newKeys: ['v4']};
let hf = AccumulateHistory(h0, hf); // hf = {changes: [{key: 'v2', history: 2}, {key: 'v5', history: 5}], newKeys: ['v4']};
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
let h = GetHistory(v0, vf); // h = {length: 4, changes: [{index: 1, history: 2}]};
let v0_restored = RestoreHistory(vf, h); // v0_restored === v0
```
#### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 3, v5: 5}
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let h = GetHistory(h0, hf); // h = {changes: [{key: 'v2', history: 2}, {key: 'v5', history: 5}], newKeys: ['v4']};
let v0_restored = RestoreHistory(vf, h); // v0_restored === v0
```

