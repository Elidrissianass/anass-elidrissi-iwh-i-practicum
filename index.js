const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const params = {
    properties: 'firstname,bio,food,sport',
  };
  try {
    const response = await axios.get(url, { headers, params });
    const contactsData = response.data.results;
    res.render('homepage', { title: 'Contacts | HubSpot APIs', contactsData });
  } catch (error) {
    console.error(error);
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

app.post('/update-cobj', async (req, res) => {
  try {
    const { firstname, bio, food, sport } = req.body;
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    await axios.post(
      url,
      {
        properties: { firstname, bio, food, sport },
      },
      {
        headers,
      }
    );

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
