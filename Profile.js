const datas = require("./Schemas/Profile");
const file = require("./Multer/uploadimg");
const fs = require("fs");
const cloudinary = require("./Multer/cloudinary");
const auth = require("./middleware/auth");



module.exports = function (router) {
  router.post("/sendprofile", async (req, res) => {
    // console.log(req.params)
    try {
      // let userdatas = req.body
      // console.log(userdatas)
      // console.log(req.body.Username)
      let data = await datas.findOne({ Username: req.body.Username });
      res.status(200).json(data);
      // console.log(data)
    } catch (error) {
      res.status(500).json(error);

    }
  });

  router.post("/Profileget", file.single("image_file"), async (req, res) => {
    try {
      // if (
      //   //  " req.file == null ||
      //     req.body.Username == "fsefsef"
      //   //   req.body.name == null ||
      //   //   req.body.email == null ||
      //   //   req.body.mobile == null ||
      //   //   req.body.rollno == null"

      //   ) {
      //     res.send("Submit all the inputs!",403);
      //     console.log("Submit all the inputs!");
      //     try {
      //       fs.unlinkSync(`${__dirname}/assets/imgs/${req.file.filename}`);
      //     } catch (error) {}
      //   } else {
      // let a = req.file.filename;
      // req.body.image_file = a;
      let data = await datas(req.body);
      // const upload = await cloudinary.v2.uploader.upload(req.file.path);
      // req.body.url=upload.secure_url
      let result = await data.save();
      // console.log(result);
      // console.log(req.file.filename);
      // res.json({
      //   success: true,
      //   file: upload.secure_url,
      // });
      res.status(200).json("Done")
      // }
    } catch (error) {
      res.status(403).json("something went wrong")
      console.log(error);
    }
  });

  router.delete("/Profiledelete/:_id", async (req, res) => {
    let img = await datas.findOne(req.params);

    // console.log(img.image_file)
    let delimg = img.image_file;
    try {
      fs.unlinkSync(`${__dirname}/assets/imgs/` + delimg);
    } catch (error) { }
    let data = await datas.deleteOne(req.params);
    if (data.deletedCount == 0) {
      console.log("Data not found!");
      res.send("Data not found!")
    } else {
      res.send(data);
    }
  });

  router.put("/Profileupdate/:_id", file.single("image_file"), async (req, res) => {
    try {
  
      let img = await datas.findById(req.params);
      console.log(req.params);
      console.log(img);
      if (img == null) {
        console.log("UserProfile not found");
        res.status(404).json("UserProfile not found");
      } else {
//         if (upimg == null) {
//           res.status(404).json("profile not found");
//           console.log("profile not found")
//           try {
//             fs.unlinkSync(req.file.path)
// } catch (error) {
	
// }
//         }
//         else {
//           let delimg = img.image_file;
//           try {
//             fs.unlinkSync(`${__dirname}/assets/imgs/` + delimg);
//           } catch (error) { }
//         }
        try {
          let upimg = req.file.filename
          req.body.image_file = upimg;
        } catch (error) {
          console.log("NoProfile")
        }
        console.log(req.params);
        console.log(req.body);
        try {
	const upload = await cloudinary.v2.uploader.upload(req.file.path);
	        req.body.url=upload.secure_url
} catch (error) {

}
        let data = await datas.updateOne(req.params, { $set: req.body });
        // console.log(data);
        if (data.modifiedCount == 1) {
          console.log("Profile and details updated!");
          res.status(200).json("Profile and details updated!");
        }
      }
    } catch (error) {
      res.status(404).json("something went wrong");
      console.log(error);

    }
  });
 

  return router;
}



//code for only img name
// app.get("/find/:_id", async (req, res) => {
// let data = await datas.findOne( {},{_id:req.params,image_file:1});
//   res.send(data.image_file);
// });
