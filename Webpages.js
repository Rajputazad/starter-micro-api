const auth = require("./middleware/auth");
module.exports=function (router){
    router.get("/About", auth, async (req, res) => {
        const userId =req.decoded.user_id
        console.log(userId);
        res.status(200).json(userId);
      });
      return router
}