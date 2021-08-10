const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const allRoutes = require("./routers/index");
const cors = require("cors");



const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv')
	dotenv.config()
}

const app = express();
app.use(cors())
const url = process.env.MONGODB_URL

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: "secret",
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false },
}));

mongoose.connect(url, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
	console.log("Database Connected");
});

app.use("/", allRoutes)

app.listen(port, () => {
	console.log("Sever Running")
})