var express = require('express');
var router = express.Router();
var Person = require('../models/person');

router.get('/', function(req, res, next) {
  res.send('Hello, World!');
});

// *** api routes *** //
router.get('/persons', findAllPersons);
router.get('/persons/:id', findPersonById);
router.post('/persons', addPerson);
router.put('/persons/:id', updatePerson);
router.delete('/persons/:id', deletePerson);


// *** get ALL persons *** //
function findAllPersons(req, res) {
  Person.find(function(err, persons) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(persons);
    }
  });
}

// *** get SINGLE person *** //
function findPersonById(req, res) {
  Person.findById(req.params.id, function(err, person) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(person);
    }
  });
}

// *** post ALL persons *** //
function addPerson(req, res) {
  var newPerson = new Person({
    name: req.body.name,
    lastName: req.body.lastName
  });
  newPerson.save(function(err) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json({'SUCCESS': newPerson});
    }
  });
}

// *** put SINGLE person *** //
function updatePerson(req, res) {
  Person.findById(req.params.id, function(err, person) {
    person.name = req.body.name;
    person.lastName = req.body.lastName;
    person.save(function(err) {
      if(err) {
        res.json({'ERROR': err});
      } else {
        res.json({'UPDATED': person});
      }
    });
  });
}

// *** delete SINGLE person *** //
function deletePerson(req, res) {
  Person.findById(req.params.id, function(err, person) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      person.remove(function(err){
        if(err) {
          res.json({'ERROR': err});
        } else {
          res.json({'REMOVED': person});
        }
      });
    }
  });
}

module.exports = router;
