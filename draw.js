var childPoints = [];
var shapeList = [];
var drawnShapes = [];
var currentShape = -1;
var colors = ["(200, 0, 0)", "(0, 200, 0)", "(0, 0, 200)"]

function init() {
	var childCanvas = document.getElementById('childCanvas');
	childCanvas.addEventListener("mousedown", placeInChild, false);
	var masterCanvas = document.getElementById('masterCanvas');
	masterCanvas.addEventListener("mousedown", placeInMaster, false);
	var addButton = document.getElementById('addButton');
	addButton.addEventListener("click", addButtonHandler, false);
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Shape() {
	this.points = [];
	this.index = -1;
}

Shape.prototype.add = function(p) {
	this.points.push(p);
}

Shape.prototype.draw = function(ctx) {
	if (this.points.length < 1) {
		return;
	}
	ctx.beginPath();
	var p = this.points[0];
	ctx.moveTo(p.x, p.y);
	for (var i = 1; i < this.points.length; i++) {
		p = this.points[i];
		ctx.lineTo(p.x, p.y);
	}
	ctx.closePath();
	ctx.fill();
}

Shape.prototype.copy = function(c) {
	var copiedShape = new Shape();
	for (i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		copiedShape.add(new Point(p.x + c.x, p.y + c.y));
	}
	return copiedShape;
}

function drawChild() {
	var canvas = document.getElementById('childCanvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "rgb(256,256,256)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "rgb(256,0,0)";
		var p = childPoints[0];
		if (childPoints.length == 1) {
			ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
		} else {
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			for (var i = 1; i < childPoints.length; i++) {
				p = childPoints[i];
				ctx.lineTo(p.x, p.y);
			}
			ctx.closePath();
			ctx.stroke();
		}
	}
}

function drawMaster() {
	var canvas = document.getElementById('masterCanvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.scale(0.5, 0.5);
		for (var i = 0; i < drawnShapes.length; i++) {
			var shape = drawnShapes[i];
			ctx.fillStyle = "rgb" + colors[shape.index];
			shape.draw(ctx);
		}
		ctx.restore();
	}
}

function makePointFromEvent(event, canvasId) {
	var canvas = document.getElementById(canvasId);
	var x = event.x - canvas.offsetLeft;
	var y = event.y - canvas.offsetTop;
	return new Point(x, y);
}

function placeInMaster(event) {
	var point = makePointFromEvent(event, 'masterCanvas');
	var shape = shapeList[currentShape].copy(point);
	shape.index = currentShape;
	drawnShapes.push(shape);
	drawMaster();
}

function placeInChild(event) {
	var point = makePointFromEvent(event, 'childCanvas');
	childPoints.push(point);
	drawChild();
}

function imageFromChildCanvas() {
	var canvas = document.getElementById('childCanvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
}

function addButtonHandler(event) {
	var shape = new Shape();
	for (var i = 0; i < childPoints.length; i++) {
		shape.add(childPoints[i]);
	}
	shapeList.push(shape);
	makeShapeButton(shapeList.length - 1);
}

function selectShape(index) {
	currentShape = index;
	childPoints = [];
	for (var i = 0; i < shapeList[index].points.length; i++) {
		var p = shapeList[index].points[i];
		childPoints.push(new Point(p.x, p.y));
	}
	drawChild();
}

function makeShapeButton(index) {
	var buttonDiv = document.getElementById("buttonDiv");
	var element = document.createElement("input");
	element.setAttribute("type", "button");
	element.setAttribute("id", "shape_" + index);
	element.setAttribute("value", "shape_" + index);
	element.setAttribute("onclick", "selectShape(" + index + ");");
	buttonDiv.appendChild(element);
}