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
			elem.attachEvent("on" + event, function() {
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

		// put the contents of the <main> tag into an object
		var main = d.getElementsByTagName('main')[0];

		// TODO: do this with a nav element from the server
		// updateCurrentNav = function(href) {

		// 	// remove all current- classes
		// 	$('.menu-item').removeClass('current-menu-item current-menu-ancestor current-menu-parent current_page_item current-page-ancestor current_page_ancestor current-page-parent current_page_parent');
			
			
		// 	var $newCurrentLink = $('.menu-item a[href="'+href+'"]').parent('.menu-item'), // object containing the current link
		// 		$menuLinks = $('.menu-item a'),
		// 		hrefAncestorPaths = [],
		// 		hrefEdit = href;

		// 	//TODO: figure out how to detect if something is a .current_page_item
		// 	$newCurrentLink.addClass('current_page_item current-menu-item');
		// 	$newCurrentLink.parents('.menu-item-has-children').addClass('current-menu-ancestor');
		// 	$newCurrentLink.parent().closest('.menu-item-has-children').addClass('current-menu-parent');

		// 	// create an array of url strings matching each possible ancestor
		// 	while ( hrefEdit != (location.origin + "/") ) {
		// 		hrefEdit = hrefEdit.replace(/[^\/]+\/?([#\?][^\/]*)?$/,"");
		// 		hrefAncestorPaths.push(hrefEdit);
		// 	}
		// 	hrefAncestorPaths.pop(); // delete the last entry that should be the location.origin+"/"

		// 	// loop through each menu item and add relevant page-ancestor classes
		// 	for (i = 0; i < $menuLinks.length; i++) { 

		// 		var hrefCurrent = $menuLinks.eq(i).attr("href");
		// 		// parent
		// 		if ( hrefCurrent === hrefAncestorPaths[0] ){
		// 			$menuLinks.eq(i).parent('.menu-item').addClass('current-page-parent current_page_parent');
		// 		}
		// 		// ancestor
		// 		if ( hrefAncestorPaths.indexOf(hrefCurrent) >= 0 ){
		// 			$menuLinks.eq(i).parent('.menu-item').addClass('current-page-ancestor current_page_ancestor');
		// 		}
		// 	}
		// };

		ajaxProgress = function(progressDelay) {

			// do this if ajaxCalled is done but ajax has not been delivered.
			console.log("pjax is still loading after "+ progressDelay + " milliseconds");
		};

		ajaxCalled = function() {
			// set how long ajaxCalled is expected to take (in milliseconds)
			var progressDelay = 2;

			// do this just before the ajax is requested
			console.log("calling pjax");

			// call ajaxProgress after timeout
			progressTimer = setTimeout(ajaxProgress(progressDelay),progressDelay);
		};
		
		ajaxDelivered = function(html) {
			clearTimeout(progressTimer);

			// Do this once the ajax request is returned.
			console.log('pjax loaded!');

			var workspace = d.createElement("div");
			workspace.innerHTML = html;

			// update the doc title
			d.title = workspace.getElementsByTagName('title')[0];

			// update the content
			main.innerHTML = workspace.getElementsByTagName('main')[0].innerHTML;

			// update the the class list of all menu items
			menuItems = workspace.querySelector('#wp-all-registered-nav-menus').querySelectorAll('.menu-item');
			for (var i = 0; i < menuItems.length; ++i) {
				var item = menuItems[i];  // Calling myNodeList.item(i) isn't necessary in JavaScript
				d.getElementById(item.id).className = item.className;
			}

			// google universial analytics tracking
			// send a pageview connected to anayltics.js loaded in footer.php
			if (typeof ga == 'function') {
				ga('send', 'pageview');
			}

			return true;

		};
		
		// // jQuery ajax call
		// loadPage = function(href) {
		// 	ajaxCalled();
		// 	$main.load(href + " main > *", function(html){
		// 		ajaxDelivered(html);
		// 		updateCurrentNav(href);
		// 	});
		// };
		
		function wp_loadPage(href) {
			ajaxCalled();
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					ajaxDelivered(xhttp.responseText);
				}
			};
			xhttp.open("GET", href, true);
			xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhttp.send();
		}


		// // //
		// use our functions
		// // //
		
		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies of popstate
		window.onpopstate = function(event) {
			// don't fire on the inital page load
			if (event.state !== null) {
				wp_loadPage(location.href);
			}
		};

		// transforms all the interal hyperlinks into ajax requests
		// TODO: add exception for #id links.
		// TODO: add support for subdomains. - subdomain is included in document.domain
		// TODO: add exception for /wp-admin
		addEvent(d, 'click', function(e) {
			
			var e = window.e || e;

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