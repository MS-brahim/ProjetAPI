// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser')

// we'll load up node's built in file system helper library here
const fs = require('fs');

// create an instance of express to serve our end points
const app = express();


const jsonFile = fs.readFileSync('./data/condidats.json');
let planch = JSON.parse(jsonFile); 


app.set('view engine', 'ejs'); 

// configure our express instance with some body-parser settings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {

	res.render('index', { planch: planch });
});


app.get('/add', (req, res) => {
	res.render('add');
});  

app.post('/add', (req, res) => {
	const { image, name,ville,typeOfSurf} = req.body;
 
	planch.push({ ID: planch.length+1, image: image, name:name,ville:ville,typeOfSurf:typeOfSurf });
	fs.writeFileSync('./data/condidats.json', JSON.stringify(planch, null));
	res.redirect('/'); 
});

app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let planchId;

	for (let i = 0; i < planch.length; i++) {
		if (Number(id) === planch[i].ID) {
			planchId = i;
		}
	}

	res.render('edit', { planch: planch[planchId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const {image, name, ville,typeOfSurf } = req.body;

	let planchId;
	for (let i = 0; i < planch.length; i++) {
		if (Number(id) === planch[i].ID) {
			planchId = i;
		}
	}

	planch[planchId].image = image;
	planch[planchId].name = name;
	planch[planchId].ville = ville;
	planch[planchId].typeOfSurf = typeOfSurf;
	 

	fs.writeFileSync('./data/condidats.json', JSON.stringify(planch, null));
	res.redirect('/');  
});

app.get('/delete/:id', (req, res) => {
	const { id } = req.params;
 
	const xData = [];
	for (let i = 0; i < planch.length; i++) {
		if (Number(id) !== planch[i].ID) {
			xData.push(planch[i]);
		}
	}

	planch = xData;
	fs.writeFileSync('./data/condidats.json', JSON.stringify(planch, null));
	res.redirect('/');
});

//launch server on port 3001
app.listen(3001,(err)=>{
    console.log('server listen on port 3001');
})