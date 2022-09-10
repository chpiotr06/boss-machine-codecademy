const express = require('express');
const minionsRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db')

const workRouter = require('./work-router');
minionsRouter.use('/:minionId/work', workRouter);

const haveUniqueId = (req, res, next) => {
  const { id } = req.body;
  const exists = getFromDatabaseById('minions', id)
  req.exists = exists
  
  next();
} 

minionsRouter.get('/', (req, res, next) => {
  const minions = getAllFromDatabase('minions')
  res.send(minions);
})

minionsRouter.post('/', haveUniqueId, (req, res, next) => {
  const {id, name, title, salary} = req.body;
  if(!req.exists) {
    const newMinion = addToDatabase('minions', {id, name, title, salary});
    res.status(201).send(newMinion);
  } else {
    res.sendStatus(404);
  }
})

minionsRouter.get('/:minionId', (req, res, next) => {
  const minion = getFromDatabaseById('minions', req.params.minionId)
  if(minion) {
    res.send(minion);
  } else {
    res.status(404).send();
  }
})

minionsRouter.put('/:minionId', haveUniqueId, (req, res, next) => {
  const {id, name, title, salary, weaknesses} = req.body;
  if(req.exists) {
    const newMinion = updateInstanceInDatabase('minions', {id, name, title, salary, weaknesses})
    if(newMinion) {
      res.send(newMinion);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
})

minionsRouter.delete('/:minionId', haveUniqueId, (req, res, next) => {
  const hasDeleted = deleteFromDatabasebyId('minions', req.params.minionId)
  if(hasDeleted) {
    res.status(204).send()
  } else {
    res.status(404).send();
  }
})

module.exports = minionsRouter;