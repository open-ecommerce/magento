// author: open-ecomerce.org
// magento 1.9 base in rwd theme

casper.test.begin('Checkout as a guest', function suite(test) {

    casper.on('remote.message', function(msg) {
      this.echo(msg);
    });

    // Start category page
    casper.start(mage.getDirectUrl('women/dresses-skirts.html'), function () {

        test.assertHttpStatus(200);

        test.assertUrlMatch(mage.getDirectUrl('women/dresses-skirts.html'));

        // check first product in the product grid for this category
        test.assertExists('.category-products>ul>li:nth-child(1)');
		// click on the detail for the first product in the grid
        this.click('.category-products>ul>li:nth-child(1) a');
		

    })

	// whait for the first product page detail
    .waitForUrl(mage.getDirectUrl('women/dresses-skirts/essex-pencil-skirt-527.html'), function() {

        test.assertHttpStatus(200);

        test.assertUrlMatch(mage.getDirectUrl('women/dresses-skirts/essex-pencil-skirt-527.html'));

		// old templates to get selects
        // this.evaluate(function() {
        //     var elmt = document.querySelector('select#attribute525');
        //     elmt.selectedIndex = 2;
        //     elmt.onchange();
        // });

        // select the color black the dress
		this.click('ul#configurable_swatch_color>li#option17 a');

        // select the size 8 of the dress
		this.click('ul#configurable_swatch_size>li#option73 a');
		
        // check that the home page has th	e link login
        test.assertExists('.add-to-cart-buttons button');
        this.click('.add-to-cart-buttons button');
    })

   .waitForSelector(".checkout-types.top .button.btn-proceed-checkout.btn-checkout > span",
       function success() {
           test.assertExists(".checkout-types.top .button.btn-proceed-checkout.btn-checkout > span");
           this.click(".checkout-types.top .button.btn-proceed-checkout.btn-checkout > span");
			test.assertExists('.messages .success-msg');
            test.assertExists('.checkout-types.top .button.btn-proceed-checkout.btn-checkout');
       },
       function fail() {
           this.echo('Kind of problem here');
   },
   50000)

   
    .waitForUrl(mage.getUrl('checkout/onepage'), function() {
        test.assertHttpStatus(200);
        test.assertExists('input[name="checkout_method"]');
        test.assertExists('#onepage-guest-register-button');
        
        this.evaluate(function() {
            document.getElementById('login:guest').checked = true;
            checkout.setMethod();
        });
        test.pass('Try to go trough checkout as Guest');
    })

    /* Billing address step */
    .waitUntilVisible('#opc-billing', function() {
        test.assertExists('input[name="billing[firstname]"]');
        test.assertExists('input[name="billing[lastname]"]');
        test.assertExists('input[name="billing[company]"]');
        test.assertExists('input[name="billing[email]"]');
        test.assertExists('input[name="billing[street][]"]');
        test.assertExists('input[name="billing[city]"]');
        test.assertExists('select[name="billing[region_id]"]');
        test.assertExists('input[name="billing[postcode]"]');
        test.assertExists('select[name="billing[country_id]"]');
        test.assertExists('input[name="billing[telephone]"]');
        test.assertExists('input[name="billing[fax]"]');
        test.assertExists('input[name="billing[use_for_shipping]"]');
        this.fill('form#co-billing-form', {
            'billing[firstname]'    : login_user_firstname,
            'billing[lastname]'     : login_user_lastname,
            'billing[company]'      : user_address_company,
            'billing[email]'        : login_user_username,
            'billing[street][]'     : user_address_street,
            'billing[city]'         : user_address_city,
            'billing[postcode]'     : user_address_postcode,
            'billing[telephone]'    : user_address_telephone,
            'billing[fax]'          : user_address_fax
        }, false);

        /* Set country and region_id dropdowns */
        this.evaluate(function(regionId, countryId) {
            function setSelectedValue(selectObj, valueToSet) {
                for (var i = 0; i < selectObj.options.length; i++) {
                    if (selectObj.options[i].text== valueToSet) {
                        selectObj.options[i].selected = true;
                        return;
                    }
                }
            }

            try {
                var regionIdObject = document.getElementById('billing:region_id');
                var countryIdObject = document.getElementById('billing:country_id');
                
                setSelectedValue(regionIdObject, regionId);
                setSelectedValue(countryIdObject, countryId);

                document.getElementById('billing:use_for_shipping_yes').checked = true;
                billing.save();
            } catch (err) {
                console.log(err);
            }
        }, { regionId: user_address_region, countryId: user_address_country });
        test.pass('Filling the billing address form and use this address as shipping');
    })

    /* Shipping method step */
   .waitUntilVisible('#checkout-step-shipping_method',
       function success() {
			test.assertExists('input[name=shipping_method][value=flatrate_flatrate]');
			this.echo('Select the radio button flate rate');
			this.evaluate(function() {
				document.querySelector('input[name=shipping_method][value=flatrate_flatrate]').setAttribute('checked', true);
			});   
			this.evaluate(function() {
				shippingMethod.save();
			});
			test.pass('Using flat rate as shipping method');		
       },
       function fail() {
           this.echo('Kind of problem here not finiding the shipping stage');
   },
   70000)	

   /* Payment method step */
   .waitUntilVisible('#checkout-step-payment',
       function success() {
			test.assertExists('input[name="payment[method]"][value=banktransfer]');
			this.echo('Select the radio button bank transfer');
			this.evaluate(function() {
				document.querySelector('input[name="payment[method]"][value=banktransfer]').setAttribute('checked', true);
			});  
			this.evaluate(function() {
				payment.save();
			});
			test.pass('Using "Bank Transfer Payment" as payment method');
			
       },
       function fail() {
           this.echo('Kind of problem here not finiding the payment stage');
   },
   70000)	
   
    /* Order review step */
	.waitUntilVisible('#checkout-step-review',
       function success() {
			test.assertExists('.button.btn-checkout');
			this.evaluate(function() {
				review.save();
			});
       },
       function fail() {
           this.echo('Kind of problem athe the order review');
   },
   70000)	
	
    /* Order success page */
	.waitForUrl(mage.getUrl('checkout/onepage/success'),
       function success() {
			test.assertHttpStatus(200);
			test.assertExists('.checkout-onepage-success');
			test.pass('The order has been placed successfully');
       },
       function fail() {
           this.echo('Kind of problem athe the order success screen');
   },
   70000)	

    .run(function () {
        test.done();
    });
});