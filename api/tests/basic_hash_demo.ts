import { ethers } from "ethers"
import buildPoseidon from "../lib/poseidon/poseidon_opt"
/**
 * This file shows how to use poseidon function.
 * THis function accepts parameters 
 */


const test1 = (pf: any) => {
 // console.log(pf([3176497, 999999]))

    function log(arg: any){
        console.log(ethers.hexlify(arg))
    }
    //Putting null to the next arguments (explicitly) has no effect
    log(pf([1], null, null))
    log(pf([1]))

    //Stringifying and hexlifying have no difference
    log(pf(["1"]))
    log(pf(["0x1"]))
    log(pf([0]))
    log(pf(["0x0"]))
}

const test2 = (pf: any) => {

    //The following two produce the same output
    const log1 = (arg: any) => console.log(ethers.toBigInt(arg).toString())
    // const log2 = (arg: any) => console.log(BigInt(ethers.hexlify(arg)).toString())

    let h1 = pf([0], null, 1)
    let h2 = pf([1])
    let h3 = pf([0,1])

    // console.log()
    log1(h1)
    // log2(h1)

    log1(h2)
    // log2(h2)

    log1(h3)
    // log2(h3)

}

buildPoseidon().then(test2)
// buildPoseidon().then(test1)

// buildPoseidon().then((pf: any) => {
//     console.log(pf(["0x3176497", "999999"]))
// })


