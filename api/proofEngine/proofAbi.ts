

export default {
  "inputs": [
    {
      "name": "row",
      "public": false,
      "type": "array",
      "components": {
        "size": 8,
        "type": "field"
      }
    },
    {
      "name": "merkleArr",
      "public": false,
      "type": "array",
      "components": {
        "size": 18,
        "type": "field"
      }
    },
    {
      "name": "root",
      "public": true,
      "type": "field"
    }
  ],
  "outputs": [],
  "output": {
    "type": "tuple",
    "components": {
      "elements": []
    }
  }
}