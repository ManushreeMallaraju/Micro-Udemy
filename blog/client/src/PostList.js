import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentsList from './CommentList';

export default () => {
    const [posts, setPosts] = useState({}); //{} because, we need to set an initial value, where posts are obtained as an obj not an array(posts{})

    const fetchPosts = async () => {
        // const res = await axios.get('http://localhost:4000/posts');
        const res = await axios.get('http://localhost:4002/posts'); // w.r.t query service(one single req)
        //console.log(res.data);
        setPosts(res.data);
    };

    // where to call setPosts? useEffect: used to run some code at very specific point of time in a life cycle of a component 

    useEffect(() => {
        fetchPosts();
    }, []); //[] empty array tells react to run this method only once

    //generating a list of all the posts titles
    const renderedPosts = Object.values(posts).map(post => { //array of actual post objects
        return ( 
        <div
            className="card"
            style={{ width: '30%', marginBottom: '20px ' }}
            key={post.id}
        >
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentsList comments={post.comments} />
                <CommentCreate postId={post.id}/> 
            </div>

        </div>
        //post.id(prop) -> which id of the post needs comments for
        );
    }) 

    //need to be changed
    //display renderedPosts in the browser
    return ( <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts}
    </div>
    );
};

