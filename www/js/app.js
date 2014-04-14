/**
 *  The App.js sets up the app.
 */
(function(){
  //load board.
  var boardfile = window.location.hash.replace(/^#/, "");
  if(!boardfile){
    boardfile = "board.json";
  }else{
    boardfile = decodeURIComponent(boardfile);
  }
  document.getElementById("boardfile").value = boardfile;
  var xhr = new XMLHttpRequest();
  var error = function(){
    document.getElementById("error").classList.add("visible");
  }
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
        window.setTimeout(function(){
          document.getElementById("title").innerText = board.Title;
          React.renderComponent(Board(board), document.getElementById("panels"));
        }, 4);
      }catch(e){
        error();
      }
    }else{
      error();
    }
  });
  xhr.addEventListener("error", error);
  xhr.send(null);

  //bind form to load
  document.getElementById("loadform").addEventListener("submit", function(ev){
    ev.preventDefault();
    window.location.hash = encodeURIComponent(document.getElementById("boardfile").value);
    window.location.reload();
  })
})();