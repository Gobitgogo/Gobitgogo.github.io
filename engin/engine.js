let thisUpdateScene;
let thisRenderScene;
//let game;
let resourse = 0;
let loadCount = 0;
let resourseAnimation = 0;
let loadCountAnimation = 0;
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function GBT_Scene(obj)
{
	canvas.width = obj.width || 400;
	canvas.height = obj.height || 400;
	this.WIDTH = canvas.width;
	this.HEIGHT = canvas.height;
	canvas.style.background = obj.style || "white";
    this.game;
GBT_Scene.prototype.gameLoop = function(scene)
{
    this.game = new scene();
	this.game.create();
	thisRenderScene = this.game.render;
	thisUpdateScene = this.game.update;
	
	sceneStart();
}
GBT_Scene.prototype.setGameLoop = function(scene)
{
	resourse = 0;
	loadCount = 0;
	resourseAnimation = 0;
	loadCountAnimation = 0;
	this.game = new scene();
	this.game.create();
	thisRenderScene = this.game.render;
	thisUpdateScene = this.game.update;
	
}

function sceneRequestAnimationFrame(scene)
{
requestAnimationFrame(scene);
}
function sceneStart()
{
	clearContext();
	if(resourse == loadCount && resourseAnimation == loadCountAnimation){
	
    thisRenderScene();
	thisUpdateScene();
	}
    sceneRequestAnimationFrame(sceneStart);
}
function clearContext(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}
var lastLoop = new Date();
var lastDraw = 0;
var f = 0;
this.fpsDraw = function(x,y,size,color){
	this.x = x || 0;
    this.y = y || 48;
    this.style =  color || "green";
    this.sizeText = size+"px serif" || "48px serif";
    var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
	lastLoop = thisLoop;
	if(new Date().getTime() - lastDraw > 500){
    f = fps;
	lastDraw = new Date().getTime();
    }
	ctx.fillStyle = this.style;
	ctx.font = this.sizeText;
    ctx.fillText("FPS: "+Math.round(f), this.x, this.y);
}
let url;
let buff;
this.GBT_Image = function(obj)
{
	        this.width = obj.width || canvas.width;
		    this.height = obj.height || canvas.height;
	        this.url = obj.url || 0;
		    this.x = obj.x || 0;
		    this.y = obj.y || 0;
			this.dx = obj.dx || 0;
			this.dy = obj.dy || 0;
            this.buff = document.createElement("canvas");
			this.buff.width = this.width;
			this.buff.height = this.height;
			if(url != this.url){
			buff = this.buff;
			url = this.url;
				resourse++;
			load(this.url).then(image=>
			{
				this.buff.getContext("2d").drawImage(image,0,0,this.width,this.height);
				loadCount++;
			});
			}else{
				this.buff = buff;
			}
}
this.GBT_Image.prototype.draw = function()
{
		//	if(resourse == loadCount){
			ctx.beginPath();
			ctx.drawImage(this.buff,this.x,this.y,this.buff.width,this.buff.height);
			ctx.closePath();
		//	}
}
this.GBT_Image.prototype.illuminationObject = function(){
	        	ctx.beginPath();
	            ctx.strokeStyle = "white";
                ctx.strokeRect(this.x,this.y,this.width,this.height);
	            ctx.closePath();
}
function load(url)
{
	return new Promise(resolve =>
	{
		const image = new Image();
		image.addEventListener("load",() =>
		{
			resolve(image);
			
		});
		image.src = url;
	});

}
const keys = {"LEFT" : 37,
              "RIGHT" : 39,
		      "UP" : 38,
			  "DOWN" : 40,
			  "SPACE" : 32
           }
let keyDown = {};
this.GBT_KeyDown = function(keyName)
{
    return  keyDown[keys[keyName]] == true;
}
addEventListener("keydown", function(event)
	{
       setKey(event.keyCode);
	});
	addEventListener("keyup", function(event)
	{
        clearKey(event.keyCode);
    });
function setKey(e)
{
	keyDown[e] = true;
}
function clearKey(e)
{
	keyDown[e] = false;
}

this.GBT_TimerOut = function(){
        this.startTimer = false;
        this.started;
		this.timer = new Date().getTime();
	}
this.GBT_TimerOut.prototype.start = function(f,t){
    this.t = t;
    this.f = f;
	if(new Date().getTime() - this.timer > this.t){
    this.f();
	this.timer = new Date().getTime();
	}
}

this.collision = function(obj_1, obj_2){
return obj_1.x<=obj_2.x+obj_2.width && obj_1.x+obj_1.width>=obj_2.x 
    && obj_1.y<=obj_2.y+obj_2.height && obj_1.y+obj_1.height>=obj_2.y;
}


this.GBT_Animation = function(obj){
	this.url = obj.url;
	this.x = obj.x || 0;
	this.y = obj.y || 0;
	this.width = obj.width || canvas.width;
	this.height = obj.height || canvas.height;
	this.sfX = obj.startFrameX || 0;
	this.sfY = obj.startFrameY || 0;
	this.cfX = this.sfX;
	this.cfY = this.sfY;
	this.efX = obj.endFrameX+1;
	this.efY = obj.endFrameY+1;
    this.animationOnXY = obj.animationOnXY || false;
	this.animationOnX = obj.animationOnX || false;
	this.animationOnY = obj.animationOnY || false;
	this.timer = new Date().getTime();
	this.fps = obj.fps || 1000/60;
	resourseAnimation++;
	this.buff = [];
	for(let i=0; i<=this.efX; i++){
		this.buff[i] = [];
		for(let j=0; j<=this.efY; j++){
			this.buff[i][j] = document.createElement("canvas");
	        this.buff[i][j].width = this.width;
	        this.buff[i][j].height = this.height;
	}
	}
	load(this.url).then(image=>
	{
        this.sWidth = obj.spriteWidth || image.width/this.efX;
        this.sHeight = obj.spriteHeight || image.height/this.efY;
		
			for(let i=this.sfX; i<=this.efX; i++){
			
		for(let j=this.sfY; j<=this.efY; j++){
		this.buff[i][j].getContext("2d").drawImage(image,(i)*this.sWidth,(j)*this.sHeight,this.sWidth,this.sHeight,0,0,this.width,this.height);
			
		}
			}
			loadCountAnimation++;
	});
}

this.GBT_Animation.prototype.draw = function()
{

		//	if(resourseAnimation == loadCountAnimation){
				if(new Date().getTime() - this.timer > this.fps){
					if(this.animationOnXY == true){
                this.cfX++;
				if(this.cfX>=this.efX){
					this.cfX=this.sfX;
					this.cfY++;
				if(this.cfY>=this.efY){
					this.cfY=this.sfY;
				}
	
				}
				}
				if(this.animationOnX == true){
					 this.cfX++;
					 this.cfY=this.sfY;
				if(this.cfX>=this.efX){
					this.cfX=this.sfX;
				}
				}
				if(this.animationOnY == true){
					this.cfY++;
					this.cfX=this.sfX;
				if(this.cfY>=this.efY){
					this.cfY=this.sfY;
				}
				}
                	this.timer = new Date().getTime();
				}
            ctx.beginPath();
			ctx.drawImage(this.buff[this.cfX][this.cfY],this.x,this.y,
			                                  this.buff[this.cfX][this.cfY].width,
			                                  this.buff[this.cfX][this.cfY].height);
			ctx.closePath();
			

		//	}
}
this.GBT_Animation.prototype.setCurrentFrameX = function(cfX){
	 this.cfX = cfX;
}
this.GBT_Animation.prototype.setCurrentFrameY = function(cfY){
	 this.cfY = cfY;
}
this.GBT_Animation.prototype.getCurrentFrameX = function(){
	return this.cfX;
}
this.GBT_Animation.prototype.getCurrentFrameY = function(){
	return this.cfY;
}
this.GBT_Animation.prototype.getEndFrameX = function(){
	return this.efX;
}
this.GBT_Animation.prototype.getEndFrameY = function(){
	return this.efY;
}
}




