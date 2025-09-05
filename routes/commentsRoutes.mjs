import express from 'express';
import { comments } from '../data/comments.mjs';


const router = express.Router();


router
    .route("/")
    .get((req, res) => {
        // get for ?userId query must use format: localhost:3000/api/comments/?userId=<value>&api-key=<key>
        const userId = req.query.userId;
        // grabbing postId query if it exists, must use format: localhost:3000/api/comments/?postId=<value>&api-key=<key>
        const postId = req.query.postId;

        if (userId) { // If userId query used find comments with that userId and return those comments
            const userComments = comments.filter((comment) => comment.userId == userId);
            res.json(userComments);
        } else if(postId){ // If postId query used find comments with that postId and return that comment(s)
            const pIComment = comments.filter((comment) => comment.postId == postId);
            res.json(pIComment);
        } else res.json(comments);
    })
    .post((req, res) => {
        const { userId, postId, body } = req.body; // grabing these values from the req.body
        let id;
        if (comments.length > 0) {
            id = comments[comments.length - 1].id + 1;
        } else {
            id = 1;
        }


        if (userId && postId && body) {
            const comment = {
                id: id,
                userId: userId,
                postId: postId,
                body: body
            }
            comments.push(comment);
            res.json(comments);
        } else {
            res.status(400).json({ msg: "Insuffecient Data" });
        }
    })


router
    .route("/:id")
    .get((req, res, next) => {
        const id = req.params.id;
        let comment = comments.find((comment) => comment.id == id);

        if (comment) {
            res.json(comment);
        } else next();

    })
    .patch((req, res, next) => {
        const id = req.params.id;
        const data = req.body;
        const comment = comments.find((comment, i) => { // find the comment
            if (comment.id == id) {
                for (let item in data) {
                    comments[i][item] = data[item]; // make the change
                }
                return true;
            }
        })
        // send a response
        if (comment) {
            res.json(comments);
        } else next();

    })
    .delete((req, res, next) => {
        const id = req.params.id;
        const comment = comments.find((comment, i) => { // find the comment
            if (comment.id == id) {
                comments.splice(i, 1);
                return true;
            }
        })
        // send a response
        if (comment) {
            res.json(comments);
        } else next();
    })



export default router;
