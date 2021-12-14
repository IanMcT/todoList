var MyToDo = {};
MyToDo.webdb = {};
MyToDo.webdb.db = null;

MyToDo.webdb.open = function(){
  var dbSize = 5 * 1024*1024;
  MyToDo.webdb.db = openDatabase("ToDo", "1", "Todo manager",dbSize);
}

MyToDo.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

MyToDo.webdb.onSuccess = function(tx, e){
  MyToDo.webdb.getAllTodoItems(loadTodoItems);
}

MyToDo.webdb.createTable = function() {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS " + "todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
  });
}

MyToDo.webdb.addTodo = function(todoText) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
    [todoText, addedOn],
    MyToDo.webdb.onSuccess,
    MyToDo.webdb.onError);
  });
}

MyToDo.webdb.getAllTodoItems = function(renderFunc) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM todo", [], renderFunc, MyToDo.webdb.onError);
  });
}