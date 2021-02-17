const express = require("express");
const uniqid = require("uniqid");
const ArticleSchema = require("./schema");
const mongoose = require("mongoose");
const qm2 = require("query-to-mongo")
const articlesRouter = express.Router();

articlesRouter.post("/", async (req, res, next) => {
  try {
    const newArticle = new ArticleSchema(req.body);
    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/", async (req, res, next) => {
  try {
      const query = qm2(req.query)
      const total = await ArticleSchema.countDocuments(query.criteria)
    const articles = await ArticleSchema.find(query.criteria,query.options.fields,query.options).populate("authors")
 

 
    res.send(articles);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await ArticleSchema.findById(id).populate("authors");
    if (article) {
      res.send(article);
    } else {
      const errors = new Error();
      errors.httpStatusCode = 404;
      next(errors);
    }
  } catch (error) {
    next(error);
  }
});
articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await ArticleSchema.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (article) {
      res.status(201).send(article);
    } else {
      const errors = new Error();
      errors.httpStatusCode = 404;
      next(errors);
    }
  } catch (error) {
    next(error);
  }
});
articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await ArticleSchema.findByIdAndDelete(id);
    if (article) {
      res.send("deleted");
    } else {
      const erros = new Error();
      errors.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.post("/:id", async (req, res, next) => {
  try {
    const updated = await ArticleSchema.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: { ...req.body }, //,_id:mongoose.Types.ObjectId()
        },
      },
      { new: true }
    );
    // const { _id} = await updated.save()
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reviews } = await ArticleSchema.findById(id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id/reviews/:reviewsID", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reviews } = await ArticleSchema.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewsID) },
        },
      }
    );
    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.put("/:id/reviews/:reviewsID" ,async(req,res,next)=>{
    try {
        const {reviews}= await ArticleSchema.findOne(
            {_id:mongoose.Types.ObjectId(req.params.id)},
            {
                _id:0,
                reviews:{
                    $elemMatch: {_id:mongoose.Types.ObjectId(req.params.reviewsID)},
                },
            }
        )
        if(reviews && reviews.length>0){
            const updatedReview = {...reviews[0].toObject(), ...req.body}

            const modifiedReview = await ArticleSchema.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                    "reviews._id":mongoose.Types.ObjectId(req.params.reviewsID)
                },
                {$set : {"reviews.$":updatedReview}},
                {
                    new:true,
                }
                
            )
            res.send(modifiedReview)
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
})

articlesRouter.delete("/:id/reviews/:reviewsID", async(req,res,next)=>{
    try {
        const modifiedReview = await ArticleSchema.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    reviews : {_id:mongoose.Types.ObjectId(req.params.reviewsID)},
                },
            },
            {
                new:true
            }
        )
        res.send("Deleted")
    } catch (error) {
        next(error)
    }
})

articlesRouter.post("/:id/:userId",async(req,res,next)=>{
    try {
        const article = await ArticleSchema.findById(req.params.id)
        if(article){
            const newArticle = {...article.toObject(),claps:req.params.userId}
            
            await ArticleSchema.addUserToClaps(req.params.id,req.params.userId)
        }
    } catch (error) {
        next(error)
    }
})
module.exports = articlesRouter;
