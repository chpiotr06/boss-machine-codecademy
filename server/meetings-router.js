const express = require('express');
const meetingsRouter = express.Router();

const { getAllFromDatabase, addToDatabase, deleteAllFromDatabase } = require('./db')

meetingsRouter.get('/', (req, res, next) => {
  const meetings = getAllFromDatabase('meetings');
  res.send(meetings);
})
meetingsRouter.post('/', (req, res, next) => {
  const { time, date, day, note } = req.body;
  const newMeeting = addToDatabase('meetings', {
    time:`${time}`,
    date: new Date(date), 
    day: `${day}`, 
    note: `${note}`});
  if(newMeeting){
    res.status(201).send(newMeeting);
  } else {
    res.sendStatus(404);
  }
})
meetingsRouter.delete('/', (req, res, next) => {
  deleteAllFromDatabase('meetings');
  res.sendStatus(204);
})

module.exports = meetingsRouter;