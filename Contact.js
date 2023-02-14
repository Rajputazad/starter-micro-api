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
      const result = await data.save();
      res.status(200).json(result);
      console.log(result);
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).send(errors);
      }
      console.log(error);
      res.status(500).send("Something went wrong");
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
	  res.status(200).json("Updated! ( ͡▀̿ ̿ ͜ʖ ͡▀̿ ̿ )")
	}
} catch (error) {
  console.log(error)
  res.status(500).json("Something went wrong!")
}
})

router.delete("/ContactDelete/:_id",multer.any(),async(req,res)=>{
    try {
	console.log(req.params)
	    let delcontact= await datas.findByIdAndDelete(req.params)
		  res.status(200).json("Deleted! ( ͡▀̿ ̿ ͜ʖ ͡▀̿ ̿ )")
	    console.log(delcontact);
    } catch (error) {
  console.log(error);
	
}
})





  return router;
};
