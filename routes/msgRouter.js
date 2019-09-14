const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors') ;


const msgRouter = express.Router();



msgRouter.use(bodyParser.json());
msgRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Msg.find(req.query)
        .then(
            (msg) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(msg);
            },
            (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions,(req, res, next) => {
    Msg.create(req.body)
        .then((promotion) => {
            console.log('Msg Created ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch(
            (err) => next(err));
})
.put(cors.corsWithOptions , (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /msg');
})
.delete(cors.corsWithOptions,(req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /msg');
});



msgRouter.route('/:msgId')
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
    Msg.findByIdAndUpdate(req.params.msgId , {
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
    Msg.findByIdAndRemove(req.params.msgId)
        .then(
            (resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            },
            (err) => next(err))
        .catch((err) => next(err));
});



module.exports = msgRouter;
