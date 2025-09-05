import express from 'express';
import { users } from '../data/users.mjs';
import { posts } from '../data/posts.mjs';

const router = express.Router();

// Get all users Route
// @route GET /api/users
// @desc Get all users
// @access Public
router
    .route("/")
    .get((req, res) => {
        res.json(users);
    })
    .post((req, res) => {
        const { name, username, email } = req.body;

        // Check if we have all data to create new user
        if (name && username && email) {
            // Check if user already exists
            if (users.find((user) => user.username == username)) {
                res.status(400).json({ err: "Username taken" });
                return;
            }

            const user = {
                id: users[users.length - 1].id + 1,
                name,
                username,
                email
            }
            users.push(user);

            res.json(user);

        } else res.status(400).json({ msg: "Insuffecient Data" })
    })



router
    .route("/:id/posts")
    .get((req, res, next) => {
        const userPosts = posts.filter((post)=> post.userId == req.params.id);
        if(userPosts){
            res.json(userPosts);
        } else next();
    })



// Show One User Route
// @route GET /api/users/:id
// @desc Get ONE user
// @access Public

router
    .route("/:id")
    .get((req, res) => {
        const user = users.find((user) => user.id == req.params.id);

        if (user) res.json(user);
        else throw new Error("User does not exist!!")


    })
    .patch((req, res, next) => {
        // find the user that the client wants to update
        const id = req.params.id;
        const data = req.body;
        const user = users.find((user, i) => {
            if (user.id == id) {
                for (let item in data) {
                    users[i][item] = data[item]; // make the change
                }
                return true;
            }

        })
        // send a response
        if (user) {
            res.json(users);
        } else next();
    })
    .delete((req, res, next)=>{
                // find the user that the client wants to delete
                const id = req.params.id;
                const user = users.find((user, i) => {
                    if(user.id == id){
                        users.splice(i, 1); // remove the post
                        return true;
                    }
                });
        
                // send the client the respone
                if(users){
                    res.json(users);
                } else next();
            })






export default router;