// POST /api/chat/upload → upload fichier → retourne l'URL S3
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }
    // Déterminer le type
    const mime = req.file.mimetype;
    let fileType = 'file';
    if (mime.startsWith('image/')) fileType = 'image';
    else if (mime.startsWith('audio/')) fileType = 'audio';
    else if (mime === 'application/pdf') fileType = 'pdf';
    else if (mime.startsWith('video/')) fileType = 'video';

    res.json({
      fileUrl: req.file.location, // URL S3 publique
      fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadFile };