const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
});

//end cloudinary
module.exports.upload = (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // async function upload(req) {
    //   try {
    //     let result = await streamUpload(req);
    //     console.log(result.secure_url);
    //     req.body[req.file.fieldname] = result.secure_url;
    //     next();
    //     // Bạn có thể gửi phản hồi hoặc tiếp tục xử lý tại đây
    //     res.status(200).send(result);
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //     res.status(500).send("Error uploading file");
    //   }
    // }
    async function upload(req) {
      let result = await streamUpload(req);

      req.body[req.file.fieldname] = result.secure_url;
      next();
    }

    upload(req);
  } else {
    next();
  }
};
