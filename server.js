'use strict'

const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const pg = require('pg');
require('dotenv').config();
const axios = require('axios');
server.use(express.json())
let PORT = 3002;
// const apiKey = process.env.APIkey;
// const client = new pg.Client(process.env.DATABASE_URL)
server.get('/Listrestaurants', async function Listrestaurants(req, res) {
 

  const axios = require('axios');
 
  const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
  params: {
  latitude: '29.52667',
  longitude: '35.00778',
  limit: '30',
  currency: 'USD',
  distance: '2',
  open_now: 'false',
  lunit: 'km',
  lang: 'en_US'
  },
  headers: {
  'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
  'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
  }
  }

  try {
  const response = await axios.request(options); 
  console.log(response.data);
  res.send(response.data)
  } catch (error) {
  console.error(error);
  }
 });
server.listen(PORT, ()=> {

    console.log(`Listening on ${PORT}: I'm ready`);


})

