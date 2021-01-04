var express = require('express');
var router = express.Router();
// Get Users model
var User = require('../models/user');
var End = require('../models/end');
/*
 * GET register
 */
router.get('/register', function (req, res) {

    res.render('register');

});

/*
 * POST register
 */
router.post('/end', function (req, res) {

    var packagename = req.body.packagename;
    var totalamount= req.body.totalamount;
    var amount= req.body.amount;

                var end = new End({
                    packagename: packagename,
                    totalamount: totalamount,
                    amount:amount
                });
                end.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            }
                )});
router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var mobilenumber = req.body.mobilenumber;
    var refcode = req.body.refcode;
    var customerid=req.body.customerid;
    var user = new User({
                                    name: name,
                                    email: email,
                                    mobilenumber: mobilenumber,
                                    refcode: refcode,
                                    customerid:customerid,
                                });
        user.save(function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            }
                                )});
                

// Exports
module.exports = router;
