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
 const client = new pg.Client(process.env.DATABASE_URL)
 client.connect()

server.get('/', HomeHandler);
server.get('/getReviewsById', getReviewsByIdHandler);
server.post('/addReview',addReviewHandler);
server.post('/addSubmit',addSubmitHandler);

server.get('/Listrestaurants', async function Listrestaurants(req, res) {



    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '29.52667',
            longitude: '35.00778',
            limit: '30',
            currency: 'USD',
            distance: '6',
            open_now: 'false',
            lunit: 'km',
            lang: 'en_US'
        },
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
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

server.get('/getResturauntById', async function (req, res) {
    const {location} = req.query;
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/get-details',
        params: {
            location_id: location,
            currency: 'all',
            lang: 'en_US'
        },
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
    };

    try {
        const response = await axios.request(options);

                let singleresult = new AmmanRestaurant(
                    response.data.location_id,
                    response.data.name,
                    response.data.photo.images.original.url,
                    response.data.rating,
                    response.data.distance,
                    response.data.description,
                    response.data.web_url,
                    response.data.phone,
                    response.data.website,
                    response.data.address,
                    response.data.cuisine,
                    response.data.hours
                );
            
        res.send(singleresult);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

server.post('/restaurants', async function (req, res) {
    const { city} = req.body;

    try {
        const options = {
            method: 'GET',
            url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
            params: {
                latitude: latitude,
                longitude: longitude,
                limit: '30',
                currency: 'USD',
                distance: '6',
                open_now: 'false',
                lunit: 'km',
                lang: 'en_US'
            },
            headers: {
                'X-RapidAPI-Key': process.env.APIKEY,
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
              }
        };

        const response = await axios.request(options);
        const restaurants = response.data;
        res.send(restaurants);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

function getReviewsByIdHandler(req, res) {
    const location_id = req.query.location_id;
    console.log(req.query.location_id);
    const sql = `SELECT * FROM user_comments WHERE location_id='${location_id}';`
    client.query(sql)
        .then(data => {
            res.send(data.rows)
        })
        .catch(error => {
            errorHandler(error, req, res);
        })
}
 
function addReviewHandler(req, res) {
    const review = req.body;
    console.log(review);

    const sql = `INSERT INTO user_comments (email, location_id, comments, rating)
    VALUES ($1, $2, $3, $4);`
    const values = [review.email, review.location_id, review.comments, review.rating];
    client.query(sql, values)

        .then(data => {
            const sql = `SELECT * FROM user_comments WHERE location_id='${review.location_id}';`
            client.query(sql)
                .then(allData => {
                    res.send(allData.rows)
                })

                .catch(error => {
                    errorHandler(error, req, res)
                })
        })

        .catch((error) => {
            errorHandler(error, req, res)
        })
}

async function HomeHandler(req, res){

    const {lat,long} = req.query;
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude:lat,
            longitude:long,
            limit: '30',
            distance: '12',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
                    item.location_id,
                    item.name,
                    item.photo.images.original.url,
                    item.rating,
                    item.distance,
                    item.description,
                    item.web_url,
                    item.phone,
                    item.website,
                    item.address,
                    item.cuisine,
                    item.hours
                );
                return singleresult;


            }
        });

        res.send(mapResult);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

function addSubmitHandler(req,res){
    const sql=`SELECT * FROM restaurant_reservatin INNER JOIN restaurant_details`
}


function AmmanRestaurant(location_id,name, photo, rating, distance, description, web_url, phone, website, address, cuisine, hours) {
    this.location_id = location_id;
    this.name = name;
    this.photo = photo;
    this.rating = rating;
    this.distance = distance;
    this.description = description;
    this.web_url = web_url;
    this.phone = phone;
    this.website = website;
    this.address = address;
    this.cuisine = cuisine;
    this.hours = hours;
}

function errorHandler  (err,req,res){
    res.status(500).send(err);
}


server.listen(PORT, () => {

    console.log(`Listening on ${PORT}: I'm ready`);


})