import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import cors from "cors";
import crypto from "crypto";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Use 'import.meta.url' to get the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// enable CORS for frontend
app.use(cors());

// For any other route, serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// ensure folders exist
["uploads", "processed"].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// configure multer for uploads
const upload = multer({ dest: "uploads/" });

// sanitize filename
function sanitizeFileName(name) {
    return name.replace(/[^a-z0-9_.-]/gi, "_").toLowerCase();
}

// process route
app.post("/process", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const inputPath = path.resolve(req.file.path);
    const safeName = sanitizeFileName(req.file.originalname);
    const outputPath = path.resolve(
        `processed/${crypto.randomUUID()}_${safeName}`
    );

    // build ffmpeg args as array (safer than a long string)
 const ffmpegArgs = [
    "-i",
    inputPath,
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=11,acompressor=threshold=0.25:ratio=4:attack=20:release=250:makeup=1,afftdn=nf=-25,highpass=f=200,lowpass=f=3000,dynaudnorm=f=150:g=15,alimiter=limit=0.84",
    "-c:a",
    "libmp3lame",
    "-b:a",
    "192k",
    outputPath,
    "-y",
];

    console.log("Running ffmpeg:", ["ffmpeg", ...ffmpegArgs].join(" "));

    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    ffmpeg.stderr.on("data", (data) => {
        console.log(`[ffmpeg] ${data}`);
    });

    ffmpeg.on("close", (code) => {
        fs.unlinkSync(inputPath); // remove temp input

        if (code !== 0) {
            console.error(`FFmpeg exited with code ${code}`);
            return res.status(500).send("Processing failed");
        }

        res.download(outputPath, safeName, (err) => {
            if (err) {
                console.error("Download error:", err);
            }
            // optional: cleanup processed file after sending
            // fs.unlinkSync(outputPath);
        });
    });
});


// start server
app.listen(port, () => {
    console.log(`✅ Overtone API running at http://localhost:${port}`);
});