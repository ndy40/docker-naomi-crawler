var casperjs = require("casper").create();

casperjs.start("http://google.com", function () {
    this.echo(this.getTitle());
});

casperjs.run();