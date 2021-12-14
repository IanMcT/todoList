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

function loadTodoItems(tx, rs){
  var rowOutput = "";
  var todoItems = document.getElementById("todoItems");
  for(var i=0; i < rs.rows.length; i++){
    rowOutput += renderTodo(rs.rows.item(i));
  }

  todoItems.innerHTML = rowOutput;
}

function renderTodo(row) {
  return "<li>" + row.todo + " [<a href='javascript:void(0);' onclick=\'MyToDo.webdb.deleteTodo(" + row.ID + ");\'>Delete</a>]</li>";
}

MyToDo.webdb.deleteTodo = function(id) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM todo WHERE ID=?", [id], MyToDo.webdb.onSuccess,
    MyToDo.webdb.onError);
  });
}

function init(){
  MyToDo.webdb.open();
  MyToDo.webdb.createTable();

  MyToDo.webdb.getAllTodoItems(loadTodoItems);
}
function addTodo(){
  var todo = document.getElementById("todo");
  MyToDo.webdb.addTodo(todo.value);
  todo.value = "";
}