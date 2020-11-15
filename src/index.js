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
        res.status(404).send(req.params.id);
        return;
    }
    res.send(filteredStudent[0]);
});

app.post('/api/student', (req, res) => {
    const name = req.body.name.trim();
    const currentClass = req.body.currentClass;
    const division = req.body.division.trim();
    //console.log(req.body);
    if(name === undefined || currentClass === undefined || division === undefined){
        res.status(404).send("Not Found");
        return;
    }else if(name === "" || currentClass === "" || division === ""){
        res.status(404).send("Not Found");
        return;
    }
    const id = arr[arr.length-1].id+1;
    const obj = {
        id: id,
        name : name,
        currentClass: currentClass,
        division: division
    }
    arr.push(obj);
    res.send(
        {"id":id
    });
});

app.put('/api/student/:id', (req, res) => {
    const id = +req.params.id;
    const name = req.body.name.trim();
    
    if(Number.isNaN(id) || name === undefined){
        res.status(400).send("Bad Request");
        return;
    }
    const isIdExist = arr.find(student => student.id === id);
    if(!isIdExist || name === ""){
        res.status(400).send("Bad Request");
        return;
    }
    arr = arr.map(student => {
        if(student.id === id){
            student.name = name;
            return student;
        }
        return student;
    });
    res.send({"name": name});

});

app.delete('/api/student/:id', (req,res) => {
    const id = +req.params.id;
    const isIdExist = arr.find(student => student.id === id);
    //console.log(isIdExist);
    if(!isIdExist){
        res.status(404).send(`${id}`);
        return;
    }
    arr = arr.filter(student => student.id !== id);
    res.status(200).send(`${id}`);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   