

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

// finds the WP comment entry section and adds a ctrl/cmd + enter lister
function attachCtrlEnterSubmitWPComment(){
	commentArea = document.getElementById('comment');
	if(commentArea){
		addEvent( commentArea, 'keydown', function(e){ 
				if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10) ){
					document.getElementById('submit').click();
			}
		}); 
	}
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

	var i, len;
	for (i = 0, len = form.elements.length; i < len; ++i) {
		var element = form.elements[i];
		if (i in form.elements) {
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
		}
	}

	if (asObject) {
		return elements;
	}

	return elements.join('&');
};

WPAjax_options = { // things that might change
	contentSelector: '#content',
	adminUrlRegEx: '\/wp-'
};

(function(d,opts) { // why the wrapper? -  http://stackoverflow.com/questions/2937227/what-does-function-jquery-mean

	WPAjax = {
		load: function(obj){
			var xhttp = new XMLHttpRequest();
			addEvent( xhttp, 'readystatechange', function() {
				switch (xhttp.readyState){
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
								obj.failed(obj.href, xhttp.status, xhttp.statusText, xhttp.responseText);								
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
				addEvent( xhttp, 'abort',     function(){ obj.aborted(obj.href); });
				addEvent( xhttp, 'timeout',   function(){ obj.aborted(obj.href, timoutTimer); }); 
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
				var i, len;
				for (i = 0, len = obj.requestHeaders.length; i < len; ++i) {
					var el = obj.requestHeaders[i];
					xhttp.setRequestHeader(el.header, el.value);
				}
			}

			xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			if ( typeof obj.data === 'string' ){
				xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhttp.send(obj.data);
			} else {
				xhttp.send();
			}

			return true;
		},
		replaceNavLinks: function(newPosts, oldPosts) {
			if( !newPosts || !oldPosts ){
				return false;
			}
			var i, len;
			for (i = 0, len = oldPosts.length; i < len; ++i) {
				var el = oldPosts[i];
				if( newPosts.firstElementChild.href){
					el.firstElementChild.href = newPosts.firstElementChild.href;
				} else {
					el.firstElementChild.removeAttribute('href');
				}
			}
			return true;
		},
		replaceNavPageLinks: function(newList, oldList) {
			if( !newList || !oldList ){
				return false;
			}
			// TODO: dynamiclly replace each link? - don't know how I would do this?
			var i, len;
			for (i = 0, len = oldList.length; i < len; ++i) {
				var el = oldList[i];
				el.innerHTML = newList.innerHTML;
			}
			return true;
		},
		updateLinkTag: function(rel, workspace) {
			if (d.head.querySelector('link[rel="'+rel+'"]')){
				if (workspace.querySelector('link[rel="'+rel+'"]')){
					// replace link href
					d.head.querySelector('link[rel="'+rel+'"]').href = workspace.querySelector('link[rel="'+rel+'"]').href;
				} else {
					// remove link
					d.head.querySelector('link[rel="'+rel+'"]').remove();
				}
			}
		},
		attachPageLoad: function() { // adds pjax to all internal hyperlink elements (https://rosspenman.com/pushstate-jquery/)
			var that = this;

			// calls loadPage when the browser back button is pressed
			// TODO: test browser implementation inconsistencies of popstate
			addEvent(window, 'popstate', function(event) {
				// don't fire on the inital page load
				// TODO: make back button paginates comments??
				if (event.state !== null) {
					var optionsSurrogate = WPAjaxGETPage;
					optionsSurrogate.href = location.href;
					that.load(optionsSurrogate);
				}
			});

			// transforms all the interal hyperlinks into ajax requests
			addEvent(d, 'click', function(event) {
				
				var e = window.event || event; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event
				// var e = event != 'undefined' ? event : window.event; // this seems more safe...

				if ( e.target.tagName !== 'A' && e.target.tagName !== 'AREA' ){
					return false; // if the click event was not on a linked element
				}
				if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey){
					return false; // if the click was a cmd/ctrl/alt/shift click
				}
				if (!e.target.href){
					return false; // if the link has no destination
				}

				var href = e.target.href;

				if (href == window.location.href){ // if the page is exactly the same page
					console.log("you're already on that page");
					e.preventDefault();
					return false;
				}

				var currentPageWithParameters = new RegExp(window.location.origin+window.location.pathname+'[^\/]*[&#?]', 'g' );
				var adminUrl = new RegExp(opts.adminUrlRegEx,'g');

				if ((href.indexOf(d.domain) > -1 || href.indexOf(':') === -1) // if the link goes to the current domain
				&& !href.match(currentPageWithParameters) // href isnt a parameterized link of the current page
				// && href != window.location.href // href isn't a link to the current page - we already check for this above
				&& !href.match(adminUrl)  // href doesn't go to the wp-admin backend
				&& !href.match(/\/feed/g) ) // is not an rss feed of somekind
				{
					e.preventDefault();
					history.pushState({}, '', href);
					var optionsSurrogate;				
					// if the link is in the comment-navigation
					var commentNav = d.querySelectorAll('.comment-navigation'),
						isCommentNav = false;
					for ( var i = 0, len = commentNav.length; i < len; ++i) {
						if(commentNav[i].contains(e.target)){
							isCommentNav = true;
						}
					}
					// if (e.target.parentNode.parentNode.className.match(/\bcomment-navigation\b/g)){
					if (isCommentNav){
						optionsSurrogate = WPAjaxGETCommentsSection;
						optionsSurrogate.href = href;
						that.load(optionsSurrogate);
					} else {
						optionsSurrogate = WPAjaxGETPage;
						optionsSurrogate.href = href;
						that.load(optionsSurrogate);
					}
				}
			});

			return true;
		},
		attachComments: function(){
			var commentform = d.getElementById('commentform'),
				statusdiv = d.getElementById('comment-status'),
				that = this;
			if (commentform && statusdiv) {
				addEvent(commentform, 'submit', function(e){
					e.preventDefault();
					// this might break
					that.submitComment(commentform, statusdiv);
				});
			}
		},
		submitComment: function(commentform, statusdiv){
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
				aborted:      '<p class="ajax-success" ><strong>TIMEOUT:</strong> There was no response from the server. Please refresh the page to see if your comment Posted.</p>',
				error:        '<p class="ajax-error" ><strong>ERROR:</strong> Please wait a while before posting your next comment</p>'
			};
			// Post Form with data
			this.load({
				httpMethod: 'POST',
				href: formurl,
				data: formdata,
				timeoutTimer: 5000,
				requestHeaders: [ {header: 'WP-Request-Type', value: 'PostComment'} ],
				started: function(){
					statusdiv.innerHTML = commentStatus.placeholder;
				},
				failed: function(href, status, statusText, responseText) {
					var errorWrapper = d.createElement('div');
					errorWrapper.innerHTML = responseText;

					var wpErrorTitle = errorWrapper.querySelector('title');
					if ( wpErrorTitle && wpErrorTitle.innerHTML.toLowerCase().match(/error/) ){
						// in case wordpress sends a formatted error page
						statusdiv.innerHTML = '<p><strong>ERROR '+status+': </strong>'+errorWrapper.getElementsByTagName('p')[0].innerHTML+'</p>';
						return true;
					} else {
						statusdiv.innerHTML = '<p><strong>ERROR '+status+': </strong>'+statusText+'</p>';
						return false;
					}
				},
				aborted: function(href, timoutTimer) {
					statusdiv.innerHTML = commentStatus.aborted;				
				},
				delivered: function( commentLI, textStatus ) {
					var wrapperUL       = d.createElement('ul');
					wrapperUL.className = 'children';
					wrapperUL.innerHTML = commentLI;
					// wrapperUL.innerHTML will return commentLI as an HTML element - not a string.
					// console.log(wrapperUL);

					var wpErrorTitle = wrapperUL.querySelector('title');
					if ( wpErrorTitle && wpErrorTitle.innerHTML.toLowerCase().match(/error/) ){
						// in case wordpress sends a formatted error page
						commentStatus.wpError = wrapperUL.getElementsByTagName('p')[0].innerHTML;
						statusdiv.innerHTML = commentStatus.wpError;
						return false;
					} else {
						// if the comment doesn't have a parent, i.e. is it a reply?
						if ( parentCommentId == '0' ) {
							var commentlist = d.getElementsByClassName('commentlist')[0];
							if ( commentlist ){
								commentlist.insertBefore( wrapperUL.children[0], commentlist.firstChild ); // prependChild
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
	};

	WPAjaxGETPage = {
		httpMethod: 'GET',
		timeoutTimer: 5000,
		requestHeaders:[{header:'WP-Request-Type', value: 'GetPage' }],
		main: d.querySelector(opts.contentSelector),
		aborted: function(href, timoutTimer) {
			var timoutText = timoutTimer == 'undefined' ? '' : 'The request timed out after '+timoutTimer+' milliseconds.';
			console.log( 'ajax load was aborted.\n'+timoutText );
			if (href){
				location.href = href;
				return true;
			}
			return false;
		},
		failed: function(href, status, statusText, responseText) {
			errorStatusText = typeof statusText == 'undefined' ? '' : 'Error Message: '+ statusText ;
			console.log( 'ajax load failed with an error code: '+ status +'\n'+errorStatusText);
			if (href){
				location.href = href;
				return true;
			}
			return false;
		},
		delivered: function(responseText, statusText) {

			var workspace       = d.createElement("div");
			workspace.innerHTML = responseText;

			var headMeta = d.head.getElementsByTagName('meta'),
				newHeadMeta = workspace.querySelector('#ajax-head').getElementsByTagName('meta');
			for (var i = headMeta.length - 1; i > -1; --i) { // remove all meta tags
				headMeta[i].remove();
			}
			for (var j = newHeadMeta.length - 1; j > -1; --j) { // replace meta tags with new ones
				d.head.appendChild(newHeadMeta[j]);
			}

			// update header link tags
			WPAjax.updateLinkTag('next', workspace);
			WPAjax.updateLinkTag('prev', workspace);
			WPAjax.updateLinkTag('shortlink', workspace);
			WPAjax.updateLinkTag('canonical', workspace);

			if (workspace.getElementsByTagName('title')){
				d.title = workspace.getElementsByTagName('title')[0].innerHTML; // update the doc title
			}
			if (this.main && workspace.querySelector('#content').innerHTML){
				this.main.innerHTML = workspace.querySelector('#content').innerHTML;  // update the content
			}

			// update post navigation
			var newNextPosts = workspace.querySelector('.post-navigation .next-posts'),
				newPrevPosts = workspace.querySelector('.post-navigation .prev-posts'),
				newPostPages = workspace.querySelector('.post-navigation .page-numbers'),
				NextPosts = d.querySelectorAll('.post-navigation .next-posts'),
				PrevPosts = d.querySelectorAll('.post-navigation .prev-posts'),
				PostPages = d.querySelectorAll('.post-navigation .page-numbers');
			WPAjax.replaceNavLinks(newNextPosts, NextPosts);
			WPAjax.replaceNavLinks(newPrevPosts, PrevPosts);
			WPAjax.replaceNavPageLinks(newPostPages, PostPages);

			// update the the class list of all menu items
			menuItems = workspace.querySelector('#wp-all-registered-nav-menus').querySelectorAll('.menu-item');
			for (var k = 0; k < menuItems.length; ++k) {
				var item = menuItems[k];  // Calling myNodeList.item(k) isn't necessary in JavaScript
				d.getElementById(item.id).className = item.className;
			}

			// TODO: Test this
			if (typeof ga === 'function') {	// google universial analytics tracking 
				ga('send', 'pageview');     // send a pageview connected to anayltics.js loaded in footer.php
			}

			// comments section will be new - need to rebind events to new elements
			WPAjax.attachComments(); 
			attachCtrlEnterSubmitWPComment();
			console.log('ajax loaded!\n'+statusText);
			return true;
		}
	};

	WPAjaxGETCommentsSection = {
		httpMethod: 'GET',
		timeoutTimer: 5000,
		requestHeaders: [{header:'WP-Request-Type', value:'GetCommentsSection'}],
		started: function(){
			// console.log('the comment section has started loading');
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

			// replace comments navigation links
			// TODO: add pagination functionality
			var newNextComments = workspace.querySelector('.comment-navigation .next-comments'),
				newPrevComments = workspace.querySelector('.comment-navigation .prev-comments'),
				newCommentPages = workspace.querySelector('.comment-navigation .page-numbers'),
				NextComments = d.querySelectorAll('.comment-navigation .next-comments'),
				PrevComments = d.querySelectorAll('.comment-navigation .prev-comments'),
				CommentPages = d.querySelectorAll('.comment-navigation .page-numbers');
			WPAjax.replaceNavLinks(newNextComments, NextComments);
			WPAjax.replaceNavLinks(newPrevComments, PrevComments);
			WPAjax.replaceNavPageLinks(newCommentPages, CommentPages);
		}
	};

	WPAjaxGETExample = {
		httpMethod: 'GET',
		timeoutTimer: 5000,
		requestHeaders:[{header:'WP-Request-Type', value: 'GetExample' }],
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
		aborted: function(href, timoutTimer) {
			// called when ajax aborts due to timeout of other causes
			var timoutText = timoutTimer == 'undefined' ? '' : 'The request timed out after '+timoutTimer+' milliseconds.';
			// console.log( 'ajax load was aborted.\n'+timoutText );
			if (href){
				location.href = href;
				return true;
			}
			return false;
		},
		finished: function() {
			// called when ajax is finished, pass or fail.
			// console.log( 'ajax is done...' );
			return true;
		},
		failed: function(href, status, statusText, responseText) {
			// called when the response is recieved with an error
			errorStatusText = typeof statusText == 'undefined' ? '' : 'Error Message: '+ statusText ;
			// console.log( 'ajax load failed with an error code: '+ status +'\n'+errorStatusText);
			if (href){
				location.href = href;
				return true;
			}
			return false;
		},
		delivered: function(responseText, statusText) {
			// Do this once the ajax request is returned.
			var workspace       = d.createElement("div");
			workspace.innerHTML = responseText;

			// console.log('ajax loaded!');
			return true;
		}
	};
	
	// TODO: find a better way to call this?
	attachCtrlEnterSubmitWPComment();
	WPAjax.attachPageLoad();
	WPAjax.attachComments();

})(document,WPAjax_options);