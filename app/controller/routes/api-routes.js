require('dotenv');
var passport = require('passport');
const axios = require('axios');

module.exports = (app, db) => {
    app.get('/api/items/:item', (req, res) => {
        const query = req.params.item;
        axios({
            method: 'GET',
            url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/site/search?',
            params: {
                query: query
            },
            headers: { 'X-RapidAPI-Key': process.env.SPOONACULAR_API_KEY }
        }).then(results => {
            let data = [];
            for (let i = 0; i < results.data.Recipes.length; i++) {
                data[i] = {
                    name: results.data.Recipes[i].name,
                    cost: results.data.Recipes[i].dataPoints[0].value,
                    imageUrl: results.data.Recipes[i].image
                };
            }
            app.locals[query] = data;
            res.redirect(`/searchResults/${req.params.item}`);
        });
    });

    //when purchase is complete
    app.put('/api/orders/', (req, res) => {
        db.cart
            .update(
                {
                    status: 'delivered',
                    updatedAt: ''
                },
                {
                    where: {
                        username: req.body.username
                    }
                }
            )
            .then(cartUpdate => {
                console.log(cartUpdate);
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.post('/api/orders/', (req, res) => {
        db.cart
            .create({
                item: req.body.item,
                price: req.body.price,
                quantity: req.body.quantity,
                cartname: req.body.cartname,
                //username input placeholder
                username: req.body.username,
                UserEmail: req.body.userEmail,
                shopper: req.body.shopper,
                status: 'cart'
            })
            .then(cart => {
                console.log(cart);
                res.send('Hey');
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.post('/api/signup/', function(req, res) {
        console.log(req.body);
        console.log('HI');

        db.User.create({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            activeuser: req.body.activeuser
        }).then(function(dbUser) {
            // console.log(dbUser);
            console.log('okay');
            res.status(200);
        });
    });

    app.post(
        '/api/login',
        passport.authenticate('local', {
            failureRedirect: '/signup'
        }),
        function(req, res) {
            // console.log('user', req.user);
            // res.send('hi');
            res.json('/loggedin');
            // res.redirect('/loggedin');
        }
    );

    //display user's cart
    app.get('/api/orders/', (req, res) => {
        db.cart
            .findAll({
                where: {
                    username: req.body.username
                }
            })
            .then(cart => {
                if (cart) {
                    res.status(300).json(cart);
                } else {
                    res.status(404).send('Nothing is in your cart');
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

    //make order active
    app.post('/api/orders/active', (req, res) => {
        const orderNbrGenerator = () => {
            let randNbr = '';
            for (let i = 0; i < 10; i++) {
                randNbr += Math.floor(Math.random() * 10);
            }
            db.cart
                .findAll({
                    where: {
                        status: 'ordered'
                    }
                })
                .then(orders => {
                    for (let i = 0; i < orders.length; i++) {
                        if (orders[i].orderNumber === randNbr) {
                            orderNbrGenerator();
                        }
                    }
                    db.cart
                        .update(
                            {
                                orderNumber: parseInt(randNbr),
                                status: 'ordered'
                            },
                            {
                                where: {
                                    username: req.body.username
                                }
                            }
                        )
                        .then(cart => {
                            res.json(cart);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    console.log(randNbr);
                    return randNbr;
                })
                .catch(err => {
                    console.log(err);
                });
        };
        orderNbrGenerator();
    });

    //display active orders
    app.get('/api/orders/active', (req, res) => {
        db.cart
            .findAll({
                where: {
                    status: 'ordered'
                }
            })
            .then(orders => {
                if (orders) {
                    res.status(300).json(orders);
                } else {
                    res.status(404).send('No active orders');
                }
            })
            .catch(err => {
                console.log(err);
            });
    });
};
