// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

// remap jQuery to $
(function ($) {

	// adds pjax to all internal hyperlink elements (https://rosspenman.com/pushstate-jquery/)
	// TODO: add hover prefetch option to increase performance ( copy: http://miguel-perez.github.io/smoothState.js/ )
	function plusPjax() {

		// // //
		// define functions and objects
		// // //

		// decode html entities in a string
		// REMOVE - I don't understand what this si supposed to do
		String.prototype.decodeHTML = function() {
			return $("<div>", {html: "" + this}).html();
		};

		// put the contents of the <main> tag into an object
		var $main = $("main");

		updateCurrentNav = function(href) {

			// remove all current- classes
			$('.menu-item').removeClass('current-menu-item current-menu-ancestor current-menu-parent current_page_item current-page-ancestor current_page_ancestor current-page-parent current_page_parent');
			
			
			var $newCurrentLink = $('.menu-item a[href="'+href+'"]').parent('.menu-item'), // object containing the current link
				$menuLinks = $('.menu-item a'),
				hrefAncestorPaths = [],
				hrefEdit = href;

			//TODO: figure out how to detect if something is a .current_page_item
			$newCurrentLink.addClass('current_page_item current-menu-item');
			$newCurrentLink.parents('.menu-item-has-children').addClass('current-menu-ancestor');
			$newCurrentLink.parent().closest('.menu-item-has-children').addClass('current-menu-parent');

			// create an array of url strings matching each possible ancestor
			while ( hrefEdit != (location.origin + "/") ) {
				hrefEdit = hrefEdit.replace(/[^\/]+\/?([#\?][^\/]*)?$/,"");
				hrefAncestorPaths.push(hrefEdit);
			}
			hrefAncestorPaths.pop(); // delete the last entry that should be the location.origin+"/"

			// loop through each menu item and add relevant page-ancestor classes
			for (i = 0; i < $menuLinks.length; i++) { 

				var hrefCurrent = $menuLinks.eq(i).attr("href");
				// parent
				if ( hrefCurrent === hrefAncestorPaths[0] ){
					$menuLinks.eq(i).parent('.menu-item').addClass('current-page-parent current_page_parent');
				}
				// ancestor
				if ( hrefAncestorPaths.indexOf(hrefCurrent) >= 0 ){
					$menuLinks.eq(i).parent('.menu-item').addClass('current-page-ancestor current_page_ancestor');
				}
			}
		};

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
			console.log("pjax loaded!");

			// change the <title> element in the <head>
			document.title = html
				.match(/<title>(.*?)<\/title>/)[1]
				.trim()
				//.decodeHTML()
				;

			// google universial analytics tracking
			// uncomment this to send a pageview connected to anayltics.js loaded in footer.php
			// ga('send', 'pageview');

			return false;

		};
		
		loadPage = function(href) {
			ajaxCalled();
			$main.load(href + " main > *", function(html){
				ajaxDelivered(html);
				updateCurrentNav(href);
			});
		};
		


		// // //
		// use our functions
		// // //
		
		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies of popstate
		$(window).on("popstate", function(e) {
			// don't fire on the inital page load
			if (e.originalEvent.state !== null) {
				loadPage(location.href);
			}
		});


		// transforms all the interal hyperlinks into ajax requests
		// TODO: add exception for #id links.
		// TODO: add support for subdomains. - subdomain is included in document.domain
		// TODO: add exception for /wp-admin
		$(document).on("click", "a, area", function() {

			var href = $(this).attr("href");
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
					history.pushState({}, '', href);
					loadPage(href);
					// return false to diable default link behovior
					return false;
				}
			}

		});
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

	/* trigger when page is ready */
	$(document).ready(function (){

		// call our pjax function
		plusPjax();
		ajaxComments();
		// your functions go here

	});

}(window.jQuery || window.$));