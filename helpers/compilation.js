exports.execute = async (code) => {
    // We make a HTTP request to the engine 
    // It will execute the code that is passed in as a parameter
    const req = await fetch("http:localhost:2000/api/v2/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            language: "python",
            version: "*",
            files: [
                {
                    name: `main.py`,
                    content: code
                }
            ]
        })
    })
    const res = req.json()
    return res
}

