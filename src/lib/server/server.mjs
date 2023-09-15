import express from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;
const projectId = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const bigquery = new BigQuery({
  projectId,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.get('/data', async (req, res) => {
  try {
    const query = 'SELECT * FROM bigquery-public-data.america_health_rankings';
    const options = {
      query: query,
      // Add other options as needed.
    };

    const [rows] = await bigquery.query(options);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
