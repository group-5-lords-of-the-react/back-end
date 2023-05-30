'use strict'
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const pg = require('pg');
require('dotenv').config();
const axios = require('axios');
server.use(express.json())
let PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
server.get('/', HomeHandler);
server.get('/getReviewsById', getReviewsByIdHandler);
server.post('/addReview', addReviewHandler);
server.post('/addBooking', addBookingHandler);
server.get('/bookingList', bookingListHandler);
server.put('/updateBooking/:id', updateBookingHandler);
server.post('/addFavourite', addFavouriteHandler);
server.get('/getFavourite', getFavouriteHandler)
server.get('getImageId', getImageIdHandler);
server.post('/restaurants', getResturaunts);
server.delete('/deleteFavourite/:id', deleteFavouriteHandler);
server.get('/getResturauntById', getResturauntByIdHandler);
server.delete('/deleteBooking/:id', deleteBookingHandler);
server.get('/checkFavExist/:id', checkFavExistHandler)
server.get('/checkBookExist/:id', checkBookExistHandler)

async function getResturauntByIdHandler(req, res) {
    const { location } = req.query;
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
}

async function getImageIdHandler(req, res) {
    const { location } = req.query;
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/photos/list',
        params: {
            location_id: location,
            currency: 'USD',
            limit: '2',
            lang: 'en_US'
        },
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const datax = response.data;
        const dataxy = datax.data;



        let mapResult = dataxy.map(item => {
            if (item.images && item.images.original) {
                let singleresult = new AmmanRestaurant2(
                    item.images.original.url,
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

function AmmanRestaurant2(photo) {
    this.photo = photo;
}

async function getResturaunts(req, res) {
    const { city } = req.body;

    try {
        const options = {
            method: 'GET',
            url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
            params: {
                latitude: latitude,
                longitude: longitude,
                limit: '14',
                currency: 'USD',
                distance: '12',
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
}
function addFavouriteHandler(req, res) {
    const restaurantData = req.body;
    const sql = `INSERT INTO restaurant_details (r_location_id,r_image,r_name,r_address,r_max_reservation,r_reservation_cost,r_reservation_count)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(r_location_id) DO NOTHING;`;
    const value = [restaurantData.r_location_id, restaurantData.r_image, restaurantData.r_name, restaurantData.r_address, restaurantData.r_max_reservation, restaurantData.r_reservation_cost, restaurantData.r_reservation_count];
    const sql2 = `INSERT INTO favourite_list (location_id) VALUES ($1);`
    const value2 = [restaurantData.location_id];
    client.query(sql, value)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            errorHandler(error, req, res)
            console.log(data);
        })
        .catch(error => {
            errorHandler(error, req, res)
        })
    client.query(sql2, value2)

    client.query(sql2, value2)
        .then(data => {
            res.send(data)
            res.send(data)
        })
        .catch(error => {
            errorHandler(error, req, res)
        })

}
function getFavouriteHandler(req, res) {
    const sql = `SELECT favourite_list.location_id, restaurant_details.r_image, restaurant_details.r_name, restaurant_details.r_address
    FROM favourite_list
    INNER JOIN restaurant_details ON favourite_list.location_id = restaurant_details.r_location_id;`

    client.query(sql)
        .then(data => {
            res.send(data.rows);
            console.log('Data from DB:', data.rows);
        })
        .catch(error => {
            console.log('Sorry, there was an error:', error);
            res.status(500).send(error);
        });
}

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

    const sql = `INSERT INTO user_comments (email, location_id, comments, rating)
    VALUES ($1, $2, $3, $4);`
    const values = [review.email, review.location_id, review.comments, review.rating];
    client.query(sql, values)

        .then(data => {
            const sql = `SELECT * FROM user_comments WHERE location_id=${review.location_id};`
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

async function HomeHandler(req, res) {

    const { lat, long } = req.query;
    const options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
        params: {
            latitude: lat,
            longitude: long,
            limit: '14',
            distance: '15',
            limit: '2',
            distance: '15',
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

function addBookingHandler(req, res) {
    const restaurantData = req.body;
    const sql = `INSERT INTO restaurant_details (r_location_id,r_image,r_name,r_address,r_max_reservation,r_reservation_cost,r_reservation_count)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(r_location_id) DO NOTHING;`;
    const value = [restaurantData.r_location_id, restaurantData.r_image, restaurantData.r_name, restaurantData.r_address, restaurantData.r_max_reservation, restaurantData.r_reservation_cost, restaurantData.r_reservation_count];
    const sql2 = `INSERT INTO restaurant_reservation (location_id,r_reservation_date,r_reservation_time,no_people_reservation)
     VALUES ($1,$2,$3,$4);`
    const value2 = [restaurantData.location_id, restaurantData.r_reservation_date, restaurantData.r_reservation_time, restaurantData.no_people_reservation];
    client.query(sql, value)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            errorHandler(error, req, res)
        })
    client.query(sql2, value2)
        .then(data => {
            res.send(data)
        })
        .catch(error => {
            errorHandler(error, req, res)
        })
}

function bookingListHandler(req, res) {

    const sql = `SELECT restaurant_details.r_location_id,
    restaurant_details.r_name,
    restaurant_details.r_address,
    restaurant_reservation.r_reservation_date,
    restaurant_reservation.r_reservation_time,
    restaurant_reservation.no_people_reservation
FROM restaurant_details
INNER JOIN restaurant_reservation
ON restaurant_details.r_location_id = restaurant_reservation.location_id;`

    client.query(sql)
        .then(data => {
            res.send(data.rows);
            console.log('data from DB', data.rows)
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
}

function updateBookingHandler(req, res) {
    const location_id = req.params.id;
    const restaurantData = req.body;
    const sql = `UPDATE restaurant_reservation 
    SET r_reservation_date = $1,
    r_reservation_time =$2,
    no_people_reservation = $3
     WHERE location_id = ${location_id}
     RETURNING * ;`
    const value = [restaurantData.r_reservation_date, restaurantData.r_reservation_time, restaurantData.no_people_reservation];
    client.query(sql, value)
        .then(data => {
            const sql2 = `SELECT restaurant_details.r_location_id,
        restaurant_details.r_name,
        restaurant_details.r_address,
        restaurant_reservation.r_reservation_date,
        restaurant_reservation.r_reservation_time,
        restaurant_reservation.no_people_reservation
    FROM restaurant_details
    INNER JOIN restaurant_reservation
    ON restaurant_details.r_location_id = restaurant_reservation.location_id;`
            client.query(sql2)
                .then(alldata => {
                    res.send(alldata.rows)

                })
                .catch((error) => {
                    console.log('sorry you have something error', error)
                    res.status(500).send(error);
                })
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
}

function AmmanRestaurant(location_id, name, photo, rating, distance, description, web_url, phone, website, address, cuisine, hours) {
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

function addReviewHandler(req, res) {
    const review = req.body;
    console.log(review);

    const sql = `INSERT INTO user_comments (email, location_id, comments, rating)
    VALUES ($1, $2, $3, $4)`;
    const values = [review.email, review.location_id, review.comments, review.rating];
    client.query(sql, values)

        .then(data => {
            const sql = `SELECT * FROM user_comments WHERE location_id='${review.location_id}'`;
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

function getReviewsByIdHandler(req, res) {
    const location_id = req.query.location_id;
    console.log(req.query.location_id);
    const sql = `SELECT * FROM user_comments WHERE location_id='${location_id}';`;
    client.query(sql)
        .then(data => {
            res.send(data.rows)
        })
        .catch(error => {
            errorHandler(error, req, res);
        })
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.status(500).send(err);
}

function getReviewsByIdHandler(req, res) {
    const location_id = req.query.location_id;
    console.log(req.query.location_id);
    const sql = `SELECT * FROM user_comments WHERE location_id='${location_id}';`;
    client.query(sql)
        .then(data => {
            res.send(data.rows)
        })
        .catch(error => {
            errorHandler(error, req, res);
        })
}

function deleteFavouriteHandler(req, res) {
    const location_id = req.params.id;
    console.log(req.query);
    const sql = `DELETE FROM favourite_list WHERE location_id=${location_id};`
    client.query(sql)
        .then(data => {
            const sql = `SELECT * FROM favourite_list;`;
            client.query(sql)
                .then(allData => {
                    res.send(allData.rows);
                })
                .catch(error => {
                    errorHandler(error, req, res);
                });
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
}

function deleteBookingHandler(req, res) {
    const location_id = req.params.id;
    const sql = `DELETE FROM restaurant_reservation WHERE location_id=${location_id};`
    client.query(sql)
        .then(data => {
            const sql = `SELECT * FROM restaurant_reservation;`
            client.query(sql)
                .then(allData => {
                    res.send(allData.rows)
                })

                .catch(error => {
                    errorHandler(error, req, res)
                })
        })
        .catch(error => {
            errorHandler(error, req, res)
        })
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.status(500).send(err);
}

function checkFavExistHandler(req, res) {
    const location_id = req.params.id;
    const sql = `SELECT COUNT(*) FROM favourite_list WHERE location_id = ${location_id};`
    client.query(sql)
        .then(allData => {
            if (allData.rows[0].count > 0)
                res.send(true)
            else
                res.send(false)
        })

        .catch(error => {
            errorHandler(error, req, res)
        })

}
function checkBookExistHandler(req, res) {
    const location_id = req.params.id;
    const sql = `SELECT COUNT(*) FROM restaurant_reservation WHERE location_id = ${location_id};`
    client.query(sql)
        .then(allData => {
            if (allData.rows[0].count > 0)
                res.send(true)
            else
                res.send(false)
        })

        .catch(error => {
            errorHandler(error, req, res)
        })

}

client.connect()
    .then(() => {


        server.listen(PORT, () => {
            console.log(`Listening on ${PORT}: I'm ready`);
        })

    })

