/**
 * Fetch URL from Konga Catalogue pages.
 */

var require = patchRequire(require),
    fs  = require("fs"),
    utility = require("../../../lib/utility"),
    baseClass = require("../../../lib/Agent"),
    utils = require('utils'),
    Agent;

var agent = new baseClass("jumia.com.ng", undefined);

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
        waitTimeout : 7000,
        pageSettings: {
            loadPlugins: false,
            loadImages : true
        },
        //BLock contents.
        onResourceRequested : function (casper, requestData, networkData) {
            'use strict';
            if (/analytics|facebook|conversion|twitter|addthis|track|tag|gstatic|postmessage|newrelic|criteo|webengage|conversion|cedexis/i.test(requestData.url)) {
                networkData.abort();
            }
        }
    };
};

Agent.prototype.scrape = function (onComplete) {
    'use strict';
    var self = this,
        casperjs = this.casperjs,
        Pagination = require(fs.absolute(".") + "/crawler/lib/Pagination").create("NextButton"),
        Pager,
        scrapeData;

    scrapeData = function () {
        return casperjs.evaluate(function () {
            var links = __utils__.findAll("div[data-sku] > a.link[href*=html]");
            return links.map(function (e) {
                return {
                    url : e.href
                }
            });
        });
    };

    casperjs.start(this.url, function () {
        this.waitUntilVisible(".pagination a[title='Next']", function () {
            var link = this.evaluate(function () {
                return __utils__.findOne(".pagination a[title='Next']").textContent;
            });
            Pager = new Pagination(".pagination a[title='Next']", false, 4);
            Pager.run(this, function () {
                self.results = scrapeData();
            });
        }, function () {
            self.results = scrapeData();
        });
    });

    if (onComplete) {
        onComplete.apply(this, [casperjs]);
    }

    return this;
};


module.exports = Agent;
