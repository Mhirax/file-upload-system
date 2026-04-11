const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

let gfs;

const initGFS = (connection) => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, { // ✅ connection.db
    bucketName: 'uploads'
  });
  console.log('✅ GridFS initialized');
};

/* ---------------- UPLOAD ---------------- */
const uploadFile = async (req, res) => {
  try {
    if (!gfs) return res.status(500).json({ error: "GridFS not initialized" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filename =
      crypto.randomBytes(16).toString('hex') +
      path.extname(req.file.originalname);

    const uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { originalName: req.file.originalname }
    });

    // ✅ error handler BEFORE .end()
    uploadStream.on('error', (err) => {
      console.error('❌ Upload stream error:', err);
      return res.status(500).json({ error: 'Upload stream failed' });
    });

    uploadStream.on('finish', () => {
      console.log('✅ File uploaded:', filename);
      return res.json({
        fileId: uploadStream.id,
        filename: req.file.originalname
      });
    });

    uploadStream.end(req.file.buffer); // ✅ .end() AFTER listeners

  } catch (err) {
    console.error('❌ uploadFile error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- GET ---------------- */
const getFile = async (req, res) => {
  try {
    if (!gfs) return res.status(500).json({ error: "GridFS not initialized" });

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // ✅ fetch metadata first to set Content-Type
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).json({ error: "File not found" });

    res.set('Content-Type', files[0].contentType);
    res.set('Content-Disposition', `inline; filename="${files[0].metadata?.originalName || files[0].filename}"`);

    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.on('error', (err) => {
      console.error('❌ Download stream error:', err);
      return res.status(500).json({ error: 'Download failed' });
    });

    downloadStream.pipe(res);

  } catch (err) {
    console.error('❌ getFile error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- DELETE ---------------- */
const deleteFile = async (req, res) => {
  try {
    if (!gfs) return res.status(500).json({ error: "GridFS not initialized" });

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // ✅ check existence before deleting
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).json({ error: "File not found" });

    await gfs.delete(fileId);
    console.log('✅ File deleted:', req.params.id);
    res.json({ message: "File deleted successfully" });

  } catch (err) {
    console.error('❌ deleteFile error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { initGFS, uploadFile, getFile, deleteFile };