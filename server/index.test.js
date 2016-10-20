'use strict'

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect

chai.use(chaiHttp)

describe('Test API Fruits', function(){
  var id, url = 'http://localhost:9000'
  it(': create record', function(done){
    chai.request(url)
        .post('/fruits')
        .send({
          name: 'Apple'
        })
        .end(function(err, res){
          expect(res).to.have.status(200)
          id = res.body._id;
          done()
        })
  })
  it(': read data', function(done){
    chai.request(url)
        .get('/fruits')
        .end(function(err, res){
          expect(res).to.have.status(200)
          done()
        })
  })
  it(': update record', function(done){
    chai.request(url)
        .put(`/fruits/${id}`)
        .send({
          title: 'Delicious Apple'
        })
        .end(function(err, res){
          expect(res).to.have.status(200)
          done()
        })
  })
  it(': delete record', function(done){
    chai.request(url)
        .delete(`/fruits/${id}`)
        .end(function(err, res){
          expect(res).to.have.status(200)
          done()
        })
  })
})
