import express from "express"
import { MongoClient } from "mongodb"
import { config as dotenvConfig } from "dotenv"
import { Abi, CompilationArtifacts, ComputationResult, ZoKratesProvider, } from "../lib/zokrates_js/types";
// import zokratesJS from "zokrates-js"
import { initialize } from "../lib/zokrates_js/index.js"
import abiJson from "./proofAbi"
import fs from "fs";
import path from "path"

import { getMerklePath, getMerkleRoot, hashDataPoint, hexToBigNumStr, insertDataPointsToDb, insertTreeToDb, merkleizeInsert, verifyMerkleProof } from "../merkleizeInsert"
import buildPoseidon from "../lib/poseidon/poseidon_opt"
import { DataPoint } from "../types"
import { ethers, getBigInt } from "ethers";
import { Proof } from "zokrates-js";
import { getDataRootDetailsFromDB } from "..";
dotenvConfig()
const app = express()
app.use(express.json())
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017`

app.get('/', (req, res) => {
    res.send('Hello iman')
})

var poseidon: Function | undefined = undefined
var zokProvider: ZoKratesProvider | undefined = undefined

async function init(){
poseidon = await buildPoseidon()
   zokProvider = await initialize()
}

app.post('/queryAgeGt18', async (req, res) => {
    const client = new MongoClient(uri);

    let walletAddr = req.body.walletAddress
    let err: any = undefined
    let dataPoint: DataPoint | undefined
    //TODO: Sanitize request data
    try {
        if (poseidon === undefined) {
            res.status(504).send({ "error": "waitiing initialization, try again in some time" })
            return
        }
        dataPoint = await findDataPointForQuery(QueryFilter.GT_18, walletAddr)
    } catch (e: any) {
        res.status(504).send({ "error": err.toString()})
        err = e
        return
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    if (err !== undefined) res.status(504).send({ "error": err.toString() })
    if (dataPoint === undefined) {
        res.status(200).send({ "status": "not found", "result": "", "proof": "" })
    } else {
        // try to get the proof
        // Find the merkle path to the root, and pass it down
        // let isProofCorrect = verifyMerkleProof(merkleArr, await getMerkleRoot(), poseidon)
        // let merkleArr: string[] = []
        const merkleArr: string[] = hexToBigNumStr(await getMerklePath(dataPoint));
        let row = hexToBigNumStr(hashDataPoint(dataPoint, poseidon).row)
        let root = merkleArr[18]
        // let ph = poseidon([poseidon([...row.slice(0,4)]), poseidon([...row.slice(4,8)])])
        let computationResult = getWitness(row, merkleArr.slice(0,18), root)
        if(computationResult === undefined){
            res.status(200).send({status: "error"})
            return
        }
        // console.log(computationResult)
        let proof = genProof(computationResult.program, computationResult.witness.witness)
        if(proof === undefined){
            res.status(500).send({status: "error"})
            return
        }
        let isCorrect = verifyProof(proof)
        if(isCorrect === undefined){
            res.status(500).send({status: "error"})
            return
        }

        let merkleDataRootDetails: any = undefined
        merkleDataRootDetails = await getDataRootDetailsFromDB(root)
        let isMerkleSignValid = merkleDataRootDetails.walletAddress 
        === ethers.verifyMessage(
            merkleDataRootDetails.merkleRoot, 
            merkleDataRootDetails.signature
        )

        res.status(200).send({ "status": "found", "isAgeGt18": isCorrect, dataPoint, "proof": proof, merkleDataRootDetails, isProofCorrect: isCorrect, isMerkleSignValid: isMerkleSignValid, dataRowNumerified: hashDataPoint(dataPoint, poseidon).row})
    }
})

app.post('/verifyAgeGt18', async (req, res) => {
    let proof = req.body.proof
    let isProofCorrect = verifyProof(proof)
    if(isProofCorrect === undefined){
        res.status(500).send({status: 'error'})
    } else {
        res.status(200).send({status: "okay", isProofCorrect})
    }
})

const enum QueryFilter {
    GT_18
}

export async function findDataPointForQuery(qf: QueryFilter, query: any): Promise<DataPoint | undefined> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    let res: DataPoint | undefined = undefined
    try {
        const database = client.db('zk_db')
        const dpColl = database.collection('dataPoints')
        let queryRes = await dpColl.findOne({ "walletAddr": query })
        if (queryRes !== null) {
            res = {
                // idHash: queryRes.idHash,
                // nodeInfo: queryRes.nodeInfo,
                // walletAddr: queryRes.walletAddr,
                // personName: queryRes.personName,
                // emailId: queryRes.emailId,
                // personAge: queryRes.personAge
            }
        }

    } catch (e) {
        err = e
    }
    finally { client.close() }
    return res
}

export function genProof(program: Uint8Array, witness: Uint8Array): Proof | undefined{
    if(zokProvider === undefined) return undefined
    let f = fs.readFileSync(path.resolve(__dirname, "./proving.key"), null )
    let provingKey = new Uint8Array(f.buffer)
    return zokProvider.generateProof(program, witness, provingKey)
}

export function verifyProof(proof: Proof): boolean | undefined{
    if(zokProvider === undefined) return undefined
    let f = fs.readFileSync(path.resolve(__dirname, "./verification.key"), null )
    let verificationKey = JSON.parse(f.toString())
    return zokProvider.verify(verificationKey, proof)
}


export function getWitness(row: any[], merkleArr: any[], root: string): {witness: ComputationResult, program: Uint8Array} | undefined{
    // const location = path.resolve(path.dirname(path.resolve(from)), to);
    if(zokProvider === undefined) return undefined
    let out = fs.readFileSync(path.resolve(__dirname, "./out"), null )
    let program = new Uint8Array(out.buffer)
    let proofAbi: Abi = abiJson
    let input: CompilationArtifacts = {
        program,
        abi: proofAbi
    }
    let witness: ComputationResult
    try {
        console.log()
        witness = zokProvider.computeWitness(input, [row, merkleArr, root])
        return {witness, program}
    } catch (e){
        console.log(e)
    }
    return undefined
}

const port = process.env.PORT || 3001

init().then( f => app.listen(port, () => console.log(`App listening on PORT ${port}`)))
