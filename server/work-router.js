const express = require('express');
const workRouter = express.Router({mergeParams: true});

const { getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db')

const middleware = (model, paramName) => {
  return (req, res, next) => {
    const id = req.params[`${paramName}Id`];
    const exists = getFromDatabaseById(model, id);
    if(exists) {
      req[`${paramName}Id`] = id;
      req[`${paramName}`] = exists;
      next();
    } else {
      res.sendStatus(404)
    }
}}

const extractWorkData = (req, res, next) => {
  const { id, title, description, hours, minionId } = req.body;
  req.work = {id, title, description, hours, minionId};
  next();
}


workRouter.get('/', middleware('minions', 'minion'), (req, res, next) => {
  const allWork = getAllFromDatabase('work')
  const filteredWork = allWork.filter(work => work.minionId === req.minionId)
  res.send(filteredWork);
})

workRouter.put('/:workId', middleware('work', 'work'), middleware('minions', 'minion'), extractWorkData, (req, res, next) => {
  if(req.work.minionId === req.params.minionId){
    const newWork = updateInstanceInDatabase('work', req.work)
    if (newWork){
      res.send(newWork);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
})

workRouter.post('/', extractWorkData, (req, res, next) => {
  const exists = getFromDatabaseById('work', req.body.id);
  if(!exists){
    const newWork = addToDatabase('work', req.work)
    if(newWork){
      res.status(201).send(newWork);
    } else {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(404)
  }


})

workRouter.delete('/:workId', middleware('work', 'work'), (req, res, next) => {
  if(req.work){
    const hasDeleted = deleteFromDatabasebyId('work', req.workId);
    if(hasDeleted){
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(404);
  }

})

module.exports = workRouter;