const datas = require("./Schemas/Contect");
const multer = require("multer")();

module.exports = function (router) {
  router.get("/contacts", async (req, res) => {
    // setTimeout(async() => {
	try {
	      const data = await datas.find();
	      res.status(200).json(data);
	    } catch (error) {
	      console.log(error);
	      res.status(500).send("Something went wrong");
	    }
// }, 5000);
  });

  router.post("/receivecontact", multer.any(), async (req, res) => {
    try {
      const data = await datas(req.body);
	//  console.log(data)
      const result = await data.save();
      res.status(200).json({message:"Your info. successfully sent",data:result,success:true});
      console.log(result);
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).json({message:errors,success:false});
      }
      console.log(error);
      res.status(500).json({message:"Something went wrong",success:false});
    }
  });

router.put("/updatecontact/:_id",multer.any(),async(req,res)=>{
try {
  console.log(req.params)
	let update = await datas.updateOne(req.params,{$set:req.body})
	if(!update){
	  res.status(404).json("Contect not found!")
	}
	else{
    console.log(update)
		res.status(200).json({message:"Updated! ( ͡▀̿ ̿ ͜ʖ ͡▀̿ ̿ )",success:true});
	}
} catch (error) {
  console.log(error)
  res.status(500).json({message:"Something went wrong",success:false});
}
})

router.delete("/ContactDelete/:_id",multer.any(),async(req,res)=>{
    try {
	console.log(req.params)
	    let delcontact= await datas.findByIdAndDelete(req.params)
	    res.status(200).json({message:"Deleted! ( ͡▀̿ ̿ ͜ʖ ͡▀̿ ̿ )",data:update,success:true});
	    console.log(delcontact);
    } catch (error) {
  console.log(error);
	  res.status(500).json({message:"Something went wrong",success:false});
}
})

	router.get("/ip",multer.any(),async(req,res)=>{
	try {
		let mac=await macaddress.one();
		const ipAddress =  await IP.address();
	let payload=await	satelize.satelize({ip:ipAddress},function(err,payload){
			// if used with expressjs
			res.json({ipAddress,mac,payload})
		// res.send(payload);
		// res.json...
	});
 
} catch (error) {
	console.log(error);
	res.json(error)
}
})




  return router;
};
