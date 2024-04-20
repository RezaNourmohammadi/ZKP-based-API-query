// import { ethers, getBigInt } from "ethers";

let ethers = require("ethers")

let q = {
  "h": [
    [
      "0x015e816d8c66fb9c1d44585395d0b342f0a7566b594a536d361d232a3f02436f1d4050598c45356855c251ea994c889c",
      "0x00c3de9613078aaa20a9943848e6b02052eaba40acdeea600f8fbac181e40a7de7ea20b7bb22d5d06b80197bddf8ebe8"
    ],
    [
      "0x0041279d7ad6bf6d73d1383b23f92d67f6bfb8231215304b73a40e46dc830b2c531aecf4a1a6a6676f6ac0722f0d5021",
      "0x00bae1fcaf84e75b85eeae06404ad285d6daf7981de09b4db7aede3d942f29f2ee557fe7d474fd1303306942d215ff9b"
    ]
  ],
  "g_alpha": [
    "0x01a6450cec17f926ab4912b130fca6fe232dbf74f06ca67a2f7bd461860d616e8afbe7110de9b52b52735d95a4c9c273",
    "0x011bf81a4422d78568d1da13ed2b8182c1887a1aca04709eb5fb8e74a1f2f6c285800ddadfd5a0e9811516a76f1426a3"
  ],
  "h_beta": [
    [
      "0x0014b6be484a18e92eeeadedc3cad42fd91b4f4c1f7fc5e4e4a289b8f0cb62ac212fe33332acecdb63f94ba09a88c2d2",
      "0x0173457dc7a7a7c452f2056b55603d889bff9947264db57c5a4d4b0631833d26b7ffa844a7c21b27d2aa543ec2c94a56"
    ],
    [
      "0x01206dc24c8b14b1936c11fc64e42bff81415baa1b0ab1b2f24e9b431f885541cdf75804eb6ae0b3395f211b25c062d8",
      "0x01411b41fe8829588f09231eb89dd69e05cb995cc900c5498d7324042353501cf2b20a0bc4ad237038aa2e5035ef2644"
    ]
  ],
  "g_gamma": [
    "0x00be252614350cd81c2376fb52aa4a26b39618207dae27ebea3bcabdee5346ce3b7e698cf0007519af426e53f5b130c6",
    "0x013c8f7e3a45d96de9e65e5d2a66eb53b541080c29f46590eae632b79fb893b88c2098ff50ea29d8a24d38a57d30435a"
  ],
  "h_gamma": [
    [
      "0x015e816d8c66fb9c1d44585395d0b342f0a7566b594a536d361d232a3f02436f1d4050598c45356855c251ea994c889c",
      "0x00c3de9613078aaa20a9943848e6b02052eaba40acdeea600f8fbac181e40a7de7ea20b7bb22d5d06b80197bddf8ebe8"
    ],
    [
      "0x0041279d7ad6bf6d73d1383b23f92d67f6bfb8231215304b73a40e46dc830b2c531aecf4a1a6a6676f6ac0722f0d5021",
      "0x00bae1fcaf84e75b85eeae06404ad285d6daf7981de09b4db7aede3d942f29f2ee557fe7d474fd1303306942d215ff9b"
    ]
  ],
  "query": [
    [
      "0x0146b6867994425200ad974a71c05a9da4c4c619de0c7af7821ae59e6d212cb45181715b623a72f52b9a1b0940f09b8c",
      "0x0184449b5d342a36721e8010af40849864e16372c8dae35c9d398d390deb6afa82b63980a7b4a02bb8312617d8b3b8d9"
    ],
    [
      "0x015fcfc1ed765a451921b9ecfbde4a1b8b0f4651269c00a42aad5798030ceffa3574a4e2b7e991b09ed8fea14bbf31e1",
      "0x0052f7899661f3a8c677f86daad4d9cab4d33a5469b3ca30ea23f13bca5f30cfd3f92973ff630f9028527fcf22238d08"
    ],
    [
      "0x0094d81e803d3dafc34ae03bd90ba4b96a85f3b51d17992f503fea379c755c7d29e7bf0f460099ecbe0e0f70da1659d2",
      "0x01207bfac164c512e3c7a13f88f5796eb6f6df710af2b25fef3edd8fe49737d8cfbc89199554a424050557b629cd25e3"
    ],
    [
      "0x015e4a7af9808f0763bfa729084ebae201fc7b59f0935e52fd9b8ed5f09c59d2b1ebec4965ba132a3eb4cc380e4ac9cf",
      "0x004fdef9e9543b117b63465a6ddd79e966cf6c2ee4f19e653981494ae85568d64dd1699185517552792150a94194294f"
    ],
    [
      "0x00f0e1899035da69ec114168faf997af30237831dd4cc6d9489aa099411323f458e0a71a34373e0d5fb3b5d2f787e169",
      "0x01266354675cdad357df8a8f52cc8c3ad2d34031b5793d9c3e1f75877fdffc785c7476636ab5051a4818d8f56706c348"
    ],
    [
      "0x00a7147a2732db401a71f35d34ac463752b0a8728ab255063bcd38f37071015c4d25326842fcacff161f1f7666cf65db",
      "0x006becce0dedb4bf8c8cfc0c01774629eeb733667c7efb95a8d4dce9fabc68e4f63fb4ce514b5bd293b8992c58f98030"
    ],
    [
      "0x0121e062fc997790fcc53d0bd6d7cd271b74f964132ec1fe66f4b86af8a32d58735fbb4e9f54964c4bbb025ea793d254",
      "0x009dcd9c95b4b2e5eca479fa40f3084be70550b7215272d05580a76aaa3fa3b2cf88281412a6f01f529fafa0dcd6f9fb"
    ],
    [
      "0x0015c98b0f214bccf58081c31eb74727fc874c2a291579529c4879c857093240d30d9d69bb9c0f2d2055902d925f36d5",
      "0x01a28bd854128b8693ddb49a020b6b0cf2c62804b2950db78e2294ce8032403fa3f9203d5b0948d35e8762e718fb6add"
    ],
    [
      "0x018c7fd48fea66446f24b4b4499ffe980c8251cf72a526dc46b7089d2f8d6fe4f09ad4f779eee6055d5082641b575a20",
      "0x00b939ce763643f39ff20850b9fed615c57ad77785efd30229c28f056efdfa6fc56f5484739c19bb9127b85b37277091"
    ],
    [
      "0x005ba9edb2f7bd041e4372bf38db923bc2604ee0fe45979154bb3ed68d0f9788680092f895c6dc8f393440d411815336",
      "0x01265f234a5a126af491e982cd6ec4c0a2ddb53a63c6fe3a9976a59f0e74f8b4d57f28a39d81dc698750e37c54ec570a"
    ],
    [
      "0x008e8eb38ea0e9b2a5e2bd832eb921fe99a17bc473146128744998208898bb90bd742cd865a9116cc10c4e893e82d14a",
      "0x00ebb9d8a79255c2350ba3a637efd5ecc93fec9248573e61607d44f22f05a51a67a70f9105e1ab9c67f9a8d7be0cb81b"
    ],
    [
      "0x00b23514b8f45c2a1f8402b7ca7bab7074f7f7101bbb5d4fb65f168b440af8233e8041fda5c3b28fccc1a3b7de8b89c2",
      "0x01752bac75b9522c92379f5ab763100a722ce08ba90a1d7e4bbb7077bad49ec88c46b33f6bee6910721da24f3d10fd0b"
    ],
    [
      "0x008cbf9ff141318abefc0975cece493dd975a99bf9e565ecc434a696eee8b29ea94eb233665c0f60e6166d06b341c8b3",
      "0x015bb0b81330505913830c37e273fc46e42385abb400035a7462655f5e1b7e7f93c1e3c06da2209626128115eae176d4"
    ],
    [
      "0x01aa774bfc8ed97eb0aab134c7916763f9ad2e10ea96dd617acfa93f68372a165e956a66c860ff75de3913cb60c5c4da",
      "0x019433fe14c5bee215e590dbeeaf76958fb565ecdd64ba808caf87d06731106dc0242846173e9bd6e47c8dd6d1d6c915"
    ],
    [
      "0x00af99158c5d103772980e13119c95e81f90dc2369b1a6f39731c9d33a22a1194e8e6d583880708d4ce12489b674764c",
      "0x00a31e6c85db45d9547f45c3a6fc3dc8d05f95ca3a134c17a061bb7fa44cb82b234e6dac19478ac3d8d68549e52204f7"
    ],
    [
      "0x00188c2b7c60db1c16e2b3cfc08d913d8e7b3ff8b35e6bd67e2558f869e7511dbd99cde9296df77e5663aee3c1693efd",
      "0x00ee1443cabdf6f8ef7f81c454e1315caf81d96ab91d3d09ee4487334f74efa346127cc2a69eef61032e0ec952f64b43"
    ],
    [
      "0x017c367d6814135ad827896f18d752a2a0d359a8d636909c5b1a853a2350f2c5bd8ad168b6418a8bcf03271015547245",
      "0x00d1f83602747f08f161ced09952df51930137677ac9fa78abc6ddde4f9deb9854f07533cd88393c55830824acdc1d3f"
    ],
    [
      "0x0052e512d6bf1baf108bcabadd8a841858198bc7b247048eb9e1c9179f2f0a84ae24cef712bbfe8c2a89ddfffec9d260",
      "0x00b235d586f9ab287a72776c4d98b85e99d5577d19c29464102be722f8e0c80796c67f302c9936f695ec7c325fafc31c"
    ]
  ]
}

let printMulti = (a) => {
  for (let v of a){
    printPair(v)
  }
}
let printPair = (a) => {
  console.log(ethers.getBigInt(a[0]).toString() + " \\")
  console.log(ethers.getBigInt(a[1]).toString() + " \\")
}


printMulti(q["h"])
printPair(q["g_alpha"])
printMulti(q["h_beta"])
printPair(q["g_gamma"])
printMulti(q["h_gamma"])
printMulti(q["query"])

// for (let qq of q){
//   console.log(ethers.getBigInt(qq).toString() + " \\")
// }



// for (let tp of Object.values(q)) {
//   console.log(ethers.getBigInt(tp[0]).toString() + " \\")
//   console.log(ethers.getBigInt(tp[1]).toString() + " \\")
// }

// for (let tp of query) {
//   console.log(ethers.getBigInt(tp[0]).toString() + " \\")
//   console.log(ethers.getBigInt(tp[1]).toString() + " \\")
// }

