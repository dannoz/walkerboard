"use strict";
var EventEmitter = require("events").EventEmitter;
/**
 *  This is a Flux Pattern style Dispatcher and general store.
 *  The ides is that all data is stored in a single object, but
 *  "stores" may manage their data through the hub.
 */
function Hub(state){
  this.__state = state||{};
  this.__events = new EventEmitter();
  this.__stores = {};
  this.__dispatching = false;
  this.__dispatch = function(){
    if(!this.__dispatching){
      process.nextTick(function(){
        this.__events.emit("dispatch");
        this.__dispatching = false;
      }.bind(this));
    }
    this.__dispatching = true;
  };
}

Hub.prototype = {
  //register an on-change callback
  register: function(fn){
    this.__events.addListener("dispatch", fn);
  },
  //register an event handler (these are the "actions")
  on: function(evt, fn){
    this.__events.addListener.call(this.__events, "event:"+evt, fn);
  },
  //tell the hub to do something, e.g. trigger an action
  dispatch: function(evt){
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift("event:"+evt);
    this.__events.emit.apply(this.__events, args.slice());
    args.unshift("event:any");
    this.__events.emit.apply(this.__events, args);
  },
  //get a value out of the hub.
  get: function(ref){
    var k = ref, v = this.__state;
    if(!k){ return; }
    if(!Array.isArray(k)){
      k = k.replace(/(^\.|\.$)/g, "").split(".");
    }
    while(k.length && (v = v[k.shift()])){}
    return v;
  },
  //definitely private, does the setting, and returns true (change) or false (no change)
  __set: function(ref, val){
    var k = ref, v = this.__state, changed = false;
    if(!k){ return changed; }
    if(!Array.isArray(k)){
      k = k.replace(/(^\.|\.$)/g, "").split(".");
    }
    while(k.length >1){
      if(!(k[0] in v)){
        v[k[0]] = {};
      }
      v = v[k.shift()];
    }
    if(val === void 0){
      changed = (v[k[0]] !== void 0);
      delete v[k[0]];
    }else{
      //check before for equality checking.
      changed = (JSON.stringify(v[k[0]]) !== JSON.stringify(val));
      v[k[0]] = val;
    }
    //here do a diff!
    return changed;
  },
  //set a value
  set: function(ref, val){
    var change;
    if(typeof ref === "object" && !Array.isArray(ref)){
      //object, set keys => values.
      change = Object.keys(ref).reduce(function(p, c){
        return (this.__set(c, ref[c]) || p);
      }.bind(this), false);
    }else{
      change = this.__set(ref, val);
    }
    if(change){
      this.__dispatch();
    }
    return change;
  },
  //alias setState with undefined value
  unset: function(ref){
    this.set(ref);
  },
  //this should only be used by "privileged" object who manipulate references in
  //the hub directly.
  notify: function(){
    this.__dispatch();
  }
};

module.exports = Hub;