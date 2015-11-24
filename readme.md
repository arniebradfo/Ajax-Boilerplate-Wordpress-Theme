#  HTML5 Reset+PJAX WordPress Theme

HTML5 Reset+PJAX is a simple set of *WordPress* best practices to get web projects off on the right foot. It alos includes support for the combination of the .js history API and AJAX to enable faster loads and dynamic page transitions.

## TODOs:
1. Add hover prefetch option to increase performance ( copy: http://miguel-perez.github.io/smoothState.js/ ).
2. X - Add manual change to the wp .active class of the correct <nav> element.
	X - Add exception for the home page
	X - work on ancestor matching
3. X - Split initialLoad out from ajaxDelivered.
4. Test browser implementation inconsistencies of popstate.
6. Write documentation. "stick with the syntax wp uses to write nav links"
7. X - Alter <head> info on ajax call
8. X - Research and reduce SEO problems with ajax
	this should work fine because the stie will still function normally without js. 
	all the links have accurate urls
	the site map will still work normally with site crawlers 
9. X - Make it work with google analytics
8. Research and reduce SEO problems with ajax
9. Make it work with google anylitics
	added google analytics send pageview when ajaxDelivered()
10. research best keywords for naming
11. 0 - Possibly handle image loading differently? - image loading is out of scope
12. refactor functions to the appropiate type: anonymous, public, etc...
13. feature detect to allow gracefull degredation.
15. ajax the comments section
	- live reload from a refresh button
	X - post to the DB without reloading the page
	X - update posted comments
	X - add support for worpress returning an error page due to incorrect credentials
	X - detect a reply and append to the correct comment
		this one was hard - might have holes
	- navigate between comment pages - after new comments were posted
	- make surevcomment li have correct even odd classes
16. switch everything from jQuery to regular .js
	- regualar page load
	- comments section
17. add support for wp admin bar edit button.
18. 0 - Test wp native DOING_AJAX constant? - only works in the admin section.
19. add settings object


## Some of the features:

1. A style sheet designed to strip initial styles from browsers, starting your development off with a blank slate.
2. Easy to customize — remove whatever you don't need, keep what you do.
3. Google Analytics and jQuery calls
4. Meta tags ready for population
5. Empty print and small-screen media queries
6. Modernizr.js [http://www.modernizr.com/](http://www.modernizr.com/) enables HTML5 compatibility with IE (and a dozen other great features)
7. [Prefix-free.js](http://leaverou.github.io/prefixfree/) allowing us to only use un-prefixed styles in our CSS
8. IE-specific classes for simple CSS-targeting
9. iPhone/iPad/iTouch icon snippets, plus social/app meta tags for Twitter, Facebook, Windows 8
10. Lots of other keen stuff

## Credits:
	comments ajax: http://wpcrux.com/ajax-submit-wordpress-comments/
	comments php ajax reply: http://davidwalsh.name/wordpress-ajax-comments

