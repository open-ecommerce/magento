// This test can be used as a basis for creating more advanced tests for the empty cart page
// if you e.g. want to test the existence of a  CMS block or product recommendations, etc.

casper.test.begin('Empty cart', function suite(test) {

    // Start on the homepage
    casper.start(mage.getBaseUrl(), function () {
        test.assertHttpStatus(200);
    })

	// empty cart
   .waitForSelector(".info-wraper",
       function success() {
           test.assertExists(".ul#cart-sidebar a.remove");
           this.click(".ul#cart-sidebar a.remove");
       },
       function fail() {
           this.echo('popup not there');
   })

	
    .run(function () {
        test.done();
    });
});

