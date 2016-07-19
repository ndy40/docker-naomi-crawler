var require = patchRequire(require),
    fs  = require("fs"),
    sys = require("system"),
    utility = require(sys.env["CRAWLER_HOME"] +  "/lib/utility"),
    dataType = require(sys.env["CRAWLER_HOME"] + "/lib/DataType"),
    baseClass = require(sys.env["CRAWLER_HOME"] + "/lib/Agent"),
    utils = require('utils'),
    Agent;

/**
 * Inherit from Parent Agent class.
 */
var parent = new baseClass("konga.com", undefined);

Agent = function (name, casperjs) {
    'use strict';
    baseClass.apply(this, [name, casperjs]);
};

Agent.prototype = parent;

/**
 * Override super init method
 */
Agent.prototype.init = function () {
    'use strict';
    return {
        viewportSize : {width: 1200, height: 600},
        pageSettings: {
            loadPlugins: false,
            loadImages: false
        },
        //BLock contents.
        onResourceRequested : function (casper, requestData, networkData) {
            'use strict';
            if (/track|talk|twitter|addthis|facebook|tag|analytics|css/i.test(requestData.url)) {
                networkData.abort();
            }
        }
    };
};

Agent.prototype.scrape = function () {
    'use strict';
    var self = this,
        utils = require("utils"),
        casperjs = this.casperjs;

    casperjs.start(this.url, function () {
        this.wait(6000, function () {
            this.waitUntilVisible("button.add-to-cart", function () {
                var results = this.evaluate(function () {
                    var name        = __utils__.findOne(".product-name"),
                        price       = __utils__.findOne(".purchase-actions .price"),
                        price_was    = __utils__.findOne(".purchase-actions .previous-price"),
                        inStock     = __utils__.exists("button.add-to-cart"),
                        sku         = __utils__.findOne("input.product-code");

                    return   {
                        name        : (name !== null ? name.textContent.replace(/\n/g, "").trim() : null),
                        price       : (price !== null ? price.textContent.replace(/\n/g, "").trim() : null),
                        price_was    : ( price_was !== null ? price_was.textContent.replace(/\n/g, "").trim() : null),
                        inStock     : inStock,
                        description : __utils__.findAll(".product-long-description-brief p")
                            .map(function (e) { return e.textContent.replace(/&(?!amp;|gt;|lt;|quot;|nbsp;)+/g, '').trim(); }).join(" "),
                        sku    : (sku !== undefined ? sku.value : null)
                    };
                });

                // clean up code
                if (results["price"] !== null) {
                    results.price = dataType.currency(results.price);
                }

                if (results["price_was"]!== null) {
                    results.price_was = dataType.currency(results.price_was);
                } else if (results["price_was"] == null) {
                    delete results["price_was"];
                }

                results.description = dataType.string(results.description);

                self.results = results;
            }, function () {
                this.waitForSelector("*.no-result-suggestions", function () {
                    self.results = { page : "removed" };
                }, function () {
                    self.results = { error : "Page Error" };
                })

            });
        });
    });

    return this;
};

module.exports = Agent;


