export default {
  "inputs": [
    {
      "name": "row",
      "public": false,
      "type": "array",
      "components": {
        "size": 128,
        "type": "array",
        "components": {
          "size": 28,
          "type": "field"
        }
      }
    },
    {
      "name": "cmpVal",
      "public": true,
      "type": "array",
      "components": {
        "size": 5,
        "type": "field"
      }
    },
    {
      "name": "queryFieldIndex",
      "public": true,
      "type": "array",
      "components": {
        "size": 5,
        "type": "u32"
      }
    },
    {
      "name": "queryOp",
      "public": true,
      "type": "array",
      "components": {
        "size": 5,
        "type": "u32"
      }
    }
  ],
  "output": {
    "type": "tuple",
    "components": {
      "elements": [
        {
          "type": "u32"
        },
        {
          "type": "field"
        }
      ]
    }
  },
  "outputs": []
}