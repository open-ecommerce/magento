// author: open-ecomerce.org
// magento 1.9 base in rwd theme

casper.test.begin('Add To Cart', function suite(test) {

	//casper.options.stepTimeout = 50000;


    // Start page
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
	
    .run(function () {
        test.done();
    });
});

