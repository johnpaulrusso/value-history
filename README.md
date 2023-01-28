# Value History
A simple module to calculate the difference between two values.
## Usage
Values passed to GetHistory must be of the same type. This works for primitives, arrays, and objects. (Arrays are treated differently than objects even though they are also objects.) Calling this method on two different types will result in an error. (See below.)
### Primitives
```javascript
let v0 = 1;
let vf = 2;
let history = GetHistory(v0, vf); // history = 1;
```

### Arrays
```javascript
let v0 = [1,2,3];
let vf = [1,0,3];
let history = GetHistory(v0, vf); // history = {length: 2, changes: [{index: 1, history: 2}]};
```

### Objects
```javascript
let v0 = {v1: 1, v2: 2, v3: 3};
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let history = GetHistory(v0, vf); // history = {changes: [{key: 'v2', history: 2}], newKeys: ['v4']};
```

### Type Mismatch
```javascript
let v0 = [1,2,3];
let vf = {v1: 1, v2: 0, v3: 3, v4: 4};
let history = GetHistory(v0, vf); // throws ValueHistoryTypeMismatchError
```

### No History
```javascript
let v0 = [1,2,3];
let vf = [1,2,3];
let history = GetHistory(v0, vf); // returns NO_HISTORIC_CHANGES (undefined)
```