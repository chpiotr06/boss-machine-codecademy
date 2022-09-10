const checkMillionDollarIdea = (req, res, next) => {
  const { numWeeks, weeklyRevenue } = req.body;
  let total;
  total = numWeeks * weeklyRevenue;
  if(total >= 1000000) {
    next()
  } else {
    res.sendStatus(400)
  } 
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
