import { config as appConfig } from '../../utils/config';
import { fileTypeFromBuffer } from 'file-type';
import tinify from 'tinify';
import { saveImageToBucket } from '../../utils/storage';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default async function uploadRouteHandler(req, res) {
  if (req.method === 'POST') {
    try {
        const file = await getFileFromRequest(req);

      if (!file) {
        res.status(400).json({ message: 'No file provided.' });
        return;
      }
      const contentType = file.mimetype;
  
      if (!contentType || !(contentType === 'image/jpeg' || contentType === 'image/png')) {
        console.log('Received content type:', contentType);
        res.status(415).json({ message: 'File type is not supported. Please upload a JPEG or PNG image.' });
        return;
      }
  
      const binaryImg = Buffer.from(file.buffer);
      const detectedFileType = await fileTypeFromBuffer(binaryImg);
  
      if (!detectedFileType || !(detectedFileType.mime === contentType)) {
        console.log('Error: Mismatch between ContentType and detected file MIME type');
        res.status(415).json({ message: 'File type is not supported. Please upload a JPEG or PNG image.' });
        return;
      }
  
      tinify.key = appConfig.apiKey;
  
      const source = tinify.fromBuffer(binaryImg);
      const resized = source.resize({ method: 'scale', height: 1000 });
      const compressedData = await resized.toBuffer();
  
      const publicUrl = await saveImageToBucket(compressedData, contentType);
  
      res.status(200).json({ url: publicUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getFileFromRequest(req) {
    return new Promise((resolve) => {
      let chunks = [];
      req
        .on('data', (chunk) => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const buffer = Buffer.concat(chunks);
          const mimetype = req.headers['content-type'];
          if (buffer.length === 0) {
            resolve(null);
          } else {
            resolve({ buffer, mimetype });
          }
        });
    });
  }
  
  
  
