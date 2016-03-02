/*
 *	Particles Object
 *
 ***********************************************/

function Particle(color, posX, posY, radius, speed){
	this.color = new Color(color === undefined ? BASE_COLOR : color);
	this.posX = posX === undefined ? Math.floor(Math.random()*canvas.width) : posX;
	this.posY = posY === undefined ? Math.floor(Math.random()*canvas.height) : posY;
	this.radius = radius === undefined ? Math.floor(Math.random()*6 + 2) : radius;
	this.speed = speed === undefined ? Math.random()*0.4+0.2 : speed;
	this.oscillationDistance = 0;
	this.oscillationRate = Math.random()*0.12;
	this.inScreen = true;
}

Particle.prototype.move = function(){
	
	// In screen checking
	this.posX += this.speed;
	if (this.posX >= canvas.width+this.radius) {
		this.inScreen = false;
	}

	// Oscillation
	this.posY += this.oscillationRate;
	this.oscillationDistance += this.oscillationRate;
	if (Math.abs(this.oscillationDistance) >= this.radius*10) {
		this.oscillationRate = -this.oscillationRate;
	}
}



/*
 *	Color Object
 *
 ***********************************************/

function Color(rgb){
	this.rgb = rgb.substring(4, rgb.length-1).split(',');
	this.rgb = alterColor(this.rgb);
	this.opacity = Math.random()*0.4+0.1;
}

Color.prototype.getColor = function(){
	return "rgba(" 	+ this.rgb[0] + "," 
					+ this.rgb[1] + "," 
					+ this.rgb[2] + ","
					+ this.opacity + ")";
}

function alterColor(rgb_Arr){
	for (var i = 0; i < rgb_Arr.length; i++) {
		rgb_Arr[i] = parseInt(rgb_Arr[i]) + Math.floor(Math.random()*150)-30;
		if (rgb_Arr[i] > 255) rgb_Arr[i] = 255;
	}
	return rgb_Arr;
}



/*
 *	Canvas and Scene
 *
 ***********************************************/

var BASE_COLOR, NUM_PARTICLES;
var PARTICLES_ON = false;

var canvas = document.createElement('canvas');
	canvas.id     = "canvas";
	canvas.width  = null;
	canvas.height = null;	// DEFAULT

var scene  = canvas.getContext('2d');
    scene.lineWidth = 0;

var particles = [];

function refreshCanvas(){
	scene.clearRect(0, 0, canvas.width, canvas.height);
}

function getBackgroundHeight(){
	return document.getElementsByClassName('background-image')[0].offsetHeight * 0.8;
}




/*
 *	System
 *
 ***********************************************/

function loadParticules() { 
	for (var i = 0; i < NUM_PARTICLES; i++) generateParticles();
	var body = document.body;
		body.appendChild(canvas);
	particlesLoop();
}


function particlesLoop(){
	if (PARTICLES_ON) {
		refreshCanvas();
		renderParticles();
		setTimeout(function(){ particlesLoop() }, 15);
	}
}


function renderParticles(){
	for (var i = 0; i < particles.length && PARTICLES_ON; i++) {
		scene.beginPath();
		scene.fillStyle = particles[i].color.getColor();
		scene.arc(particles[i].posX, particles[i].posY, particles[i].radius, 0, Math.PI * 2, true);
		scene.fill();
		scene.closePath();

		// Move particles
		particles[i].move();

		// Generate Particules
		if (!particles[i].inScreen) {
			particles[i].color  = new Color(BASE_COLOR);
			particles[i].posX = -10; // reset position
			particles[i].posY = Math.floor(Math.random()*canvas.height);
			particles[i].radius = Math.floor(Math.random()*6 + 2);
			particles[i].speed  = Math.random()*0.8+0.1;
			particles[i].oscillationRate = Math.random()*0.12;
			particles[i].inScreen = true;
		}
	}
}

function generateParticles(){
	particles.push( new Particle() );
}




/*
 *	Onload
 *
 ***********************************************/

function setParticles(baseColor, numParticles){
	BASE_COLOR	  = baseColor;
	NUM_PARTICLES = numParticles === undefined ? 50 : numParticles;
	canvas.width  = document.body.offsetWidth;
	canvas.height = getBackgroundHeight();
	//	loadParticules()
}



/*
 *	Controllers
 *
 ***********************************************/

function particlesController(controller, particlesState){

	if (PARTICLES_ON != particlesState) {

		//	CSS
		var section = document.getElementsByClassName("section-particles-controllers")[0];
		var controllers = section.getElementsByTagName("span");
		for (var i = 0; i < controllers.length; i++) controllers[i].className = "";
		controller.className = "active";

		//	Switch particles : on/off; 
		PARTICLES_ON = particlesState;
		canvas.height = getBackgroundHeight();
 		canvas.width  = document.body.offsetWidth;

	 	if (PARTICLES_ON) loadParticules(BASE_COLOR, NUM_PARTICLES);
	 	else{
	 		refreshCanvas();
	 		particles = [];
	 	}
	}
}