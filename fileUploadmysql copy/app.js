const express = require('express');
const bodyparser = require('body-parser');
const fs = require("fs");
const { stringify } = require('querystring');
const { exitCode } = require('process');
const { get } = require('http');
var path = require('path');

const app = express();

app.use(bodyparser.json());

app.use(express.urlencoded({extended:true}));

app.use("/public", express.static(path.join(__dirname, 'public')));

const datapath = "data.json";

const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    console.log(stringifyData);
    fs.writeFileSync(datapath, stringifyData)
}

const getAccountData = () => {
    const jsonData = fs.readFileSync(datapath)
    return JSON.parse(jsonData)   
}

app.get('/', (req, res)=>{
    res.send('<form action="/reg" method="POST"> <label for="user">user</label><input type="text" name="username" id="user"><br><label for="pass">Fullname</label><input type="text" name="fullname" id="pass"><br><input type="file" name="bild"><br><input type="submit"></form>');

})

//create
app.post('/reg', (req, res)=>{

    var existAccounts = getAccountData();
    const newAccountId = req.body.username;
    existAccounts[newAccountId] = req.body;
    saveAccountData(existAccounts);
    res.send({existAccounts});

})

//read
app.get('/:id', (req, res) => {
    
    var existAccounts = getAccountData();
    const accountId = req.params['id'];
    console.log(existAccounts[accountId]);
    res.send(`<img src=${existAccounts[accountId].bild} alt="bild">   ${existAccounts[accountId].username} ${existAccounts[accountId].fullname}`);
    
});

//update
app.put('/update/:id',(req,res)=>{

    var existAccounts = getAccountData();
    const accountId = req.params['id'];
    existAccounts[accountId] = req.body;
    saveAccountData(existAccounts);

    res.send(`the data of ${existAccounts[accountId].username} has been updated`);
})

//delete
app.delete('/delete/:id', (req,res)=>{

    var existAccounts = getAccountData();
    const accountId = req.params['id'];
    delete existAccounts[accountId];
    saveAccountData(existAccounts);
    
    res.send(`user${existAccounts[accountId].username} has been deleted`);

})

app.listen(5000);
