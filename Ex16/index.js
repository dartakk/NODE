const express = require('express');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();
const port = process.env.PORT

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
}).single('image');

app.use(express.json());
app.post('/planets/:id/image', (req, res) => {
    const planetId = req.params.id;

    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imagePath = req.file.path;

        pool.query(
            'UPDATE planets SET image = $2 WHERE id = $1',
            [planetId, imagePath],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Database update failed', error: error });
                }

                res.status(200).json({ message: 'Image uploaded and path updated in database', path: imagePath });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
