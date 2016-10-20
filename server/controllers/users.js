const models = require('../models/users'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash')

module.exports = {
  createOne:createOne,
  findAll:findAll,
  findOne:findOne,
  updateOne:updateOne,
  deleteOne:deleteOne,
  authenticate:authenticate
}

function createOne(req, res, next){
  models.findOne({
    username:req.body.username
  },(err, record) => {
    if(err) throw err
    if(!_.isEmpty(record)){
      res.status(400).json({error:"Username already exists"})
    } else {
      var record = new models({
        username:req.body.username,
        password:req.body.password
      })
      record.save()
      res.status(200).json(record)
    }
  })
}

function findAll(req, res, next){
  models.find({},(err, record) => {
    if(err) throw err
    if(!_.isEmpty(record)){
      res.status(200).json(record)
    } else {
      res.status(204).json({error:"Cannot find any record"})
    }
  })
}

function findOne(req, res, next){
  models.findOne({
    _id:req.params.id
  },(err, record) => {
    if(err) throw err
    if(!_.isEmpty(record)){
      res.status(200).json(record)
    } else {
      res.status(400).json({error:"Record does not exist"})
    }
  })
}

function updateOne(req, res, next){
  models.findOne({
    _id:req.params.id
  },(err, record) => {
    if(err) throw err
    if(record){
      record.password = req.body.password
      record.save((err)=> {
        if(err) throw err
        res.status(200).json(record)
      })
    } else {
      res.status(400).json({error:"Record does not exist"})
    }
  })
}

function deleteOne(req, res, next){
  models.findOne({
    _id:req.params.id
  },(err, record) => {
    if(err) throw err
    if(record){
      record.remove((err)=> {
        if(err) throw err
        res.status(200).json(record)
      })
    } else {
      res.status(400).json({error:"Record does not exist"})
    }
  })
}

function authenticate(req, res, next){
  models.findOne({
    username:req.body.username,
    password:req.body.password
  },(err, record) => {
    if(err) throw err
    if(!_.isEmpty(record)){
      var tokenValue = jwt.sign({
        "username": record.username
      }, req.app.get('secretToken'), {
        expiresIn: 86400 // expires in 24 hours
      })
      res.status(200).json({
        token: tokenValue
      })
    } else {
      res.status(400).json({error:"Username already exists"})
    }
  })
}
