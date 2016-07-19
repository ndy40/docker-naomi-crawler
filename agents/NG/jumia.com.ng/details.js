var require = patchRequire(require),
    fs  = require("fs"),
    utility = require("../../../lib/utility"),
    dataType = require("../../../lib/DataType"),
    baseClass = require("../../../lib/Agent"),
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
            if (/track|talk|twitter|addthis|facebook|tag|analytics/i.test(requestData.url)) {
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
            this.waitUntilVisible(".details-footer button.-add-to-cart", function () {
                var results = this.evaluate(function () {
                    var name        = __utils__.findOne("*[itemprop=name]"),
                        price       = __utils__.findOne(".details-footer *.price-box *[data-price]"),
                        price_was    = __utils__.findOne(".details-footer *.price-box .-old *[data-price]"),
                        inStock     = __utils__.exists(".details-footer button.-add-to-cart"),
                        sku         = __utils__.findOne("input[type=hidden][name=rating-sku]");


                    return   {
                        name        : (name !== null ? name.textContent.replace(/\n/g, "").trim() : null),
                        price       : (price !== null ? price.textContent.replace(/\n/g, "").trim() : null),
                        price_was    : ( price_was !== null ? price_was.textContent.replace(/\n/g, "").trim() : null),
                        inStock     : inStock,
                        description : __utils__.findAll("#productDescriptionTab > .product-description *")
                            .map(function (e) { return e.textContent.replace(/&(?!amp;|gt;|lt;|quot;|nbsp;)/g, '').trim(); }).join(" "),
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
            });
        });
    });

    return this;
};

module.exports = Agent;


