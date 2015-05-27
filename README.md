#toner
[![Build Status](https://travis-ci.org/jsreport/toner.png?branch=master)](https://travis-ci.org/jsreport/toner)

**[node](https://nodejs.org/) library for dynamic assembling documents and printing them into various formats** 
(written for [jsreport](http://jsreport.net))


```js
var toner = require("toner")();
toner.engine("jsrender", require("toner-jsrender"));
toner.recipe("wkhtmltopdf", require("toner-wkhtmltopdf")());

toner.render({
    template: { 
	    engine: "jsrender",
		recipe: "wkhtmltopdf", 
		content: "<h1>{{:foo}}</h1>"
	},
    data: { foo: "hello world"}
}, function(err, res) {
    var pdfbuffer = res.content;
    var pdfstream = res.stream;    
});
```

##Basics

###Engines
Documents are assembled using javascript templating engines. The **engine** needs to be first registered in toner.

```js
toner.engine("[engine name]", pathToEngineScript);
```

You can write your own engine or use an existing one:

- [toner-handlebars](https://github.com/jsreport/toner-handlebars)
- [toner-jsrender](https://github.com/jsreport/toner-jsrender)

###Recipes
The actual printing of the document into pdf, excel or any other type of the document is done by something we call **recipe**. The recipe also needs to be registered first.

```js
toner.recipe("[recipe name]", function(req, res) { ... });
```

You can also write your own recipe or use an existing one:

- [toner-phantom](https://github.com/jsreport/toner-phantom)
- [toner-html-to-xlsx](https://github.com/jsreport/toner-html-to-xlsx)
- [toner-wkhtmltopdf](https://github.com/jsreport/toner-wkhtmltopdf)

###Render
The complete document generation is invoked using `tuner.render` function:
```js
toner.render({
    template: { 
	    engine: "jsrender",
		recipe: "wkhtmltopdf", 
		content: "<h1>{{:foo}}</h1>"
	},
    data: { foo: "hello world"}
}, function(err, res) {
    var pdfbuffer = res.content;
    var pdfstream = res.stream;    
});
```
The only parameter is an object representing rendering request. The request has following structure:
```js
{
	//[required]
    template: { 
	    //[required] templating engine used to assemble document
	    engine: "jsrender",
	    //[required] recipe used for printing previously assembled document
		recipe: "wkhtmltopdf", 
		//[required] template for the engine		
		content: "<h1>{{:foo}}</h1>",
		//javascript helper functions used by templating engines
		helpers: "function foo() { ...}" + 
				 "function foo2() { ... }"
		//any other settings used by recipes		 
		...		 
	},
	//dynamic data inputs used by templating engines
    data: { foo: "hello world"}
    ...
}
```

The render callback then contains the response with
```js
{
	//node.js buffer with the document
	content: ...
	//stream with the document
	stream: ...
	//http response headers with valid content type..
	headers: { ... }
}
```

##Pipe the document to the http response
```js
var http = require('http');
http.createServer(function (req, res) {
    toner.render({...}, function(err, out) {
        out.stream.pipe(res);
    });
}).listen(1337, '127.0.0.1');
```

##Hooks
It is expected there will soon popup other packages hooking into the Toner and adding additional functionality. For this case Toner provides several hooks which can be used to extend it.

```js
toner.before(function(req) { ... });
toner.after(function(req, res) { ... });
toner.afterEngine(function(req, res) { ... });
``` 

##Options
Calling Toner accepts some options as the parameter
```js
var toner = require("toner")({ ... });
```

Possible options:
- `tempDirectory` - this attribute is used by the recipes to store temporary files


##Tests

```bash
npm install
npm test
```

##Contributions
Yes, please.

##License
MIT