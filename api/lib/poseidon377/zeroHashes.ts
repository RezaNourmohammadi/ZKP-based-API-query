import { hexToBigNumStr } from "../../merkleizeInsert"
import buildPoseidon from "./poseidon377"

let H: string[] = new Array<string>(10)
let salt = "65535"

export const ZERO_HASHES_377 = [
    '3418554114147518368054593363195605018351219576575808145268247832025627544861',
    '3794367528256303487977666575996807187352916382572614131612662404802990432293',
    '6392776019064760349318447022278210640115785364240361023837253627014073242132',
    '330693153218412203134518903489315905872709188352219984389422855279168775706',
    '7036371137623654030299548692739535152032810876860193090272811318793537988424',
    '7550691179665877414960091972274644542587202670372347588922131517294103872220',
    '1232317414690446621711602187294363065571287022685471145337818825365542527348',
    '3259773724571267040363222006676890369654823759380840787732038206415010073134',
    '7830820480778000723663423593156193716698006205270761723627302345481075224369',
    '4029614491748967984353569522150695927818894966231571757195142522645564027403',
    '0'
]



var buildZeroHashes = async () => {
    let poseidon = await buildPoseidon()
    H[0] = poseidon(["0", salt], null, null) + ""

    for (let i = 1; i < 10; i++) {
        H[i] = poseidon([H[i - 1], H[i - 1]], null, null) + ""
    }
    console.log(H)
}

// buildZeroHashes()
