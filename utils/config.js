const getEnvironmentVariable = (environmentVariable) => {
    const unvalidatedEnvironmentVariable = process.env[environmentVariable];
    if (!unvalidatedEnvironmentVariable) {
      throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
    } else {
      return unvalidatedEnvironmentVariable;
    }
  };
  
  export const config = {
    apiKey: getEnvironmentVariable("TINYPNG_API_KEY"),
    awsAccessKeyId: getEnvironmentVariable("AWS_ACCESS_KEY_ID"),
    awsSecretAccessKey: getEnvironmentVariable("AWS_SECRET_ACCESS_KEY"),
    awsRegion: getEnvironmentVariable("AWS_REGION"),
    s3BucketName: getEnvironmentVariable("S3_BUCKET_NAME"),
    authKey: getEnvironmentVariable("PASSWORD_HASH"),
  };
  