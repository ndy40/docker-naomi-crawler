/**
 * This is the main script for running and initialising all scrapes.
 * @author Ndifreke Ekott <ndy40.ekott@gmail.com>
 * @copyright 2015
 */

var require = patchRequire(require),
    casperjs = require("casper").create(),
    utils = require("utils"),
    sys = require("system"),
    fs = require("fs"),
    helper,
    args,
    options,
    agent,
    isValid,
    buildAgentInstance;

//change to crawler working directory
fs.changeWorkingDirectory("/data"); 

helper = require(fs.absolute(".") + "/lib/utility");

/**
 * Create an instance of the fetcher from the passed in parameter.
 */
buildAgentInstance = function () {
    "user strict";
    var args = casperjs.cli.args,
        agentPath = fs.workingDirectory + "/agents/" + args[0] + "/" + args[1] + ".js", //fs.absolute(".") + "/agents/" + args[0] + "/" + args[1] + ".js",
        fn = require(agentPath);
    fn = new fn(null, casperjs);
    fn.url = args[2];

    return fn;
};

//////////////////////
/// Execution ///////
////////////////////
args = casperjs.cli.args;
options = casperjs.cli.options;
casperjs.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36");

isValid =  helper.validateScriptArgs(casperjs.cli.args);

if (isValid !== true) {
    if (casperjs.cli.has("verbose")) {
        casperjs.echo("Arguments");
        utils.dump(casperjs.cli.args);
        casperjs.echo("Options");
        utils.dump(casperjs.cli.options);
    }
    casperjs.echo(isValid);
    casperjs.exit(1);
}

agent = buildAgentInstance.call(this);
agent.build();
casperjs.run(function () {
        var requestData = helper.buildRequestOutput(helper.headers(this.currentResponse)),
            scrapeData = helper.buildResultOutput(agent.results),
            root = "<root>" + requestData + scrapeData + "</root>";
        //var parser = new DOMParser();
        //    scrapeData = parser.parseFromString(scrapeData);
        this.echo(root);
        this.exit(0);
    });



