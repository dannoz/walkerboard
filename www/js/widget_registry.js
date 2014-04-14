/**
 * Widgets add themselves to this global object.
 */
var WidgetRegistry = {
  _widgets: {},
  add: function(name, constructor){
    this._widgets[name] = constructor;
  },
  get: function(name){
    return this._widgets[name]||false;
  }
};