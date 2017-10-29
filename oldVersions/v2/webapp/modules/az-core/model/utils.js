/**
 * General utility functions that are not tightly coupled with any libraries.
 * Please do not pollute this file with library-specific implementation.
 */
define(function () {
    "use strict";
    return {
        /**
         * Returns a string based on the given format spec and arguments.
         * @param {String} fmt The format string.
         *                     Use "{n}" to substitute the n-th argument
         *                     following the fmt argument. For example:
         *                     <code>format("{1}", "a")</code> returns "a".
         *                     Use "{p}" to subtitute the property named "p" of
         *                     the object immediately following the fmt
         *                     argument. For example:
         *                     <code>format("{a}", { a: 1 })</code> returns "1"
         *                     You can use both flavors of argument references
         *                     simultanously.
         * @return The formatted string.
         */
        format: function (fmt) {
            var args = arguments;

            return String(fmt).replace(/\{(?:(\d+)|(\w+))\}/g, function (s, idx, prop) {
                return prop && args[1]
                    ? args[1][prop]
                    : args[idx];
            });
        },

        /**
         * Formats a number based on the given format options.
         * @param {Number} n The number
         * @param {Object} fmt The format options:
         *                     <dl>
         *                     <dt>dd</dt><dd>Decimal point character</dd>
         *                     <dt>nd</dt><dd>Number of decimal digits</dd>
         *                     <dt>dg</dt><dd>Whole number grouping
         *                     delimiter</dd>
         *                     <dt>ng</dt><dd>Number of digits in a whole
         *                     number group</dd>
         *                     </dl>
         * @return The formatted string.
         */
        formatNumber: function (n, fmt) {
            var tokens = n.toFixed(fmt.nd).split(/\.|,/);

            if (fmt.dg) {
                var whole = tokens[0],
                    groups = [],
                    i;

                for (i = 0, n = whole.length % fmt.ng || fmt.ng;
                        i < whole.length; i += n, n = fmt.ng) {
                    groups.push(whole.substr(i, n));
                }

                tokens[0] = groups.join(fmt.dg);
            }

            return tokens.join(fmt.dd);
        },
        /**
         * Return the unit representation for the given number of bytes
         * @param n {Number} The number of bytes
         * @return An object with size and unit properties
         */
        getSizeUnit: function (n) {
            var units = [ "B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ],
                bytes = 1,
                unit;

            for (unit = 0; unit < units.length; unit++) {
                var nextBytes = bytes * 1024;

                if (n < nextBytes) {
                    return {
                        size: n / bytes,
                        unit: units[unit]
                    };
                }

                bytes = nextBytes;
            }
        },
        /**
         * Converts a Date to a string based on the format spec
         * @param {Date} date The Date instance.
         * @param {String} fmt The format string.
         *                     Use "{part}" to subtitute a date part, where
         *                     the part name comes from the Date object instance
         *                     methods like "getFullYear", without the "get"
         *                     prefix. For example:
         *                     <code>"{Month}/{FullYear}"</code>
         *                     Use "{part:padding}" where padding is the number
         *                     of zeros a numerical value should be padded with.
         *                     For example:
         *                     <code>"{FullYear}-{Month:2}-{Date:2}"</code>
         * @return The formatted string.
         */
        formatDate: function (date, fmt) {
            return fmt.replace(
                /\{([^}:]+)(?::(\d+))?\}/g,
                function (s, comp, pad) {
                    var fn = date["get" + comp];

                    if (fn) {
                        var v = (fn.call(date) +
                            (/Month$/.test(comp) ? 1 : 0)).toString();

                        if (pad && pad > v.length) {
                            return new Array.prototype.constructor(pad - v.length + 1).join("0") + v;
                        } else {
                            return v;
                        }
                    } else {
                        return s;
                    }
                }
            );
        },
        /**
         * Format a date string, preferrably with a human-readable relative time
         * Based on JavaScript Pretty Date by John Resig
         * todo: Deprecated. Use gax.locale.prettyDate instead.
         */
        prettyDate: function (date, fmt) {
            var diff = (((new Date()).getTime() - date.getTime()) / 1000);
            var day_diff = Math.floor(diff / (60 * 60 * 24));

            if (day_diff < 0) {
                return this.formatDate(date, fmt);
            }

            return ((day_diff === 0)
                && ((diff < 60 && "Just now")
                    || (diff < 120 && "1 minute ago")
                    || (diff < 3600 && Math.floor(diff / 60) + " minutes ago")
                    || (diff < 7200 && "1 hour ago")
                    || (diff < 86400 && Math.floor(diff / 3600) + " hours ago")
                ))
                || (day_diff === 1 && "Yesterday")
                || (day_diff < 7 && day_diff + " days ago")
                || (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago")
                || this.formatDate(date, fmt);
        },
        /**
         * Parse a string in ISO 8601 format into a Date object
         * The expected format is: yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
         * @param {String} s The date string
         * @return The parsed Date object
         */
        parseIsoDate: function (s) {
            var tokens = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d{3}))?Z$/
                .exec(s);
            if (tokens) {
                tokens.shift();
                tokens[1] -= 1; // Fix month
                tokens[6] = tokens[6] || 0;
                return new Date(Date.UTC.apply(null, tokens));
            } else {
                return new Date(NaN);
            }
        },
        /**
         * Parse a string in ISO 8601 format into a UTC Date object
         * The expected format is: yyyy-MM-dd
         * @param {String} s The date string
         * @return The parsed Date object
         */
        parseIsoDateComponent: function (s) {
            var tokens = /(\d{4})-(\d\d)-(\d\d)/
                .exec(s);
            tokens.shift();
            tokens[1] -= 1;
            return new Date(Date.UTC.apply(null, tokens));
        },
        parseDateComponent: function (s) {
            var tokens = /(\d{4})-(\d\d)-(\d\d)/
                .exec(s);
            tokens.shift();
            tokens[1] -= 1;
            return new Date(tokens[0], tokens[1], tokens[2]);
        },
        /**
         * todo: could have been hard-coded in OPM validation
         */
        matchIsoTimeComponent: function (s) {
            return s.match(/([0-1]?[0-9]|2[0-3]):([0-5][0-9])/);
        },
        /**
         * Tokenize a string a call a callback upon tokenization with the tokens
         * passed in as individual arguments to the function. This is a convenience
         * function that allows semantic mapping of tokens to named arguments.
         * Tokenization can either be done with a delimiter or a token-capturing
         * regular expression. In the latter case, the callback will only be called
         * if there is a regular expression match.
         * @param s {String} The string to tokenize.
         * @param tokenizer {RegExp, String} The tokenizer. If this is a regular
         *                                   expression, the captured tokens will
         *                                   be passed as arguments to the callback.
         *                                   Otherwise the tokenizer is used as a
         *                                   delimiter for simple tokenization via
         *                                   split().
         * @param callback {Function} The callback to be called with the tokens as
         *                            arguments.
         */
        tokenize: function (s, tokenizer, callback) {
            var tokens;
            if (tokenizer instanceof RegExp) {
                tokens = tokenizer.exec(s);
                if (tokens) {
                    tokens.shift();
                    callback.apply(null, tokens);
                }
            } else {
                tokens = s.split(tokenizer);
                callback.apply(null, tokens);
            }
        },
        /**
         * Return an autocomplete source that does substring matching, scoring based
         * on match index and limits results
         * todo: may not be the perfect place for this jQUI-related utility!!!
         */
        getAutoCompleteSource: function (source) {
            return function (request, response) {
                var results = [],
                    term = request.term.toLowerCase();

                source.forEach(function (item) {
                    var label = item.label || item;
                    var idx = label.toLowerCase().indexOf(term);

                    if (idx > -1) {
                        results.push($.extend(true, {}, item, {
                            label: item.label || item,
                            distance: idx
                        }));
                    }
                });

                results.sort(function (a, b) {
                    return a.distance - b.distance;
                });

                response(results.slice(0, 10));
            };
        },
        /**
         * Resolve a relative path based on the current path. Path delimiter is "/".
         * Current directory (".") and parent directory ("..") references are
         * supported. The last part of the current path is treated as the
         * "document" part. The current path should have a trailing "/" for the last
         * part to be treated as a folder.
         * @param current {String} The current path
         * @param path {String} The relative path to resolve
         * @return The resolved path
         */
        resolvePath: function (current, path) {
            var ret = current.split("/"),
                parts = path.split("/"),
                part;

            ret.pop(); // Remove "document" part
            part = parts.shift();

            while (part) {
                switch (part) {
                case ".":
                    // Ignore
                    break;
                case "..":
                    // Go one level up
                    ret.pop();
                    break;
                default:
                    ret.push(part);
                }
                part = parts.shift();
            }

            return ret.join("/");
        },
        // todo: eh? better name?
        compare: function (a, b) {
            return a === b
                ? 0
                : a < b ? -1 : 1;
        },
        /**
         * Resolve an argument that can be specified as a function for dynamic
         * evaluation
         */
        resolve: function (arg, scope) {
            return arg instanceof Function
                ? arg.call(scope)
                : arg;
        },
        /**
         * Resolve an array that can be specified as a non-array single argument as
         * shorthand
         */
        resolveArray: function (arg, scope) {
            arg = this.resolve(arg, scope);
            return arg instanceof Array
                ? arg
                : typeof arg !== "undefined" ? [ arg ] : [];
        },
        /**
         * Convert an array to a hash
         */
        toHash: function (arr, key) {
            var getKey = key instanceof Function
                ? key
                : function (item) {
                    return item[key];
                };

            var hash = {};

            arr.forEach(function (item) {
                hash[getKey(item)] = item;
            });

            return hash;
        },
        /**
         * Convert a hash to an array
         */
        toArray: function (hash) {
            var arr = [];

            $.each(hash, function () {
                arr.push(this);
            });

            return arr;
        },
        /**
         * Escapes a string for some HTML characters
         */
        escapeHtml: function (s) {
            return s.replace(
                /[&<>'"]/g,
                function (c) {
                    return "&" + {
                        "&": "amp",
                        "<": "lt",
                        ">": "gt",
                        "'": "apos",
                        '"': "quot"
                    }[c] + ";";
                }
            );
        },
        /**
         * Checks two objects for equality
         */
        equal: function (obj1, obj2) {
            function _equals(obj1, obj2) {
                var clone = $.extend(true, {}, obj1),
                    cloneStr = JSON.stringify(clone);
                return cloneStr === JSON.stringify($.extend(true, clone, obj2));
            }

            return _equals(obj1, obj2) && _equals(obj2, obj1);
        },
        /*
         * Runs the given function asynchronously
         */
        async: function (fn, scope) {
            return window.setTimeout(function () {
                fn.call(scope);
            }, 1);
        },



    };
});
