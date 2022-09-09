const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minions-router');
const ideasRouter = require('./ideas-router');
const meetingsRouter = require('./meetings-router')

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;
