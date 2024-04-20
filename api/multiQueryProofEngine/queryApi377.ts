import express from "express"
import { MongoClient } from "mongodb"
import { config as dotenvConfig } from "dotenv"
import { Abi, CompilationArtifacts, ComputationResult, ZoKratesProvider, } from "../lib/zokrates_js/types";
// import zokratesJS from "zokrates-js"
import { initialize as zokInitialize } from "../lib/zokrates_js"
import abiJson from "../proofEngine/proofAbi"
import firstLevelAbiJson from "./abi/firstLevelAbi128"
import firstLevelAbiJson16 from "./abi/firstLevelAbi16"
import secondLevelAbi16 from "./secondLevelAbi16";
import fs from "fs";
import path from "path"
import { Fr as Field } from "../lib/bls12377js"
import { getMerklePath, getMerkleRoot, hashDataPoint, hexToBigNumStr, hexlify, insertDataPointsToDb, insertTreeToDb, merkleizeInsert, verifyMerkleProof } from "./merkleizeInsert"

import buildPoseidon from "../lib/poseidon377/poseidon377"
import { DataPoint } from "../types"
import { ethers, getBigInt } from "ethers";
import { Proof, } from "zokrates-js";

import { getDataRootDetailsFromDB } from "..";
import { assert } from "console";

import { mongoUri } from "./dataApi"

dotenvConfig()
const app = express()
app.use(express.json())
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017`

app.get('/', (req, res) => {
    res.send('Hello world')
})

var poseidon: Function | undefined = undefined
var defaultZokProvider: ZoKratesProvider | undefined = undefined
var firstZokProvider: ZoKratesProvider | undefined = undefined
var secondZokProvider: ZoKratesProvider | undefined = undefined
async function init() {
    poseidon = await buildPoseidon()
    // let zokjs = require('zokrates-js')
    defaultZokProvider = await zokInitialize()
    firstZokProvider = defaultZokProvider.withOptions({
        backend: "ark",
        scheme: "gm17",
        curve: "bls12_377"
    })
    secondZokProvider = defaultZokProvider.withOptions({
        backend: "ark",
        scheme: "gm17",
        curve: "bw6_761"
    })
}

interface Condition {
    fieldName: string
    operator: string
    cmpVal: string | number
}

let fieldToPos: { [fieldName: string]: number } = {
    "uid": 0,
    "gender": 2,
    "dateOfBirth": 4,
    "countryOfResidence": 6,
    "cityOfResidence": 8,
    "employmentStatus": 10,
    "maritalStatus": 12,
    "education": 14,
    "employmentIndustry": 16,
    "primaryLanguage": 18,
    "otherLanguage": 20,
    "householdIncomeAnnual": 22,
    "accountCreationDate": 24
}

let operatorToNum: { [operator: string]: number } = {
    "NONE": 0,
    "EQ": 1,
    "GTE": 2,
    "LTE": 3
}

app.post('/multiQuery', async (req, res) => {
    let conditions: any[] = req.body.conditions
    if (conditions.length > 5) {
        res.status(400).send({ error: "TOO MANY CONDITIONS (MAX 5)" })
        return
    }
    let cmpVal: any[] = []
    let queryFieldIndex: number[] = []
    let queryOp: number[] = []
    // Add empty conditions to fill up
    for (let i = conditions.length; i < 5; i++) {
        conditions.push({
            cmpVal: 0,
            fieldName: "uid",
            operator: "NONE"
        })
    }
    for (let c of conditions) {
        let cond: Condition = c as Condition
        try {
            validateCond(cond)
        } catch (err: any) {
            res.status(400).send({ "error": err + "" })
            return
        }
        cmpVal.push(cond.cmpVal)
        queryFieldIndex.push(fieldToPos[cond.fieldName])
        queryOp.push(operatorToNum[cond.operator])
    }

    try {
        // Get 128 rows at a time
        // let dataPoints = await get128DataPoints()
        let dataPoints = await get16DataPoints()
        // TODO: Call zokrates API to generate first level proofs
        if (firstZokProvider === undefined || poseidon === undefined) {
            res.status(500).send({ error: "First level zok-provider or poseidon instance not ready" })
        } else {
            let proofAbi: Abi = firstLevelAbiJson
            let firstLevelProgram = fs.readFileSync(path.resolve(__dirname, "./firstLevel.program"), null)
            let program = new Uint8Array(firstLevelProgram.buffer)
            let input: CompilationArtifacts = {
                program,
                abi: proofAbi
            }
            let rows = dataPoints?.map((val) => {
                if (poseidon !== undefined)
                    return hexToBigNumStr(hashDataPoint(val, poseidon).row)
                else return []
            })

            let circuitArgs = [
                rows,
                hexToBigNumStr(cmpVal),
                hexToBigNumStr(queryFieldIndex),
                hexToBigNumStr(queryOp)
            ]

            let computationResult = firstZokProvider.computeWitness(
                input, circuitArgs)
            if (computationResult === undefined) {
                res.status(200).send({ status: "error" })
                return
            }
            let provingKeyFile = fs.readFileSync(path.resolve(__dirname, "./proving.key"), null)
            let provingKey = new Uint8Array(provingKeyFile.buffer)
            let witness = new Uint8Array(computationResult.witness.buffer)
            let proof = firstZokProvider.generateProof(program, witness, provingKey)

            if (proof === undefined) {
                res.status(500).send({ status: "error generating proof" })
                return
            }

            let verificationKeyFile = fs.readFileSync(path.resolve(__dirname, "./verification.key"), null)
            let verificationKey = new Uint8Array(verificationKeyFile.buffer)
            let verification = firstZokProvider.verify(verificationKey, proof)
            if (verification === undefined) {
                res.status(500).send({ status: "error" })
                return
            }
        }
    } catch (e: any) {
        res.status(500).send({ error: e })
        console.error(e)
        return
    }
    // TODO: Collect first level proofs and generate second level proof using zokrates API

    res.status(200).json({
        "status": "Query received successfully",
        cmpVal,
        queryFieldIndex,
        queryOp,
        connector: "AND",
        queryResult: {
            count: "NOT IMPLEMENTED",
            proof: {
                objPlaceholder: "NOT IMPLEMENTED"
            }
        }
    })
})

app.post('/multiQuery16', async (req, res) => {
    let conditions: any[] = req.body.conditions
    if (conditions.length > 5) {
        res.status(400).send({ error: "TOO MANY CONDITIONS (MAX 5)" })
        return
    }
    let cmpVal: any[] = []
    let queryFieldIndex: number[] = []
    let queryOp: number[] = []
    let proof: any = undefined
    let witness: any = undefined
    let output: any[] = []
    // Add empty conditions to fill up
    for (let i = conditions.length; i < 5; i++) {
        conditions.push({
            cmpVal: 0,
            fieldName: "uid",
            operator: "NONE"
        })
    }
    for (let c of conditions) {
        let cond: Condition = c as Condition
        try {
            validateCond(cond)
        } catch (err: any) {
            res.status(400).send({ "error": err + "" })
            return
        }
        cmpVal.push(cond.cmpVal)
        queryFieldIndex.push(fieldToPos[cond.fieldName])
        queryOp.push(operatorToNum[cond.operator])
    }

    try {
        // Get 128 rows at a time
        // let dataPoints = await get128DataPoints()
        let dataPoints = await get16DataPoints()
        // TODO: Call zokrates API to generate first level proofs
        if (firstZokProvider === undefined || poseidon === undefined) {
            res.status(500).send({ error: "First level zok-provider or poseidon instance not ready" })
        } else {
            let proofAbi: Abi = firstLevelAbiJson16
            let firstLevelProgram = fs.readFileSync(path.resolve(__dirname, "./firstLevel16.program"), null)
            let program = new Uint8Array(firstLevelProgram.buffer)
            let input: CompilationArtifacts = {
                program,
                abi: proofAbi
            }
            let rows = dataPoints?.map((val) => {
                if (poseidon !== undefined)
                    return hexToBigNumStr(hashDataPoint(val, poseidon).row)
                else return []
            })

            let circuitArgs = [
                rows,
                hexToBigNumStr(cmpVal),
                hexToBigNumStr(queryFieldIndex),
                hexToBigNumStr(queryOp)
            ]

            let computationResult = firstZokProvider.computeWitness(
                input, circuitArgs)
            if (computationResult === undefined) {
                res.status(200).send({ status: "error" })
                return
            }
            output = JSON.parse(computationResult.output)
            let provingKeyFile = fs.readFileSync(path.resolve(__dirname, "./proving16.key"), null)
            let provingKey = new Uint8Array(provingKeyFile.buffer)
            witness = new Uint8Array(computationResult.witness.buffer)
            proof = firstZokProvider.generateProof(program, witness, provingKey)

            if (proof === undefined) {
                res.status(500).send({ status: "error generating proof" })
                return
            }

            let verificationKeyFile = fs.readFileSync(path.resolve(__dirname, "./verification16.key"), null)
            let verificationKey = JSON.parse(verificationKeyFile.toString())
            let verification = firstZokProvider.verify(verificationKey, proof)
            if (verification === undefined) {
                res.status(500).send({ status: "error" })
                return
            }
        }
    } catch (e: any) {
        res.status(500).send({ error: e })
        console.error(e)
        return
    }
    // TODO: Collect first level proofs and generate second level proof using zokrates API

    res.status(200).json({
        "status": "Query received successfully",
        cmpVal,
        queryFieldIndex,
        queryOp,
        connector: "AND",
        queryResult: {
            count: output[0],
            merkleRoot: output[1],
            proof
        }
    })
})

app.post('/secondlevel16', async (req, res) => {
    let firstProof = req.body.proof
    let witness: any = undefined
    let output: any[] = []
    let secondProof: Proof | undefined = undefined
    let verification: boolean | undefined = undefined
    try {
        // Get 128 rows at a time
        // let dataPoints = await get128DataPoints()
        // TODO: Call zokrates API to generate first level proofs
        if (secondZokProvider === undefined || poseidon === undefined) {
            res.status(500).send({ error: "Second level zok-provider or poseidon instance not ready" })
        } else {
            let proofAbi: Abi = secondLevelAbi16
            let secondLevelProgram = fs.readFileSync(path.resolve(__dirname, "./secondLevel16.program"), null)
            let program = new Uint8Array(secondLevelProgram.buffer)
            let input: CompilationArtifacts = {
                program,
                abi: proofAbi
            }
            let verificationKeyFile = fs.readFileSync(path.resolve(__dirname, "./verification16.key"), null)
            let verificationKey = JSON.parse(verificationKeyFile.toString())
            delete verificationKey.scheme
            delete verificationKey.curve
            let circuitArgs = [
                firstProof,
                verificationKey
            ]
            
            let computationResult = secondZokProvider.computeWitness(
                input, circuitArgs)
            if (computationResult === undefined) {
                res.status(200).send({ status: "error" })
                return
            }
            output = JSON.parse(computationResult.output)
            let provingKeyFile = fs.readFileSync(path.resolve(__dirname, "./secondProving16.key"), null)
            let provingKey = new Uint8Array(provingKeyFile.buffer)
            witness = new Uint8Array(computationResult.witness.buffer)
            secondProof = secondZokProvider.generateProof(program, witness, provingKey)

            if (secondProof === undefined) {
                res.status(500).send({ status: "error generating proof" })
                return
            }

            verificationKeyFile = fs.readFileSync(path.resolve(__dirname, "./verification16.key"), null)
            let secondVerificationKey = JSON.parse(verificationKeyFile.toString())
            verification = secondZokProvider.verify(verificationKey, secondVerificationKey)
            if (verification === undefined) {
                res.status(500).send({ status: "error" })
                return
            }
        }
    } catch (e: any) {
        res.status(500).send({ error: e })
        console.error(e)
        return
    }

    res.status(200).json({
        "status": "Second level proof",
        verification,
        proof: secondProof,
    })
})

app.post('/getHashes', async (req, res) => {
    let args: string[] = req.body.args as string[]
    let hashes: any = []
    for (let arg of args) {
        if (poseidon !== undefined) {
            let hashDetail = {
                arg,
                hashValue: poseidon([arg]),
                // hashWithField: poseidon(Field.fromString(arg))
            }
            hashes.push(hashDetail)
        }
    }
    res.status(200).json({
        hashes
    })
})

function validateCond(cond: Condition) {
    let fe: Field
    if (typeof cond.cmpVal === "string") {
        if (cond.cmpVal.startsWith("0x")) {
            // Already in hex format
            fe = Field.fromString(cond.cmpVal.substring(2), 16)
        } else {
            try {
                // If probably in BigInteger format
                fe = Field.fromString(cond.cmpVal)
            } catch (e) {
                // Normal string value
                fe = Field.fromString(hexlify(cond.cmpVal).substring(2), 16)
            }
        }
    } else if (typeof cond.cmpVal === "number") {
        fe = Field.fromString(cond.cmpVal + "")
    } else {
        throw "Undefined Type of val: " + cond.cmpVal
    }
    if (fe === undefined) {
        throw "Undefined CmpVal: " + cond.cmpVal
    }
    if (fieldToPos[cond.fieldName] === undefined) {
        throw "Unknown Field: " + cond.fieldName
    }
    if (operatorToNum[cond.operator] === undefined) {
        throw "Unknown Operator: " + cond.operator
    }
}

const enum QueryFilter {
    GT_18
}

export async function get128DataPoints(): Promise<DataPoint[] | undefined> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    let dataPoints: DataPoint[] | undefined = undefined
    try {
        const database = client.db('zk_db');
        const dataPointsCollection = database.collection('dataPoints')
        const query = {}
        dataPoints = await dataPointsCollection.find({}, { batchSize: 128 }).toArray() as unknown as DataPoint[]
    } catch (e) {
        throw e
    }
    finally { client.close() }
    return dataPoints
}

export async function get16DataPoints(): Promise<DataPoint[] | undefined> {
    const uri = process.env.MONGO_URI
    if (uri === undefined) throw "undefined mongo uri env config"
    let err = undefined
    const client = new MongoClient(uri)
    let dataPoints: DataPoint[] | undefined = undefined
    try {
        const database = client.db('zk_db');
        const dataPointsCollection = database.collection('dataPoints')
        const query = {}
        dataPoints = await dataPointsCollection.find({}, { batchSize: 16, limit: 16 }).toArray() as unknown as DataPoint[]
    } catch (e) {
        throw e
    }
    finally { client.close() }
    return dataPoints
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
                idHash: queryRes.idHash,
                nodeInfo: queryRes.nodeInfo,
                uid: queryRes.uid,
                gender: queryRes.gender,
                dateOfBirth: queryRes.dateOfBirth,
                countryOfResidence: queryRes.countryOfResidence,
                cityOfResidence: queryRes.cityOfResidence,
                employmentStatus: queryRes.employmentStatus,
                maritalStatus: queryRes.maritalStatus,
                education: queryRes.education,
                employmentIndustry: queryRes.employmentIndustry,
                primaryLanguage: queryRes.primaryLanguage,
                otherLanguage: queryRes.otherLanguage,
                householdIncomeAnnual: queryRes.householdIncomeAnnual,
                accountCreationDate: queryRes.accountCreationDate,
            }
        }

    } catch (e) {
        err = e
    }
    finally { client.close() }
    return res
}

export function genProof(program: Uint8Array, witness: Uint8Array): Proof | undefined {
    if (firstZokProvider === undefined) return undefined
    let f = fs.readFileSync(path.resolve(__dirname, "./proving.key"), null)
    let provingKey = new Uint8Array(f.buffer)
    return firstZokProvider.generateProof(program, witness, provingKey)
}

export function verifyProof(proof: Proof): boolean | undefined {
    if (firstZokProvider === undefined) return undefined
    let f = fs.readFileSync(path.resolve(__dirname, "./verification.key"), null)
    let verificationKey = JSON.parse(f.toString())
    return firstZokProvider.verify(verificationKey, proof)
}

export function getWitnessCount128(row: any[], merkleArr: any[], root: string): { witness: ComputationResult, program: Uint8Array } | undefined {
    // const location = path.resolve(path.dirname(path.resolve(from)), to);
    if (firstZokProvider === undefined) return undefined
    let out = fs.readFileSync(path.resolve(__dirname, "./out"), null)
    let program = new Uint8Array(out.buffer)
    let proofAbi: Abi = abiJson
    let input: CompilationArtifacts = {
        program,
        abi: proofAbi
    }
    let witness: ComputationResult
    try {
        console.log()
        witness = firstZokProvider.computeWitness(input, [row, merkleArr, root])
        return { witness, program }
    } catch (e) {
        console.log(e)
    }
    return undefined
}

export function getWitness(row: any[], merkleArr: any[], root: string): { witness: ComputationResult, program: Uint8Array } | undefined {
    // const location = path.resolve(path.dirname(path.resolve(from)), to);
    if (firstZokProvider === undefined) return undefined
    let out = fs.readFileSync(path.resolve(__dirname, "./out"), null)
    let program = new Uint8Array(out.buffer)
    let proofAbi: Abi = abiJson
    let input: CompilationArtifacts = {
        program,
        abi: proofAbi
    }
    let witness: ComputationResult
    try {
        console.log()
        witness = firstZokProvider.computeWitness(input, [row, merkleArr, root])
        return { witness, program }
    } catch (e) {
        console.log(e)
    }
    return undefined
}

const port = process.env.PORT || 3001

init().then(f => app.listen(port, () => console.log(`App listening on PORT ${port}`)))

