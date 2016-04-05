#  WPAjax WordPress Theme

## AJAX TODOs:

## NAVIGATION:
- research the history object api
- Pagination: 
    + dynamiclly replace each link? - don't know how I would do this?

##META

##SETTINGS:

## COMMENTS:
- when posting the first comment, the navigation does not appear
- back button paginates comments 
	+ make history-like object/array that stores the type of ajax call along with the url. Reference this everytime we hit the back button.
    + save a copy of the last ajax response and use that insted of querying the server

## Refactor js
- add if() checks for everything
- add a global settings object
	- wp-admin rename
- Test it with google analytics - use ga plugin?
- feature detect to allow graceful degredation.
	+ Test browser implementation inconsistencies of popstate.     

## SITE TODOs / HTML:
- drop support for <=IE9

## FINAL
- research best keywords for naming
- Write documentation.

## DONES to keep:
- [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) 
- Add hover [prefetch option](http://miguel-perez.github.io/smoothState.js/) to increase performance.

## Credits:
	comments ajax: http://wpcrux.com/ajax-submit-wordpress-comments/
	comments php ajax reply: http://davidwalsh.name/wordpress-ajax-comments

