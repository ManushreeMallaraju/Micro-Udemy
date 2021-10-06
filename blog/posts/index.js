const express = require('express');
const bodyParser = require('body-parser');  //administration work with express.js
const {randomBytes } = require('crypto'); //using randomBytes, to generate id for posts
const cors = require('cors');
const axios = require('axios');

const app = express(); //step1. creating a new app.
app.use(bodyParser.json()); //we need to add bodyPaser, to make sure, whenever user sends us some json data 
                            //in a body, request actually gets passed. 
                            // And so it actually shows up appropriately inside of a request handler
app.use(cors());

//Note: no database, so simple object to store all the posts getting created
const posts={};

//step 2: associate two different routes just created
app.get('/posts', (req, res) => {
    res.send(posts);   //send all the posts created 
});

app.post('/posts', async (req, res) => {    //WE MIGHT NEED SOME ID ASSOCIATED WITH EACH POST
    //RANDOMLY GENERATE AN ID, assign it to the post created, using 'randomBytes'
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;    //pull out the title

    posts[id] = {  //assign id to the title
        id,
        title
    };

    //making a network request
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated', //event to be emitted, hey someone emitted an event
        data: {
            id, title
        }
    });
    
    res.status(201).send(posts[id]);  //status indicates that, we just created a resource.
                                      //sending the user post, just created
});

//posts request handler
app.post('/events', (req, res) => {  // '/events' receives any event coming form event bus 
    console.log('Received Event', req.body.type);

    res.send({});
});

//step 3: make sure express application listens on a very specific port 
app.listen(4000, () => {
    console.log('Listening on 4000');
})

//Step 4: implementing two different routes just created.

