exports.generateHash = (lobbyCode) => {
    let digits = 0 
    for (let i=0;i<8;i++) {
        digits += lobbyCode.charCodeAt(i) 
    }  
    hash = digits % 500 
    return hash  
}

