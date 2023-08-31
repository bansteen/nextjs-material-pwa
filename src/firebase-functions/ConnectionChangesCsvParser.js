// firebase-functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as iconv from 'iconv-lite';
import * as express from 'express';

admin.initializeApp();

const app = express();

app.get('/parse-csv', async (req, res) => {
  const directoryPath = 'csv/eventConnections';

  try {
    const jsonDataArray = [];

    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({ prefix: directoryPath });

    for (const file of files) {
      const [fileContent] = await file.download();

      const jsonData = [];
      iconv.decodeStream('Shift_JIS')
        .end(fileContent)
        .pipe(csvParser())
        .on('data', (row) => {
          jsonData.push(row);
        })
        .on('end', () => {
          jsonDataArray.push({
            fileName: file.name,
            data: jsonData,
          });

          if (jsonDataArray.length === files.length) {
            res.json(jsonDataArray);
          }
        });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error parsing CSV' });
  }
});

export const api = functions.https.onRequest(app);
