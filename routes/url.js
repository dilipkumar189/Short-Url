const express = require("express");
const { handleGenerateShortUrl, handleGetAnalytics, handleGetVisitUrl } = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateShortUrl);
router.get("/:shortUrl", handleGetVisitUrl);
router.get("/analytics/:shortUrl",handleGetAnalytics);

module.exports = router;