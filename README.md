# Demo Test Runner

The design is pretty simple - using d3 (which the app will pull in from a CDN) for DOM manipulation and taking advantage of closures to avoid having to keep track of too much state.

The displayStats and updateStats methods could be consolidated by clever uses of d3's enter method, but I find that to be less readable in the long run.

### License: MIT
