import express from 'express';
import { comments } from '../data/comments.mjs';


const router = express.Router();


router
    .route("/")
        .get((req, res)=>{
            res.json(comments);
        })
        .post((req, res)=>{
            const { userId, postId, body } = req.body; // grabing these values from the req.body
            let id;
            if(comments.length > 0){
                id = comments[comments.length - 1].id + 1;
            } else{
                id = 1;
            }
            

            if(userId && postId && body){
                const comment = {
                id: id,
                userId: userId,
                postId: postId,
                body: body
                }
                comments.push(comment);
                res.json(comments);
                } else{
                    res.status(400).json({msg: "Insuffecient Data"});
                }
        })


router
    .route("/:id")
        .get((req, res, next)=>{
            const id = req.params.id;
            let comment = comments.find((comment) => comment.id == id);

            if(comment){
                res.json(comment);
            } else next();

        })



export default router;
        