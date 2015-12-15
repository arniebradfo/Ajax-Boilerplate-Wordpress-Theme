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
		// console.log('httpMethod: '+httpMethod);
		if (httpMethod === 'GET' 
		||  httpMethod === 'POST' 
		||  httpMethod === 'PUT' ){
			xhttp.open(httpMethod, obj.href, true);
		} else {
			return false;
		}

		if (typeof obj.requestHeaders === 'object'){
			obj.requestHeaders.forEach( function(el) {
				xhttp.setRequestHeader(el.header, el.value);
				// console.log('header: '+el.header+'\nvalue: '+el.value);
			});
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

		var d = document;
		var main = d.getElementsByTagName('main')[0];

		var ajaxGetPage = {
			httpMethod: 'GET',
			timeoutTimer: 10000,
			requestHeaders:[{header:'WP-Request-Type', value: 'GetPage' }],
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
				console.log('ajax loaded!');

				// TODO: Test this
				if (typeof ga === 'function') {	// google universial analytics tracking 
					ga('send', 'pageview');     // send a pageview connected to anayltics.js loaded in footer.php
				}

				attachAjaxComments(); // comments section will be new - need to rebind events to new elements
				return true;
			}
		};

		var ajaxGetCommentsSection = {
			httpMethod: 'GET',
			timeoutTimer: 10000,
			requestHeaders: [{header:'WP-Request-Type', value:'GetCommentsSection'}],
			started: function(){
				console.log('the comment section has started loading');
			},
			delivered: function(responseText, statusText) {
				var workspace = d.createElement('div');
				workspace.innerHTML = responseText;
				console.log(workspace);

				// replace comments section
				d.getElementsByClassName('commentlist')[0].innerHTML = workspace.querySelector('.commentlist').innerHTML;

				// replace response area if nessasary
				if (!d.getElementById('respond')){
					var commentsSection = d.getElementById('comments-section'),
						newRespond      = workspace.querySelector('#respond');
					if (commentsSection && newRespond){
						commentsSection.appendChild(newRespond);
					}
				}

				var newNextPosts = workspace.querySelector('.next-posts'),
					newPrevPosts = workspace.querySelector('.prev-posts'),
					NextPosts = d.querySelectorAll('.next-posts'),
					PrevPosts = d.querySelectorAll('.prev-posts'),
					newCommentNavigation = function(newPosts, oldPosts, prepend) {
					if (newPosts.firstChild && oldPosts){
						// replace href
						oldPosts.forEach(function(el){
							if(el.firstChild){
								el.firstChild.href = newPosts.firstChild.href;
							} else {
								el.innerHTML = newPosts.innerHTML;
							}
						});
					} else {
						// delete div
						oldPosts.forEach(function(el){
							el.removeChild(el.firstChild);
						});
					}
				};
				newCommentNavigation(newNextPosts, NextPosts, true );
				newCommentNavigation(newPrevPosts, PrevPosts, false);
			}
		};

		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies of popstate
		addEvent(window, 'popstate', function(e) {
			// don't fire on the inital page load
			// TODO: make sure back button paginates comments??
			if (event.state !== null) {
				var optionsSurrogate = ajaxGetPage;
				optionsSurrogate.href = location.href;
				ajaxLoad(optionsSurrogate);
			}
		});

		// transforms all the interal hyperlinks into ajax requests
		// TODO: add support for subdomains. - subdomain is included in document.domain
		addEvent(d, 'click', function(event) {
			
			var e = window.event || event; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event
			// var e = event != 'undefined' ? event : window.event; // this seems more safe...

			if ( e.target.tagName !== 'A' && e.target.tagName !== 'AREA' ){
				// if the click event was not on a linked element
				return false;
			}
			var href = e.target.href;
			var anchorLink = new RegExp(window.location.origin+window.location.pathname+'#', 'g' );

			if ((href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) // if the link goes to the current domain
			&& !href.match(anchorLink) // href isnt an anchor to the current page
			&& href != window.location.href // href isn't a link to the current page
			&& !href.match(/\/wp-/g) ){ // href doesn't go to the wp-admin backend

				e.preventDefault();
				history.pushState({}, '', href);
				var optionsSurrogate;
				// if the link is in the comment-navigation
				if (e.toElement.parentNode.parentNode.className.match(/\bcomment-navigation\b/g)){
					optionsSurrogate = ajaxGetCommentsSection;
					optionsSurrogate.href = href;
					ajaxLoad(optionsSurrogate);
				} else {
					optionsSurrogate = ajaxGetPage;
					optionsSurrogate.href = href;
					ajaxLoad(optionsSurrogate);
				}
			}
		});

		return true;
	}

	function attachAjaxComments(){
		var d = document;
		var commentform = d.getElementById('commentform');
		var statusdiv = d.getElementById('comment-status');
		if (commentform) {
			addEvent(commentform, 'submit', function(e){
				e.preventDefault();
				submitComment(commentform, statusdiv);
			});
		}
	}

	function submitComment(commentform, statusdiv){
		var d = document;
		// Extract action URL from commentform
		var formurl = commentform.action;
		// Serialize and store form data
		var formdata = commentform.serialize().replace(/%20/g, '+'); // Apparetly this is helpful - https://stackoverflow.com/questions/4276226/ajax-xmlhttprequest-post/
		var parentCommentId = /&comment_parent=(\d+)/.exec(formdata)[1];
		var commentStatus = {
			// TODO: add better error messages
			placeholder:  '<p class="ajax-placeholder">Processing...</p>',
			invaid:       '<p class="ajax-error" ><strong>ERROR:</strong> You might have left one of the fields blank, or be posting too quickly</p>',
			success:      '<p class="ajax-success" ><strong>SUCCESS:</strong> Thanks for your comment. We appreciate your response.</p>',
			error:        '<p class="ajax-error" ><strong>ERROR:</strong> Please wait a while before posting your next comment</p>',
		};
		// Post Form with data
		ajaxLoad({
			httpMethod: 'POST',
			href: formurl,
			data: formdata,
			requestHeaders: [ {header: 'WP-Request-Type', value: 'PostComment'} ],
			started: function(){
				// Add a status message while we wait for the response
				statusdiv.innerHTML = commentStatus.placeholder;
			},
			failed: function(status, statusText, href) {
				statusdiv.innerHTML = commentStatus.invaid;
				return false;
			},
			// replace the entire comments section
			// delivered: function( commentOutput, textStatus){
			// 	var workspace = d.createElement('div');
			// 	workspace.innerHTML = commentOutput;
			// 	d.querySelector('#comments-section').innerHTML = workspace.querySelector('#comments-section').innerHTML;
			// 	// TODO: need someway to permanently set click diverts on submit buttons
			// }
			delivered: function( commentLI, textStatus ) {
				var wrapperUL       = d.createElement('ul');
				wrapperUL.className = 'children';
				// wrapperUL.innerHTML will return commentLI as an HTML element - not a string.
				wrapperUL.innerHTML = commentLI;
				// in case wordpress sends a formatted error page
				if (wrapperUL.querySelector('#error-page')){
					// TODO: test this
					commentStatus.wpError = wrapperUL.getElementsByTagName('p')[0].innerHTML;
					console.log( 'commentStatus: '+ commentStatus.wpError );
					statusdiv.innerHTML = commentStatus.wpError;
					return false;
				} else {
					// if the comment doesn't have a parent, i.e. is it a reply?
					if ( parentCommentId == '0' ) {
						var commentlist = d.getElementsByClassName('commentlist')[0];
						if ( commentlist ){
							commentlist.prependChild(wrapperUL.children[0]);						
						} else {
							console.log('there is nowhere to put the comment');
							statusdiv.innerHTML = commentStatus.error;
							return false; 
						}
					} else {
					 	var childrenUL = d.querySelector('#comment-'+parentCommentId+' > ul.children');
					 	if (childrenUL !== null) {
					 		childrenUL.appendChild(wrapperUL.children[0]);
					 	} else {
					 		d.getElementById('comment-'+parentCommentId).appendChild(wrapperUL);
				 		}
					}
					statusdiv.innerHTML = commentStatus.success;
					commentform.querySelector('textarea[name=comment]').value = '';
				}
			}
		});
		return true;
	}
	
	// attach element outside of this
	// find a better way to call this?
	plusPjax();
	attachAjaxComments();


})();
//}(window.jQuery || window.$));