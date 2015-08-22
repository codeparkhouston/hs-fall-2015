function Maze(width, height){

  this.width = width;
  this.height = height;

}

Maze.prototype.generate = function(){
  var previousMaze = JSON.parse(localStorage.getItem('maze'));
  this.maze = previousMaze || maze(this.height, this.width);

  return this;
}

Maze.prototype.display = function(){
  var mazeArray = display(this.maze);
  var mazeBox = document.getElementById('maze');
  var mazeLineWidth = mazeArray[0].length;
  var mazePieces = ['|', '-', '+'];
  var mazeDOM = [];

  _.each(mazeArray, function(line){
    var mazeLine = document.createElement('div');
    mazeLine.classList.add('line');

    _.each(line, function(piece){
      var mazePiece = document.createElement('div');
      mazePiece.classList.add('piece-'+piece);
      mazePiece.innerText = ' ';
      mazePiece.style.width = 100/mazeLineWidth + '%';
      if(mazePieces.indexOf(piece) > -1){
        mazePiece.classList.add('piece');
        mazeDOM.push(mazePiece);
      } else {
        mazePiece.addEventListener('click', function(){
          var position;
          this.classList.toggle('active');
          if (typeof this.dataset.positionX == 'undefined'){
            position = this.getBoundingClientRect();
            this.dataset.positionX = (position.left + position.width/2).toFixed(1);
            this.dataset.positionY = (position.top + position.height/2).toFixed(1);
          }
        });
      }
      mazeLine.appendChild(mazePiece);
    });

    mazeBox.appendChild(mazeLine);
  });

  this.mazeDOM = mazeDOM;

  return this;
}

Maze.prototype.getBounds = function(){

  this.bounds = _.map(this.mazeDOM, function(mazeBlock){
    return _.omit(mazeBlock.getBoundingClientRect(),'width','height');
  });

  return this.bounds;
}

Maze.prototype.save = function(){
  localStorage.setItem('maze', JSON.stringify(this.maze));
}

Maze.prototype.clear = function(){
  localStorage.clear();
}

// http://rosettacode.org/wiki/Maze_generation#JavaScript
function maze(x,y) {
  var n=x*y-1;
  if (n<0) {alert("illegal maze dimensions");return;}
  var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
      verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
      here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
      path = [here],
      unvisited = [];
  for (var j = 0; j<x+2; j++) {
    unvisited[j] = [];
    for (var k= 0; k<y+1; k++)
      unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
  }
  while (0<n) {
    var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
        [here[0]-1, here[1]], [here[0],here[1]-1]];
    var neighbors = [];
    for (var j = 0; j < 4; j++)
      if (unvisited[potential[j][0]+1][potential[j][1]+1])
        neighbors.push(potential[j]);
    if (neighbors.length) {
      n = n-1;
      next= neighbors[Math.floor(Math.random()*neighbors.length)];
      unvisited[next[0]+1][next[1]+1]= false;
      if (next[0] == here[0])
        horiz[next[0]][(next[1]+here[1]-1)/2]= true;
      else 
        verti[(next[0]+here[0]-1)/2][next[1]]= true;
      path.push(here = next);
    } else 
      here = path.pop();
  }
  return {x: x, y: y, horiz: horiz, verti: verti};
}

function display(m) {
  var text= [];
  for (var j= 0; j<m.x*2+1; j++) {
    var line= [];
    if (0 == j%2)
      for (var k=0; k<m.y*4+1; k++)
        if (0 == k%4) 
          line[k]= '+';
        else
          if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
            line[k]= 'e';
          else
            line[k]= '-';
    else
      for (var k=0; k<m.y*4+1; k++)
        if (0 == k%4)
          if (k>0 && m.horiz[(j-1)/2][k/4-1])
            line[k]= 'e';
          else
            line[k]= '|';
        else
          line[k]= 'e';
    if (0 == j) line[1]= line[2]= line[3]= 'e';
    if (m.x*2-1 == j) line[4*m.y]= 'e';
    text.push(line);
  }
  return text;
}
