const express = require('express');
const axios = require('axios');
const app = express();
var vehicleData = "";

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-e2c234b1-8192-4a4c-894f-7d2bf553d525';

app.get('/homepage', async (req, res) => {
    const vehicles = 'https://api.hubspot.com/crm/v3/objects/vehicles?properties=vehicle_name&properties=vehicle_color&properties=vehicle_model';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(vehicles, { headers });
        vehicleData = resp.data.results;
        res.render('homepage', { title: 'My Homepage' ,  vehicleData});    
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const vehicles = 'https://api.hubspot.com/crm/v3/objects/vehicles?properties=vehicle_name&properties=vehicle_color&properties=vehicle_model';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(vehicles, { headers });
        const data = resp.data.results;
        res.render('vehicles', { title: 'Vehicles | HubSpot APIs', data });     
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update', async (req, res) => {
// http://localhost:3000/update?hs_object_id=8691794520
    
    const vehicle_id = req.query.hs_object_id;
    const getVehicle = `https://api.hubapi.com/crm/v3/objects/vehicles/${vehicle_id}?properties=vehicle_name&properties=vehicle_color&properties=vehicle_model`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        const response = await axios.get(getVehicle, { headers });
        const data = response.data;
        res.render('update', { 
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' , 
            vehicle_name : data.properties.vehicle_name , 
            vehicle_color : data.properties.vehicle_color , 
            vehicle_model : data.properties.vehicle_model});  

    } catch(err) {
        console.error(err);
    }

});
// ?idProperty=vehicle_name&properties=vehicle_name&properties=vehicle_color
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "vehicle_color": req.body.colorNewVal,
            "vehicle_name": req.body.nameNewVal,
            "vehicle_model": req.body.modelNewVal,
        }
    }

    const vehicle_id = req.query.hs_object_id;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/vehicles/${vehicle_id}`;
    const vehicles = 'https://api.hubspot.com/crm/v3/objects/vehicles?properties=vehicle_name&properties=vehicle_color&properties=vehicle_model';
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        const resp = await axios.get(vehicles, { headers });
        vehicleData = resp.data.results;
        res.redirect(`/?title=My%20Homepage&vehicleData=${JSON.stringify(vehicleData)}`);
        
    } catch(err) {
        console.error(err);
    }

});

app.post('/homepage', async (req, res) => {
    const formData = req.body;
    const newRecordPayload = {
      properties: {
        vehicle_name: formData.nameNewVal,
        vehicle_color: formData.colorNewVal,
        vehicle_model: formData.modelNewVal,
        // Add other properties as needed
      },
    };
  
    const createCustomObjectEndpoint = `https://api.hubspot.com/crm/v3/objects/vehicles`;
  
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.post(createCustomObjectEndpoint, newRecordPayload, { headers });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      // Handle the error as needed, e.g., display an error message or redirect to an error page
      res.status(500).send('Error creating custom object');
    }
  });
  


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));