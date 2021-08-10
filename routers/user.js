const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs");
const User = require("../db/models/user")
const Meal = require("../db/models/meal");
const {isAuthorized, isSignIn} = require("../controllers/controller")


router.get("/", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");
  	res.redirect("/signin");
});

router.get("/signup", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");
	res.render("signup");
});

router.post("/signup", (req, res) => {
  var name = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var calorie = req.body.calories;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const data = {
    Username: name,
    Email: email,
    Password: hash,
    Calories: calorie
  };
  const newUser = new User(data);
  newUser.save();
  res.redirect("/signin");
});

router.get("/signin", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");
	res.render("signin", { msg: " " });
});

router.post("/signin", isSignIn,(req, res) => {
  res.redirect("/home");
});

router.get("/signout", isAuthorized, (req, res) => {
	res.clearCookie('token');
	res.clearCookie('connect.sid');
	req.session.destroy(() => {
		res.render('signin', { msg: "Logged out sucessfully" },)
	});
});

router.get("/logout", async (req, res) => {
	res.clearCookie('token');
	res.clearCookie('connect.sid');
	req.session.destroy(() => {
		res.render('signin', { msg: "Time Expiered! Logged out sucessfully" },)
	});
});

router.get("/update/:id", isAuthorized, async(req, res) => {

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

  res.render("update", { name: req.session.name, idd: req.params.id, total:total, cal: obj.Calories});

});


router.post("/update/:id", isAuthorized, async (req, res) => {

  await Meal.findOneAndUpdate({ _id: req.params.id }, { Meal: req.body.food })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log("err");
    });


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
      res.render("final", {name: req.session.name, response: response ,msg:"Meal Order Updated successfully" , total:total, cal: obj.Calories});
    })
    .catch((err) => {
      console.log(err);
    });

});


router.get("/delete/:id", isAuthorized, async (req, res) => {

  await Meal.findOneAndRemove({ _id: req.params.id })
    .then((response) => {
      console.log("Successfull");
    })
    .catch((err) => {
      console.log("err");
    });

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
      res.render("final", { name: req.session.name, response: response ,msg : "Order Deleted Successfully", total:total, cal: obj.Calories});
    })
    .catch((err) => {
      console.log(err);
    });


});

module.exports = router
