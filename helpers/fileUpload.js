// import aws-sdk library
const AWS = require('aws-sdk');

module.exports = (req, res, next, data) => {
  // initiate s3 library from AWS
const s3 = new AWS.S3({
  accessKeyId: 'AKIATVSMIVE5HJXM3W3A',
  secretAccessKey: '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'
});

console.log(req.files)
      console.log(req.body)
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: false, message: 'Please upload a file.' });
      }
      // create a new submission based on the fields in our submission model
      // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let uploadedFile = req.files.file;
      let name = uploadedFile.name;
      let filetype = req.files.file.mimetype;
      let filesize = req.files.file.size
      // let user = req.body.userFirstname;
      console.log(uploadedFile);
      console.log(uploadedFile.name);
      console.log(filetype);

      if (
        filetype !== 'image/jpeg' && filetype !== 'image/png' && // for images (png, jpg, jpeg)
        filetype !== 'text/plain' && // for texts
        filetype !== 'application/msword' && filetype !== 'application/vnd.ms-excel' && // for microsoft offices (doc and xls)
        filetype !== 'application/pdf' && // for pdfs
        filetype !== 'application/zip' // for zips

      ) {
        return res.status(400).json({ status: false, message: 'File type not allowed !' });
      }

      if (filesize > 2 * 1024 * 1024 * 1024) {
        return res.status(400).json({ status: false, message: 'File size is more than 2 MB.' });
      }


      // params for AWS S3
      const params = {
        Bucket: 'bringforthjoy', // pass your bucket name
        Key: 'home/TraineesFolder/casemanger/' + name, // file will be saved as     /TraineesFolder/assignment1.doc 
        // make sure you ensure assignment1.doc changes based on the user uploading the file. for instance, you can combine
        // username with assignment i.e. assignment1-jide.doc
        Body: uploadedFile.data
      };

      // load file inside AWS S3 bucket using the params declared
      //  note s3 uses the access and secret keys declared earlier
      s3.upload(params, function (err, data) {
        if (err) throw err
        console.log(`File uploaded successfully at ${data.Location}`)
        return data;
        // next(data);
        // push submission details to db
        // models.Submission.update({
        //   file: data.Location,
        //   url: req.body.url,
        //   note: req.body.note,
        // }).then(submission => {
        //   res.json({
        //     status: true,
        //     data: submission,
        //     message: 'Submission Updated successfully'
        //   })
        // });
      });
};
