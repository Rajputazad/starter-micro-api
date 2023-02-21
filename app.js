const datas = require("./Schemas/chat");
const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer")()

module.exports = function (router) {


  

  router.get("/chats",async (req, res) => {
    try {
 var users= await datas.find()
      // console.log(users)
      res.json({ success: true, data:users});
    } catch (error) {
      res.json({ success: false, message: "something went wrong" });
      console.log(error);
    }
  });


  router.post("/Send", multer.any(), async (req, res) => {
    try {
        userdata={
            Username:req.body.Username,
            Chat:req.body.Chat
        }
        console.log(userdata);
        let data = await datas(userdata);
        let result = await data.save();
        res.json({ success: true, message: "msg Successfully uploaded",data:result });
        // console.log(data)
    } catch (error) {
        res.json({ success: false, message: "something went wrong" });

    }
  });

  router.delete("/delete", multer.any(), async (req, res) => {
    try {
        
        let data = await datas.deleteMany();
       
        res.json({ success: true, message: "msg Successfully deleted",data:data });
        // console.log(data)
    } catch (error) {
        res.json({ success: false, message: "something went wrong" });
console.log(error);
    }
  });

 
  return router;
};

//code for only img name
// app.get("/find/:_id", async (req, res) => {
// let data = await datas.findOne( {},{_id:req.params,image_file:1});
//   res.send(data.image_file);
// });
