/*global export */

/**
 *Base class describing the structure of an Agent class. 
 * @author Ndifreke Ekott <ndy40.ekott@gmail.com>
 * @copyright 2015 
 */

/**
 * A base class for all Agents. 
 * @constructor 
 */
var Agent = function (name, capser) {
    'use strict';
    this.name = name || "Default Agent";
    this.casperjs = capser || undefined;
    this.results = null;
    this.url = undefined;
};

/**
 * Method for initialising casperjs before run. 
 */
Agent.prototype.init = function () {
    'use strict';
    this.casperjs.blockContent(
        ["https?:\/\/.+?\.css", "google"]   
    );
    return {};
};

/**
 * Build the 
 */
Agent.prototype.build = function () {
    'use strict';
    var initOptions = this.init(),
        optionKeys = Object.keys(initOptions),
        that = this.casperjs;
        
    //setup casperjs options. 
    if (Array.isArray(optionKeys)) {
        optionKeys.forEach(function (key) {
            that.options[key] = initOptions[key];
        });
    }
    
    //build and run scrapes.
    this.scrape();

    return this;
};

/**
 * Method for scraping page. 
 */
Agent.prototype.scrape = function (onDataReady) {
    'use strict';
    var casperjs = this.casperjs;
    
    casperjs.start(this.url, function () {
        this.echo(this.status(true));
        this.echo("This is just a default test");
    });
    
    this.results = {"name" : "This is sample output"};
        
    return this;
};

/**
 *  Method to get the casper instance used by scrape agent. 
 */
Agent.prototype.casperjs = function () {
    'use strict';
    return this.casperjs;
};

module.exports =  Agent;