/**
 * This module assumes that these functions will be used within an AWS Lambda context and the permissions required
 * to access S3 buckets are provided through the Lambda execution IAM policy
 */

import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { createBaseDirs } from './fs-util';

const s3 = new AWS.S3();

async function listBucketObjects(bucketName, prefix) {
  const s3Params = {
    Bucket: bucketName,
    Prefix: prefix
  };

  return await s3.listObjectsV2(s3Params).promise();
}

async function downloadFileFromBucket(bucketNAme, key, destDir) {
  const s3Params = {
    Bucket: bucketNAme,
    Key: key
  };

  const destPath = `${destDir}/${key}`;
  
  return new Promise((resolve, reject) => {
    createBaseDirs(destPath);
    const outFileStream = fs.createWriteStream(destPath);
    const s3ReadStream = s3.getObject(s3Params).createReadStream();

    s3ReadStream.on('error', reject);
    outFileStream.on('error', reject);
    outFileStream.on('close', () => { resolve(destPath) });

    s3ReadStream.pipe(outFileStream);
  });
}

async function downloadDirFromBucket(bucketName, prefix, destDir) {
  const copiedFiles = [];

  const s3Contents = (await listBucketObjects(bucketName, prefix)).Contents;
  for (let i = 0; i< s3Contents.length; ++i) {
    const key = s3Contents[i].Key;
    copiedFiles.push(await downloadFileFromBucket(bucketName, key, destDir));
  }

  return copiedFiles;
}

async function uploadDirToBucket(bucketName, srcDirPath, prefix = null, excludes = []) {
  let targetDirs = fs.readdirSync(srcDirPath);

  // forEach is hard to use with await, hence a normal loop
  for (let i = 0; i < targetDirs.length; ++i) {
    const name = targetDirs[i];
    let shouldExclude = false;

    // Exclude files and directories if necessary; same reason as above for not using forEach
    for (let e = 0; e < excludes.length; ++e) {
      const exclude = excludes[e];

      if (exclude instanceof RegExp) {
        if (exclude.test(name)) {
          shouldExclude = true;
        }
      }
      else if (typeof exclude === 'string' || exclude instanceof String) {
        if (exclude === name) {
          shouldExclude = true;
        }
      }
    }

    if (!shouldExclude) {
      const filePath = path.join(srcDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        await uploadFileToBucket(bucketName, filePath, prefix);
      }
      else if (stat.isDirectory()) {
        await uploadDirToBucket(bucketName, filePath, prefix ? `${prefix}/${name}` : name, excludes);
      }
    }
  }
}

async function uploadFileToBucket(bucketName, srcFilePath, prefix) {
  let s3RelativePath = path.basename(srcFilePath);
  if (prefix) {
    s3RelativePath = `${prefix}/${s3RelativePath}`;
  }

  const s3Params = {
    Bucket: bucketName,
    Key: s3RelativePath,
    Body: fs.readFileSync(srcFilePath)
  };

  return await s3.putObject(s3Params).promise();
}

export default {
  listBucketObjects,
  downloadFileFromBucket,
  downloadDirFromBucket,
  uploadDirToBucket,
  uploadFileToBucket
};