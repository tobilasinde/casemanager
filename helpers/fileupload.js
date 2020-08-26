var express = require('express');
var router = express.Router();
var multer  = require('multer');
var AWS = require('aws-sdk');
module.exports = {
    fileUpload: (req, file) => {
        var storage = multer.memoryStorage({
            destination: function(req, file, callback) {
                callback(null, '');
            }
        });
        var multipleUpload = multer({ storage: storage }).array('file');
        var upload = multer({ storage: storage }).single('file');
        return multipleUpload;
    }
}

// const BUCKET_NAME = 'BUCKET_NAME';
// const IAM_USER_KEY = 'USER_KEY';
// const IAM_USER_SECRET = 'USER_SECRET_KEY';
// router.post('/upload',multipleUpload, function (req, res) {
//   const file = req.files;
// let s3bucket = new AWS.S3({
//     accessKeyId: IAM_USER_KEY,
//     secretAccessKey: IAM_USER_SECRET,
//     Bucket: 'BUCKET_NAME'
//   });
// s3bucket.createBucket(function () {
//       let Bucket_Path = 'BUCKET_PATH';
//       //Where you want to store your file
//       var ResponseData = [];
   
// file.map((item) => {
//       var params = {
//         Bucket: BucketPath,
//         Key: item.originalname,
//         Body: item.buffer,
//         ACL: 'public-read'
//   };
// s3bucket.upload(params, function (err, data) {
//         if (err) {
//          res.json({ "error": true, "Message": err});
//         }else{
//             ResponseData.push(data);
//             if(ResponseData.length == file.length){
//               res.json({ "error": false, "Message": "File Uploaded    SuceesFully", Data: ResponseData});
//             }
//           }
//        });
//      });
//    });
// });
// module.exports = router;


// const models = require('../models');
// var multer  = require('multer');
// var AWS = require('aws-sdk');

// module.exports = {
//     fileUload: async (req, res) => {
//         // The User Uploaded a file
//         // Process the file upload
//         let uploadedFile = req.files.file;
//         let name = uploadedFile.name;
//         let filetype = req.files.file.mimetype;
//         let filesize = req.files.file.size

//         // Checking for File Type
//         if (
//             filetype !== 'image/jpeg' && filetype !== 'image/png' && // for images (png, jpg, jpeg)
//             filetype !== 'text/plain' && // for texts
//             filetype !== 'application/msword' && filetype !== 'application/vnd.ms-excel' && // for microsoft offices (doc and xls)
//             filetype !== 'application/pdf' && // for pdfs
//             filetype !== 'application/zip' // for zips
//         ) {
//             return res.status(400).json({ status: false, code: 400, message: 'File type not allowed !' });
//         }
        
//         // Check the file size, it should not be greater than 2MB
//         if (filesize > 2 * 1024 * 1024 * 1024) {
//             return res.status(400).json({ status: false, code: 400, message: 'File size is more than 2 MB.' });
//         }
        
        
//         // params for AWS S3
//         const params = {
//             Bucket: 'bringforthjoy', // pass your bucket name
//             Key: 'home/TraineesFolder/casemanager/' + name, // file will be saved as     /TraineesFolder/assignment1.doc
//             Body: uploadedFile.data
//         };
//         return params;
//     }
// }