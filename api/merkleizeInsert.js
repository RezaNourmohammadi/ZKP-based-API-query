"use strict";
//Given a list of data points, returns the merkle root and merkle path
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBigNumStr = exports.verifyMerkleProof = exports.getMerklePath = exports.hashDataPoint = exports.getMerkleRoot = exports.insertDataPointsToDb = exports.insertTreeToDb = exports.merkleizeInsert = exports.hexlify = exports.DATA_SALT = void 0;
var ethers_1 = require("ethers");
var types_1 = require("./types");
var zeroHashes_1 = require("./lib/merkle/zeroHashes");
var mongodb_1 = require("mongodb");
exports.DATA_SALT = "0xffff";
function hexlify(v) {
    return ethers_1.ethers.hexlify(ethers_1.ethers.toUtf8Bytes(v));
}
exports.hexlify = hexlify;
/**
 * Function to create a merkle tree for a set of data points.
 * The returned tree is just a key-value store type object.
 * Zero hashes refer to hashing zero value the same way non-zero value would have been.
 * The zero hashes initially fully fill the merkle tree.
 * The tree structure only has nodes of unknown children/parents - so,
 *  no zero hash node or their parents.
 * @param dataPoints Array of data points to be inserted
 * @param poseidon Intance of Poseidon hash function
 * @returns {tree: the full merkle tree, root: root of the merkle tree}
 */
function merkleizeInsert(dataPoints, poseidon) {
    var levelNodes = 1024; //max number of data points to be supported here
    // First filling all the leaf nodes with zero hashes, since our merkle tree must be full
    var currentLevelHashes = new Array(levelNodes).fill(zeroHashes_1.ZERO_HASHES[0]);
    var tree = {};
    // iterate over all data points and create an anchor hash for each of them
    for (var i in dataPoints) {
        // start inserting from the left most
        currentLevelHashes[i] = hashDataPoint(dataPoints[i], poseidon).hash;
        tree[currentLevelHashes[i]] = {
            idHash: currentLevelHashes[i],
            parent: undefined,
            nodeType: types_1.NodeType.leaf,
            children: []
        };
        dataPoints[i].nodeInfo = tree[currentLevelHashes[i]];
        dataPoints[i].idHash = currentLevelHashes[i];
    }
    var levels = Math.ceil(Math.log2(levelNodes)); // 10 for 1024
    // Going from level 1 (second) and up. Since we already filled the leaves
    for (var justCount = 1; justCount < levels; justCount++) {
        levelNodes /= 2;
        for (var j = 0; j < levelNodes; j++) {
            // At this level the children of a node j would be located at 2j and 2j+1
            var c = Math.floor(j * 2);
            var children = [currentLevelHashes[c], currentLevelHashes[c + 1]];
            currentLevelHashes[j] = poseidon(children);
            // if this current hash hasn't come from zero hashes beneath
            if (currentLevelHashes[j] != zeroHashes_1.ZERO_HASHES[justCount]) {
                tree[currentLevelHashes[j]] = {
                    idHash: currentLevelHashes[j],
                    parent: undefined,
                    nodeType: types_1.NodeType.branch,
                    children: children
                };
            }
            // If the child doesn't have a known parent, since this is not a zero hash
            if (children[0] != zeroHashes_1.ZERO_HASHES[justCount - 1]) {
                tree[children[0]].parent = currentLevelHashes[j];
            }
            if (children[1] != zeroHashes_1.ZERO_HASHES[justCount - 1]) {
                tree[children[1]].parent = currentLevelHashes[j];
            }
        }
    }
    tree[currentLevelHashes[0]].nodeType = types_1.NodeType.root;
    return { tree: tree, root: currentLevelHashes[0] };
}
exports.merkleizeInsert = merkleizeInsert;
/**
 * Function to insert the whole tree into the database
 * @param tree The tree object
 * @returns nothing
 */
function insertTreeToDb(tree) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, err, client, dbTreeRows, database, treeColl, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.MONGO_URI;
                    if (uri === undefined)
                        throw "undefined mongo uri env config";
                    err = undefined;
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    dbTreeRows = Object.keys(tree).map(function (k) { return ({
                        idHash: k,
                        parent: tree[k].parent,
                        children: tree[k].children,
                        nodeType: tree[k].nodeType
                    }); });
                    database = client.db('test');
                    treeColl = database.collection('tree');
                    return [4 /*yield*/, treeColl.insertMany(dbTreeRows)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 5];
                case 4:
                    client.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, err];
            }
        });
    });
}
exports.insertTreeToDb = insertTreeToDb;
// Insert a set of data points to the database
function insertDataPointsToDb(dataPoints) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, err, client, database, dpColl, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.MONGO_URI;
                    if (uri === undefined)
                        throw "undefined mongo uri env config";
                    err = undefined;
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    database = client.db('test');
                    dpColl = database.collection('newDatabase');
                    return [4 /*yield*/, dpColl.insertMany(dataPoints)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    err = e_2;
                    return [3 /*break*/, 5];
                case 4:
                    client.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, err];
            }
        });
    });
}
exports.insertDataPointsToDb = insertDataPointsToDb;
// Get the current merkle root from the database - assume there is only one
function getMerkleRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var treeColl, rootNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    treeColl = getDbCollection('tree');
                    return [4 /*yield*/, treeColl.findOne({ nodeType: types_1.NodeType.root })];
                case 1:
                    rootNode = _a.sent();
                    if (rootNode !== null) {
                        return [2 /*return*/, rootNode.idHash || ""];
                    }
                    return [2 /*return*/, "null"];
            }
        });
    });
}
exports.getMerkleRoot = getMerkleRoot;
function getDbCollection(name) {
    var uri = process.env.MONGO_URI;
    if (uri === undefined)
        throw "undefined mongo uri env config";
    var err = undefined;
    var client = new mongodb_1.MongoClient(uri);
    var database = client.db('zk_db');
    return database.collection(name);
}
/**
 * Numerify an ordered set of data and return the combined hash, using a pre-defined salt
 * @param dataPoint The data point
 * @param poseidon Instance of poseidon hash function
 * @returns numerified row, poseidon hash of the whole data point
 */
function hashDataPoint(dataPoint, poseidon) {
    var a1 = [
        hexlify(dataPoint.uid + ""),
        exports.DATA_SALT,
        hexlify(dataPoint.gender),
        exports.DATA_SALT
    ];
    var a2 = [
        dataPoint.dateOfBirth + "",
        exports.DATA_SALT,
        hexlify(dataPoint.countryOfResidence),
        exports.DATA_SALT
    ];
    var a3 = [
        hexlify(dataPoint.cityOfResidence),
        exports.DATA_SALT,
        hexlify(dataPoint.employmentStatus),
        exports.DATA_SALT
    ];
    var a4 = [
        hexlify(dataPoint.maritalStatus),
        exports.DATA_SALT,
        hexlify(dataPoint.education),
        exports.DATA_SALT
    ];
    var a5 = [
        hexlify(dataPoint.employmentIndustry),
        exports.DATA_SALT,
        hexlify(dataPoint.primaryLanguage),
        exports.DATA_SALT
    ];
    var a6 = [
        hexlify(dataPoint.otherLanguage),
        exports.DATA_SALT,
        dataPoint.householdIncomeAnnual + "",
        exports.DATA_SALT
    ];
    var a7 = [
        dataPoint.accountCreationDate + "",
        exports.DATA_SALT,
        "0x0",
        "0x0"
    ];
    var a1234 = poseidon([poseidon(a1), poseidon(a2), poseidon(a3), poseidon(a4)]);
    var a567 = poseidon([poseidon(a5), poseidon(a6), poseidon(a7)]);
    return { row: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], a1, true), a2, true), a3, true), a4, true), a5, true), a6, true), a7, true), hash: poseidon([a1234, a567]) };
}
exports.hashDataPoint = hashDataPoint;
/**
 * Function to find the full merkle tree path from the data point to the root of the merkle tree
 * @param dataPoint The data point as obtained from DB
 * @returns An array containing the sequence of nodes from current sibling to the root
 */
function getMerklePath(dataPoint) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var treeColl, parent, merkleArr, i, parentNode;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    treeColl = getDbCollection('tree');
                    parent = (_a = dataPoint.nodeInfo) === null || _a === void 0 ? void 0 : _a.parent;
                    if (parent === undefined)
                        return [2 /*return*/, []];
                    merkleArr = [];
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    return [4 /*yield*/, treeColl.findOne({ idHash: parent })];
                case 2:
                    parentNode = _d.sent();
                    merkleArr.push.apply(merkleArr, parentNode.children);
                    if (parentNode.nodeType === types_1.NodeType.root)
                        return [3 /*break*/, 4];
                    parent = parentNode.parent;
                    if (parent === undefined || parent === null)
                        return [3 /*break*/, 4];
                    _d.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    merkleArr.push(parent || ""); //push the root
                    // swap with the sibling to make sure the first element is itself
                    if (((_b = dataPoint.nodeInfo) === null || _b === void 0 ? void 0 : _b.idHash) !== merkleArr[0]) {
                        _c = [merkleArr[1], merkleArr[0]], merkleArr[0] = _c[0], merkleArr[1] = _c[1];
                    }
                    return [2 /*return*/, merkleArr];
            }
        });
    });
}
exports.getMerklePath = getMerklePath;
// export function hashToHex(arr: ArrayBuffer): string{
//     return "0x" + Buffer.from(arr).toString('hex')
// }
// Function to verfy a given merkle path sequence array, given a root and an
// instance of poseidon function
function verifyMerkleProof(merkleArr, root, poseidon) {
    var i = 0;
    if (merkleArr[merkleArr.length - 1] !== root)
        return false;
    while (i < merkleArr.length - 2) {
        if (poseidon([merkleArr[i], merkleArr[i + 1]]) !== merkleArr[i + 2])
            return false;
        i += 2;
    }
    return true;
}
exports.verifyMerkleProof = verifyMerkleProof;
// Function to convert an array of strings to base-10 integer values, to be used with zokrates ecosystem
// It assumes hex numbers have a "0x" prefix
function hexToBigNumStr(args) {
    var ret = [];
    args.forEach(function (e) {
        if (e.startsWith("0x")) {
            ret.push(BigInt(e).toString());
        }
        else {
            ret.push(e + "");
        }
    });
    return ret;
}
exports.hexToBigNumStr = hexToBigNumStr;
