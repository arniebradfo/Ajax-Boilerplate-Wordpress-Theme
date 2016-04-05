#  WPAjax WordPress Theme
what is this?

## HOW IT WORKS
high level concept - uses ajax to load a wordpress page and updates its page contents - ajaxed page and loaded new page should have parity.

## WPAjax js



## Helpful code
- If your developing a wordpress theme, you should use the [Theme Checker Plugin](https://wordpress.org/plugins/theme-check/).
- If your hosting your theme repository on github or bitbucket use the [github updater pluin](https://github.com/afragen/github-updater).
- For SEO [Yoast SEO](https://wordpress.org/plugins/wordpress-seo/).
- For google analytics [Google Analytics by Yoast](https://wordpress.org/plugins/google-analytics-for-wordpress/).
- [W3 total cache](https://wordpress.org/plugins/w3-total-cache/)is complicated but can make your site a lot faster.
- [Save with Keyboard](https://wordpress.org/plugins/save-with-keyboard/) is awesome.
- [Use svg](https://wordpress.org/plugins/svg-support/).
- Use [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) to animate between anchors and other loads. 

## TODOs:
- PAGINATION: 
    + dynamiclly replace each link? - don't know how I would do this?
    + don't reload menu and header for pagination - like comments
- back button loads just comments if previous post was a comment load - same with posts pagination.
    + make history-like object/array that stores the type of ajax call along with the url. Reference this everytime we hit the back button.
    + save a copy of the last ajax response and use that insted of querying the server.
- JS:
    + rename file
    + add if() checks for everything in js - fail gracefully
- CSS:
    + add a css framework for animating content in an out
- TEST:
    + Test it with google analytics - use ga plugin?
    + feature detect to allow graceful degredation.
        * Test browser implementation inconsistencies of popstate.
- Write documentation.
- research best keywords for naming
    + boilerplate
    + ajax
    + theme
    + wordpress
    + wp
    + pjax
    + pushstate
    + WP ajax boilerplate theme ??
