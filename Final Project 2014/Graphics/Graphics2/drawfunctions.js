var opts;
var points = []; //points array
var curve_lines =30;
var pt = 1;
var color = '#000000';
var lines = []; //lines array
var circles = [];// circles array
var curves = [];// curves array

jQuery( document ).ready(function($) {
    $( ".jscolor" ).change(function() {
        color = $("#mycolor").val();
    });
    $("input[name=opts]:radio").change(function (){
        opts = $("input[name=opts]:checked").val();
        points = [];

    });
});


document.addEventListener("DOMContentLoaded", init, false);
function init() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPosition, false);
}


function getPosition(event) {
    var x;
    var y;
    var canvas = document.getElementById("canvas");
    x = event.x;
    y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    points.push({x:x,y:y});
	console.log(x);
	console.log(y);

	//check how many points the user clicked and which transformation the user has chosen
    if(opts == "reflectionX"){    //horizontal reflection
		reflection(2);
        points = [];
    }
	  if(opts == "reflectionY"){    //vertical reflection
        reflection(1);
        points = [];
    }
	else if((points.length == 1) && (opts == "rotation")){ //1 click and rotation
		angle = document.getElementById("angle").value; // rotations angle 
        rotation(points[0].x, points[0].y, angle);
        points = [];
    }
	if((points.length == 2) && (opts == "move")){    //2 clicks and move
        move(points[0].x,points[1].x, points[0].y,points[1].y);
        points = [];
    }
    
	else if((points.length == 2) && (opts == "scaling")){ //2 clicks and scaling
        scaling(points[0].x, points[1].x, points[0].y, points[1].y);
        points = [];
    }
	
	else if((points.length == 2) && (opts == "shearing")){//2 clicks and shearing
        shearing(points[0].x ,points[1].x, points[0].y, points[1].y);
        points = [];
    }
	
	
}


function clearCanvas(){ //clear all
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    points = [];
}


//*************  draw functions *******

function drawLine(x1, x2, y1, y2) { //draw a line
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle="#"+color;
	
    var dy = Math.abs(y2 - y1);
    var dx = Math.abs(x2 - x1);
    var sx = x1 < x2? 1 : -1;
    var sy = y1 < y2? 1 : -1;
	
	x1 = Math.round(x1);
	x2 = Math.round(x2);
	y1 = Math.round(y1);
	y2 = Math.round(y2);
    if (dx >= dy) {
        var p = 2 * dy - dx;
        while (x1 != x2) {
            ctx.fillRect(x1, y1, pt, pt);
            if (p > 0) {
                y1 += sy;
                p -= 2 * dx;
            }
            x1 += sx;
            p += 2 * dy;
        }
    }
    else if (dy > dx) {
        var p = 2 * dx - dy;
        while (y1 != y2) {
            ctx.fillRect(x1, y1,pt,pt);
            if (p > 0) {
                x1 += sx;
                p -= 2 * dy;
            }
            y1 += sy;
            p += 2 * dx;
        }
    }
}


function drawCircle(xCenter, yCenter, xRadius, yRadius){ //draw a circle
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle="#"+color;
    var r = Math.sqrt((Math.pow((xCenter-xRadius),2) + Math.pow((yCenter-yRadius),2)));
    var x = 0;
    var p = 3-2*r;
	
    while (x<r) {
        ctx.fillRect(xCenter+x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter+x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter+r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter+r, yCenter-x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter-x, pt, pt);
        if (p < 0) {
            p = p+(4*x)+6;
        }
        else {
            p = p+4*(x-r)+10;
            r--;
        }
        x++;
    }
}

function drawCurve(x1, x2, x3, x4, y1, y2, y3, y4) { // draw a curve
    console.log("drawing curve");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#" + color;
    var Mb = [[-1,3,-3,1],[3,-6,3,0],[-3,3,0,0],[1,0,0,0]];
    var Px = [x1, x2, x3, x4];
    var Py = [y1, y2, y3, y4];
    var xParams = matrixMultiply(Mb, Px);
    var yParams = matrixMultiply(Mb, Py);
    var lastX = 0;
    var lastY = 0;
    var xt, yt;
	curve_lines = 30;
    var step = parseFloat(1 / parseFloat(curve_lines));
    for (var t = 0;t <= 1; t += step){
        if (t == 0) {
            lastX = x1;
            lastY = y1;
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
        }
        else if (t == 1) {
            xt = x4;
            yt = y4;
            drawLine(lastX, xt, lastY, yt);
        }
        else {
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
            lastX = xt;
            lastY = yt;
        }
    }
    drawLine(lastX, x4, lastY, y4);

}

function drawAll(){ // draw all shapes in the arrays
	for(var i = 0 ; i < 14 ; i++){ // draw lines array
		drawLine(lines[i].x1 , lines[i].x2 , lines[i].y1 , lines[i].y2);
	}
	for(var i = 0 ; i < 6 ; i++){ //draw circles array

		drawCircle(circles[i].xc , circles[i].yc , circles[i].x , circles[i].y);
	}
	for(var i = 0 ; i < 1 ; i++){ //draw curves array
		curve_lines =30;
		drawCurve(curves[i].xc1 , curves[i].xc2 , curves[i].xc3 , curves[i].xc4 , curves[i].yc1 , curves[i].yc2 , curves[i].yc3 , curves[i].yc4);
	}
}

// ******* matrix Multiply *******

function matrixMultiply(mb, px) { 
    var result = [0,0,0,0];
    for (var i=0;i<mb.length;i++) {
        for (var j=0;j<px.length;j++) {
            result[i] += mb[i][j]*px[j];
        }
    }
    return result;
}



// ********* Add shape to arrays functions **********

 
function addLine(x1,x2,y1,y2){ // add line to lines array
console.log("x1 : " +x1);
lines.push({x1:x1,x2:x2,y1:y1,y2:y2});
console.log("lines.x1 : " +lines[0].x1);
console.log("line lengh : " + lines.lengh);
}

function addCircle(xc , yc ,x ,y ){ // add circle to circles array
	console.log("add circle " +xc);
	circles.push({xc:xc,yc:yc,x:x,y:y});
}

function addCurve(x1,x2,x3,x4,y1,y2,y3,y4){ //add curve to curves array
	console.log("add curve " +x1);
	curves.push({xc1:x1,xc2:x2,xc3:x3,xc4:x4,yc1:y1,yc2:y2,yc3:y3,yc4:y4});
}



//******** Transformations functions************

function move(x1,x2,y1,y2){ // move shape
	var xt = x1 - x2;
	var yt = y1 - y2;
	var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
	
	for(var i = 0 ; i < 14 ; i++){ //move lines
		lines[i].x1 = lines[i].x1 - xt;
		lines[i].x2 = lines[i].x2 - xt;
		lines[i].y1 = lines[i].y1 - yt;
		lines[i].y2 = lines[i].y2 - yt;
	}
	for(var i = 0 ; i < 6 ; i++){  //move circles
		circles[i].xc = circles[i].xc - xt;
		circles[i].x = circles[i].x - xt;
		circles[i].yc = circles[i].yc - yt;
		circles[i].y = circles[i].y - yt;
	}
	for(var i = 0 ; i < 1 ; i++){ //move curves
		curves[i].xc1 = curves[i].xc1 - xt;
		curves[i].xc2 = curves[i].xc2 - xt;
		curves[i].xc3 = curves[i].xc3 - xt;
		curves[i].xc4 = curves[i].xc4 - xt;
		curves[i].yc1 = curves[i].yc1 - yt;
		curves[i].yc2 = curves[i].yc2 - yt;
		curves[i].yc3 = curves[i].yc3 - yt;
		curves[i].yc4 = curves[i].yc4 - yt;
	}
	
	clearCanvas(); //clear all
	drawAll();  // draw new shapes
}

function rotation(xc,yc,t){  //rotation 
	var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
	ctx.fillStyle = "#" + color;

    var teta = t * Math.PI / 180;
	var sint = Math.sin(teta);
	var cost = Math.cos(teta);
	var r = [[cost,sint,0] , [-sint,cost,0] , [0,0,1]];

	for (var i = 0 ; i < 6 ; i++) { //rotate circles

		var xc1 = circles[i].xc - xc;
		var yc1 = circles[i].yc - yc;
		
		var x = circles[i].x - xc;
		var y = circles[i].y - yc;
		
		var result = matrixMultiply(r,[xc1,yc1,1]);
		xc1 = parseInt(result[0]);
		yc1 = parseInt(result[1]);
		
		result = matrixMultiply(r,[x,y,1]);
		x = parseInt(result[0]);
		y = parseInt(result[1]);
		
		circles[i].xc = (xc1 + xc);
		circles[i].yc = (yc1 + yc);
		circles[i].x = (x + xc);
		circles[i].y = (y + yc);
		}
		
		
	for (var i = 0 ; i < 1 ; i++) { // rotate curves
	
		var xc1 = curves[i].xc1 - xc;
		var yc1 = curves[i].yc1 - yc;
		
		var xc2 = curves[i].xc2 - xc;
		var yc2 = curves[i].yc2 - yc;
		
		var xc3 = curves[i].xc3 - xc;
		var yc3 = curves[i].yc3 - yc;
		
		var xc4 = curves[i].xc4 - xc;
		var yc4 = curves[i].yc4 - yc;
		
		var result = matrixMultiply(r,[xc1,yc1,1]);
		xc1 = parseInt(result[0]);
		yc1 = parseInt(result[1]);
		result = matrixMultiply(r,[xc2,yc2,1]);
		xc2 = parseInt(result[0]);
		yc2 = parseInt(result[1]);
		result = matrixMultiply(r,[xc3,yc3,1]);
		xc3 = parseInt(result[0]);
		yc3 = parseInt(result[1]);
		result = matrixMultiply(r,[xc4,yc4,1]);
		xc4 = parseInt(result[0]);
		yc4 = parseInt(result[1]);
		
		curves[i].xc1 =(xc1 + xc);
		curves[i].yc1 = (yc1 + yc);
		curves[i].xc2 = (xc2 + xc);
		curves[i].yc2 = (yc2 + yc);
		curves[i].xc3 = (xc3 + xc);
		curves[i].yc3 = (yc3 + yc);
		curves[i].xc4 = (xc4 + xc);
		curves[i].yc4 = (yc4 + yc);
		}
		
	for (var i = 0 ; i < 14 ; i++) { //rotate lines
	
		var xl1 = lines[i].x1 - xc;
		var yl1 = lines[i].y1 - yc;
		
		var xl2 = lines[i].x2 - xc;
		var yl2 = lines[i].y2 - yc;
		
		var result = matrixMultiply(r,[xl1,yl1,1]);
		xl1 = parseInt(result[0]);
		yl1 = parseInt(result[1]);
		result = matrixMultiply(r,[xl2,yl2,1]);
		xl2 = parseInt(result[0]);
		yl2 = parseInt(result[1]);		
		
		lines[i].x1 = (xl1 + xc);
		lines[i].y1 = (yl1 + yc);
		lines[i].x2 = (xl2 + xc);
		lines[i].y2 = (yl2 + yc);
		}
		clearCanvas(); //clear all
		drawAll(); // draw new shapes
}


function shearing(x1,x2,y1,y2){ //shearing
	var DX = x2 - x1;
	var DY = y2 - y1;
	
	
	var a = DX / (DY + 600);
	for(var i = 0 ; i < 14 ; i++){ // shear lines
		lines[i].x1 = lines[i].x1 + (a*lines[i].y1);
		lines[i].x2 = lines[i].x2 + (a*lines[i].y2);
	}
	for(var i = 0 ; i < 6 ; i++){ //shear circles
		circles[i].xc = circles[i].xc + (a*circles[i].yc);
		circles[i].x = circles[i].x + (a*circles[i].y);
		
	}
	for(var i = 0 ; i < 1 ; i++){ //shear curves
		curves[i].xc1 = curves[i].xc1 + (a*curves[i].yc1);
		curves[i].xc2 = curves[i].xc2 + (a*curves[i].yc2);
		curves[i].xc3 = curves[i].xc3 + (a*curves[i].yc3);
		curves[i].xc4 = curves[i].xc4 + (a*curves[i].yc4);
	}
	clearCanvas();//clear all
	drawAll();  // draw new shapes
}

function scaling(x1,x2,y1,y2){ //scaling
	var SX =1- ((x1 - x2)*0.001);
	var SY = 1 - ((y1 - y2)*0.001);
	var m = [[SX,0,0] , [0,SY,0] , [x1 * (1-SX),y1 * (1- SY),1]];
	console.log("SX :" + SX + "  SY  :" + SY); 
	
	for(var i = 0 ; i < 14 ; i++){ //scale lines
		var result = matrixMultiply(m , [lines[i].x1 , lines[i].y1 ,1]);
		lines[i].x1 = parseInt(result[0]);
		lines[i].y1 = parseInt(result[1]);
		
		
		result = matrixMultiply(m , [lines[i].x2 , lines[i].y2 ,1]);
		lines[i].x2 = parseInt(result[0]);
		lines[i].y2 = parseInt(result[1]);
	}
	for(var i = 0 ; i < 6 ; i++){//scale circles
		var result = matrixMultiply(m , [circles[i].xc , circles[i].yc ,1]);
		circles[i].xc = parseInt(result[0]);
		circles[i].yc = parseInt(result[1]);
		
		result = matrixMultiply(m , [circles[i].x , circles[i].y ,1]);
		circles[i].x = parseInt(result[0]);
		circles[i].y = parseInt(result[1]);
		
	}
	for(var i = 0 ; i < 1 ; i++){ //scale curves
	var result = matrixMultiply(m , [curves[i].xc1 , curves[i].yc1 ,1]);
		curves[i].xc1 = parseInt(result[0]);
		curves[i].yc1 = parseInt(result[1]);
		
		result = matrixMultiply(m , [curves[i].xc2 , curves[i].yc2 ,1]);
		curves[i].xc2 = parseInt(result[0]);
		curves[i].yc2 = parseInt(result[1]);
		
		result = matrixMultiply(m , [curves[i].xc3 , curves[i].yc3 ,1]);
		curves[i].xc3 = parseInt(result[0]);
		curves[i].yc3 = parseInt(result[1]);
		
		result = matrixMultiply(m , [curves[i].xc4 , curves[i].yc4 ,1]);
		curves[i].xc4 = parseInt(result[0]);
		curves[i].yc4 = parseInt(result[1]);
	}
	clearCanvas(); //clear all
	drawAll(); // draw all new shapes
	
}

function reflection(x){ //reflection X|Y
	if(x == 1){  //check which reflection to use , if 1 then use vertical, else use horizontal
			for(var i = 0 ; i < 14 ; i++){  //lines vertical reflection
		lines[i].x1 = ((lines[i].x1 - 624)*(-1)) + 624;
		lines[i].x2 = ((lines[i].x2 - 624)*(-1)) + 624;
	}
	for(var i = 0 ; i < 6 ; i++){ //circles vertical reflection
		circles[i].xc = ((circles[i].xc - 624)*(-1)) + 624;
		circles[i].x = ((circles[i].x - 624)*(-1)) + 624;
	}
	for(var i = 0 ; i < 1 ; i++){ //curves vertical reflection
		curves[i].xc1 = ((curves[i].xc1 - 624)*(-1)) + 624;
		curves[i].xc2 = ((curves[i].xc2 - 624)*(-1)) + 624;
		curves[i].xc3 = ((curves[i].xc3 - 624)*(-1)) + 624;
		curves[i].xc4 = ((curves[i].xc4 - 624)*(-1)) + 624;
	}
	
	}else{
				for(var i = 0 ; i < 14 ; i++){ // lines horizontal reflection
		lines[i].y1 = ((lines[i].y1 - 275)*(-1)) + 275;
		lines[i].y2 = ((lines[i].y2 - 275)*(-1)) + 275;
	}
	for(var i = 0 ; i < 6 ; i++){ //circles horizontal reflection
		circles[i].yc = ((circles[i].yc - 275)*(-1)) + 275;
		circles[i].y = ((circles[i].y - 275)*(-1)) + 275;	
	}
	for(var i = 0 ; i < 1 ; i++){ //curves horizontal reflection
		curves[i].yc1 = ((curves[i].yc1 - 275)*(-1)) + 275;
		curves[i].yc2 = ((curves[i].yc2 - 275)*(-1)) + 275;
		curves[i].yc3 = ((curves[i].yc3 - 275)*(-1)) + 275;
		curves[i].yc4 = ((curves[i].yc4 - 275)*(-1)) + 275;
	}
	}
	clearCanvas(); // clear all
	drawAll(); // draw all new shapes

}
