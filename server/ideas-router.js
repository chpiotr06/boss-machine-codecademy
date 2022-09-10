const express = require('express');
const ideasRouter = express.Router();

const { getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db')
const checkMillionDollarIdea = require('./checkMillionDollarIdea')

const extractData = (req, res, next) => {
  const { id, name, description, numWeeks, weeklyRevenue } = req.body;
  req.idea = {id, name, description, numWeeks, weeklyRevenue};
  next()
}

const isUniqueId = (req, res, next) => {
  const { id } = req.body;
  const isUnique = getFromDatabaseById('ideas', id);
  req.isUniqueId = isUnique;
  next();
}

ideasRouter.get('/', (req, res, next) => {
  const ideas = getAllFromDatabase('ideas');
  res.send(ideas);
});

ideasRouter.get('/:ideaId', (req, res, next) => {
  const idea = getFromDatabaseById('ideas', req.params.ideaId)
  if(idea) {
    res.send(idea);
  } else {
    res.sendStatus(404);
  }
});

ideasRouter.put('/:ideaId', extractData, isUniqueId, (req, res, next) => {
  if(req.isUniqueId) {
    const updatedIdea = updateInstanceInDatabase('ideas', req.idea);
    if(updatedIdea){
      res.send(updatedIdea);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

ideasRouter.post('/', checkMillionDollarIdea, extractData, isUniqueId, (req, res, next) => {
  if(!req.isUniqueId){
    const newIdea = addToDatabase('ideas', req.idea);
    if(newIdea){
      res.status(201).send(newIdea);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
  const hasDeleted = deleteFromDatabasebyId('ideas', req.params.ideaId);
  if(hasDeleted) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404);
  }
})

module.exports = ideasRouter;