  // upload.js

  //https://www.npmjs.com/package/multer for more info about multer
  //Dependecies
  const multer = require("multer");
  const multerS3 = require("multer-s3");
  const { S3Client } = require("@aws-sdk/client-s3");
  require("dotenv").config({path: '../.env'});

  //creating s3 client
 
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

  //configuring the multer upload
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE, 
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  });



 module.exports = upload;

 console.log({
  region: process.env.AWS_REGION,
  bucket: process.env.S3_BUCKET_NAME,
});
