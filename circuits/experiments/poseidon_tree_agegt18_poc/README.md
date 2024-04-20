# zkdb-api-alpha

### How to run
First compile
```
zokrates compile -i main.zok
```

Perform the Setup Phase: This is necessary for each unique circuit (code that you compile)
```
zokrates setup
```

Compute witness
```
zokrates compute-witness -a 19 20 21
```

Generate Proof
```
zokrates generate-proof
```

Verify
```
zokrates verify
```

Problem statement for the PoC
- Given a set of plaintext data rows consisting of fields (name, age, city)
- Return results of fixed queries
- Every data row is identified by a hash that has been pre-committed into a Merkle tree
- Result of a query resolves into the following data structure
  ```
  result
  proof
  merkle_proof
  ```
- The approach is to get the results in plaintext db, then to iteratively generate proof of the results, then return

### Age > 18
- Count the number of rows where the above ``conditional`` is true
