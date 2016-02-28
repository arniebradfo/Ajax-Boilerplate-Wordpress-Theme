#  HTML5 Reset+PJAX WordPress Theme

## AJAX TODOs:
- ajax does not load properly in theme customizer

## NAVIGATION:
- research the history object api
- add [pagination](https://codex.wordpress.org/Function_Reference/paginate_links) to comments and post archives

##META
- global author option

## COMMENTS:
- back button paginates comments 
	+ make history-like object/array that stores the type of ajax call along with the url. Reference this everytime we hit the back button.

## Refactor js
- refactor functions to the appropiate type: anonymous, public, etc...
- refactor names - more like jQuery?
- add a global settings object
	- wp-admin rename

- Test it with google analytics

- feature detect to allow graceful degredation.
	+ Test browser implementation inconsistencies of popstate.

## SITE TODOs / HTML:
- remove `if ( !function_exists()){}` checks ??
- add ctrl-s to save stuff in the admin panel
- move html outputing php into a new folder
- drop support for <=IE9

## FINAL
- research best keywords for naming
- Write documentation.

## DONES to keep:
- Research and reduce SEO problems with ajax
	this should work fine because the stie will still function normally without js. 
	all the links have accurate urls
	the site map will still work normally with site crawlers 
- [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) 
- Add hover [prefetch option](http://miguel-perez.github.io/smoothState.js/) to increase performance.


## Credits:
	comments ajax: http://wpcrux.com/ajax-submit-wordpress-comments/
	comments php ajax reply: http://davidwalsh.name/wordpress-ajax-comments

