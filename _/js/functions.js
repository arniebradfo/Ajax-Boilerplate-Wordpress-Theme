// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }


// remap jQuery to $
(function ($) {

	// SOURCE: https://rosspenman.com/pushstate-jquery/
	function plusPjax() {

		// // //
		// define functions and objects
		// // //

		// decode html entities in a string
		String.prototype.decodeHTML = function() {
			return $("<div>", {html: "" + this}).html();
		};

		// put the contents of the <main> tag into an object
		var $main = $("main"),

		initialLoad = function() {
			// Do this on an inital page load of a regular http request.
		},
		
		ajaxEnd = function(html) {

			// Do this once the ajax request is returned.

			// change the <title> element in the <head>
			document.title = html
				.match(/<title>(.*?)<\/title>/)[1]
				.trim()
				.decodeHTML();

			//
			alert("pjax worked!");

			// call the intial load function again
			// TODO: split this out into smaller functions
			initialLoad();
		},
		
		loadPage = function(href) {
			$main.load(href + " main>*", ajaxEnd);
		};
		


		// // //
		// use our functions
		// // //

		initialLoad();
		
		// calls loadPage when the browser back button is pressed
		// TODO: test browser implementation inconsistencies
		$(window).on("popstate", function(e) {
			// don't fire on the inital page load
			if (e.originalEvent.state !== null) {
				loadPage(location.href);
			}
		});


		// transforms all the interal hyperlinks into ajax requests
		// TODO: add exception for #id links.
		// TODO: add support for subdomains.
		// TODO: add exception for /wp-admin
		$(document).on("click", "a, area", function(e) {
			// e.preventDefault();
			alert("calling pjax");


			var href = $(this).attr("href");

			if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
				history.pushState({}, '', href);
				loadPage(href);
				// return false to diable default link behovior
				return false;
			}
		});
	}	

	/* trigger when page is ready */
	$(document).ready(function (){

		// call our pjax function
		plusPjax();
		// your functions go here

	});

}(window.jQuery || window.$));