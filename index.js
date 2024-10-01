const express = require("express");
const {connectDb} = require("./connection");
// const Curl = require("./controllers/url");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const app = express();

const PORT = 8000;

connectDb("mongodb://127.0.0.1:27017/short-url");
app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortUrl", async (req, res) => {
    const shortUrl = req.params.shortUrl;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortUrl },
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
});

// app.get("/:shortUrl", async (req, res) => {
//     const shortID = req.params.shortUrl;
//     const entry = await URL.findOneAndUpdate(
        // {
        //     shortID,
        // },
//         {
//             push: {
//                 visitHistory: {
//                     timestamp: Date.now()
//                 }
//             }
//         }    
//     );
//     res.redirect(entry.redirectUrl);
// });

app.listen(PORT, () => {console.log(`Server running on PORT:${PORT}`)});
