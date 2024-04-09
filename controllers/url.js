const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: "url is required"});

    const shortID = shortid();

    await URL.create({
        shortUrl: shortID,
        redirectUrl: body.url,
        visitHistory: [] 
    });

    return res.json({ id: shortID });
}

async function handleGetVisitUrl(req, res){    
    const shortUrl = req.params.shortUrl;
    try {
        const entry = await URL.findOneAndUpdate(
            {
                 shortUrl 
            },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            }
        );
        if (!entry) {
            // If entry is null, redirect to a default URL or send an error response
            res.status(404).send("URL not found");
            return;
        }
        res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error("Error finding URL:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleGetAnalytics(req, res){
    const shortUrl = req.params.shortUrl;
    const result = await URL.findOne({  shortUrl });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = {
    handleGenerateShortUrl,
    handleGetVisitUrl,
    handleGetAnalytics
}