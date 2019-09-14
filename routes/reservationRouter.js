const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors') ;


const reservationRouter = express.Router();



reservationRouter.use(bodyParser.json());

reservationRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Reservations.find(req.query)
        .then(
            (reservations) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reservations);
        },
            (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions,(req, res, next) => {
    Reservations.create(req.body)
        .then((promotion) => {
            console.log('reservation Created ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions , (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /reservations');
})
.delete(cors.corsWithOptions,(req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /reservations');
});



reservationRouter.route('/:resId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported');
})
.post(cors.corsWithOptions ,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})
.put(cors.corsWithOptions , (req, res, next) => {
    Reservations.findByIdAndUpdate(req.params.resId , {
        $set: req.body
    }, { new: true })
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions,(req, res, next) => {
    Reservations.findByIdAndRemove(req.params.resId)
        .then(
            (resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        },
            (err) => next(err))
        .catch((err) => next(err));
});


module.exports = reservationRouter;
