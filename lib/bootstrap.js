/* jshint browser: true */
/**
 *  The App.js sets up the app.
 */
module.exports = function(){
  var Hub = require("lib/hub"),
      Board = require("lib/board"),
      React = require("react");
  //load board.
  var boardfile = window.location.hash.replace(/^#/, "");
  if(!boardfile){
    boardfile = window.localStorage.getItem("last-board") || "board.json";
    window.location.hash = encodeURIComponent(boardfile);
    window.location.reload();
    return;
  }else{
    boardfile = decodeURIComponent(boardfile);
  }
  window.localStorage.setItem("last-board", boardfile);
  document.getElementById("boardfile").value = boardfile;
  var xhr = new XMLHttpRequest();
  var error = function(){
    document.getElementById("error").classList.add("visible");
  };
  xhr.open("GET", boardfile, true);
  xhr.addEventListener("load", function(){
    if(xhr.status == 200){
      try {
        var board = JSON.parse(xhr.responseText);
        if(!Array.isArray(board.Panels)){
          throw new Error();
        }
        if(!board.Title){
          board.Title = boardfile;
        }
        process.nextTick(function(){
          start(new Hub(board));
        });
      }catch(e){
        error();
      }
    }else{
      error();
    }
  });
  xhr.addEventListener("error", error);
  xhr.send(null);

  function start(hub){
    addBusinessLogicTo(hub);
    var app = React.renderComponent(Board({hub:hub}), document.getElementById("panels"));
    hub.register(app.forceUpdate.bind(app));
    document.title = hub.get("Title");
    document.getElementById("title").innerText = hub.get("Title");
  }

  function addBusinessLogicTo(hub){
    hub.on("get-data", function(panelIndex){
      var url = hub.get(["Panels", panelIndex, "Url"]),
          xhr = new XMLHttpRequest(),
          sKey = ["Panels", panelIndex, "Status"];
      xhr.open("GET", url, true);
      xhr.addEventListener("load", function(){
        if(xhr.status == 200) {
          hub.set(sKey, {
            data: xhr.responseText,
            error: "",
            last: +(new Date())
          });
        }else{
          hub.set(sKey, {
            data: null,
            error: "Could not fetch data",
            last: +(new Date())
          });
        }
      }.bind(this));
      xhr.addEventListener("error", function(){
        hub.set(sKey, {
          data: null,
          error: "Could not fetch data",
          last: +(new Date())
        });
      }.bind(this));
      xhr.send(null);
    });

    var intervals = []; //map[panelIndex]intervalId
    hub.on("moar-data-please", function(panelIndex){
      if(!intervals[panelIndex]){
        hub.dispatch("get-data", panelIndex);
        intervals[panelIndex] = window.setInterval(function(){
          hub.dispatch("get-data", panelIndex);
        }, (hub.get(["Panels", panelIndex, "Update"]) || 3600) * 1e3);
      }
    });
    hub.on("stop-data-please", function(panelIndex){
      if(intervals[panelIndex]){
        window.clearInterval(intervals[panelIndex]);
      }
    });
    hub.on("force-update", function(panelIndex){
      hub.set(["Panels", panelIndex, "Status"], {
        data: null,
        error: "",
        last: 0
      });
      hub.dispatch("get-data", panelIndex);
    });
  }

  //bind form to load
  document.getElementById("loadform").addEventListener("submit", function(ev){
    ev.preventDefault();
    window.location.hash = encodeURIComponent(document.getElementById("boardfile").value);
    window.location.reload();
  });
};