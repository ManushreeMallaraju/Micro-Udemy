const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

//post req handler(recieve all different events)
app.post('/events',  (req,res) => {
    const event = req.body; //watevr comes in req.bosy will be our event. could be a JSON obj, string, anything
    
    events.push(event);
    
    axios.post('http://localhost:4000/events', event).catch((err) => { //follow design principles
        console.log(err.message);
      }); //downside: assuming only app succeed
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log(err.message);
    })

app.get('/events', (req, res) => {
  res.send(events);
})

    res.send({status: 'OK'});
}); 

app.listen(4005, () =>{
    console.log('Listening on 4005');
})