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

	// adds pjax to all internal hyperlink elements (https://rosspenman.com/pushstate-jquery/)
	// TODO: add hover prefetch option to increase performance ( copy: http://miguel-perez.github.io/smoothState.js/ )
	function plusPjax() {
		// console.log('plusPjax was called');

		// // //
		// define functions and objects
		// // //

		var d = document;
		var main = d.getElementsByTagName('main')[0]; // put the contents of the <main> tag into an object

		ajaxLoadStart = function() {
			// After the XMLHttpRequest object has been created, but before the open() method has been called
			console.log('ajax load has not yet been initalized');
			return true;
		};
		// ajaxTimeout = function(timeoutDelay) {
		// 	// do this if ajaxCalled is done but ajax has not been delivered.
		// 	console.log("ajax was still loading after "+ timeoutDelay + " milliseconds."+
		// 		      "\nThe ajax load timed out and has been aborted.");
		// };
		ajaxServerConnectionEstablished = function() {
			// The open method has been invoked successfully
			console.log('Connection Established');
			return true;
		};
		ajaxRequestRecieved = function() {
			// The send method has been invoked and the HTTP response headers have been received
			console.log('Request Recieved');
			return true;
		};
		ajaxProcessingRequest = function() {
			// HTTP response content begins to load
			console.log('Processing Request');
			return true;
		};
		ajaxAborted = function(timoutTimer) {
			var timoutText = timoutTimer == 'undefined' ? '' : 'The request timed out after '+timoutTimer+' milliseconds.';
			console.log( 'ajax load was aborted.\n'+timoutText );
			return true;
		};
		ajaxFinished = function() {
			// called when ajax is finished, pass or fail.
			console.log( 'ajax is done...' );
			return true;
		};		
		ajaxFailed = function(status, statusText, href) {
			// called when the response is recieved with an error
			errorStatusText = statusText == 'undefined' ? '' : 'Error Message: '+ statusText ;
			console.log( 'ajax load failed with an error code: '+ status +'\n'+errorStatusText);
			location.href = href;
			return true;
		};
		ajaxDelivered = function(responseText, responseXML, responseType) {

			// Do this once the ajax request is returned.
			console.log('ajax loaded!');
			//console.log(responseText);
			console.log(responseXML);
			console.log(responseType);

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

			if (typeof ga == 'function') {	// google universial analytics tracking 
				ga('send', 'pageview');     // send a pageview connected to anayltics.js loaded in footer.php
			}

			return true;
		};

		function wp_loadPage(href) {

			var xhttp = new XMLHttpRequest();
			addEvent( xhttp, 'readystatechange', function() {
				switch (xhttp.readyState){
					// case 0: ajaxLoadStart(); break; // I think this is fired when the constructor is called, before this block is set
					case 1: ajaxServerConnectionEstablished(); break;
					case 2: ajaxRequestRecieved(); break;
					case 3: ajaxProcessingRequest(); break;
					case 4:
						if (xhttp.status >= 200 && xhttp.status < 300) {
							ajaxDelivered(xhttp.responseText, xhttp.responseXML, xhttp.responseType);
							break;
						} else {
							ajaxFailed(xhttp.status, xhttp.statusText, href);
							break;
						}
				}
			});

			var timoutTimer = 10000; // (in milliseconds) Set the amout of time until the ajax request times out.
			xhttp.timeout = timoutTimer; 
			addEvent( xhttp, 'loadstart', ajaxLoadStart); 
			addEvent( xhttp, 'abort',     ajaxAborted); 
			addEvent( xhttp, 'timeout',   function(){ ajaxAborted(timoutTimer); }); 
			addEvent( xhttp, 'loadend',   ajaxFinished); 

			xhttp.open("GET", href, true);
			xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhttp.send();
		}

		// // //
		// use our functions
		// // //
		
		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies of popstate
		addEvent(window, 'popstate', function(event) {
			// don't fire on the inital page load
			if (event.state !== null) {
				wp_loadPage(location.href);
			}
		});

		// transforms all the interal hyperlinks into ajax requests
		// TODO: add exception for #id links.
		// TODO: add support for subdomains. - subdomain is included in document.domain
		// TODO: add exception for /wp-admin
		addEvent(d, 'click', function(e) {
			
			var e = window.e || e; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event

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
					wp_loadPage(href);
					// return false to diable default link behovior
					return true;
				}
			}
			return false;
		});

		return true;
	}	

	function ajaxComments() {

		loadComments = function(href) {
			// ajaxCommentsCalled();
			// $main.load(href + "main > *", function(html){
			// 	// ajaxComments(html);
			// 	// updateCurrentCommentsNav(href);
			// });
		};

		// if comments section exists
		// SOURCE: http://wpcrux.com/ajax-submit-wordpress-comments/
		if ( $('#commentform') ) {
			// attach divert to comment form submit 

			var commentform = $('#commentform');
			var statusdiv = $('#comment-status');
			commentStatus = {
				placeholder:  '<p class="ajax-placeholder">Processing...</p>',
				invaid:       '<p class="ajax-error" ><strong>ERROR:</strong> You might have left one of the fields blank, or be posting too quickly</p>',
				success:      '<p class="ajax-success" ><strong>SUCCESS:</strong> Thanks for your comment. We appreciate your response.</p>',
				error:        '<p class="ajax-error" ><strong>ERROR:</strong> Please wait a while before posting your next comment</p>',
			};

			commentform.submit( function(){
				// Serialize and store form data
				var formdata = commentform.serialize();
				parentPost = formdata.match(/(?:&comment_parent=)\d+/g)[0].match(/\d+/g)[0];
				// Add a status message while we wait for the response
				statusdiv.html( commentStatus.placeholder );
				// Extract action URL from commentform
				var formurl = commentform.attr('action');
				// Post Form with data
				$.ajax({
					method: "POST",
					url: formurl,
					data: formdata,
					error: function( XMLHttpRequest, textStatus, errorThrown ) {
						statusdiv.html(commentStatus.invaid);
						console.log(
							'XMLHttpRequest: ' + XMLHttpRequest + 
							',\ntextStatus: '    + textStatus + 
							',\nerrorThrown: '   + errorThrown
						);
					},
					success: function( data, textStatus ) {
						if ( data == "success" || textStatus == "success" ) {
							// in case wordpress sends a formatted error page
							if ( data.match(/id="[^"]*(error-page)[^"]*"/g)) {
								commentStatus.wpError = data.match(/<p>.*<\/p>/g);
								console.log( commentStatus.wpError );
								statusdiv.html( commentStatus.wpError );
							} else {
								statusdiv.html(commentStatus.success);
								// if the comment doesn't have a parent, i.e. is it a reply?
								if ( parentPost == 0 ) {
									$(".commentlist").prepend(data);
								} else {
									commentHasSiblings = $("#comment-"+parentPost+" > .children");
									// does this reply have no sibling replies?
									if ( commentHasSiblings[0] == undefined ){
										data = '<ul class="children">'+data+'</ul>';
										$("#comment-"+parentPost).append(data);
									} else {
										commentHasSiblings.append(data);
									} 
								}
								// console.log(
								// 	'formurl: '+ formurl + ',\n' +							
								// 	'formdata: '+ formdata + ',\n' +
								// 	'parentPost: '+ parentPost + ',\n' +
								// 	'textStatus: '+ textStatus + ',\n' +
								// 	'textStatus did == success,\n' + 
								// 	'data:\n' + 
								// 	data
								// );
								// console.log($("#comment-"+parentPost+" > .children")[0]);
							}
						} else {
							// TODO: what really happens in this case
							console.log(
								'textStatus: '+ textStatus +
								',\n textStatus did NOT == success, data:' + data
							);
							statusdiv.html(commentStatus.error);
						}
						commentform.find('textarea[name=comment]').val('');
					}
				});
				return false;
			});
		}

		// when comment is submitted
		// send data through ajax
		// return data from php
		// insert it into comments 

		// create refresh comments link
		// attach ajax call to link
		// php to return the newest links
			// have isCommentsAjax bool
		// when data is returned replace comments section

		// attah divert to pagination
		// replace comments ol section (alter/ display:none; the links)
	}

	// /* trigger when page is ready */
	// $(document).ready(function (){
	// 	// call our pjax function
	// 	plusPjax();
	// 	ajaxComments();
	// 	// your functions go here
	// });
	
	// find a better way to call this?
	plusPjax();

})();
//}(window.jQuery || window.$));