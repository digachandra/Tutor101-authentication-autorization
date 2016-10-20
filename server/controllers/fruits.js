const models = require('../models/fruits'),
      _ = require('lodash')

module.exports = {
  createOne:createOne,
  findAll:findAll,
  findOne:findOne,
  updateOne:updateOne,
  deleteOne:deleteOne
}

function createOne(req, res, next){
  models.findOne({
    name:req.body.name
  },(err, record) => {
    if(err) throw err
    if(!_.isEmpty(record)){
      res.status(400).json({error:"Name already exists"})
    } else {
      var record = new models({
        name:req.body.name
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
      record.name = req.body.name
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
