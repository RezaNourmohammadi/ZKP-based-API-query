"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = void 0;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["leaf"] = 0] = "leaf";
    NodeType[NodeType["branch"] = 1] = "branch";
    NodeType[NodeType["root"] = 2] = "root";
})(NodeType || (exports.NodeType = NodeType = {}));
