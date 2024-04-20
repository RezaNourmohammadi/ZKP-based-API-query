"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZERO_HASHES = void 0;
var poseidon_opt_1 = require("../poseidon/poseidon_opt");
var H = new Array(10);
var salt = "0xffff";
exports.ZERO_HASHES = [
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
];
var buildZeroHashes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var poseidon, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, poseidon_opt_1.default)()];
            case 1:
                poseidon = _a.sent();
                H[0] = "0x" + Buffer.from(poseidon(["0x0", salt], null, null)).toString('hex');
                for (i = 1; i < 10; i++) {
                    H[i] = "0x" + Buffer.from(poseidon([H[i - 1], H[i - 1]], null, null)).toString('hex');
                }
                console.log(H);
                return [2 /*return*/];
        }
    });
}); };
// buildZeroHashes()
