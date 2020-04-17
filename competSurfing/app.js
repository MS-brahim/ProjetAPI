const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();


const jsonFile = fs.readFileSync('./models/condidats.json');
let planch = JSON.parse(jsonFile); 


app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));
app.get('/', (req, res) => {
	let filterData = [];  



	res.render('index', { planch: planch });
});


// add condidat
app.get('/add', (req, res) => {
	res.render('add');
});  

app.post('/add', (req, res) => {
	const { image, name,ville,typeOfSurf} = req.body;
 
	planch.push({ ID: planch.length+1, image: image, name:name,ville:ville,typeOfSurf:typeOfSurf });
	fs.writeFileSync('./models/condidats.json', JSON.stringify(planch, null));
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
	 

	fs.writeFileSync('./models/condidats.json', JSON.stringify(planch, null));
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
	fs.writeFileSync('./models/condidats.json', JSON.stringify(planch, null));
	res.redirect('/');
});


app.listen(2999,(err)=>{
    console.log(err);
    console.log('server listen on port 2999');
})