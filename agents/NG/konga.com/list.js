/*global __utils__ */

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
            if (/track|talk|google|twitter|addthis|facebook|postmessage|css/i.test(requestData.url)) {
                networkData.abort();
            }
        }
    };
};

Agent.prototype.scrape = function () {
    'use strict';
    var self = this,
        casperjs = this.casperjs,
        utils = require("utils"),
        results;

    casperjs.start(this.url, function () {
        this.wait(10000, function () {
            results = this.evaluate(function () {
                var urls =  __utils__.getElementsByXPath("//li[contains(@class, 'vertical-nav-item')]/ul//a[contains(@class, 'vertnavlink')]");
                return urls.filter(function (e) {
                    return !/category|&|search|\?/.test(e.href)
                }).map(function (e) {
                    return  {"url" : e.href };
                });
            });

        }).then(function () {
            self.results = results;
        });
    });

    return this;
};

module.exports = Agent;


