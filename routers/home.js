const express = require("express")
const router = express.Router()
const User = require("../db/models/user")
const Meal = require("../db/models/meal");

router.get("/", async (req, res) => {
  var obj = await User.findOne({Username:req.session.name})
  var sumobj = await Meal.aggregate([{ 
      $group: { 
          _id: null, 
          total: { 
              $sum: "$Calories" 
          } 
      } 
  }])

  if(sumobj[0]===undefined){
    var total = 0;
  } else{
    total = sumobj[0].total
  }
  res.render("home",{ name: req.session.name, cal: obj.Calories, total:total});
});
  
router.get("/placeorder", async (req,res) =>{
  var obj = await User.findOne({Username:req.session.name})
  var sumobj = await Meal.aggregate([{ 
      $group: { 
          _id: null, 
          total: { 
              $sum: "$Calories" 
          } 
      } 
  }])

  if(sumobj[0]===undefined){
    var total = 0;
  } else{
    total = sumobj[0].total
  }
  res.render("placeorder", { name: req.session.name, id: obj._id ,total:total, cal: obj.Calories})
});
  

router.post("/placeorder", async (req, res) => {
  var date = req.body.date
  var meal = req.body.mealname;
  var type = req.body.mealtype;
  var desc = req.body.description
  var calories = req.body.calories;
  const data = {
    Name: req.session.name,
    Meal: meal,
    Type: type,
    Date: date,
    Description: desc,
    Calories: calories
  };
  const newMeal = await new Meal(data);

  newMeal
    .save()
    .then((response) => {
      res.redirect("/home/placeorder/details")
    })
    .catch((err) => {
      console.log("Error inside post",err);
    });
});


// router.post("/fetch", async(req,res)=>{
//   const EndPoint = "https://trackapi.nutritionix.com/v2/natural/nutrients";
//   const getCalories = async () => {
//     const headers = {
//       "x-app-id": "848297ec",
//       "x-app-key": "c8db491e80464aed364a0f6cfe2917d2",
//     };
//     try {
//       const response = await axios.post(EndPoint, { query: food }, { headers });
//       if (response.data) {
//         // console.log(response.data.foods[0]["nf_calories"]);
//         caloriesRef.current.value = response.data.foods[0]["nf_calories"]
//       }
//     } catch (err) {
//         setFetchError
//   console.log(req.body)
 
// })


router.get("/placeorder/details", async (req,res)=>{

  var obj = await User.findOne({Username:req.session.name})
  var sumobj = await Meal.aggregate([{ 
    $group: { 
        _id: null, 
        total: { 
            $sum: "$Calories" 
        } 
    } 
  }])

  if(sumobj[0]===undefined){
    var total = 0;
  } else{
    total = sumobj[0].total
  }

  Meal.find({ Name: req.session.name })
        .then((response) => {
          res.render("final", {name: req.session.name, response: response, cal: obj.Calories, total:total ,msg:"Congratulations! Meal Added"});
        })
        .catch((err) => {
          console.log(err);
        });

});



module.exports = router