var shape;
var points = [];
var curve_lines;
var poly_lines;
var pt = 2;
var color = '#000000';

jQuery( document ).ready(function($) {
    $( ".jscolor" ).change(function() {
        color = $("#mycolor").val();
    });
    $("input[name=shape]:radio").change(function (){
        shape = $("input[name=shape]:checked").val();
        points = [];

    });
});


document.addEventListener("DOMContentLoaded", init, false);
function init() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPosition, false);
}



//get position from the mouse pointer
function getPosition(event) {
    var x;
    var y;
    var canvas = document.getElementById("canvas");
    x = event.x;
    y = event.y;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    points.push({x:x,y:y});
    drawCircle(x, y, x+1, y+1);

	
	//check how many points the user clicked and which shape the user has chosen
    if((points.length == 2) && (shape == "line")){    //2 clicks and line
        drawLine(points[0].x,points[1].x, points[0].y,points[1].y);
        points = [];
    }
    else if((points.length == 2) && (shape == "circle")){ //2 clicks and circle
        drawCircle(points[0].x, points[0].y, points[1].x, points[1].y);
        points = [];
    }
    else if((points.length == 2) && (shape == "polygon")){//2 clicks and polygon
        var e = document.getElementById("poly_lines");
        poly_lines = e.options[e.selectedIndex].value; //get number of lines the user has chosen
        drawPolygon(points[0].x ,points[0].y, points[1].x, points[1].y);
        points = [];
    }
    else if((points.length == 4) && (shape == "curve")){//4 clicks and curve
        var e = document.getElementById("curve_lines");
        curve_lines = e.options[e.selectedIndex].value;//get number of lines 

        drawCurve(points[0].x, points[1].x, points[2].x, points[3].x, points[0].y, points[1].y, points[2].y, points[3].y);
        points = [];
    }
}


function clearCanvas(){ //clear all
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    points = [];
}

function drawLine(x1, x2, y1, y2) { //draw a line
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle="#"+color;
	
    var dy = Math.abs(y2 - y1);
    var dx = Math.abs(x2 - x1);
    var sx = x1 < x2? 1 : -1;
    var sy = y1 < y2? 1 : -1;
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



function drawPolygon(pcx,pcy,prx,pry){ //draw a polygon
console.log("drawing polygon");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#" + color;
	
    var teta = 2*Math.PI / poly_lines;
	var sint = Math.sin(teta);
	var cost = Math.cos(teta);
    var points = [];
    
	var x1,y1;
	var nx,ny;
	x1 = prx;
	y1 = pry;
	x1 = prx - pcx;
	y1 = pry - pcy;

	
	 for (var i = 0 ; i < poly_lines ; i++ ) {
				nx = Math.round((x1*cost) - (y1*sint));
				ny =Math.round((x1*sint) + (y1*cost));
				drawLine(x1+pcx,nx+pcx,y1+pcy,ny+pcy);
				x1=nx;
				y1=ny;
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

function matrixMultiply(mb, px) { 
    var result = [0,0,0,0];
    for (var i=0;i<mb.length;i++) {
        for (var j=0;j<px.length;j++) {
            result[i] += mb[i][j]*px[j];
        }
    }
    return result;
}






