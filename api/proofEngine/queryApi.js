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
exports.getWitness = exports.verifyProof = exports.genProof = exports.findDataPointForQuery = void 0;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var dotenv_1 = require("dotenv");
// import zokratesJS from "zokrates-js"
var index_js_1 = require("../lib/zokrates_js/index.js");
var proofAbi_1 = require("./proofAbi");
var fs_1 = require("fs");
var path_1 = require("path");
var merkleizeInsert_1 = require("../merkleizeInsert");
var poseidon_opt_1 = require("../lib/poseidon/poseidon_opt");
var ethers_1 = require("ethers");
var __1 = require("..");
(0, dotenv_1.config)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
var uri = "mongodb://".concat(process.env.MONGO_USER, ":").concat(process.env.MONGO_PASSWORD, "@127.0.0.1:27017");
app.get('/', function (req, res) {
    res.send('Hello world');
});
var poseidon = undefined;
var zokProvider = undefined;
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, poseidon_opt_1.default)()];
                case 1:
                    poseidon = _a.sent();
                    return [4 /*yield*/, (0, index_js_1.initialize)()];
                case 2:
                    zokProvider = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
app.post('/queryAgeGt18', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client, walletAddr, err, dataPoint, e_1, merkleArr, _a, row, root, computationResult, proof, isCorrect, merkleDataRootDetails, isMerkleSignValid;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                client = new mongodb_1.MongoClient(uri);
                walletAddr = req.body.walletAddress;
                err = undefined;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 6]);
                if (poseidon === undefined) {
                    res.status(504).send({ "error": "waitiing initialization, try again in some time" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, findDataPointForQuery(0 /* QueryFilter.GT_18 */, walletAddr)];
            case 2:
                dataPoint = _b.sent();
                return [3 /*break*/, 6];
            case 3:
                e_1 = _b.sent();
                res.status(504).send({ "error": err.toString() });
                err = e_1;
                return [2 /*return*/];
            case 4: 
            // Ensures that the client will close when you finish/error
            return [4 /*yield*/, client.close()];
            case 5:
                // Ensures that the client will close when you finish/error
                _b.sent();
                return [7 /*endfinally*/];
            case 6:
                if (err !== undefined)
                    res.status(504).send({ "error": err.toString() });
                if (!(dataPoint === undefined)) return [3 /*break*/, 7];
                res.status(200).send({ "status": "not found", "result": "", "proof": "" });
                return [3 /*break*/, 10];
            case 7:
                _a = merkleizeInsert_1.hexToBigNumStr;
                return [4 /*yield*/, (0, merkleizeInsert_1.getMerklePath)(dataPoint)];
            case 8:
                merkleArr = _a.apply(void 0, [_b.sent()]);
                row = (0, merkleizeInsert_1.hexToBigNumStr)((0, merkleizeInsert_1.hashDataPoint)(dataPoint, poseidon).row);
                root = merkleArr[18];
                computationResult = getWitness(row, merkleArr.slice(0, 18), root);
                if (computationResult === undefined) {
                    res.status(200).send({ status: "error" });
                    return [2 /*return*/];
                }
                proof = genProof(computationResult.program, computationResult.witness.witness);
                if (proof === undefined) {
                    res.status(500).send({ status: "error" });
                    return [2 /*return*/];
                }
                isCorrect = verifyProof(proof);
                if (isCorrect === undefined) {
                    res.status(500).send({ status: "error" });
                    return [2 /*return*/];
                }
                merkleDataRootDetails = undefined;
                return [4 /*yield*/, (0, __1.getDataRootDetailsFromDB)(root)];
            case 9:
                merkleDataRootDetails = _b.sent();
                isMerkleSignValid = merkleDataRootDetails.walletAddress
                    === ethers_1.ethers.verifyMessage(merkleDataRootDetails.merkleRoot, merkleDataRootDetails.signature);
                res.status(200).send({ "status": "found", "isAgeGt18": isCorrect, dataPoint: dataPoint, "proof": proof, merkleDataRootDetails: merkleDataRootDetails, isProofCorrect: isCorrect, isMerkleSignValid: isMerkleSignValid, dataRowNumerified: (0, merkleizeInsert_1.hashDataPoint)(dataPoint, poseidon).row });
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
app.post('/verifyAgeGt18', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var proof, isProofCorrect;
    return __generator(this, function (_a) {
        proof = req.body.proof;
        isProofCorrect = verifyProof(proof);
        if (isProofCorrect === undefined) {
            res.status(500).send({ status: 'error' });
        }
        else {
            res.status(200).send({ status: "okay", isProofCorrect: isProofCorrect });
        }
        return [2 /*return*/];
    });
}); });
function findDataPointForQuery(qf, query) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, err, client, res, database, dpColl, queryRes, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.MONGO_URI;
                    if (uri === undefined)
                        throw "undefined mongo uri env config";
                    err = undefined;
                    client = new mongodb_1.MongoClient(uri);
                    res = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    database = client.db('zk_db');
                    dpColl = database.collection('dataPoints');
                    return [4 /*yield*/, dpColl.findOne({ "walletAddr": query })];
                case 2:
                    queryRes = _a.sent();
                    if (queryRes !== null) {
                        res = {
                        // idHash: queryRes.idHash,
                        // nodeInfo: queryRes.nodeInfo,
                        // walletAddr: queryRes.walletAddr,
                        // personName: queryRes.personName,
                        // emailId: queryRes.emailId,
                        // personAge: queryRes.personAge
                        };
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    err = e_2;
                    return [3 /*break*/, 5];
                case 4:
                    client.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, res];
            }
        });
    });
}
exports.findDataPointForQuery = findDataPointForQuery;
function genProof(program, witness) {
    if (zokProvider === undefined)
        return undefined;
    var f = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./proving.key"), null);
    var provingKey = new Uint8Array(f.buffer);
    return zokProvider.generateProof(program, witness, provingKey);
}
exports.genProof = genProof;
function verifyProof(proof) {
    if (zokProvider === undefined)
        return undefined;
    var f = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./verification.key"), null);
    var verificationKey = JSON.parse(f.toString());
    return zokProvider.verify(verificationKey, proof);
}
exports.verifyProof = verifyProof;
function getWitness(row, merkleArr, root) {
    // const location = path.resolve(path.dirname(path.resolve(from)), to);
    if (zokProvider === undefined)
        return undefined;
    var out = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./out"), null);
    var program = new Uint8Array(out.buffer);
    var proofAbi = proofAbi_1.default;
    var input = {
        program: program,
        abi: proofAbi
    };
    var witness;
    try {
        console.log();
        witness = zokProvider.computeWitness(input, [row, merkleArr, root]);
        return { witness: witness, program: program };
    }
    catch (e) {
        console.log(e);
    }
    return undefined;
}
exports.getWitness = getWitness;
var port = process.env.PORT || 3001;
init().then(function (f) { return app.listen(port, function () { return console.log("App listening on PORT ".concat(port)); }); });
