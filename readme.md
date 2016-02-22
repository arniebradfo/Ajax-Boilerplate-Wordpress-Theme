#  HTML5 Reset+PJAX WordPress Theme

## AJAX TODOs:
	+ load in meta tags
	+ ajax does not load properly in theme customizer
	+ comments is broken in strict mode

## NAVIGATION:
	+ research the history object api
	+ add [pagination](https://codex.wordpress.org/Function_Reference/paginate_links) to comments and post archives

	+ COMMENTS:
		* back button paginates comments 
		* make sure all comment classes are implemented properly

## Refactor js
	+ refactor functions to the appropiate type: anonymous, public, etc...
	+ refactor names - more like jQuery?
	+ add a global settings object
		+ wp-admin rename

- Test it with google analytics

- feature detect to allow gracefull degredation.
	+ Test browser implementation inconsistencies of popstate.


## SITE TODOs / HTML:
	+ add github updater headers
	+ remove `if ( !function_exists()){}` checks ??
	+ add newer [custom options framework](http://www.paulund.co.uk/theme-options-page). Current options framework does not save options when cloning db to a new server.
		* replace head meta options
	+ add ctrl-s to save stuff in the admin panel
	+ move html outputing php into a new folder
	+ drop support for <=IE9

## FINAL
	+ research best keywords for naming
	+ Write documentation.


## DONES to keep:
	+ Research and reduce SEO problems with ajax
		this should work fine because the stie will still function normally without js. 
		all the links have accurate urls
		the site map will still work normally with site crawlers 
	+ [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) 
	+ Add hover [prefetch option](http://miguel-perez.github.io/smoothState.js/) to increase performance.


## Credits:
	comments ajax: http://wpcrux.com/ajax-submit-wordpress-comments/
	comments php ajax reply: http://davidwalsh.name/wordpress-ajax-comments

