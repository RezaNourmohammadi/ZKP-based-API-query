
// 0 for string, 1 for number

let dataSchema = [
    [0, 32],
    [0, 32],
    [0, 32],
    [1, 32]
]

let numRows = 10
let rows = []
for (let i = 0; i < numRows; i++) {
    let row = []
    for (let j = 0; j < dataSchema.length; j++) {
        switch (dataSchema[j][0]) {
            case 0:

                break
            case 1:
                break

        }
    }
}

let generateUserData = (numRows = 128, startingUid = 1000) => {
    /*
    SAMPLE DATA POINT
    {
        "id": null,
        "nodeInfo": null,
        "uid": "879382983975836",
        "gender": "Male",
        "dateOfBirth": 20010819,
        "countryOfResidence": "US",
        "cityOfResidence": "Chicago",
        "employmentStatus": "Employed",
        "maritalStatus": "Single",
        "education": "MBA",
        "employmentIndustry": "Banking",
        "primaryLanguage": "EN",
        "otherLanguage": "VN",
        "householdIncomeAnnual": 100000,
        "accountCreationDate": 20230926
    }
    */
    let randVal = (max) => Math.floor(Math.random() * max)
    let randElement = (...arr) => {
        return arr[randVal(arr.length)]
    }
    let randDate = (minYear = 1950, noOfYears=70) => {
        return (minYear + randVal(noOfYears)) * 10000 + (1 + randVal(12)) * 100 + (1 + randVal(31))
    }

    let rows = []
    for (let i = 0; i < numRows; i++) {
        rows.push(
            {
                "id": null,
                "nodeInfo": null,
                "uid": startingUid + i + "",
                "gender": randElement("Male", "Female", "Transgender", "Others"),
                "dateOfBirth": randDate(),
                "countryOfResidence": randElement("US", "IN", "SG", "UK", "UAE", "AU", "FR", "CA", "HK"),
                "cityOfResidence": randElement("Chicago", "Mumbai", "Singapore", "London", "Dubial", "Brisbane", "Paris", "Toronto", "Hong Kong"),
                "employmentStatus": randElement("Employed", "Unepmloyed", "SelfEmployed"),
                "maritalStatus": randElement("Single", "Married"),
                "education": randElement("MBA", "MA", "MS", "BS", "BE", "ME", "PHD", "Others"),
                "employmentIndustry": randElement("Banking", "Finance", "IT", "Manufacturing", "Others"),
                "primaryLanguage": randElement("EN", "JP", "FR", "DE", "ES"),
                "otherLanguage": "VN",
                "householdIncomeAnnual": 20000 + randVal(10000000),
                "accountCreationDate": randDate(2022,2)
            }
        )
    }
    console.log(JSON.stringify(rows, null, 2))
}

generateUserData(128)