const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});
const fs = require('fs');
 
const app = express();

const PORT = process.env.PORT || 3000;


const jsonFile = fs.readFileSync('./data/users.json');
let users = JSON.parse(jsonFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/'));

app.set('views', './views');
app.set('view engine', 'ejs'); 

 
app.get("/", (req, res) => {
  res.render('index',{users:users});
  
});


// add 
app.get('/add', (req, res) => {
	res.render('add');
});  

app.post('/add', (req, res) => {
	const { image, name,ville,typeOfSurf} = req.body;
 
	users.push({ ID: users.length+1, image: image, name:name,ville:ville,typeOfSurf:typeOfSurf });
	fs.writeFileSync('./data/users.json', JSON.stringify(users, null));
	res.redirect('/'); 
});

// update 
app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let usersId;

	for (let i = 0; i < users.length; i++) {
		if (Number(id) === users[i].ID) {
			usersId = i;
		}
	}

	res.render('edit', { users: users[usersId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const {image, name, ville,typeOfSurf } = req.body;

	let usersId;
	for (let i = 0; i < users.length; i++) {
		if (Number(id) === users[i].ID) {
			usersId = i;
		}
	}

	users[usersId].image = image;
	users[usersId].name = name;
	users[usersId].ville = ville;
	users[usersId].typeOfSurf = typeOfSurf;
	 

	fs.writeFileSync('./data/users.json', JSON.stringify(users, null));
	res.redirect('/');  
});

// delete 
app.get('/delete/:id', (req, res) => {
	const { id } = req.params;
 
	const videData = [];
	for (let i = 0; i < users.length; i++) {
		if (Number(id) !== users[i].ID) {
			videData.push(users[i]);
		}
	}

	users = videData;
	fs.writeFileSync('./data/users.json', JSON.stringify(users, null));
	res.redirect('/');
});


app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});