/*!
 * @License INTERACTION WORKSPACE.web edition
 * Copyright (c) 2013 Genesys Telecommunications Laboratories
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <thomas.pariaud@genesyslab.com>
 * USER NAME:          Regis Cosnier <regis.cosnier@genesyslab.com>
 * FILE NAME:          WWE-utils.js
 */

define([
	'jquery',
	'i18n!../nls/strings'
], function(
	$,
	i18n
) {

	// Utils String Functions
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str){
			return this.indexOf(str) === 0;
		};
	}

	 // // Polyfill for the deprecated $.browser!
    if(!$.browser) {
        (function() {
            var matched, browser;
            // Use of jQuery.browser is frowned upon.
            // More details: http://api.jquery.com/jQuery.browser
            // jQuery.uaMatch maintained for back-compat
            var uaMatch = function( ua ) {
                ua = ua.toLowerCase();
                var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                    /(msie) ([\w.]+)/.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                    [];
                return {
                    browser: match[ 1 ] || "",
                    version: match[ 2 ] || "0"
                };
            };
            matched = uaMatch( navigator.userAgent );
            browser = {};
            if ( matched.browser ) {
                browser[ matched.browser ] = true;
                browser.version = matched.version;
            }
            // Chrome is Webkit, but Webkit is also Safari.
            if ( browser.chrome ) {
                browser.webkit = true;
            } else if ( browser.webkit ) {
                browser.safari = true;
            }
            $.browser = browser;
        })();
    }
    //HTCC-5574 
    $.browser.msie = (navigator.userAgent.search("MSIE") >= 0) || (navigator.userAgent.search("Trident/7.") >= 0);

	// Time format function
	var timeFormat= function (duration, mask) {
		masks = {
			"default":	"HMM:ss",
			shortTime:	"h:MM",
			mediumTime:	"h:MM:ss",
			longTime:	"hh:MM:ss"
		};

		mask = String(masks[mask] || mask || masks["default"]);

		var token = /([HhMsT])\1?|"[^"]*"|'[^']*'/g,
			result = "",
			time = Math.floor(duration / 1000),
			seconds = time % 60,
			minutes = Math.floor(time / 60) % 60,
			hours = Math.floor(time / 3600),
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) {
					val = "0" + val;
				}
				return val;
			};

			result = hours + ":" + result;

			flags = {
				h:    hours % 12 || 12,
				hh:   pad(hours % 12 || 12),
				H:    hours === 0 ? "" : hours+":",
				HH:   pad(hours),
				M:    minutes,
				MM:   pad(minutes),
				s:    seconds,
				TT:   hours < 12 ? "AM" : "PM",
				ss:   pad(seconds)
			};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
	};


	var Utils = {


		print: function($elem) {
        	$(".print-body").empty();
        	$(".print-body").html($elem);
        	setTimeout(function() {
        		window.print();
        	}, 500);
        },

		isBrowserZoomSetToDefault: function() {
			return  ($.browser.mozilla && window.matchMedia('(max--moz-device-pixel-ratio:0.99), (min--moz-device-pixel-ratio:1.01)').matches) ||
         		    ($.browser.webkit && window.matchMedia('(-webkit-max-device-pixel-ratio:0.99), (-webkit-min-device-pixel-ratio:1.01)').matches) ||
					($.browser.msie && (screen.deviceXDPI / screen.systemXDPI) !==1); 

		},

		extractUrlParams: function() {  
	      var t = location.search.substring(1).split('&');
	      var f = [];
	      for (var i=0; i<t.length; i++){
	        var x = t[ i ].split('=');
	        f[x[0]]=x[1];
	      }
	      return f;
    	},


		// htccOperation: function(functionType, functionString, parameter) {
		// 	var ajax = {
		// 		type: functionType,
		// 		url: parameter.url,
		// 		contentType: 'application/json; charset=UTF-8',
		// 		data: JSON.stringify(parameter.operation)
		// 	};
		// 	if (parameter.authenticate || this.htccToken) {
		// 		ajax.beforeSend =  
		// 			_.bind(function(req) {
		// 				if (this.htccToken) {
		// 	 				req.setRequestHeader('X-CSRF-TOKEN',this.htccToken);
		// 		 		}
		// 		 		if (parameter.authenticate) {
		// 		 			req.setRequestHeader('Authorization', 'Basic ' + parameter.authenticate);
		// 		 		}
		// 		 	},this);
		// 	}
		// 	if (parameter.data) {
		// 		ajax.data = parameter.data;
		// 		ajax.processData = false;
		// 		ajax.contentType = false;
		// 	}
		// 	return $.ajax(ajax).then(
		// 		function(data) {
		// 			if ((logger = parameter.logger) && logger.level === "debug") {
		// 				// ajax is not needed so we can parse data back (it is needed to filter sensitive data)
		// 				ajax.data = parameter.operation;
		// 				logger.debug("Command: '" + parameter.name + "' sent\n$.ajax(" + JSON.stringify(Utils.filterData(ajax)) + ")\nSUCCEED with:\n" + JSON.stringify(data, null, '\t'));
		// 			}
		// 			if (parameter.data && _.isString(data))
		// 				data = JSON.parse(data);
		// 			if(data && data.statusCode !== 0) {
		// 				if ((logger = parameter.logger) && logger.level === "debug") {
		// 					logger.debug("But the " + Utils.dumpStatusCode(data));
		// 				}
		// 				if (parameter.eventBus  && (parameter.triggerError === undefined || parameter.triggerError)) {
		// 					//DESKTOP-2450: If parameter.errorId is null, add a generic error message
		// 					parameter.eventBus.trigger("error", { type: functionString, errorId: parameter.errorId ? parameter.errorId : i18n.error_post_unknown_error,
		// 												command: parameter.command, context: parameter.context});
		// 				}
		// 			}
		// 			return data;
		// 		},
		// 		function(error) {
		// 			if ((logger = parameter.logger) && logger.level === "debug") {
		// 				// ajax is not needed so we can parse data back (it is needed to filter sensitive data)
		// 				ajax.data = parameter.operation;						
		// 				logger.debug("Command: '" + parameter.name + "' sent\n$.ajax(" + JSON.stringify(Utils.filterData(ajax)) + ")\nFAILED with:\n" + JSON.stringify(error, null, '\t'));
		// 			}
					
		// 			if (parameter.eventBus && (parameter.triggerError === undefined || parameter.triggerError)) {
		// 				//DESKTOP-2450: Add error.statusText if parameter.errorId is null. And, add a generic error message if error.statusText is also null)
		// 				var errorMessage = i18n.error_post_unknown_error;
		// 				if (parameter.errorId) {
		// 					errorMessage = parameter.errorId;
		// 				} else {
		// 					if (error && error.statusText) {
		// 						errorMessage = error.statusText;
		// 					}
		// 				}
		// 				if (parameter.interactionId) {
		// 					parameter.eventBus.trigger("error", { type: "Interaction", errorId: errorMessage, interactionId:parameter.interactionId,command: parameter.command, context: parameter.context});
		// 				} else {
		// 					parameter.eventBus.trigger("error", { type: functionString, errorId: errorMessage,command: parameter.command, context: parameter.context});
		// 				}
		// 			}
		// 			return JSON.stringify(error, null, '\t');
		// 		}
		// 	);
		// },

		// getOperation: function(parameter) {
		// 	return this.htccOperation("GET","GetOperation",parameter);
		// },

		// postOperation: function(parameter) {
		// 	return this.htccOperation("POST","PostOperation",parameter);
		// },

		// deleteOperation: function(parameter) {
		// 	return this.htccOperation("DELETE","DeleteOperation",parameter);
		// },

		// putOperation: function(parameter) {
		// 	return this.htccOperation("PUT", "PutOperation", parameter);
		// },


		fixDateString: function(date) {
			if (date) {
				//Date in workbinEvents (ItemAdded) is a string represented this way: yyyy-mm-dd HH:MM:ss.iii+0000 (i stands for milliseconds there)
				//This string can't be parsed with IE10 and Firefox.
				//With firefox, the space between yyyy-mm-dd and HH:MM:ss.iii+0000 should be replaced with a T
				//With IE10, in addition to that, the +0000 should be replaced with a Z, so that the string looks like: yyyy-mm-ddTHH:MM:ss.iiiZ
				var d = new Date(date);
				if (!$.browser.chrome && (!(d instanceof Date) || isNaN(d.getTime())) && typeof date.replace == 'function') {
					//For Firefox,it's needed to replace space with T
					date = date.replace(" ","T");
					//For IE10, replace the +0000 with Z
					var index = date.lastIndexOf('+') === -1 ? date.lastIndexOf('-') : date.lastIndexOf('+');
					var indexT = date.lastIndexOf("T");
					if ($.browser.msie && index >= 0 && index > indexT) {
						if (date.length - index === 5) {
							var tz = ":"+date.substr(index+3, 2);
							date = date.substring(0,index + 3);
							date += tz;
						} else {
							date = date.substring(0,index);
							date += "Z"; 
						}	
					}
				}
			}
			return date;
		},

		dateFormat: function (date, mask) {
			var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[oSZ]|"[^"]*"|'[^']*'/g,
				timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g,
				timezoneClip = /[^-+\dA-Z]/g,
				utc = false,
				ucsDateFormat = false,
				pad = function (val, len) {
					val = String(val);
					len = len || 2;
					while (val.length < len) {
						val = "0" + val;
					}
					return val;
				};

			masks = {
				"default":      "mmm dd yyyy h:MM TT",
				shortDate:      "m/d/yy",
				mediumDate:     "mmm d, yyyy",
				longDate:       "mmmm d, yyyy",
				fullDate:       "dddd, mmmm d, yyyy",
				shortTime:      "h:MM TT",
				mediumTime:     "h:MM:ss TT",
				longTime:       "h:MM:ss TT Z",
				isoDate:        "yyyy-mm-dd",
				isoTime:        "HH:MM:ss",
				isoDateTime:    "yyyy-mm-ddTHH:MM:ss",
				isoUtcDateTime: "UTC:yyyy-mm-ddTHH:MM:ssZ"
			};

			// Passing date through Date applies Date.parse, if necessary
			var dateStr = this.fixDateString(date);
			date = dateStr ? new Date(dateStr) : new Date();
			
			if (isNaN(date)) {
				return date;
			}
			if (mask === "localeDate") {
				return date.toLocaleDateString() + " " +date.toLocaleTimeString();
			}

			mask = String(masks[mask] || mask || masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			if (mask && mask.slice(0,4) == "UCS:") {
				mask = mask.slice(4);
				ucsDateFormat = true;
			}

			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				//L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  i18n.dayNames[D],
					dddd: i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  i18n.monthNames[m],
					mmmm: i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					//l:    pad(L, 3),
					//L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    ucsDateFormat ? "T" : H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    ucsDateFormat ? "Z" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		},

		timeFormat: timeFormat,

		brightness: function(hex, percent) {
			hex = hex.replace(/^\s*#|\s*$/g, '');
			if(hex.length == 3){
				hex = hex.replace(/(.)/g, '$1$1');
			}

			var r = parseInt(hex.substr(0, 2), 16),
				g = parseInt(hex.substr(2, 2), 16),
				b = parseInt(hex.substr(4, 2), 16);

			return '#' +
				((0|(1<<8) + r + (256 - r) * percent).toString(16)).substr(1) +
				((0|(1<<8) + g + (256 - g) * percent).toString(16)).substr(1) +
				((0|(1<<8) + b + (256 - b) * percent).toString(16)).substr(1);
		},

  		emptyIfNull: function(val) {
  			return val === null || typeof(val) == "undefined"?"":val; 
  		}      
	};
	
	return Utils;
});