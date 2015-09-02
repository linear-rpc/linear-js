# Linear JavaScript

## Overview
a msgpack-rpc + α implementation for JavaScript language.

## Build Instrunctions
### Required tools and Dependencies
* Java Runtime ver.1.6 or later<br>
  for JsTestDriver, closure-compiler and jsdoc-toolkit

### How to make and how to use
<pre class="fragment">
$ make
$ cp src/linear.min.js /path/to/somewhere
</pre>

### Make targets<br>
* all<br>
  same as pack<br>
  *NOTE*<br>
  linear.js and msgpack.codec.js are packed with by closure-compiler.<br>
  [http://code.google.com/p/closure-compiler/](http://code.google.com/p/closure-compiler/)

* pack<br>
  Pack linear.js and msgpack.codec.js into linear.min.js and linear.debug.js<br>
  You can use linear apis only including linear.min.js or linear.debug.js at your web application.<br>
<pre class="fragment">
  // minified
  &lt;script type='text/javascript' src='linear.min.js'&gt;
</pre>
<pre class="fragment">
  // not minified
  &lt;script type='text/javascript' src='linear.debug.js'&gt;
</pre>

* check-all/check<br>
  Do test linear.js on localhost with by JsTestDriver.<br>
  [http://code.google.com/p/js-test-driver/](http://code.google.com/p/js-test-driver/)<br>
  *NOTE for tests*<br>
  Test servers use TCP port number 4224 to 4229.

* start-servers<br>
  Only run test servers for linear.js.

* run-tests<br>
  Run tests.<br>
  You can test linear.js with mobile browsers and remote browsers as follows.<br>
  1. make start-servers
  2. Access http://host:port/ with your remote browsers.
  3. make run-tests

* stop-servers<br>
  Kill test servers.

* doc<br>
  Create api document for linear-js.<br>
  *NOTE for documentation*<br>
  Documents are created with by jsdoc-toolkit.<br>
  [http://code.google.com/p/jsdoc-toolkit/](http://code.google.com/p/jsdoc-toolkit/)

* clean<br>
  Cleanup dirs and remove documents, linear.min.js and linear.debug.js.

## Additional Informations
When you use HTTP Authentication(RFC2617), WebSocket transport to cross origin will not work well on some browsers.  
Please refer to [this issue](https://code.google.com/p/chromium/issues/detail?id=123862)</dd> for HTTP Authentication.

## Version Policy
* major<br>
  APIs and specifications are changed significantly,
  so you need to update server and client applications at the same time.
* minor<br>
  APIs are changed only slightly,
  so you need to rewrite applications if using appropriate APIs.
* revision<br>
  Bug fixes and security fixes etc.

## License
The MIT License (MIT)  
See LICENSE for details.  

And linear-js is using patched version of mspack.codec.js.  
Original code is at https://github.com/uupaa/msgpack.js  
<pre>
/*!{id:msgpack.codec.js,ver:1.05,license:"MIT",author:"uupaa.js@gmail.com"}*/
</pre>
And diff from original code is at deps/msgpack.js/uuppa\_msgpack\_codec\_js.diff

