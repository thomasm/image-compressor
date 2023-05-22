import AWS from "aws-sdk";
import { config } from "./config";

AWS.config.update({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
});

const s3 = new AWS.S3();

export async function saveImageToBucket(fileBuffer, contentType, originalFileName) {
  const fileName = `peil/tinify/thumb-${originalFileName}`;

  const params = {
    Bucket: config.s3BucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}