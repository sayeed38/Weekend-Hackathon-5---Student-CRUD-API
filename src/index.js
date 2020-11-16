const express = require('express')
const app = express()
const bodyParser = require("body-parser");
let arr = require('./InitialData');
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
app.get('/api/student', (req, res) => {
    res.send(arr);
});

app.get('/api/student/:id', (req, res) => {
    //console.log(req.params.id);
    const filteredStudent = arr.filter(student => student.id === +req.params.id);
    if(filteredStudent.length === 0){
        res.sendStatus(404);
        return;
    }
    res.send(filteredStudent[0]);
});

app.post('/api/student', (req, res) => {
    const name = req.body.name;
    const currentClass = +req.body.currentClass;
    const division = req.body.division;
    //console.log(req.body);
    if(name === undefined || Number.isNaN(currentClass) || division === undefined){
        res.sendStatus(404);
        return;
    }else if(name.trim() === "" || division.trim() === ""){
        res.sendStatus(404);
        return;
    }
    const id = arr[arr.length-1].id+1;
    const obj = {
        id: id,
        name : name.trim(),
        currentClass: currentClass,
        division: division.trim()
    }
    arr.push(obj);
    res.send(
        {"id":id
    });
});

app.put('/api/student/:id', (req, res) => {
    const id = +req.params.id;
    const name = req.body.name.trim();
    //console.log(id, name);
    if(Number.isNaN(id) || name === undefined || name === ""){
        res.sendStatus(400);
        return;
    }
    const obj = arr.filter(student => {
        if(student.id === id){
            student.name = name;
            return student;
        }
        return null;
    });
    console.log(obj);
    if(obj.length === 0){
        res.sendStatus(400);
        return;
    }
    
    //console.log(arr);
    //res.send({"name": name});

});

app.delete('/api/student/:id', (req,res) => {
    const id = +req.params.id;
    const isIdExist = arr.find(student => student.id === id);
    //console.log(isIdExist);
    if(!isIdExist){
        res.sendStatus(404);
        return;
    }
    arr = arr.filter(student => student.id !== id);
    res.status(200).send(`${id}`);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   