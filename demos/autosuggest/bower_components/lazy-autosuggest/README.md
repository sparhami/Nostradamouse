# About

An implementation of a typeahead in Polymer that allows for lazy loading of the component definition. In otherwords, you can place the element on the UI and a user can interact with it before the component has been upgraded.

This is by no means a complete implementation or intended for actual usage. Rather, it is an example of how you can construct an element that can be used without blocking rendering while waiting for the definition or having it suddenly appear some time after page load.

## Demo

[Demo (requires Chrome)](http://sparhami.github.io/lazy-autosuggest/)

## Motivation

The goal is to be able to have a component on your page that looks functional, even on page load. A user could, after the first round trip to the server, start using your site to perform a search.

This component is just one part of a broader vision of having instantly loading sites, even on low end devices and low bandwidth situations.

## Usage

Add the element to your page

```html
<lazy-autosuggest id="autosuggest">
    <input type="text" />
</lazy-autosuggest>
```

And some JavaScript

```javascript
autosuggest.addEventListener('inputChange', function(e) {
    // Make some api call to get the suggestions to show
    getItems(e.detail.value).then(function(suggestions) {
        autosuggest.items = suggestions;
    });
});
```
