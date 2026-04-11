const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile, getFile, deleteFile } = require('../controllers/fileController');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

module.exports = router;