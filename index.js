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

app.get('/', async (req, res) => {
  const { error } = req.query;
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const params = {
    properties: 'id,firstname,lastname,bio,food,sport',
  };
  try {
    if (error) {
      res.render('homepage', {
        title: 'Contacts | HubSpot APIs',
        contactsData: [],
        errorMessage: decodeURIComponent(error),
      });
      return;
    }

    const response = await axios.get(url, { headers, params });
    if (response.status !== 200) {
      throw new Error(
        response.data?.message
          ? response.data.message
          : 'Failed to fetch contacts data.'
      );
    }

    const contactsData = response.data.results;
    res.render('homepage', {
      title: 'Contacts | HubSpot APIs',
      contactsData,
    });
  } catch (error) {
    console.error(error);
    res.redirect(`/?error=${encodeURIComponent(error.message)}`);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
  const { error } = req.query;
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    errorMessage: error ? decodeURIComponent(error) : null,
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
  const fields = ['firstname', 'lastname', 'bio', 'food', 'sport'];
  let contactData = {};

  try {
    // * Validating and trimming the form data
    for (const field of fields) {
      if (!req.body[field]) {
        throw new Error('All fields are required.');
      }
      contactData[field] = req.body[field].trim();
    }
    // * Validating the food property
    const validFoods = ['dragon-fruit', 'pasta'];
    if (!validFoods.includes(contactData.food)) {
      throw new Error('Invalid food selection.');
    }
    // * Creating a new contact
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(
      url,
      { properties: contactData },
      { headers }
    );
    // * Handling the response
    if (!response || response.status !== 201) {
      throw new Error(
        response.data?.message ? response.data.message : 'No response received.'
      );
    }
    // * Redirecting to the homepage
    res
      .status(201)
      .json({ success: true, message: 'Contact added successfully' });
  } catch (error) {
    // * Handling the error
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding contact' });
  }
});

// * Code to update a contact

app.patch('/update-contact/:id', async (req, res) => {
  const { id } = req.params;

  const { firstname, lastname, bio, food, sport } = req.body;

  try {
    if (!id) {
      throw new Error('Contact ID is required.');
    }

    if (!firstname || !lastname || !bio || !food || !sport) {
      throw new Error('All fields are required.');
    }

    const trimmedData = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      bio: bio.trim(),
      food: food.trim(),
      sport: sport.trim(),
    };

    const validFoods = ['dragon-fruit', 'pasta'];
    if (!validFoods.includes(trimmedData.food)) {
      throw new Error('Invalid food selection.');
    }

    await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${id}`,
      { properties: trimmedData },
      { headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` } }
    );

    res
      .status(200)
      .json({ success: true, message: 'Contact updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating contact' });
  }
});

// * Code to delete a contact

app.delete('/delete-contact/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error('Contact ID is required.');
    }

    await axios.delete(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, {
      headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting contact' });
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
