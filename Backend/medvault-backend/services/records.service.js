// backend/services/records.service.js
const s3 = require('../config/s3');

async function uploadRecord(userId, fileBuffer, fileName, mimeType) {
  const key = `${userId}/${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'private',
    //ServerSideEncryption: 'AES256'  optional: uses SSE-S3 (you can remove if bucket default encryption is used)
  };

  const result = await s3.upload(params).promise(); // handles multipart for big files
  return { Location: result.Location, Key: key };
}

async function getRecord(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  const data = await s3.getObject(params).promise();
  return { body: data.Body, contentType: data.ContentType, metadata: data.Metadata };
}

module.exports = { uploadRecord, getRecord };
