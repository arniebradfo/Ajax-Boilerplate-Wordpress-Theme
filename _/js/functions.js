// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

// remap jQuery to $
// (function ($) {

(function() {

	// normalizes adding event listeners/handlers (http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser)
	function addEvent(elem, event, fn) {
		//console.log('addEvent was called on '+elem+' with function '+fn);
		if (elem.addEventListener) {
			elem.addEventListener(event, fn, false);
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + event, function() {
				// set the this pointer same as addEventListener when fn is called
				return(fn.call(elem, window.event));
			});
		}
	}
	// Add the forEach method to Array elements if absent
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fn, scope) {
			'use strict';
			var i, len;
			for (i = 0, len = this.length; i < len; ++i) {
				if (i in this) {
					fn.call(scope, this[i], i, this);
				}
			}
		};
	}
	// Extrapolate the Array forEach method to NodeList elements if absent */
	if (!NodeList.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
	// Extrapolate the Array forEach method to HTMLFormControlsCollection elements if absent
	if (!HTMLFormControlsCollection.prototype.forEach) {
		HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach;
	}
	// Convert form elements to query string or JavaScript object.
	HTMLFormElement.prototype.serialize = function(asObject) { // @param asObject: If the serialization should be returned as an object.
		'use strict';
		var form = this;
		var elements;
		var add = function(name, value) {
			value = encodeURIComponent(value);
			if (asObject) {
				elements[name] = value;
			} else {
				elements.push(name + '=' + value);
			}
		};
		if (asObject) {
			elements = {};
		} else {
			elements = [];
		}
		form.elements.forEach(function(element) {
			switch (element.nodeName) {
				case 'BUTTON':
					/* Omit this elements */
					break;
				default:
					switch (element.type) {
						case 'submit':
						case 'button':
							/* Omit this types */
							break;
						default:
							add(element.name, element.value);
							break;
					}
					break;
			}
		});

		if (asObject) {
			return elements;
		}

		return elements.join('&');
	};

	// opposite of Object.appendChild
	Object.prototype.prependChild = function(child) {
		this.insertBefore( child, this.firstChild );
	};

	function ajaxLoad(obj) {
		
		var xhttp = new XMLHttpRequest();
		addEvent( xhttp, 'readystatechange', function() {
			switch (xhttp.readyState){
				// case 0: ajaxLoadStart(); break; // I think this is fired when the constructor is called, before this block is set
				case 1: if(typeof obj.connected  === 'function'){ obj.connected(); } break;
				case 2: if(typeof obj.requested  === 'function'){ obj.requested(); } break;
				case 3: if(typeof obj.processing === 'function'){ obj.processing(); } break;
				case 4:
					if (xhttp.status >= 200 && xhttp.status < 300) {
						if(typeof obj.delivered === 'function'){
							obj.delivered(xhttp.responseText, xhttp.statusText);
						}
						break;
					} else {
						if(typeof obj.failed === 'function'){
							obj.failed(xhttp.status, xhttp.statusText, obj.href);								
						}
						break;
					}
			}
		});
		xhttp.timeout = typeof obj.timeoutTimer === 'number' ? obj.timeoutTimer : 0 ; // (in milliseconds) Set the amout of time until the ajax request times out.
		if (typeof obj.started === 'function'){
			addEvent( xhttp, 'loadstart', function(){ obj.started(); });
		}
		if (typeof obj.aborted === 'function'){
			addEvent( xhttp, 'abort',     function(){ obj.aborted(); });
			addEvent( xhttp, 'timeout',   function(){ obj.aborted(timoutTimer); }); 
		}
		if (typeof obj.finished === 'function'){
			addEvent( xhttp, 'loadend',   function(){ obj.finished(); }); 
		}

		var httpMethod = typeof obj.httpMethod === 'string' ? obj.httpMethod.toUpperCase() : 'GET' ;
		console.log('httpMethod: '+httpMethod);
		if (httpMethod === 'GET' 
		||  httpMethod === 'POST' 
		||  httpMethod === 'PUT'
		){
			xhttp.open(httpMethod, obj.href, true);
		} else {
			return false;
		}

		xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if ( typeof obj.data === 'string' ){
			xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhttp.send(obj.data);
		} else {
			xhttp.send();
		}

		return true;
	}

	// adds pjax to all internal hyperlink elements (https://rosspenman.com/pushstate-jquery/)
	// TODO: add hover prefetch option to increase performance ( copy: http://miguel-perez.github.io/smoothState.js/ )
	function plusPjax() {
		// console.log('plusPjax was called');

		var d = document;
		var main = d.getElementsByTagName('main')[0]; // put the contents of the <main> tag into an object

		var ajaxGetPage = {
			httpMethod: 'GET',
			timeoutTimer: 10000,
			started: function() {
				// After the XMLHttpRequest object has been created, but before the open() method has been called
				// console.log('ajax load has not yet been initalized');
				return true;
			},
			connected: function() {
				// The open method has been invoked successfully
				// console.log('Connection Established');
				return true;
			},
			requested: function() {
				// The send method has been invoked and the HTTP response headers have been received
				// console.log('Request Recieved');
				return true;
			},
			processing: function() {
				// HTTP response content begins to load
				// console.log('Processing Request');
				return true;
			},
			aborted: function(timoutTimer) {
				var timoutText = timoutTimer == 'undefined' ? '' : 'The request timed out after '+timoutTimer+' milliseconds.';
				console.log( 'ajax load was aborted.\n'+timoutText );
				return true;
			},
			finished: function() {
				// called when ajax is finished, pass or fail.
				// console.log( 'ajax is done...' );
				return true;
			},
			failed: function(status, statusText, href) {
				// called when the response is recieved with an error
				errorStatusText = typeof statusText == 'undefined' ? '' : 'Error Message: '+ statusText ;
				console.log( 'ajax load failed with an error code: '+ status +'\n'+errorStatusText);
				location.href = href;
				return true;
			},
			delivered: function(responseText, statusText) {
				// Do this once the ajax request is returned.
				console.log('ajax loaded!');
				//console.log(responseText);
				// console.log(responseXML);
				console.log(statusText);

				var workspace       = d.createElement("div");
				workspace.innerHTML = responseText;
				d.title             = workspace.getElementsByTagName('title')[0].innerHTML; // update the doc title
				main.innerHTML      = workspace.getElementsByTagName('main')[0].innerHTML;  // update the content

				// update the the class list of all menu items
				menuItems = workspace.querySelector('#wp-all-registered-nav-menus').querySelectorAll('.menu-item');
				for (var i = 0; i < menuItems.length; ++i) {
					var item = menuItems[i];  // Calling myNodeList.item(i) isn't necessary in JavaScript
					d.getElementById(item.id).className = item.className;
				}

				// TODO: Test this
				if (typeof(ga) === typeof(Function)) {	// google universial analytics tracking 
					ga('send', 'pageview');     // send a pageview connected to anayltics.js loaded in footer.php
				}

				return true;
			}
		};

		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies of popstate
		addEvent(window, 'popstate', function(e) {
			// don't fire on the inital page load
			if (event.state !== null) {
				var optionsSurrogate = ajaxGetPage;
				optionsSurrogate.href = location.href;
				ajaxLoad(optionsSurrogate);
			}
		});

		// transforms all the interal hyperlinks into ajax requests
		// TODO: add exception for #id links.
		// TODO: add support for subdomains. - subdomain is included in document.domain
		// TODO: add exception for /wp-admin
		addEvent(d, 'click', function(event) {
			
			var e = window.event || event; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event
			// var e = event != 'undefined' ? event : window.event; // this seems more safe...

			if ( e.target.tagName !== 'A' && e.target.tagName !== 'AREA' ){
				return;
			}

			var href = e.target.href;
			//console.log("href was: "+href);

			// TODO: is this nessasary?
			if (!href.match(location.origin)) {
				//console.log("there was not a match");
				href = href.replace(/^[^\/]+(?=\/)/,location.origin);
			}

			//console.log("href is now: "+href);
			//console.log("domain is: "+document.domain);
			//console.log("location origin is: "+location.origin);

			if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
				if ( !href.match(/\/.*[#?]/g) && !href.match(/\/wp-/g)) {
					e.preventDefault();
					history.pushState({}, '', href);
					var optionsSurrogate = ajaxGetPage;
					optionsSurrogate.href = href;
					ajaxLoad(optionsSurrogate);
				} else {
					return false;					
				}
			}
		});

		return true;
	}

	function ajaxComments() {

		var d = document;

		// if comments section exists
		if ( d.getElementById('commentform') ) {
			// attach divert to comment form submit 

			var commentform = d.getElementById('commentform');
			var statusdiv = d.getElementById('comment-status');
			commentStatus = {
				placeholder:  '<p class="ajax-placeholder">Processing...</p>',
				invaid:       '<p class="ajax-error" ><strong>ERROR:</strong> You might have left one of the fields blank, or be posting too quickly</p>',
				success:      '<p class="ajax-success" ><strong>SUCCESS:</strong> Thanks for your comment. We appreciate your response.</p>',
				error:        '<p class="ajax-error" ><strong>ERROR:</strong> Please wait a while before posting your next comment</p>',
			};

			addEvent(commentform, 'submit', function(e){
				e.preventDefault();
				submitComment();
				// console.log('the comment was submitted');
				// console.log('commentform = '+ commentform);
				// console.log('statusdiv = '+ statusdiv);
			});

			submitComment = function(){
				// Extract action URL from commentform
				var formurl = commentform.action;
				// console.log('formurl: '+formurl);

				// Serialize and store form data
				var formdata = commentform.serialize().replace(/%20/g, '+'); // Apparetly this is helpful - https://stackoverflow.com/questions/4276226/ajax-xmlhttprequest-post/
				// console.log(formdata);

				// parentPost = formdata.match(/(?:&comment_parent=)\d+/g)[0].match(/\d+/g)[0];
				var parentPostId = /&comment_parent=(\d+)/.exec(formdata)[1];
				// console.log('parentPostId: '+parentPostId);
				// // Post Form with data
				ajaxLoad({
					httpMethod: 'POST',
					href: formurl,
					data: formdata,
					started: function(){
						// Add a status message while we wait for the response
						statusdiv.innerHTML = commentStatus.placeholder;
					},
					failed: function(status, statusText, href) {
						statusdiv.innerHTML = commentStatus.invaid;
						// console.log(
						// 	'status: ' +status+',\n'+
						// 	'statusText: '+statusText+',\n'+
						// 	'href: '+href
						// );
						return false;
					},
					delivered: function( commentLI, textStatus ) {
						console.log(commentLI);

						var wrapperUL       = d.createElement('ul');
						wrapperUL.className = 'children';
						// wrapperUL.innerHTML will return commentLI as an HTML element - not a string.
						wrapperUL.innerHTML = commentLI;

						// in case wordpress sends a formatted error page
						if (wrapperUL.querySelector('#error-page')){
							commentStatus.wpError = wrapperUL.getElementsByTagName('p')[0].innerHTML;
							console.log( 'commentStatus: '+ commentStatus.wpError );
							statusdiv.innerHTML = commentStatus.wpError;
							return false;
						} else {
							statusdiv.innerHtml = commentStatus.success;
							console.log('wrapperUL: '+wrapperUL);
							// if the comment doesn't have a parent, i.e. is it a reply?
							if ( parentPostId == '0' ) {
								d.getElementsByClassName('commentlist')[0].prependChild(wrapperUL.children[0]);
							} else {
							 	var childrenUL = d.querySelector('#comment-'+parentPostId+' > ul.children');
							 	if (childrenUL !== null) {
							 		childrenUL.prependChild(wrapperUL.children[0]);
							 	} else {
							 		d.getElementById('comment-'+parentPostId).prependChild(wrapperUL);
						 		}
							}
							commentform.querySelector('textarea[name=comment]').value = '';
						}
					}
				});
				return true;
			};
		}

	}
	
	// find a better way to call this?
	plusPjax();
	ajaxComments();


})();
//}(window.jQuery || window.$));