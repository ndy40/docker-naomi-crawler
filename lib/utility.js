var require = patchRequire(require),
    utils = require('utils'),
    Utility = {};

/**
 * Method to validate input parameters for crawlerjs.
 */
Utility.validateScriptArgs = function (params) {
    'use strict';
    var errorMessage = true,
        fs = require("fs"),
        sys = require("system"),
        agentPath = "agents/" + params[0],
        agentFile = agentPath + "/" + params[1] + ".js",
        urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?.*$/i;

    /** Check that agent file works and exists. */
    if (!fs.isDirectory(agentPath)) {
        errorMessage =  "Partner directory doesn't not exists.\nDirectory supplied " + agentPath;
    }
    /** check if the agent file exist. */
    if (!fs.exists(agentFile)) {
        errorMessage = "Agent file doesn't not exists.Agent file should be Javascript file like fetcher.js|details.js.\nFile supplied is " + agentFile;
    }

    if (!urlRegex.test(params[2])) {
        errorMessage = "Input URL to crawl is invalid.";
    }

    return errorMessage;
};

/**
 * Utility method to generate xml output of results.
 * All Agents should have a results property filled up.
 */
Utility.buildResultOutput = function (resultObj) {
    'use strict';
    var utils = require("utils"),
        doc   = document.createElement("root"),
        results = document.createElement("results");

    if (utils.isArray(resultObj)) {
        //Iterate through properties and generate xml based on it.
        resultObj.forEach(function(item) {
            var keys = Object.keys(item),
                node = document.createElement("item");
            keys.forEach(function (key) {
                var property = document.createElement(key);
                property.appendChild(document.createTextNode(item[key]));
                node.appendChild(property);
            });
            results.appendChild(node);
        });
    } else if (utils.isObject(resultObj)) {
        var keys = Object.keys(resultObj),
                node = document.createElement("item");
            keys.forEach(function (key) {
                var property = document.createElement(key);
                property.appendChild(document.createTextNode(resultObj[key]));
                node.appendChild(property);
            });
            results.appendChild(node);
    }

    doc.appendChild(results);

    return doc.innerHTML;
};

Utility.buildRequestOutput = function (obj) {
    'use strict';
    var root = document.createElement("root"),
        request = document.createElement("request"),
        keys = Object.keys(obj);
    keys.forEach(function (e) {
        var prop = document.createElement(e);
        prop.appendChild(document.createTextNode(obj[e]));
        request.appendChild(prop);
    });
    root.appendChild(request);

    return root.innerHTML;
};

/**
 *
 * @param Casperjs.CurrentResponse context
 * @returns Object
 */
Utility.headers = function (context) {
    'use strict';
    var data = {};

    if (context !== null) {
        //return URL, status and time
        data.url        = context.url;
        data.time       = context.time;
        data.status     = context.statusText;
        data.httpCode   = context.status;

        context.headers.filter(function (item) {
            //regex to test for parameters.
            if (/date|expires|last\-modified/ig.test(item.name)) {
                return data[item.name] = item.value;
            }
        });
    }

    return data;
}

/* Export utility */
module.exports =  Utility;
