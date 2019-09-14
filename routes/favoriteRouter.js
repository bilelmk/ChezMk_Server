const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors') ;

favoriteRouter.use(bodyParser.json()) ;

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({user :req.user._id})
    .populate('user')
    .populate({
        path: 'dishes',
        populate: { path: 'dishes' }
    })
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({ user : req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({user : req.user._id,
                             dishes : req.body })
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err));
        }
        else {
            for(i=0 ;i<req.body.length;i++)
                {   
                    add = true;
                    j = 0 ;
                    while (add == true && j<favorite.dishes.length){
                        if (favorite.dishes[j] == req.body[i]._id)
                            {  add = false ;}
                        else
                            { j++ ; }
                    }
                    if (add == true){
                        favorite.dishes.push(req.body[i])
                    }
                }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOneAndRemove({user :req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
       
});



favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({ user : req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({user : req.user._id,
                             dishes : req.params.dishId })
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err));
        }
        else {
            
            add = true;
            j = 0 ;
            while (add == true && j<favorite.dishes.length){
                if (favorite.dishes[j] == req.params.dishId)
                    {  add = false ;}
                else
                    { j++ ; }
            }
            if (add == true){
                favorite.dishes.push(req.params.dishId)
            }
        
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite/:dishId');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({ user : req.user._id})
    .then((favorite) => {
        if (favorite != null && favorite.dishes != []) {
                for(i=0 ;i<favorite.dishes.length ; i++){
                    if (favorite.dishes[i]._id.equals(req.params.dishId))
                    {
                        favorite.dishes.splice(i, 1)                    }
                    }

                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                            .then((favorite) => {
                            console.log('Favorite Dish Deleted!', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);     
                        })           
                    }, (err) => next(err));
        }
        else{
            err = new Error('You are not authorized to delete this dish');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;