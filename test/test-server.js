process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../server/app');
var Person = require("../server/models/person");

var should = chai.should();
chai.use(chaiHttp);


describe('Persons', function() {

  Person.collection.drop();

  beforeEach(function(done){
    var newPerson = new Person({
      name: 'John',
      lastName: 'Doe'
    });
    newPerson.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
    Person.collection.drop();
    done();
  });

  it('should list ALL persons on /persons GET', function(done) {
    chai.request(server)
      .get('/persons')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('lastName');
        res.body[0].name.should.equal('John');
        res.body[0].lastName.should.equal('Doe');
        done();
      });
  });

  it('should list a SINGLE person on /persons/<id> GET', function(done) {

      var newPerson = new Person({
        name: 'Bob',
        lastName: 'lee'
      });

      newPerson.save(function(err, data) {
        chai.request(server)
          .get('/persons/'+data.id)

          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('name');
            res.body.should.have.property('lastName');
            res.body.name.should.equal('Bob');
            res.body.lastName.should.equal('lee');
            res.body._id.should.equal(data.id);
            done();
          });
      });
  });

  it('should add a SINGLE person on /persons POST', function(done) {
    chai.request(server)
      .post('/persons')
      .send({'name': 'Java', 'lastName': 'Script'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('name');
        res.body.SUCCESS.should.have.property('lastName');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.name.should.equal('Java');
        res.body.SUCCESS.lastName.should.equal('Script');
        done();
      });
  });

  it('should update a SINGLE person on /persons/<id> PUT', function(done) {
    chai.request(server)
      .get('/persons')
      .end(function(err, res){
        chai.request(server)
          .put('/persons/'+res.body[0]._id)
          .send({'name': 'Bob'})
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('UPDATED');
            response.body.UPDATED.should.be.a('object');
            response.body.UPDATED.should.have.property('name');
            response.body.UPDATED.should.have.property('_id');
            response.body.UPDATED.name.should.equal('Bob');
            done();
        });
      });
  });

  it('should delete a SINGLE person on /persons/<id> DELETE', function(done) {
    chai.request(server)
      .get('/persons')
      .end(function(err, res){
        chai.request(server)
          .delete('/persons/'+res.body[0]._id)
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('REMOVED');
            response.body.REMOVED.should.be.a('object');
            response.body.REMOVED.should.have.property('name');
            response.body.REMOVED.should.have.property('_id');
            response.body.REMOVED.name.should.equal('John');
            done();
        });
      });
  });

});
