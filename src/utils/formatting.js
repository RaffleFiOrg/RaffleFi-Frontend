// Convert to Date
export const unixToDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date 
} 
  
// Check if a date is in the future 
export const getRaffleDate = (toCheckDate, toCheckHours) => {
    const date = new Date();
    const currentTimeInSeconds = Math.floor(date.getTime() / 1000) // program time 
    const endDateInSeconds = Math.floor(new Date(toCheckDate).getTime() / 1000) // user input 
    const endTimeInSeconds = toCheckHours.split(":") 
    const endSeconds = ((endTimeInSeconds[0] * 60) * 60) + (endTimeInSeconds[1] * 60)
        
    if ((endDateInSeconds + endSeconds) - currentTimeInSeconds < 0) {
        return {
            success: false,
            date: ""
        };
    } else {
        return {
            success: true,
            date: (endDateInSeconds + endSeconds) - currentTimeInSeconds
        }
    }
}

export const getEllipsisTxt = (str, n = 6) => {
    if (str) {
        return `${str.slice(0, n)}...${str.slice(str.length - n)}`
    }
    return ""
};

export const filterRafflesByName = (data) => {
    const sorted = data.reduce((group, item) => {
        const title = item.assetContractName ?
            item.assetContractName :
            item.symbol ?
            item.symbol :
            item.assetContract
        group[title] = group[title] ?? []
        group[title].push(item)
        return group        
    }, {})

    return sorted 
}