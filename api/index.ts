import express from "express"
import { MongoClient } from "mongodb"
import { config as dotenvConfig } from "dotenv"
import { insertDataPointsToDb, insertTreeToDb, merkleizeInsert } from "./merkleizeInsert"
import buildPoseidon from "./lib/poseidon/poseidon_opt"
import { BaseWallet, Wallet, ethers } from "ethers"
dotenvConfig()
const app = express()
app.use(express.json())
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017`

app.get('/', (req, res) => {
    res.send('Hello world')
})

var poseidon: Function | undefined = undefined
buildPoseidon().then(f => poseidon = f)

app.post('/insert', async (req, res) => {
    console.log(uri)
    const client = new MongoClient(uri);

    let dataPointsFromReq = req.body
    let err: any = undefined
    let tree: any
    //TODO: Sanitize request data
    try {
        if (poseidon === undefined) {
            res.status(504).send({ "error": "waitiing initialization, try again in some time" })
            return
        }

        tree = merkleizeInsert(dataPointsFromReq, poseidon)
        err = await insertTreeToDb(tree.tree)
        if(err === undefined){
            err = await insertDataPointsToDb(dataPointsFromReq)
        }
    } catch (e: any) {
        res.status(504).send({ "error": err.toString() })
        err = e
        return
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    if (err === undefined) { res.status(200).send({ "status": "okay", merkleRoot: tree.root }) }
    else res.status(504).send({ "error": err.toString() })
})

app.get('/dataPoints', async (req, res) => {
    
    console.log('test: reading request')
    console.log(req)
    console.log("test: reading req.body")
    console.log(req.body)
    console.log("test: reading req.params")
    console.log(req.params)


    const client = new MongoClient(uri)
    async function run() {
        try {
            // const database = client.db('zk_db');
            
            // test for reading from my database: testDatabase            

            const database = client.db('test');

            ///// test

            // const database_2 = client.db('testDatabase')
            // // console.log('test: reading my database')
            // // console.log(database_2)
            // const dataPointsCollection_1 = database_2.collection('dataPoints')
            // console.log("test: reading data points")
            // console.log(dataPointsCollection_1)

            // /////

            const dataPointsCollection = database.collection('newDatabase')
            const query = {}
            const dataPoints = await dataPointsCollection.find({}).toArray()
            
            // test
            console.log("test: reading datapoints")
            console.log(dataPoints)
            //

            res.status(200).send(dataPoints)
        } finally {
            await client.close()
        }
    }
    await run()
})

app.get('/tree', async (req, res) => {
    const client = new MongoClient(uri)
    async function run() {
        try {
            // const database = client.db('zk_db');
            // const treeColl = database.collection('tree')

            // test
            const database = client.db('test');
            const treeColl = database.collection('tree')
            //

            const query = {}
            const fullTree = await treeColl.find({}).toArray()
            res.status(200).send(fullTree)
        } finally {
            await client.close()
        }
    }
    await run()
})

app.delete('/deleteDataPoints', async (req, res) => {
    const client = new MongoClient(uri)
    async function run() {
        try {
            const database = client.db('test');
            const dataPointsCollection = database.collection('newDatabase')
            const treeColl = database.collection('tree')
            const hColl = database.collection('handshake')
            let dr = await dataPointsCollection.deleteMany()
            let tr = await treeColl.deleteMany()
            await hColl.deleteMany()
            res.status(200).send({ "result": { "deleteCount": dr.deletedCount, "acknowledged": dr.acknowledged } })
        } finally {
            await client.close()
        }
    }
    await run()
})

app.post('/signDataRoot', async (req, res) => {
    const client = new MongoClient(uri)
    try {
        let merkleRoot = req.body.merkleRoot

        console.log("test: reading query body")
        console.log(req.body)
        console.log("test: reading merkle root")
        console.log(merkleRoot)

        if(merkleRoot === undefined){
            throw "malformed request"
        }
        
        const database = client.db('test');
        const hColl = database.collection('handshake')

        let existing = await hColl.findOne({merkleRoot})
        if(existing !== null){
            if(existing.signature) throw "already exists"
        }

        console.log("test_0")

        let signature = req.body.signature
        console.log("test_0_1")
        let address = req.body.walletAddress
        console.log("test_0_2")
        let signer = ethers.verifyMessage(merkleRoot, signature)
        console.log("test_0_3")
        if(signer !== address){
            throw "signature mismatch"
        }

        console.log("test_1")

        if(existing !== null){
            await hColl.updateOne({merkleRoot}, {signature, walletAddress: address})
        } else {
            await hColl.insertOne({merkleRoot, signature, walletAddress: address, timestamp: new Date().getTime() })
        }

        res.status(200).send({status: "okay", message: `successfully signed data root ${merkleRoot}`})
    } catch (err) {
        console.log(err)
        res.status(500).send({status: "error", message: err})
    } finally {
        await client.close()
    }
})

app.post('/simpleSigner', async (req, res) => {
    let key: string | undefined = req.body.key
    let wallet: BaseWallet
    if(key === undefined || key === null || key.length === 0){
        wallet = ethers.Wallet.createRandom()
    } else {
        wallet = new ethers.Wallet(key)
    }
    
    let messageToSign = req.body.messageToSign
    if(messageToSign === undefined) res.status(500).send({status: "error"})

    res.status(200).send({
        messageToSign,
        signature: await wallet.signMessage(messageToSign),
        address: await wallet.getAddress(),
        privateKey: wallet.privateKey
    })
})

app.post('/getDataRootDetails', async (req, res) => {
    try {
        let merkleRoot = req.body.merkleRoot
        if(merkleRoot === undefined){
            throw "malformed request"
        }
        let record = await getDataRootDetailsFromDB(merkleRoot)
        if(record === undefined){
            res.status(200).send({status: "not found"})
        }else {
            res.status(200).send({status: "found", ...record})
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({status: "error", message: err})
    }
})

export async function getDataRootDetailsFromDB(merkleRoot: string){
    const client = new MongoClient(uri)
    try {
        const database = client.db('test');
        console.log("test: reading from handshake")
        const hColl = database.collection('handshake')

        let existing = await hColl.findOne({merkleRoot})
        if(existing === null){
            return undefined
        } else {
            return existing
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
}

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App listening on PORT ${port}`))