# Nestable Web Component with Progressive Rendering and SEO supported

##Getting Started
Clone this repo and run these commands:
```
npm install
npm start
```
Then visit http://localhost:5000 and http://localhost:5000/seo

##Goal
  - Able to build modular and flexible web site by develop as web component
  - Support single flush (pure HTML), good for SEO
  - Lowest time to first paint
  - Able to rendering in a progressive way
  - Suitable for develop with many teams

##Inspirations
 - Facebook BigPipe -- [view](https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919)
 - Ideas behind ReactJS async server-side rendering issue -- [view](https://github.com/reactjs/react-page/issues/47)

##Philosophy
 - Web page must construct by components
 - The Component must allow to be nested
 - Data fetching is a responsibility of the component itself
 - Data fetching should be able to execute in parallel
 - Do not strict with NodeJS -- you can use in any language
 - Focus only the rendering part, not the business logic -- it should separate into API/micro service/SOA/What ever!

##Specification
 - The Component
	 - public interface must provide 3 method
		 - `componentId(): String`
		 - `getData(cycle): void` - run asynchronously, notify The Registry through cycle -- whether it is ended or has a progress
		 - `render(): String`
	 - **things should do**
		 - constructor should accept The Registry and component's properties as arguments
		 - `render()` should return only single root element with `componentId()` embedded as a element's property
		 - when The Component is created, it should register itself with The Registry
		 - Nested component creation should be created in `getData(cycle)` method to avoid SEO rendering issue
		 - Single flush mode (SEO) should detect from `User-Agent` header
 - The Registry
	 - Responsibility: watch rendering progress, send update to client and schedule a `getData()` on components
	 - public interface must provide 1 method
		 - `register(component): void` - allow component being watched by The Registry
 - The Client Library
	 - do DOM Manipulation when raw HTML arrived
	 - it's should be as tiny as possible

##Further Improvements
 - Separate CSS for each component and transform each CSS rule into a unique classname
 - Able to load CSS and JS dynamically
 - Support re-rendering of a specific component
 - Live component update by using WebSocket/HTTP Long pooling

##License
You can use this idea, source codes or modify in a way you want without any restrictions but once you found it useful or interesting, please give me some credits.
