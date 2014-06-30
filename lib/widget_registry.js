/**
 * Widgets add themselves to this global object.
 */
var _widgets = {};

module.exports = {
  add: function(name, constructor){
    _widgets[name] = constructor;
  },
  get: function(name){
    return _widgets[name]||false;
  }
};