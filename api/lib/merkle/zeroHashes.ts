import buildPoseidon from "../poseidon/poseidon_opt"

let H: string[] = new Array<string>(10)
let salt = "0xffff"

export const ZERO_HASHES = [
    '0x2e1c4861c33429bb539a5f2e6274387ff4f6714a217fafbbd18c33fcff8e1400',
    '0xcc7f5ebef05221f19a082c7ffd1f960f0a3fbbe27d680093d5290f132b1a0109',
    '0x1a9074c2c18c77e0047ac272ab771068aeb3de6cb52095f0f7ecba70b3427023',
    '0xc992a20ce1a982347b67b184a964713a14bea36f54f583ac5989df5a21619b22',
    '0xb57e21722fc518377775abd2f6cf36abda9bd39f9271319b2623afd4d29f542e',
    '0xb4c67a1d47a266f68af8e7706610cc16dc6ad79f7d2c5b463ba024f1ba4fb107',
    '0x7df82fdd414ae1fd91f514e6dbb28cf54bd6492283ac4c848108b9c0436dce20',
    '0xda0fc748fe6cbc2f1a5939d55a51ff486be18f27d45e44400500c95fac6ecb22',
    '0x580cf4139b65f193a3924fa93fca35d9c01192a40ce54e2a49f861c6f738a200',
    '0x29674d75fa34dc58b960741f842d49b1747994ef8362a04e8efa5972a954a721',
    '0x0'
]


var buildZeroHashes = async () => {
    let poseidon = await buildPoseidon()

    H[0] = "0x" + Buffer.from(poseidon(["0x0", salt], null, null)).toString('hex')

    for (let i = 1; i < 10; i++) {
        H[i] = "0x" + Buffer.from(poseidon([H[i - 1], H[i - 1]], null, null)).toString('hex')
    }
    console.log(H)
}

// buildZeroHashes()
