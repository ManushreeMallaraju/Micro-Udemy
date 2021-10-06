import React, { useState } from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';
//import newsApi from './api/newsApi'
export default () => {
//     const [news, setNews] = useState([]);
//     const onSubmit = async () => {
//         const response = await newsApi.get('/everything', {
//             params: {
//                 q: 'tesla'
//             }
//         })
//         setNews(response.data.articles)
//         console.log(news)
//    } 

    return (      
        <div className="container">
            <h1>Create Post</h1>
            {/* <button onClick={ () => onSubmit() }>Fetch News</button> */}
            <PostCreate />
            <hr/>
            <h1>Posts</h1>
            <PostList />
        </div>
    );
};