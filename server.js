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

server.get('/', HomeHandler);
// server.get('*', DefaultHandler);

server.get('/ammanhome', HomeAmmanHandler);
server.get('/wadirummhome', HomeWadiRummHandler);
server.get('/irbidhome', HomeIrbidHandler);
server.get('/aqabahome', HomeAqabaHandler);
server.get('/petrahome', HomePertaHandler);

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

server.get('/RestaurantDetails', async function (req, res) {


    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/get-details',
        params: {
            location_id: '25174432',
            currency: 'all',
            lang: 'en_US'
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        res.send(response.data)
    } catch (error) {
        console.error(error);
    }

});



server.post('/restaurants', async function (req, res) {
    const { city, longitude, latitude } = req.body;

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
                'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
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




async function HomeAmmanHandler(req, res) {
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '31.945335',
            longitude: '35.886671',
            limit: '30',
            distance: '6',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
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



async function HomeAqabaHandler(req, res) {
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '29.52667',
            longitude: '35.00778',
            limit: '30',
            distance: '8',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
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



async function HomeWadiRummHandler(req, res) {
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '29.542474',
            longitude: '35.394125',
            limit: '30',
            distance: '20',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
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

async function HomeIrbidHandler(req, res) {
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '32.551445',
            longitude: '35.851479',
            limit: '30',
            distance: '10',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
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



async function HomePertaHandler(req, res) {
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: '30.324270',
            longitude: '35.462641',
            limit: '30',
            distance: '10',
            lunit: 'km',
        },
        headers: {
            'X-RapidAPI-Key': '1a821d29fcmsh97ccbc06ad20fe8p1ec809jsn98de1f3b43cc',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;



        let mapResult = data.map(item => {
            if (item.photo && item.photo.images && item.photo.images.original) {
                let singleresult = new AmmanRestaurant(
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





function AmmanRestaurant(name, photo, rating, distance, description, web_url, phone, website, address, cuisine, hours) {
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




server.listen(PORT, () => {

    console.log(`Listening on ${PORT}: I'm ready`);


})

