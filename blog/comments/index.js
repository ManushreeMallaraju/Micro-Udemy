const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const e = require('express');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//commentsByPostId stored as in-memory data structure
const commentsByPostId={}; //this data structure should be optimized while looking up for all the comments associated with different posts, ds:array

//two route handlers: get and post requests
app.get('/posts/:id/comments', (req, res) => {
   res.send(commentsByPostId[req.params.id] || []);  //we are going to look inside commentsBypostId obj, inside there, the id i.e, 
                                                    //that is provided inside the path, if that results in undefined, send an empty array
                                                    //so no matter, whoever is making this req, always send back an array.
});

app.post('/posts/:id/comments',async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body; //provided by the user

    //check to see, we already got some array in commentsByPostID
    const comments = commentsByPostId[req.params.id] || []  //give us either an array or [undefined, if no comments created], 
                                                            //so instead of undefined, give an empty array.

    //push in the new comment inside the comments array
    comments.push({ id: commentId, content, status: 'pending'});

    // make sure that, we assign this comments array back to the given post inside of our comments, commentsByPostId object
    commentsByPostId[req.params.id] = comments;

    //the place where we create 'CommentCreated' event
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id : commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
        
    });

    console.log('Comment Created')
    res.status(201).send(comments) //send back entire array of comments
});

//comments event handler, to handle incoming events
app.post('/events', async (req, res ) => {
    console.log('Event Received: ', req.body.type);

    const { type, data} = req.body;
    if(type === 'CommentModerated') {
        const { postId, id, status, content} = data;

        const comments = commentsByPostId[postId]; //get all the comments associated with the postID, 
         
        const comment = comments.find(comment => {  //iterate over the comments to get the appropriate comment
           return comment.id === id;
        })
        comment.status = status; //status obtained from event
        
        //emitting 'CommentUpdated' event to event-bus
        await axios.post('http://localhost:4005/events', {

          type: 'CommentUpdated',
          data: {
            id,
            postId,
            content,
            status
        }
      });
    }
    
    res.send({}); //empty obj just to say, event received
})
app.listen(4001, ()=> {
    console.log('Listening on 4001')
})