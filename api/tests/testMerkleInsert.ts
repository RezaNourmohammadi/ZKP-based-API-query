
import buildPoseidon from "../lib/poseidon/poseidon_opt"
import { merkleizeInsert } from "../merkleizeInsert"
import { DataPoint } from "../types"

let dataPoint: DataPoint[] = [
    {
        _id: undefined,
        nodeInfo: undefined,
        walletAddr: "0x1",
        personName: "Ron",
        emailId: "r@g.com",
        personAge: 18,
    },

    {
        _id: undefined,
        nodeInfo: undefined,
        walletAddr: "0x2",
        personName: "Emma",
        emailId: "e@g.com",
        personAge: 16,
    },

]

buildPoseidon().then( f => {
    console.log(
        JSON.stringify(
            merkleizeInsert(dataPoint, f),
            undefined, 2
        )
    )
})