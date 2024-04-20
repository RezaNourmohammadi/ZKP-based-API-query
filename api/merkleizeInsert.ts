

//Given a list of data points, returns the merkle root and merkle path

import { ethers } from "ethers";
import { DataPoint, NodeType, TreeNode } from "./types";
import { ZERO_HASHES } from "./lib/merkle/zeroHashes";
import { Collection, MongoClient, ObjectId } from "mongodb";

export const DATA_SALT = "0xffff"

export function hexlify(v: string): string {
    return ethers.hexlify(ethers.toUtf8Bytes(v))
}

/**
 * Function to create a merkle tree for a set of data points. 
 * The returned tree is just a key-value store type object.
 * Zero hashes refer to hashing zero value the same way non-zero value would have been.
 * The zero hashes initially fully fill the merkle tree.
 * The tree structure only has nodes of unknown children/parents - so,
 *  no zero hash node or their parents.
 * @param dataPoints Array of data points to be inserted
 * @param poseidon Intance of Poseidon hash function
 * @returns {tree: the full merkle tree, root: root of the merkle tree}
 */
export function merkleizeInsert(dataPoints: DataPoint[], poseidon: Function): {tree: any, root: any} | undefined {
    let levelNodes = 1024   //max number of data points to be supported here

    // First filling all the leaf nodes with zero hashes, since our merkle tree must be full
    let currentLevelHashes = new Array<string>(levelNodes).fill(ZERO_HASHES[0])
    let tree: { [hash: string]: TreeNode } = {}
    
    // iterate over all data points and create an anchor hash for each of them
    for (let i in dataPoints) {
        // start inserting from the left most
        currentLevelHashes[i] = hashDataPoint(dataPoints[i], poseidon).hash
        tree[currentLevelHashes[i]] = {
            idHash: currentLevelHashes[i],
            parent: undefined,
            nodeType: NodeType.leaf,
            children: []
        }
        dataPoints[i].nodeInfo = tree[currentLevelHashes[i]]
        dataPoints[i].idHash = currentLevelHashes[i]
    }

    let levels = Math.ceil(Math.log2(levelNodes))   // 10 for 1024

    // Going from level 1 (second) and up. Since we already filled the leaves
    for (let justCount = 1; justCount < levels; justCount++) {
        levelNodes /= 2
        for (let j = 0; j < levelNodes; j++) {

            // At this level the children of a node j would be located at 2j and 2j+1
            let c = Math.floor(j * 2)
            let children = [currentLevelHashes[c], currentLevelHashes[c + 1]]
            currentLevelHashes[j] = poseidon(children)

            // if this current hash hasn't come from zero hashes beneath
            if (currentLevelHashes[j] != ZERO_HASHES[justCount]) {
                tree[currentLevelHashes[j]] = {
                    idHash: currentLevelHashes[j],
                    parent: undefined,
                    nodeType: NodeType.branch,
                    children
                }
            }

            // If the child doesn't have a known parent, since this is not a zero hash
            if (children[0] != ZERO_HASHES[justCount - 1]) {
                tree[children[0]].parent = currentLevelHashes[j]
            }
            if (children[1] != ZERO_HASHES[justCount - 1]) {
                tree[children[1]].parent = currentLevelHashes[j]
            }
        }
    }
    tree[currentLevelHashes[0]].nodeType = NodeType.root
    return {tree, root: currentLevelHashes[0]}
}

/**
 * Function to insert the whole tree into the database
 * @param tree The tree object
 * @returns nothing
 */
export async function insertTreeToDb(tree: { [hash: string]: TreeNode }): Promise<any> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    try {

        let dbTreeRows = Object.keys(tree).map(k => ({
            idHash: k,
            parent: tree[k].parent,
            children: tree[k].children,
            nodeType: tree[k].nodeType
        }))

        // const database = client.db('zk_db')
        // test
        const database = client.db('test')
        //
        const treeColl = database.collection('tree')
        await treeColl.insertMany(dbTreeRows)
    } catch (e) {
        err = e
    } finally {
        client.close()
    }
    return err
}

// Insert a set of data points to the database
export async function insertDataPointsToDb(dataPoints: DataPoint[]): Promise<any> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    try {
        // const database = client.db('zk_db')
        // const dpColl = database.collection('dataPoints')
        // await dpColl.insertMany(dataPoints)
        
        const database = client.db('test')
        const dpColl = database.collection('newDatabase')
        await dpColl.insertMany(dataPoints)
    } catch (e) {
        err = e
    }
    finally { client.close() }
    return err
}

// Get the current merkle root from the database - assume there is only one
export async function getMerkleRoot(): Promise<string> {
    let treeColl = getDbCollection('tree')
    let rootNode = await treeColl.findOne({nodeType: NodeType.root})
    if(rootNode !== null){
        return (rootNode as unknown as TreeNode).idHash || ""
    } 
    return "null"
}

function getDbCollection(name: string): Collection<Document> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    const database = client.db('zk_db')
    return database.collection(name)
}

/**
 * Numerify an ordered set of data and return the combined hash, using a pre-defined salt
 * @param dataPoint The data point
 * @param poseidon Instance of poseidon hash function
 * @returns numerified row, poseidon hash of the whole data point
 */
export function hashDataPoint(dataPoint: DataPoint, poseidon: Function): {row: string[], hash: string} {
    let a1 = [
        hexlify(dataPoint.uid + ""),
        DATA_SALT,
        hexlify(dataPoint.gender),
        DATA_SALT
    ]
    let a2 = [
        dataPoint.dateOfBirth + "",
        DATA_SALT,
        hexlify(dataPoint.countryOfResidence),
        DATA_SALT
    ]
    let a3 = [
        hexlify(dataPoint.cityOfResidence),
        DATA_SALT,
        hexlify(dataPoint.employmentStatus),
        DATA_SALT
    ]
    let a4 = [
        hexlify(dataPoint.maritalStatus),
        DATA_SALT,
        hexlify(dataPoint.education),
        DATA_SALT
    ]
    let a5 = [
        hexlify(dataPoint.employmentIndustry),
        DATA_SALT,
        hexlify(dataPoint.primaryLanguage),
        DATA_SALT
    ]
    let a6 = [
        hexlify(dataPoint.otherLanguage),
        DATA_SALT,
        dataPoint.householdIncomeAnnual + "",
        DATA_SALT
    ]
    let a7 = [
        dataPoint.accountCreationDate + "",
        DATA_SALT,
        "0x0",
        "0x0"
    ]
    
    let a1234 = poseidon([poseidon(a1), poseidon(a2), poseidon(a3), poseidon(a4)])
    let a567 = poseidon([poseidon(a5), poseidon(a6), poseidon(a7)])


    return  {row: [...a1, ...a2, ...a3, ...a4, ...a5, ...a6, ...a7], hash: poseidon([a1234, a567])} 
}

/**
 * Function to find the full merkle tree path from the data point to the root of the merkle tree
 * @param dataPoint The data point as obtained from DB
 * @returns An array containing the sequence of nodes from current sibling to the root
 */
export async function getMerklePath(dataPoint: DataPoint): Promise<string[]> {
    const treeColl = getDbCollection('tree')
    let parent = dataPoint.nodeInfo?.parent
    if (parent === undefined) return []
    let merkleArr: string[] = []
    for (let i = 0; i < 10; i++) {
        let parentNode: TreeNode = (await treeColl.findOne({ idHash: parent }) as unknown) as TreeNode
        merkleArr.push(...parentNode.children)
        if(parentNode.nodeType === NodeType.root) break
        parent = parentNode.parent
        if(parent === undefined || parent === null ) break
    }
    merkleArr.push(parent || "") //push the root
    // swap with the sibling to make sure the first element is itself
    if(dataPoint.nodeInfo?.idHash !== merkleArr[0]){
        [merkleArr[0], merkleArr[1]] =[merkleArr[1], merkleArr[0]]
    }
    return merkleArr
}

// export function hashToHex(arr: ArrayBuffer): string{
//     return "0x" + Buffer.from(arr).toString('hex')
// }

// Function to verfy a given merkle path sequence array, given a root and an
// instance of poseidon function
export function verifyMerkleProof(merkleArr: string[], root: string, poseidon: Function): boolean{
    let i=0;
    if(merkleArr[merkleArr.length - 1] !== root) return false
    while(i < merkleArr.length - 2){
        if(poseidon([merkleArr[i], merkleArr[i + 1]]) !== merkleArr[i+2])
            return false
        i += 2
    }
    return true
}

// Function to convert an array of strings to base-10 integer values, to be used with zokrates ecosystem
// It assumes hex numbers have a "0x" prefix
export function hexToBigNumStr(args: string[]): string[] {
    let ret: string[] = []
    args.forEach( e => {
        if(e.startsWith("0x")){
            ret.push(BigInt(e).toString())
        } else {
            ret.push(e + "")
        }
    })
    return ret
}