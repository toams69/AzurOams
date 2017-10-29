define([
    "jquery",
    "./utils"
], function ($, utils) {
    "use strict";
    // String-to-number lookup
    var levels = {
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        off: 0
    };

    // Used by stock write function
    var dateFormat = "{FullYear}-{Month:2}-{Date:2} "
        + "{Hours:2}:{Minutes:2}:{Seconds:2}.{Milliseconds:3}";

    /**
     * Create a new logger that is bound to the given module name.
     * @param {String} The module name.
     * @constructor
     * @class A module-bound logger with support for different logging levels.
     *        The levels are, in order of severity levels are:
     *        "error", "warn", "info" and "debug".
     *        The logger instance has functions with the lowercase version of
     *        these level names for logging messages at those level.
     *        The <code>level</code> property of the logger instance defaults to
     *        "info" and can be overridden per logger instance to filter
     *        messages. Use "off" to turn logging off entirely. For an
     *        instance-wide override, set Logger.prototype.level instead.
     */
    function Logger(module) {
        this.module = module;
    }

    Logger.prototype = {
        /**
         * Filters log messages. Only messages equally or more severe than this
         * level will be logged. Default is "info". Setting this to "off"
         * disables all logging.
         */
        level: "debug",
        /**
         * The ultimate write method that the Logger uses for output.
         * This can be overriden to direct log messages elsewhere.
         * @param {String} level
         * @param {String} module
         * @param {String} str
         */
        write: (function (console) {
            return console && console.log
                ? function (level, module, str) {
                    str = utils.format("{1} [{2}] {3}",
                        utils.formatDate(new Date(), dateFormat), module, str);
                    var fn = console[level] || console.log;
                    if (fn.call) {
                        fn.call(console, str);
                    } else {
                        fn(str);
                    }
                }
                : function () {};
        }(window.console))
    };

    // Generate logging functions
    $.each(levels, function (level, numeric) {
        if (numeric) {
            Logger.prototype[level] = (function (numeric) {
                return function () {
                    if (numeric <= levels[this.level]) {
                        this.write(level, this.module,
                            utils.format.apply(null, arguments));
                    }
                    return this;
                };
            }(numeric));
        }
    });

    return Logger;
});
