"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getDataRootDetailsFromDB = void 0;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var dotenv_1 = require("dotenv");
var merkleizeInsert_1 = require("./merkleizeInsert");
var poseidon_opt_1 = require("./lib/poseidon/poseidon_opt");
var ethers_1 = require("ethers");
(0, dotenv_1.config)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
var uri = "mongodb://".concat(process.env.MONGO_USER, ":").concat(process.env.MONGO_PASSWORD, "@127.0.0.1:27017");
app.get('/', function (req, res) {
    res.send('Hello world');
});
var poseidon = undefined;
(0, poseidon_opt_1.default)().then(function (f) { return poseidon = f; });
app.post('/insert', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client, dataPointsFromReq, err, tree, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(uri);
                client = new mongodb_1.MongoClient(uri);
                dataPointsFromReq = req.body;
                err = undefined;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, 6, 8]);
                if (poseidon === undefined) {
                    res.status(504).send({ "error": "waitiing initialization, try again in some time" });
                    return [2 /*return*/];
                }
                tree = (0, merkleizeInsert_1.merkleizeInsert)(dataPointsFromReq, poseidon);
                return [4 /*yield*/, (0, merkleizeInsert_1.insertTreeToDb)(tree.tree)];
            case 2:
                err = _a.sent();
                if (!(err === undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, merkleizeInsert_1.insertDataPointsToDb)(dataPointsFromReq)];
            case 3:
                err = _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 8];
            case 5:
                e_1 = _a.sent();
                res.status(504).send({ "error": err.toString() });
                err = e_1;
                return [2 /*return*/];
            case 6: 
            // Ensures that the client will close when you finish/error
            return [4 /*yield*/, client.close()];
            case 7:
                // Ensures that the client will close when you finish/error
                _a.sent();
                return [7 /*endfinally*/];
            case 8:
                if (err === undefined) {
                    res.status(200).send({ "status": "okay", merkleRoot: tree.root });
                }
                else
                    res.status(504).send({ "error": err.toString() });
                return [2 /*return*/];
        }
    });
}); });
app.get('/dataPoints', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var database, dataPointsCollection, query, dataPoints;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 4]);
                        database = client.db('test');
                        dataPointsCollection = database.collection('newDatabase');
                        query = {};
                        return [4 /*yield*/, dataPointsCollection.find({}).toArray()
                            // test
                        ];
                    case 1:
                        dataPoints = _a.sent();
                        // test
                        console.log("test: reading datapoints");
                        console.log(dataPoints);
                        //
                        res.status(200).send(dataPoints);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('test: reading request');
                console.log(req);
                console.log("test: reading req.body");
                console.log(req.body);
                console.log("test: reading req.params");
                console.log(req.params);
                client = new mongodb_1.MongoClient(uri);
                return [4 /*yield*/, run()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get('/tree', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var database, treeColl, query, fullTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 4]);
                        database = client.db('test');
                        treeColl = database.collection('tree');
                        query = {};
                        return [4 /*yield*/, treeColl.find({}).toArray()];
                    case 1:
                        fullTree = _a.sent();
                        res.status(200).send(fullTree);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new mongodb_1.MongoClient(uri);
                return [4 /*yield*/, run()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.delete('/deleteDataPoints', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var database, dataPointsCollection, treeColl, hColl, dr, tr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 4, 6]);
                        database = client.db('test');
                        dataPointsCollection = database.collection('newDatabase');
                        treeColl = database.collection('tree');
                        hColl = database.collection('handshake');
                        return [4 /*yield*/, dataPointsCollection.deleteMany()];
                    case 1:
                        dr = _a.sent();
                        return [4 /*yield*/, treeColl.deleteMany()];
                    case 2:
                        tr = _a.sent();
                        return [4 /*yield*/, hColl.deleteMany()];
                    case 3:
                        _a.sent();
                        res.status(200).send({ "result": { "deleteCount": dr.deletedCount, "acknowledged": dr.acknowledged } });
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, client.close()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new mongodb_1.MongoClient(uri);
                return [4 /*yield*/, run()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/signDataRoot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client, merkleRoot, database, hColl, existing, signature, address, signer, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new mongodb_1.MongoClient(uri);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 8, 10]);
                merkleRoot = req.body.merkleRoot;
                if (merkleRoot === undefined) {
                    throw "malformed request";
                }
                database = client.db('test');
                hColl = database.collection('handshake');
                return [4 /*yield*/, hColl.findOne({ merkleRoot: merkleRoot })];
            case 2:
                existing = _a.sent();
                if (existing !== null) {
                    if (existing.signature)
                        throw "already exists";
                }
                signature = req.body.signature;
                address = req.body.walletAddress;
                signer = ethers_1.ethers.verifyMessage(merkleRoot, signature);
                if (signer !== address) {
                    throw "signature mismatch";
                }
                if (!(existing !== null)) return [3 /*break*/, 4];
                return [4 /*yield*/, hColl.updateOne({ merkleRoot: merkleRoot }, { signature: signature, walletAddress: address })];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, hColl.insertOne({ merkleRoot: merkleRoot, signature: signature, walletAddress: address, timestamp: new Date().getTime() })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.status(200).send({ status: "okay", message: "successfully signed data root ".concat(merkleRoot) });
                return [3 /*break*/, 10];
            case 7:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).send({ status: "error", message: err_1 });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, client.close()];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
app.post('/simpleSigner', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, wallet, messageToSign, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                key = req.body.key;
                if (key === undefined || key === null || key.length === 0) {
                    wallet = ethers_1.ethers.Wallet.createRandom();
                }
                else {
                    wallet = new ethers_1.ethers.Wallet(key);
                }
                messageToSign = req.body.messageToSign;
                if (messageToSign === undefined)
                    res.status(500).send({ status: "error" });
                _b = (_a = res.status(200)).send;
                _c = {
                    messageToSign: messageToSign
                };
                return [4 /*yield*/, wallet.signMessage(messageToSign)];
            case 1:
                _c.signature = _d.sent();
                return [4 /*yield*/, wallet.getAddress()];
            case 2:
                _b.apply(_a, [(_c.address = _d.sent(),
                        _c.privateKey = wallet.privateKey,
                        _c)]);
                return [2 /*return*/];
        }
    });
}); });
app.post('/getDataRootDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var merkleRoot, record, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                merkleRoot = req.body.merkleRoot;
                if (merkleRoot === undefined) {
                    throw "malformed request";
                }
                return [4 /*yield*/, getDataRootDetailsFromDB(merkleRoot)];
            case 1:
                record = _a.sent();
                if (record === undefined) {
                    res.status(200).send({ status: "not found" });
                }
                else {
                    res.status(200).send(__assign({ status: "found" }, record));
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(500).send({ status: "error", message: err_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
function getDataRootDetailsFromDB(merkleRoot) {
    return __awaiter(this, void 0, void 0, function () {
        var client, database, hColl, existing, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 6]);
                    database = client.db('zk_db');
                    hColl = database.collection('handshake');
                    return [4 /*yield*/, hColl.findOne({ merkleRoot: merkleRoot })];
                case 2:
                    existing = _a.sent();
                    if (existing === null) {
                        return [2 /*return*/, undefined];
                    }
                    else {
                        return [2 /*return*/, existing];
                    }
                    return [3 /*break*/, 6];
                case 3:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, client.close()];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getDataRootDetailsFromDB = getDataRootDetailsFromDB;
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("App listening on PORT ".concat(port)); });
