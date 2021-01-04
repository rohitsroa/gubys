var express = require('express');
var router = express.Router();
// Get Page model
var Price = require('../models/price');
const xoauth2 = require('xoauth2');
var nodemailer=require('nodemailer');

/* * GET products index
 */
router.get('/',function (req, res) {
    Price.find(function (err, prices) {
        res.render('index2', {
            prices:prices
    });
});
});
router.get('/admin', function (req, res) {
    res.render('_layouts/adminheader');
});

router.get('/admin/prices',function (req, res) {
    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
        res.render('admin/prices', {
            prices: prices
        });
    });
});


/*
 * GET edit price
 */
router.get('/admin/prices/edit-price/:id',function (req, res) {

    Price.findById(req.params.id, function (err, prices) {
        if (err)
            return console.log(err);

        res.render('admin/edit_price', {
            title: prices.title,
            amount: prices.amount,
            id: prices._id,
            content:prices.content
        });
    });

});
// Sort pages function
function sortPages(ids, callback) {
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Price.findById(id, function (err, prices) {
                prices.sorting = count;
                price.save(function (err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}
/*
 * POST reorder pages
 */
router.post('/admin/prices/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.prices = prices;
            }
        });
    });

});

/*
 * POST edit price
 */
router.post('/admin/prices/edit-price/:id', function (req, res) {
    var title = req.body.title;
    var amount = req.body.amount;
    var content = req.body.content;
    var id = req.params.id;

        Price.findById(id, function (err, prices) {
            if (err)
                return console.log(err);

                prices.title = title;
                prices.amount = amount;
                prices.content=content;

                prices.save(function (err) {
                    if (err)
                        return console.log(err);
                    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
                        if (err) {
                                console.log(err);
                        } else {
                                req.app.locals.prices = prices;
                        }
                        });
                req.flash('success', 'Price edited!');
                res.redirect('/admin/prices/');
                    });

                });
            });

// router.post('/send',function(req,res){
//     const output=`
//         <p>You have a new customer</p>
//         <h3> Contact Details </h3>
//         <ul>
//             <li>name: ${req.body.name}</li>
//             <li>email: ${req.body.email}</li>
//             <li>subject: ${req.body.subject}</li>
//             <li>message: ${req.body.message}</li>
//         </ul>
//     `;
//     const xoauth2 = require('xoauth2');

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         xoauth2: xoauth2.createXOAuth2Generator({
//             user: 'rohitsroa3@gmail.com',
//             clientId: '264324112294-hkaa5nf6frioirv2qdc32l1vmgfm1eop.apps.googleusercontent.com',
//             clientSecret: 'BuSO6HAuxZvMK4XNmyovOkt3',
//             refreshToken: 'X/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
//         })
//     }
// })
    
//       // setup email data with unicode symbols
//       let mailOptions = {
//           from: '"Nodemailer Contact" <rohitsroa3@gmail.com>', // sender address
//           to: 'webdynasty0120@gmail.com', // list of receivers
//           subject: 'Node Contact Request', // Subject line
//           text: 'Hello world?', // plain text body
//           html: output // html body
//       };
    
//       // send mail with defined transport object
//       transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//               return console.log(error);
//           }
//           console.log('Message sent: %s', info.messageId);   
//           console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
//       }); 
// });
// Exports
module.exports = router;
