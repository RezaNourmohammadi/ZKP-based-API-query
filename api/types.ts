
export enum NodeType{
    leaf, branch, root
}

export interface TreeNode{
    idHash: string | undefined
    nodeType: NodeType
    parent: string | undefined
    children: string[]
}

export interface DataPoint {
    idHash: string | undefined
    nodeInfo: TreeNode | undefined

    // The data fields
    uid: string | undefined
    gender: string
    dateOfBirth: number
    countryOfResidence: string
    cityOfResidence: string
    employmentStatus: string
    maritalStatus: string
    education: string
    employmentIndustry: string
    primaryLanguage: string
    otherLanguage: string
    householdIncomeAnnual: number
    accountCreationDate: number
}