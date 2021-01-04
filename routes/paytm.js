var express = require('express');
var router = express.Router();

const MERCHANT_ID = "sSnaPS79122616050003";
const MERCHANT_KEY = "MV0rvB!O4MpS3_L0";
const WEBSITE_NAME = "WEBSTAGING";
const INDUSTRY_TYPE_ID = "Retail";
const BASE_URL = "https://securegw-stage.paytm.in";
const paytm_checksum = require('../paytm/checksum');
const Request = require("request");
var User = require('../models/user');
var CallbackResponse = require('../models/callbackresponse');
var datetime = require('datetime');
router.get('/payment', (req, res) => {
    let amount = "11.01";
    let transactionData = {
        MID: MERCHANT_ID,
        WEBSITE: WEBSITE_NAME,
        INDUSTRY_TYPE_ID: INDUSTRY_TYPE_ID,
        ORDER_ID: `007${Date.now()}`,
        CUST_ID: `007`,
        TXN_AMOUNT: amount.toString(),
        CHANNEL_ID: 'WEB',
        MOBILE_NO: '9911666854',
        EMAIL: 'example@paytm.com',
        CALLBACK_URL: `http://localhost:3000/paytm/callback`
};
    let url = BASE_URL + '/theia/processTransaction';
    // Generate checksum hash and render template in callback
     paytm_checksum.genchecksum(transactionData, MERCHANT_KEY, (error, checksum) => {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
				// var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
				
		var form_fields = "";
		for(var x in transactionData){
		form_fields += "<input type='hidden' name='"+x+"' value='"+transactionData[x]+"' >";
		}
		form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";
        res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();
        res.render("index.pug", {data: checksum, url: url});
			});
    });

router.post('/callback', (req, res) => {
    // log the callback response payload returned:
    let callbackResponse = req.body;
    console.log('Transaction response: ', callbackResponse);

    // verify callback response checksum:
    let checksumVerification = paytm_checksum.verifychecksum(callbackResponse, MERCHANT_KEY);
    console.log('checksum_verification_status: ', checksumVerification);

    // verify transaction status:
    let transactionVerifyPayload = {
        MID: callbackResponse.MID,
        ORDERID: callbackResponse.ORDERID,
        CHECKSUMHASH: callbackResponse.CHECKSUMHASH
    };
    let url = BASE_URL + '/order/status';
    Request.post({url: url, body: JSON.stringify(transactionVerifyPayload)}, (error, resp, body) => {
        let verificationResponse = JSON.parse(body);
        var verificationResponses = JSON.parse(body);
        console.log('Verification response: ', verificationResponse);
        res.render('callback.pug', {
            callbackResponse: callbackResponse,
            checksumVerification: checksumVerification,
            verificationResponse: verificationResponse
        });
        var verificationResponses = new CallbackResponse({
            'CURRENCY': callbackResponse.CURRENCY,
            'GATEWAYNAME': callbackResponse.GATEWAYNAME,
            'RESPMSG': callbackResponse.RESPMSG,
            'BANKNAME': callbackResponse.BANKNAME,
            'PAYMENTMODE': callbackResponse.PAYMENTMODE,
            'MID': callbackResponse.MID,
            'RESPCODE':callbackResponse.RESPCODE,
            'TXNID': callbackResponse.TXNID,
            'TXNAMOUNT': callbackResponse.TXNAMOUNT,
            'ORDERID': callbackResponse.ORDERID,
            'STATUS': callbackResponse.STATUS,
            'BANKTXNID':callbackResponse.BANKTXNID,
            'TXNDATE': callbackResponse.TXNDATE,
            'CHECKSUMHASH': callbackResponse.CHECKSUMHASH

        });
    
        verificationResponses.save(function (err) {
            if (err)
                return console.log(err);
    });
})});

module.exports=router;