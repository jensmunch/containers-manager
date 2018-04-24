const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.send({ error: 'Bad Input' });
  }

  let response = {};

  // Retrieve user data
  admin
    .database()
    .ref(`users/${req.body.username}`)
    .once('value')
    .then(snapshot => {
      const val = snapshot.val();
      if (val.password === req.body.password) {
        delete val.password;
        response = val;

        // Retrieve MAM data
        admin
          .database()
          .ref('mam')
          .once('value')
          .then(snapshot => {
            response = Object.assign({}, response, { mam: snapshot.val() });
            return res.send(response);
          })
          .catch(error => {
            return res.status(500).send({ error: 'MAM data not found' });
          });
      } else {
        return res.status(403).send({ error: 'Wrong password' });
      }
    })
    .catch(error => {
      return res.status(500).send({ error: 'User not found' });
    });
};
