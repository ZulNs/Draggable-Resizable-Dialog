# ToolWindow

Provides a mechanism for tool windows in the browser. Tool windows are dialogs which are:
- non-modal
- resizable
- mobile
- closeable
- display content to the user
- have one or more actions the user may perform via buttons in a button bar

Right now, this project needs some documentation. And much refactoring, since the code
originally came from an upstream author with a singular intent (see credits). See the
`demo/index.html` file for some in-browser usage. 

# Usage
Use this as a node module via `require` or use this as a standalone javascript file 
by grabbing the toolwindow.js from `dist`. The provided `toolwindow.css` mimicks the 
styling of a Windows 10 window. If you'd like something else, feel free to use that 
as a template (:

## The code:
ToolWindows are re-usable and will thus "remember" their position if closed and
re-opened. To create a new ToolWindow, simply do something like:
```javascript
var toolWindow = new ToolWindow({
  top: 120,
  left: 120, // optional: when no top or left are given, this window attempts to center itself
  width: 200, // starting width
  height: 250, // starting height
  minWidth: 150, // don't go thinner than this
  minHeight: 200, // don't go shorter than this
  content: {
    // simple text content -- you can also use "html" or "url" (more on that later) 
    type: "text",
    content: "Hello World!"
  },
  title: "Demo window", // goes in the title bar,
  buttons: [{
    title: "Dismiss",
    clicked: function() {
        // button click handlers are invoked with the toolwindow as the `this` parameter
        this.close();
      }
    }, {
      text: "Refresh",
      clicked: function() {
        // note that we can completely replace the content
        // here and that content.value can be any one of:
        // - string
        // - function producing a string
        // - async function producing a string (ie, promise)
        this.content = {
          type: "html",
          value: "<hr/>This is html<hr/>"
        };
        this.refresh();
      }
    }]
});
```

- By default, if you do not specify any buttons, you will get a "Close" button, which,
 like the [X] in the titlebar of the window, will close it.
- If you specifically want _no_ buttons, pass an empty array as the buttons
 and the button bar will be left out too
- possible types for content are:
  - text (plain text)
  - html (rendered html)
  - url (embed an iframe with this url)
- use the node module if you have a build system, or use toolwindow.min.js from
 the `dist` folder if you'd just like a global `ToolWindow` prototype.
  
# Why?

Because I need it for a client and I figure:
- it might be useful elsewhere
- it might be useful to someone else
- it originated in freely available code (though much has changed) so I wanted to
 give back
- for interest' sake, I would like to extend it beyond the minimal requirements
 and maintain it too
 
# It doesn't work or looks wonky
- have you included `toolwindow.css` in your site (or imported into sass)?
- if you're getting errors, I'd like to know about them (:
 
# Ew, it looks like Windows 10
Ok, so you're not a windows-lover. It _is_ the most common OS out there though,
so if I'm going to make a base style, it makes sense. Still, `toolwindow.css`
is fairly simple to work with -- I'm quite sure one could create a theme more
like the hosting system or one's favorite OS / window manager.

# Tests:
Visual only. Contributions welcome.


# Credits

Originally forked from https://github.com/ZulNs/Draggable-Resizable-Dialog, which is licensed under the MIT license
(see [LICENSE.upstream](LICENSE.upstream)). Original credit is due.

This project is relicensed, as per the MIT allowance, under the BSD 3-clause license

