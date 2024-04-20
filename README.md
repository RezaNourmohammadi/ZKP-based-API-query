## Summary

The objective of the POC is to successfully demonstrate how a tabular set of rows of data can be used to return query response proofs in zero-knowledge. The only authentication/validity this mechanism ultimately anchors to is the digital signature on the whole dataset by the source. The API provides endpoints to submit the data, which it internally converts into a reference merkle tree for inclusion proofs. The proof system itself is built on Zokrates API/tools that relies on the default GM16 curve.

## Insertion

1. Insert data to DB: The data gets merkleized and inserted into a mongo instance. Corresponding tree root is returned.
2. Handshake Signature: The data handshake protocol requires a signature on the merkle root obtained above. The request is sent with this signature and corresponding wallet address.
3. The backend updates the Merkle data root details, to be produced along with queries later on.

## Query

The query scheme currently supports 5 conditions/filters per query. This can be used to pass in 5 or less queries to the API at once, for which proofs would be generated. The query is passed as a triplet of arrays where each index corresponds to that query's
- operation for that filter/condition: value in {0, 1, 2} corresponding to {"eq", "gte", "lte"} respectively
- position of the data column in that row (that also has alternating salts): e.g. 2 for d.o.b
- Value to be compared with: e.g. "20230926" - for date


The backend first fetches the corresponding record and if the condition is met at that record, uses the Zokrates lib to generate a witness and a proof for the validity of the statement.

The response contains several cryptographic fields to ascertain, in zero-knowledge, the validity of the statement. This proof ascertains two facts: 

1. There are one or more data rows in the database that satisfy the 5-conditions array triplet's conditions.
2. Each of these data points are also a part of the merkle tree

The response also contains the merkle data root details of the original state insertion corresponding to that data.

## Data columns (ordered)

1. uid - string - Unique ID of this row (can be anything or left blank)
2. gender - string
3. dateOfBirth - number - YYYYMMDD
4. countryOfResidence - string
5. cityOfResidence - string
6. employmentStatus - string
7. maritalStatus - string
8. education - string
9. employmentIndustry - string
10. primaryLanguage - string
11. otherLanguage - string
12. householdIncomeAnnual - number (max 2\*\*64)
13. accountCreationDate - number - YYYYMMDD

Each of these would have a corresponding salt added to their next column, while storing in the database. This would eventually make 26 the total number of columns.