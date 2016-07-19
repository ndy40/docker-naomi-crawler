/**
 * This is a class for managing all datatype issues.
 */

var DataType = {
    locale : "en-gb"
};

DataType.currency = function (value) {
    'use strict';
    var result,
        options = {
            "en-gb" : {
                replace : /\,/ig,
                currency : /^\D*[^\d+]/ig
            }
        };
    if (value !== null || value !== undefined) {
        result = value.replace(options[this.locale].replace, "")
            .replace(options[this.locale].currency, "");
    }

    return parseFloat(result);
};

DataType.string = function (value) {
    'use strict';
    if (value) {
        return value.replace(/&(?!amp;|gt;|lt;|quot;|nbsp;)/g, '');
    }
    return null;
};

module.exports = DataType;
