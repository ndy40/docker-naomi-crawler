/**
 * Fetch URL from Konga Catalogue pages.
 */

var require = patchRequire(require),
    fs  = require("fs"),
    sys = require("system"),
    utility = require("../../../lib//utility"),
    baseClass = require("../../../lib/Agent"),
    utils = require('utils'),
    Agent;

var agent = new baseClass("konga.com", undefined);

Agent = function (name, casperjs) {
    'use strict';
    baseClass.apply(this, [name, casperjs]);
};

Agent.prototype = agent;

/**
 * overwrite super init method.
 */
Agent.prototype.init = function () {
    return {
        viewportSize : {width: 1200, height: 600},
        waitTimeout : 15000,
        pageSettings: {
            loadPlugins: false,
            loadImages : false,
            userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
        },
        //BLock contents.
        onResourceRequested : function (casper, requestData, networkData) {
            'use strict';
            if (/analytics|facebook|conversion|twitter|addthis|track|tag/i.test(requestData.url)) {
                networkData.abort();
            }
        }
    };
};

Agent.prototype.scrape = function (onComplete) {
    'use strict';
    var self = this,
        casperjs = this.casperjs,
        utils = require("utils"),
        pages = 3,
        fnPageThrough,
        scrapeData;


    scrapeData = function () {
        return casperjs.evaluate(function () {
            var links = __utils__.findAll("ul.catalog *.product-block  a.product-block-link");
            return links.map(function (e) {
                return {
                    url : e.href
                }
            });
        });
    };

    // fnPageThrough = function () {
    //     this.evaluate(function () {
    //         window.scrollBy(0, 350);
    //     });
    //     //casperjs.scrollToBottom();
    //     casperjs.wait(3500, function () {
    //         this.waitForSelector(".catalog-box > .spinner-container[style*=none]", fnPageThrough, null, 15000);
    //     });

    // };
    var count = 0;
    casperjs.start(this.url, function () {        
        this.wait(5000, function () {
            this.repeat(pages, function () {
                this.evaluate(function () {
                    window.scrollBy(100, 7000);
                });
                this.wait(4000);
            }).then(function () {
                self.results = scrapeData();
            });
        });
    });

    return this;
};


module.exports = Agent;
