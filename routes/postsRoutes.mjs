import express from 'express';
import { posts } from '../data/posts.mjs';
import { comments } from '../data/comments.mjs';

const router = express.Router();


// Get all posts route
// @route GET /api/posts
// @desc Get all posts
// @access Public
router
    .route("/")
        .get((req, res)=>{
            // get for ?userId query must use format: localhost:3000/api/posts/?userId=<value>&api-key=<key>
            const userId = req.query.userId;
            if(userId){
            const userPosts = posts.filter((post) => post.userId == userId);
            res.json(userPosts);
            } else res.json(posts);;
            
        })
        .post((req, res)=>{
            const {userId, title, content} = req.body; // grabing these values from the req.body
            let id = posts[posts.length - 1].id + 1; // creating an id that is one more than the last (highest) number id
            if(userId && title && content){
                const post = {
                id: id,
                userId: userId,
                title: title,
                content: content
                }
                posts.push(post);
                res.json(posts[posts.length - 1]);
            } else{
                res.status(400).json({msg: "Insuffecient Data"});
            }
        })
    
// localhost:3000/api/posts/4/comments?userId=2&api-key=perscholas
// localhost:3000/api/comments?api-key=perscholas

router
    .route("/:id/comments")
    .get((req, res, next) => {
        const userId = req.query.userId;
        // Get all comments made on one post by one user
        // @route GET /api/posts/:id/comments?userId=<vaule>
        // @desc Get all comments for one post made by one user
        // @access Public
        if(userId){ // Checks if a query for userId was used
            const thePost = posts.find((post)=> post.id == req.params.id);
            const postId = thePost.id;
            const userComments = comments.filter((comment)=> (comment.postId == postId && comment.userId == userId));
            if(userComments){
                res.json(userComments); // get for ?userId query must use format: localhost:3000/api/posts/:id/comments?userId=<value>&api-key=<key>
            } else next();
        } else{
            // Get all comments made one post
            // @route GET /api/posts/:id/comments
            // @desc Get all comments for one post
            // @access Public
            const postComments = comments.filter((comment)=> comment.postId == req.params.id);
            if(postComments){
            let justComs = [];
            for(let com of postComments){
                justComs.push(com.body)
            }
            res.json(justComs);
            } else next();

        }

        
    })



// Show one post route
// @route GET /api/posts/:id
// @desc Get ONE post
// @access Public
router
    .route("/:id")
        .get((req, res, next)=>{
            const post = posts.find((post)=> post.id == req.params.id);

            if(post) res.json(post);
                else next();
        })
        .patch((req, res, next)=>{
            // find the item that the user wants to update
            const id = req.params.id;
            const data = req.body;
            const post = posts.find((post, i)=> {
                if(post.id == id){
                    for(let item in data){
                        // in the posts array grab the post that the client wants to change
                        posts[i][item] = data[item]; // make the change
                    }
                    return true;
                }

            })
            // send a response
            if(post){
                res.json(posts);
            } else next();
        })
        .delete((req, res, next)=>{
            // find the post that the client wants to delete
            const id = req.params.id;
            const post = posts.find((post, i) => {
                if(post.id == id){
                    posts.splice(i, 1); // remove the user
                    return true;
                }
            });
            
            // send the client the respone
            if(post){
                res.json(posts);
            } else next();
        })

export default router;