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
		String.prototype.decodeHTML = function() {
			return $("<div>", {html: "" + this}).html();
		};

		// put the contents of the <main> tag into an object
		var $main = $("main"),

		updateCurrentNav = function(href) {

			// remove all current- classes
			$('.menu-item').removeClass('current-menu-item current-menu-ancestor current-menu-parent current_page_item current-page-ancestor current_page_ancestor current-page-parent current_page_parent');
			
			// deletes the the http and domain info ex: "http://domain.name/link/child/more" becomes "/link/child/more"
			// TODO: add exception for home link wihtout trailing slash ex: http://domain.name
			var hrefPath			= href.replace(/https?:\/\/[^\/]+/,"");

			// matches the clicked link's parent link ex: "/link/child/more" matches "/link/child/"
			var hrefPageParent		= hrefPath.match(/.+\/(?=[^\/]+\/?$)/);
			
			// matches the clicked link's ancestor link ex: "/link/child/more" matches "/link/"
			// TODO: /link/not-child/ would also match the a.href*="/link/" selector. reengineer to avoid this.
			var hrefPageAncestor	= hrefPath.match(/^\/[^\/]+\/(?=[^\/]+\/?)/);

			// object containing the current link
			var $newCurrentLink 	= $('a[href$="'+hrefPath+'"]').parent('.menu-item');

			//TODO: does .current_page_item fit this condition?
			$newCurrentLink.addClass('current_page_item current-menu-item');
			$newCurrentLink.parents('.menu-item-has-children').addClass('current-menu-ancestor');
			$newCurrentLink.parent().closest('.menu-item-has-children').addClass('current-menu-parent');

			// an link that includes an ancestor url // that is not the current link // add class to its menu item parent
			if (hrefPageParent){
				$('a[href*="'+hrefPageParent+'"]').not('a[href$="'+hrefPath+'"]').parent('.menu-item').addClass('current-page-parent current_page_parent');
				$('a[href*="'+hrefPageAncestor+'"]').not('a[href$="'+hrefPath+'"]').parent('.menu-item').addClass('current-page-ancestor current_page_ancestor');
			}

			console.log("href is: " + href);
			console.log("hrefPath is: " + hrefPath);
			console.log("hrefPageAncestor is: " + hrefPageAncestor);
			console.log("hrefPageParent is: " + hrefPageParent);

		}

		ajaxProgress = function(progressDelay) {

			// do this if ajaxCalled is done but ajax has not been delivered.
			console.log("pjax is still loading after "+ progressDelay + " milliseconds");

		}

		ajaxCalled = function() {
			// set how long ajaxCalled is expected to take (in milliseconds)
			var progressDelay = 2;

			// do this just before the ajax is requested
			console.log("calling pjax");


			// call ajaxProgress after timeout
			progressTimer = setTimeout(ajaxProgress(progressDelay),progressDelay);
		}
		
		ajaxDelivered = function(href) {
			clearTimeout(progressTimer);

			// Do this once the ajax request is returned.
			console.log("pjax loaded!");

			updateCurrentNav(href);

			// change the <title> element in the <head>
			// document.title = html
			// 	.match(/<title>(.*?)<\/title>/)[1]
			// 	.trim()
			// 	.decodeHTML();

		},
		
		loadPage = function(href) {
			ajaxCalled();
			$main.load(href + " main>*", ajaxDelivered(href));
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
		// TODO: add support for subdomains.
		// TODO: add exception for /wp-admin
		$(document).on("click", "a, area", function(e) {

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