// author: open-ecomerce.org
// magento 1.9 base in rwd theme

casper.test.begin('404 Not Found', function suite(test) {

    // Start page
    casper.start(mage.getUrl('not-found'), function () {

        test.assertHttpStatus(404);

        test.assertTitle('404 Not Found');
        test.assertExists('body.cms-index-noroute');
        test.assertSelectorHasText('h1', 'OOPS!');
    })

    .run(function () {
        test.done();
    });
});

