export default {
  "inputs": [
    {
      "name": "proof",
      "public": true,
      "type": "struct",
      "components": {
        "name": "Proof",
        "generics": [
          17
        ],
        "members": [
          {
            "name": "proof",
            "type": "struct",
            "components": {
              "name": "ProofInner",
              "generics": [],
              "members": [
                {
                  "name": "a",
                  "type": "array",
                  "components": {
                    "size": 2,
                    "type": "field"
                  }
                },
                {
                  "name": "b",
                  "type": "array",
                  "components": {
                    "size": 2,
                    "type": "array",
                    "components": {
                      "size": 2,
                      "type": "field"
                    }
                  }
                },
                {
                  "name": "c",
                  "type": "array",
                  "components": {
                    "size": 2,
                    "type": "field"
                  }
                }
              ]
            }
          },
          {
            "name": "inputs",
            "type": "array",
            "components": {
              "size": 17,
              "type": "field"
            }
          }
        ]
      }
    },
    {
      "name": "vk",
      "public": true,
      "type": "struct",
      "components": {
        "name": "VerificationKey",
        "generics": [
          18
        ],
        "members": [
          {
            "name": "h",
            "type": "array",
            "components": {
              "size": 2,
              "type": "array",
              "components": {
                "size": 2,
                "type": "field"
              }
            }
          },
          {
            "name": "g_alpha",
            "type": "array",
            "components": {
              "size": 2,
              "type": "field"
            }
          },
          {
            "name": "h_beta",
            "type": "array",
            "components": {
              "size": 2,
              "type": "array",
              "components": {
                "size": 2,
                "type": "field"
              }
            }
          },
          {
            "name": "g_gamma",
            "type": "array",
            "components": {
              "size": 2,
              "type": "field"
            }
          },
          {
            "name": "h_gamma",
            "type": "array",
            "components": {
              "size": 2,
              "type": "array",
              "components": {
                "size": 2,
                "type": "field"
              }
            }
          },
          {
            "name": "query",
            "type": "array",
            "components": {
              "size": 18,
              "type": "array",
              "components": {
                "size": 2,
                "type": "field"
              }
            }
          }
        ]
      }
    }
  ],
  "output": {
    "type": "tuple",
    "components": {
      "elements": []
    }
  },
  "outputs": []
}