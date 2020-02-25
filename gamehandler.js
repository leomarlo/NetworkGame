

var mainfieldsizes=[300,300];
var panelfieldsizes=[100,190];

function color_choice(player_number,opaque) {
  if (player_number==1){
    if (opaque){
      return 'rgba(255,127,80,0.5)';
    } else {
      return 'rgba(255,127,80,1.0)';
    }
  } else {
    if (opaque){
      return "rgba(115,144,153,0.5)";
    } else {
      return "rgba(115,144,153,1.0)";
    }
  }
}

function startGame() {
    Reset.addEventListener('click', ()=>{reset()});
    Rules.addEventListener('click', ()=>{alert(Rules_text)});
    document.getElementById("leftpanel").style.borderColor=color_choice(1,false);
    document.getElementById("rightpanel").style.borderColor=color_choice(2,false);
    Ply_2_fin.style.background=color_choice(2,false);
    Ply_1_fin.style.background=color_choice(1,false);

    var maincanvas=document.getElementById("GameField");
    maincanvas.width=mainfieldsizes[0];
    maincanvas.height=mainfieldsizes[1];
    window.MainArea = new GameArea(maincanvas,10,true);
    MainArea.setgridparameters(8,8,2,"#000");
    MainArea.updategrid();

    Player1= new Player(1,22,5);
    Player2= new Player(2,22,5);
    Player1.initialize();
    Player2.initialize();
    Ply_2_fin.addEventListener('click', Player_2_starts);
    Ply_1_fin.addEventListener('click', Player_1_starts);

}



function Player_1_starts () {
  // make the other button color faint.
  Ply_2_fin.style.background=color_choice(2,true);
  Ply_1_fin.style.background=color_choice(1,false);
  // change the innerHTML to I finished my turn.
  var finished_sentence='I\'m done';
  Ply_2_fin.innerHTML=finished_sentence;
  Ply_1_fin.innerHTML=finished_sentence;
  // remove eventlistener and add the new ones.
  Ply_2_fin.removeEventListener('click', Player_2_starts);
  Ply_1_fin.removeEventListener('click', Player_1_starts);
  //add event listeners
  add_finished_button_listeners();
  // let the games begin
  Player1.myturn()

}

function Player_2_starts () {
  // make the other button color faint.
  Ply_1_fin.style.background=color_choice(1,true);
  Ply_2_fin.style.background=color_choice(2,false);
  // change the innerHTML to I finished my turn.
  var finished_sentence='I\'m done';
  Ply_1_fin.innerHTML=finished_sentence;
  Ply_2_fin.innerHTML=finished_sentence;
  // remove eventlistener and add the new ones.
  Ply_1_fin.removeEventListener('click', Player_1_starts);
  Ply_2_fin.removeEventListener('click', Player_2_starts);
  //add event listeners
  add_finished_button_listeners();
  // let the games begin
  Player2.myturn()
}

function remove_finished_button_listeners (){
  //add_finished_button_listeners();
  Ply_2_fin.removeEventListener('click',Player1.myturn);
  Ply_2_fin.removeEventListener('click',Player2.removelisteners);
  Ply_1_fin.removeEventListener('click',Player2.myturn);
  Ply_1_fin.removeEventListener('click',Player1.removelisteners);
}
function add_finished_button_listeners (){
  //add_finished_button_listeners();
  Ply_2_fin.addEventListener('click',Player1.myturn);
  Ply_2_fin.addEventListener('click',Player2.removelisteners);
  Ply_1_fin.addEventListener('click',Player2.myturn);
  Ply_1_fin.addEventListener('click',Player1.removelisteners);
}

var Rules_text =
"Start) Press \"Player 1 to start\" or \"Player 1 to start\"\n\n"+
"Selection) If it is the turn of player X (1 or 2), the that player may click on any of "+
"the pebbles or arrows in her or his stock. Once a selection is made the pebble or arrow can be placed in the main field.\n\n"+
"Placement of pebble) A pebble is placed by clicking simply on the game area, close to one of the grid points where it ought to be placed."+
"Once the pebble is placed it appears on the game area and disappears from the stock.\n\n"+
"Placement of arrow) An arrow is placed by clicking on the starting grid point, or close by, and then after that on the finishing grid point."+
"The starting and finishing point may not be the same one. In other words self-edges are not allowed. "+
"Once the arrow is placed it appears on the game area and disappears from the stock.\n\n"+
"Reset) Pressing the Reset-button will clear all the placed pebbles and arrows from the field and replenish the respective stocks.";

function reset(){
  MainArea.clear(true);
  Ply_2_fin.style.background=color_choice(2,false);
  Ply_1_fin.style.background=color_choice(1,false);
  remove_finished_button_listeners();
  Ply_2_fin.innerHTML="Player 2 to start";
  Ply_1_fin.innerHTML="Player 1 to start";
  // reset all the pebbles and arrows or player one and two
  Player1.initialize();
  Player2.initialize();
  // add eventlistener for whom to start.
  Ply_2_fin.addEventListener('click', Player_2_starts);
  Ply_1_fin.addEventListener('click', Player_1_starts);
}


function GameArea (canvas,padding,mainarea){
  this.mainarea=mainarea;
  this.canvas=canvas;
  this.padding=padding;
  this.width=this.canvas.width;
  this.height=this.canvas.height;
  this.context = this.canvas.getContext("2d");
  this.clear = function(withgrid) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (withgrid){this.updategrid();}
    };
  this.setgridparameters = function(xpts,ypts,size,color) {
      this.xpts=xpts; // creates these properties of GameArea
      this.ypts=ypts;
      this.size=size;
      this.gridcolor=color;
      // defining the distance between 2 consecutive gridlines
      if (this.mainarea){
        this.grid_dy=(this.height-2*this.padding)/(this.ypts-1); // distance between two gridlines
      } else {
        this.grid_dy=this.height/(this.ypts);;
      };
      this.grid_dx=(this.width-2*this.padding)/(this.xpts-1);
    };
  this.updategrid = function(){
      this.context.fillStyle = "red";

      var ix,iy;
      for (iy=0; iy < this.ypts; iy++) {
        if (this.mainarea){
          var y= this.padding+iy*this.grid_dy;
        } else {
          var y=(iy+1/2)*this.grid_dy;
        }
        this.context.beginPath();
        this.context.moveTo(this.padding, y);
        this.context.lineTo(this.width-this.padding, y);
        this.context.strokeStyle = 'rgba(0,0,0,0.5)';
        this.context.lineWidth=1;
        this.context.stroke();
      };
      for (ix = 0; ix < this.xpts; ix++) {
        let x= this.padding+ix*this.grid_dx;
        this.context.beginPath();
        this.context.moveTo(x, this.padding);
        this.context.lineTo(x, this.height-this.padding);
        this.context.strokeStyle = 'rgba(0,0,0,0.5)';
        this.context.lineWidth=1;
        this.context.stroke();
        for (iy=0; iy < this.ypts; iy++) {
          if (this.mainarea){
            var y= this.padding+iy*this.grid_dy;
          } else {
            var y=(iy+1/2)*this.grid_dy;
          }
          this.context.fillStyle = this.gridcolor;
          this.context.beginPath();
          this.context.arc(x, y, this.size, 0, 2 * Math.PI);
          this.context.fill();
        };
      };


    };
}

function Player(playernumber, pebbles, arrows) {
  this.playernumber=playernumber;
  this.opponentnumber=3-playernumber;
  this.color=color_choice(playernumber,false);
  this.pebbles=pebbles;
  this.arrows=arrows;
  this.get_player_name = function(name){
    this.player_name=name;
    document.getElementById("Ply_"+this.playernumber+"_name").innerHTML=this.player_name;
  }

  if (this.playernumber==1){
    var arrowcanvas=l_arr_cnv;//document.getElementById("leftarrowcanvas");
    var pebblescanvas=l_peb_cnv;//document.getElementById("leftpebblescanvas");
  }  else  {
    var arrowcanvas=r_arr_cnv;//document.getElementById("rightarrowcanvas");
    var pebblescanvas=r_peb_cnv;//document.getElementById("rightpebblescanvas");
  }
  arrowcanvas.width=panelfieldsizes[0];
  arrowcanvas.height=panelfieldsizes[1];
  pebblescanvas.width=panelfieldsizes[0];
  pebblescanvas.height=panelfieldsizes[1];
  this.arrowsarea = new GameArea(arrowcanvas,10,false);
  this.pebblsarea = new GameArea(pebblescanvas,10,true);

  this.arrowwidth=5;
  this.arrowsarea.setgridparameters(2,arrows,2,"black");
  this.arrowsarea.updategrid();

  this.pebblesize=5;
  this.pebblecols=4;
  this.pebblsarea.setgridparameters(this.pebblecols,(pebbles-(pebbles%this.pebblecols))/this.pebblecols+1,2,"black");
  this.pebblsarea.updategrid();

  this.initialize = function() {
    var arrows_instock = new Array(this.arrows);
    var pebbls_instock = new Array(this.pebbles);
    var arrows_infield = new Array(this.arrows);
    var pebbls_infield = new Array(this.pebbles);

    var arr_in,peb_in;

    // add the arrows to the stock
    for (arr_in=0; arr_in<this.arrows; arr_in++ ){
      arrows_instock[arr_in] = new canvas_arrow(this.arrowsarea, [0,arr_in], [1,arr_in],this.color,this.arrowwidth,arr_in);
      arrows_instock[arr_in].update();
    }
    this.arrows_instock=arrows_instock;

    // add the pebbles to the stock.
    for (peb_in=0; peb_in<this.pebbles; peb_in++) {
      let x_in=peb_in%this.pebblecols;
      let y_in=(peb_in-x_in)/this.pebblecols;
      pebbls_instock[peb_in] = new canvas_pebbles(this.pebblsarea, [x_in,y_in], this.color,this.pebblesize,peb_in);
      pebbls_instock[peb_in].update();
    }
    this.pebbls_instock=pebbls_instock;

    // add the arrow and pebbles to the field (initially none)
    this.arrows_infield=arrows_infield;
    this.pebbls_infield=pebbls_infield;

    this.selected_arrow=null;
    this.selected_pbble=null;
    this.found_arrow_starting=false;
    this.found_arrow_ending=false;
    this.arrow_starting_point=[null,null];
    this.arrow_ending_point=[null,null];
    // reset the pebble finding flags
    this.found_pebble_position=false;
    // reset the pebble position to null
    this.pebble_position=[null,null];

  }

  this.update_arrow_canvas = () => {
    // clear the arrow and pebbles canvases
    this.arrowsarea.clear(true);
    // initialize looping indices
    var arr_in;
    // update the arrows to the stock
    for (arr_in=0; arr_in<this.arrows; arr_in++ ){
      if (this.arrows_instock[arr_in] != null){this.arrows_instock[arr_in].update(); }
    }
  }

  this.update_pebbles_canvas = () => {
    // clear the arrow and pebbles canvases
    this.pebblsarea.clear(true);
    // initialize looping indices
    var peb_in;
    // add the pebbles to the stock.
    for (peb_in=0; peb_in<this.pebbles; peb_in++) {
      if (this.pebbls_instock[peb_in] != null){this.pebbls_instock[peb_in].update(); };
    }
  }

  this.update_canvases = () => {
    // update all the canvases from the player side.
    this.update_pebbles_canvas();
    this.update_arrow_canvas();
  }

  this.removelisteners = () => {
    if (this.playernumber==1){
      l_arr_cnv.removeEventListener('click', this.select_arrow );
      l_peb_cnv.removeEventListener('click', this.select_pebble);
    }  else  {
      r_arr_cnv.removeEventListener('click', this.select_arrow );
      r_peb_cnv.removeEventListener('click', this.select_pebble);
    }
  }

  this.myturn = () => {
    // set to default all the pebble and arrow selection flags, so that there is no confusion later
    this.selected_arrow=null;
    this.selected_pbble=null;
    this.found_arrow_starting=false;
    this.found_arrow_ending=false;
    this.arrow_starting_point=[null,null];
    this.arrow_ending_point=[null,null];
    // reset the pebble finding flags
    this.found_pebble_position=false;
    // reset the pebble position to null
    this.pebble_position=[null,null];

    // first disable the other person's button;
    document.getElementById("finished"+this.opponentnumber).style.background=color_choice(this.opponentnumber,true);
    // then enable my button;
    document.getElementById("finished"+this.playernumber).style.background=color_choice(this.playernumber,false);
    // create eventlisteners
    if (this.playernumber==1){
      l_arr_cnv.addEventListener('click', this.select_arrow );
      l_peb_cnv.addEventListener('click', this.select_pebble);
    }  else  {
      r_arr_cnv.addEventListener('click', this.select_arrow );
      r_peb_cnv.addEventListener('click', this.select_pebble);
    }
  }

  this.select_arrow = (evt) => {

    var rect = this.arrowsarea.canvas.getBoundingClientRect();
    var posx = evt.clientX - rect.left;
    var posy = evt.clientY - rect.top;
    var arr_in;

    if (this.selected_arrow==null && this.selected_pbble==null){

      for (arr_in=0; arr_in<this.arrows; arr_in++ ) {

        if (this.arrows_instock[arr_in]!=null){

          if (Math.abs(posy-this.arrows_instock[arr_in].fromy)<this.arrowsarea.grid_dy/2){

            this.arrows_instock[arr_in].color='#ddd';
            this.arrows_instock[arr_in].update();
            this.selected_arrow=arr_in;

            marea_cnv.addEventListener('click',  this.place_arrow);

          }
        }

      }
    } else {
      // pebble could also be selected at the same time. If not then an arrow
      // had been selected previously and we should undo the selection Random
      // remove the event listener to the main area again.
      if (this.selected_pbble==null){
        this.arrows_instock[this.selected_arrow].color=this.color;
        this.arrows_instock[this.selected_arrow].update();
        this.selected_arrow=null;

        // removeEventListener of the main area
        marea_cnv.removeEventListener('click', this.place_arrow );
      }
      // if a pebble is selected then nothing will happen.
    }
  }

  this.find_event_point = (canvasarea,evt) =>{
    var found_flag;
    var location=[,];
    var rect = canvasarea.canvas.getBoundingClientRect();
    var posx = evt.clientX - rect.left;
    var posy = evt.clientY - rect.top;
    var x_grip_pos,x_cond,y_grip_pos,y_cond;
    var x_in, y_in;
    for (x_in=0; x_in<canvasarea.xpts; x_in++){
      x_grip_pos= canvasarea.padding+x_in*canvasarea.grid_dx;
      x_cond = Math.abs(posx-x_grip_pos)<canvasarea.grid_dx/2;
      for (y_in=0; y_in<canvasarea.ypts; y_in++){
        y_grip_pos= canvasarea.padding+y_in*canvasarea.grid_dy;
        y_cond = Math.abs(posy-y_grip_pos)<canvasarea.grid_dy/2;
        if (x_cond && y_cond){
          //this is the starting point
          location=[x_in,y_in];
          found_flag=true;
        }
      }
    }
    return {found_flag: found_flag, location: location};
  }

  this.place_arrow = (evt) => {
    if (!this.found_arrow_starting){
      var startingloc = this.find_event_point(MainArea,evt);
      this.arrow_starting_point=startingloc.location;
      this.found_arrow_starting=startingloc.found_flag;
    } else {
      var endingloc = this.find_event_point(MainArea,evt);
      //selfedges not allowed.
      if((endingloc.location[0]==this.arrow_starting_point[0] && endingloc.location[1]==this.arrow_starting_point[1])){
        //"Its the same point"
        // nothing happens.
      } else {
        this.arrow_ending_point=endingloc.location;
        this.found_arrow_ending=endingloc.found_flag;
      }
    }

    if (this.found_arrow_starting && this.found_arrow_ending){
      // add arrow to the main GameArea
      var placed_arrow = new canvas_arrow(MainArea, [this.arrow_starting_point[0],this.arrow_starting_point[1]], [this.arrow_ending_point[0],this.arrow_ending_point[1]],this.color,this.arrowwidth,this.selected_arrow);
      placed_arrow.apropriate(this.playernumber); // give it an owner id
      // add this arrow to the infield stock and show it there
      this.arrows_infield[this.selected_arrow]=placed_arrow;
      this.arrows_infield[this.selected_arrow].update();

      // delete the selected arrow from the stock
      this.arrows_instock[this.selected_arrow]=null;
      this.selected_arrow==null;
      this.update_arrow_canvas(); // update the arrow canvas;

      this.reset_flags(); // reset the all flags and initializations of vector points and pebble positions.

      // removeEventListener of the main area
      marea_cnv.removeEventListener('click', this.place_arrow );
      // also remove the listeners to the canvases (might change this for other games)
    }
  }

  this.place_pebble =(evt)=>{
    //alert('place pebble')
    var findloc = this.find_event_point(MainArea,evt);
    this.pebble_position=findloc.location;
    this.found_pebble_position=findloc.found_flag;
    if (this.found_pebble_position){
      var placed_pebble = new canvas_pebbles(MainArea, this.pebble_position, this.color,this.pebblesize, this.selected_pbble);
      placed_pebble.apropriate(this.playernumber);
      // add this pebble to the infield stock and show it there
      this.pebbls_infield[this.selected_pbble]=placed_pebble;
      this.pebbls_infield[this.selected_pbble].update();
      // delete the selected arrow from the stock
      this.pebbls_instock[this.selected_pbble]=null;
      this.selected_pbble==null;
      this.update_pebbles_canvas(); // update the arrow canvas;

      this.reset_flags(); // reset the all flags and initializations of vector points and pebble positions.

      // removeEventListener of the main area
      marea_cnv.removeEventListener('click', this.place_pebble );
    }

  }

  this.select_pebble = (evt) => {
    //alert('select pebble')
    var rect = this.pebblsarea.canvas.getBoundingClientRect();
    var posx = evt.clientX - rect.left;
    var posy = evt.clientY - rect.top;
    var pbl_in;
    //alert(Math.abs(this.arrows))
    if (this.selected_pbble==null && this.selected_arrow==null){

      for (pbl_in=0; pbl_in<this.pebbles; pbl_in++ ) {
        if (this.pebbls_instock[pbl_in]!=null){

          let y_cond = Math.abs(posy-this.pebbls_instock[pbl_in].y)<this.pebblsarea.grid_dy/2;
          let x_cond = Math.abs(posx-this.pebbls_instock[pbl_in].x)<this.pebblsarea.grid_dx/2;
          if (x_cond && y_cond){
            this.pebbls_instock[pbl_in].color='#ddd';
            this.pebbls_instock[pbl_in].update();
            this.selected_pbble=pbl_in;

            marea_cnv.addEventListener('click',  this.place_pebble);
          }
        }

      }
    } else {
      if (this.selected_arrow==null){
        this.pebbls_instock[this.selected_pbble].color=this.color;
        this.pebbls_instock[this.selected_pbble].update();
        this.selected_pbble=null;

        marea_cnv.removeEventListener('click',  this.place_pebble);
      }
    }
  }


  this.reset_flags = ()=>{
    this.selected_arrow=null;
    this.selected_pbble=null;
    // reset the arrow beginning and starting finding flags
    this.found_arrow_starting=false;
    this.found_arrow_ending=false;
    // reset the arrow beginning and ending points to null
    this.arrow_beginning_point=[null,null];
    this.arrow_ending_point=[null,null];
    // reset the pebble finding flags
    this.found_pebble_position=false;
    // reset the pebble position to null
    this.pebble_position=[null,null];
  }
}


function canvas_arrow(gamearea, from, to, color, arrow_width, id) {

  this.id=id;
  this.fromxi=from[0];
  this.fromyi=from[1];
  this.toxi=to[0];
  this.toyi=to[1];
  this.fromx=gamearea.padding+this.fromxi*(gamearea.width-2*gamearea.padding)/(gamearea.xpts-1);
  if (gamearea.mainarea){
    this.fromy=gamearea.padding+this.fromyi*gamearea.grid_dy;
    this.toy=gamearea.padding+this.toyi*gamearea.grid_dy;
  } else {
    this.fromy=(this.fromyi+1/2)*gamearea.grid_dy;
    this.toy=(this.toyi+1/2)*gamearea.grid_dy;
  }

  this.tox=gamearea.padding+this.toxi*gamearea.grid_dx;
  this.linewidth=arrow_width;
  this.pebblesize_estimate=5;
  this.headlenth = 15; // length of head in pixels
  this.color=color;
  this.apropriate = function (owner) {
    this.owner = owner;
  }
  var dx = this.tox - this.fromx;
  var dy = this.toy - this.fromy;
  this.angle=Math.atan2(dy, dx);
  this.update = function() {
    let subtractpbbl = [this.pebblesize_estimate*Math.cos(this.angle),this.pebblesize_estimate*Math.sin(this.angle)];
    let subtracthead = [this.headlenth*Math.cos(Math.PI/6)*Math.cos(this.angle),this.headlenth*Math.cos(Math.PI/6)*Math.sin(this.angle)];
    let little_extra = [2*Math.cos(this.angle),2*Math.sin(this.angle)];
    gamearea.context.beginPath();
    gamearea.context.moveTo(this.tox - subtractpbbl[0], this.toy - subtractpbbl[1]);
    gamearea.context.lineTo(this.tox - subtractpbbl[0]- this.headlenth * Math.cos(this.angle - Math.PI / 6), this.toy - subtractpbbl[1] - this.headlenth * Math.sin(this.angle - Math.PI / 6));
    gamearea.context.lineTo(this.tox - subtractpbbl[0]- this.headlenth * Math.cos(this.angle + Math.PI / 6), this.toy - subtractpbbl[1] - this.headlenth * Math.sin(this.angle + Math.PI / 6));
    gamearea.context.lineTo(this.tox - subtractpbbl[0], this.toy - subtractpbbl[1]);
    gamearea.context.fillStyle=this.color;
    gamearea.context.fill();
    gamearea.context.lineWidth = 1;
    gamearea.context.strokeStyle = "black";
    gamearea.context.stroke();
    gamearea.context.beginPath();
    gamearea.context.lineWidth=this.linewidth;
    gamearea.context.moveTo(this.fromx + subtractpbbl[0]- little_extra[0], this.fromy + subtractpbbl[1] -little_extra[1] );
    gamearea.context.lineTo(this.tox-subtracthead[0]-subtractpbbl[0], this.toy-subtracthead[1]-subtractpbbl[1]);
    gamearea.context.strokeStyle='black';
    gamearea.context.stroke();
    gamearea.context.beginPath();
    gamearea.context.lineWidth=this.linewidth-2;
    gamearea.context.moveTo(this.fromx + subtractpbbl[0]-little_extra[0], this.fromy + subtractpbbl[1]-little_extra[1]);
    gamearea.context.lineTo(this.tox-subtracthead[0] - subtractpbbl[0] +little_extra[0], this.toy-subtracthead[1]-subtractpbbl[1] + little_extra[1]);
    gamearea.context.strokeStyle=this.color;
    gamearea.context.stroke();
  }
}

function canvas_pebbles(gamearea, where, color,size, id) {
  this.id=id;
  this.xi=where[0];
  this.yi=where[1];
  this.size=size;
  this.x=gamearea.padding+this.xi*(gamearea.width-2*gamearea.padding)/(gamearea.xpts-1);
  if (gamearea.mainarea){
    this.y=gamearea.padding+this.yi*gamearea.grid_dy;
  } else {
    this.y=(this.yi+1/2)*gamearea.grid_dy;
  }

  this.color=color;
  this.apropriate = function (owner) {
    this.owner = owner;
  }
  this.update = function() {
    //alert(''+this.y+' and '+gamearea.padding+gamearea.width+gamearea.xpts)
    gamearea.context.fillStyle = this.color;
    gamearea.context.beginPath();
    gamearea.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    gamearea.context.fill();
    gamearea.context.lineWidth = 1;
    gamearea.context.strokeStyle = "black";
    gamearea.context.stroke();
  }
}

const marea_cnv = document.querySelector('#GameField');
const l_arr_cnv = document.querySelector('#leftarrowcanvas');
const r_arr_cnv = document.querySelector('#rightarrowcanvas');
const l_peb_cnv = document.querySelector('#leftpebblescanvas');
const r_peb_cnv = document.querySelector('#rightpebblescanvas');
const Ply_1_fin = document.querySelector('#finished1');
const Ply_2_fin = document.querySelector('#finished2');
const Rules = document.querySelector('#Rules');
const Reset = document.querySelector('#Reset');
