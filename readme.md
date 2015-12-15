#  HTML5 Reset+PJAX WordPress Theme


## TODOs:
- Add hover prefetch option to increase performance ( copy: http://miguel-perez.github.io/smoothState.js/ ).
- Test browser implementation inconsistencies of popstate.
- Write documentation. "stick with the syntax wp uses to write nav links"
- Test it with google analytics
- research best keywords for naming
- refactor functions to the appropiate type: anonymous, public, etc...
- feature detect to allow gracefull degredation.

- regualar navigation
	- add support for subdomains. - subdomain is included in document.domain

- ajax the comments section:
	- live reload from a refresh button
	- better error descriptors
	- add support for worpress returning an error page due to incorrect credentials
	- make sure comment li have correct even odd classes
	- make sure new lis have correct levels of depth ?
	- make sure back button paginates comments
- add support for wp admin bar edit button.
- add settings object
	+ wp-admin rename
- ajax skip load on the sidebar/widgets
- 

## DONES to keep:
- Research and reduce SEO problems with ajax
	this should work fine because the stie will still function normally without js. 
	all the links have accurate urls
	the site map will still work normally with site crawlers 
	

## Credits:
	comments ajax: http://wpcrux.com/ajax-submit-wordpress-comments/
	comments php ajax reply: http://davidwalsh.name/wordpress-ajax-comments

