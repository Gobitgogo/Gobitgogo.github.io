function GBT_Scene(obj){
	let thisUpdateScene;
    let thisRenderScene;
	const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
	canvas.width = obj.width || 400;
	canvas.height = obj.height || 400;
	this.WIDTH = canvas.width;
	this.HEIGHT = canvas.height;
	canvas.id = obj.id || "canvas";
	canvas.style.background = obj.style || "white";
click = false;
this.game ={};
this.getRandom = function(min, max){
return Math.floor(Math.random() * (max - min+1) + min);
}
this.onclick = function(){
    canvas.addEventListener("click",this.checkSceneClick);
	if(click){
		canvas.removeEventListener("click",this.checkSceneClick);
	click = false;
	return true;
	}
}
this.checkSceneClick = function(){
    click = true; 
}
this.gameLoop = function(scene){
	this.game = scene;
    this.game.create();
	thisRenderScene = this.game.render;
	thisUpdateScene = this.game.update;
	sceneStart();
}
this.setGameLoop = function(scene){
	this.game = scene;
	this.game.create();
	thisRenderScene = this.game.render;
	thisUpdateScene = this.game.update;
	emX = 0;
	emY = 0;
	etX = 0;
	etY = 0;
}
function sceneRequestAnimationFrame(scene){
requestAnimationFrame(scene)|| webkitRequestAnimationFrame(scene) || oRequestAnimationFrame(scene) || msRequestAnimationFrame(scene) || setTimeout(scene, 1000 / 60);
}
function sceneStart(){
	clearContext();
	thisRenderScene();
	thisUpdateScene();
    sceneRequestAnimationFrame(sceneStart);
}
function clearContext(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}
let lastLoop = new Date();
let lastDraw = 0;
let f = 0;
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
	ctx.beginPath();
	ctx.fillStyle = this.style;
	ctx.font = this.sizeText;
    ctx.fillText("FPS: "+Math.round(f), this.x, this.y);
	ctx.closePath();
}
loadImages = function(url){
	return new Promise(resolve =>{
		const image = new Image();
		image.addEventListener("load",() =>{
			resolve(image);
		});
		image.src = url;
	});

}
this.loadResourse = function(url){
	return	loadImages(url).then();
}
this.loadAll = function(arr){
	return Promise.all(arr);
}
let url = new Map();
let buffer = new Map();
let images = new Map();
this.GBT_Image = function(obj){
	this.width = obj.width || canvas.width;
	this.height = obj.height || canvas.height;
	this.x = obj.x || 0;
	this.y = obj.y || 0;
	this.dx = obj.dx || 0;
	this.dy = obj.dy || 0;
	this.load = false;
    this.url = obj.url || 0;
	this.image = obj.image || 0;
    this.buffer = document.createElement("canvas");
	this.buffer.width = this.width;
	this.buffer.height = this.height;
        if(url.get(this.url) != this.url && this.url!=0){
			//buffer = this.buffer;
			url.set(this.url,this.url);
			buffer.set(this.url,this.buffer);
			loadImages(this.url).then(image=>{
				this.buffer.getContext("2d").drawImage(image,0,0,this.width,this.height);
				this.load = true;
            });
			}else if(url.get(this.url) == this.url){
				this.buffer = buffer.get(this.url);
				this.load = true;
				
			}else{
				if(images.get(this.image) != this.image){
					images.set(this.image , this.image);
					this.buffer.getContext("2d").drawImage(this.image,0,0,this.width,this.height);
					buffer.set(this.image,this.buffer);
					this.load = true;
				}else{
					this.buffer = buffer.get(this.image);
					this.load = true;
				}
			}
}
this.setAlphaChannel = function(image,R,G,B,A){
this.buffer = document.createElement("canvas");
this.buffer.width = image.width;
this.buffer.height = image.height;
this.ctx = this.buffer.getContext("2d");
this.ctx.drawImage(image,0,0);
this.arrayPixels = this.ctx.getImageData(0,0,this.buffer.width,this.buffer.height);
        for(let i = 0; i<this.arrayPixels.data.length;i+=4){
			if(this.arrayPixels.data[i]==R && this.arrayPixels.data[i+1]==G && this.arrayPixels.data[i+2]==B){
				this.arrayPixels.data[i+3]=A;
		
			}
		}
		this.ctx.putImageData(this.arrayPixels,0,0);
		
		return this.buffer;
}

this.GBT_Image.prototype.draw = function(){
	if(this.load == true){
        ctx.beginPath();
	    ctx.drawImage(this.buffer,this.x,this.y,this.width,this.height);
	    ctx.closePath();
	}
}
this.GBT_Image.prototype.illuminationObject = function(){
	ctx.beginPath();
	ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.width,this.height);
	ctx.closePath();
}


this.GBT_SpriteSheet = function(obj){
	this.url = obj.url || 0;
	this.image = obj.image || 0;
    this.width = obj.width || 64;
	this.height = obj.height || 64;
	this.x = obj.x || 0;
	this.y = obj.y || 0;
	this.dx = obj.dx || 0;
	this.dy = obj.dy || 0;
	this.SPX = obj.spritePX;
	this.SPY = obj.spritePY;
	this.SW = obj.spriteWidth;
	this.SH = obj.spriteHeight;
	this.load = false;
    this.buffer = document.createElement("canvas");
	this.img = document.createElement("img");
	this.buffer.width = this.width;
	this.buffer.height = this.height;
        if(this.url!=0){
			loadImages(this.url).then(image=>{
				//this.buffer.getContext("2d").drawImage(image,this.SPX,this.SPY,this.SW,this.SH,0,0,this.width,this.height);
				this.load = true;
            });
			}else{
				this.buffer.getContext("2d").drawImage(this.image,this.SPX,this.SPY,this.SW,this.SH,0,0,this.width,this.height);
					this.load = true;
				}
			
}
this.GBT_SpriteSheet.prototype.draw = function(){
		if(this.load == true){
        ctx.beginPath();
	    ctx.drawImage(this.buffer,this.x,this.y,this.width,this.height);
	    ctx.closePath();
	}
}


this.GBT_Animation = function(obj){
	this.url = obj.url || 0;
	this.image = obj.image || 0;
	this.obj = obj;
	this.x = obj.x || 0;
	this.y = obj.y || 0;
	this.dx = obj.dx || 0;
	this.dy = obj.dy || 0;
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
    this.repeat = 0;
	this.fps = obj.fps || 1000/60;
	this.buffer = [];
	for(let i=0; i<=this.efX; i++){
		this.buffer[i] = [];
		for(let j=0; j<=this.efY; j++){
			this.buffer[i][j] = document.createElement("canvas");
	        this.buffer[i][j].width = this.width;
	        this.buffer[i][j].height = this.height;
	}
	}
	if(this.url != 0){
	loadImages(this.url).then(image=>{
        this.sWidth = obj.spriteWidth || image.width/this.efX;
        this.sHeight = obj.spriteHeight || image.height/this.efY;
		    for(let i=this.sfX; i<=this.efX; i++){
			    for(let j=this.sfY; j<=this.efY; j++){
		            this.buffer[i][j].getContext("2d").drawImage(image,(i)*this.sWidth,(j)*this.sHeight,this.sWidth,this.sHeight,0,0,this.width,this.height);
			    }
			}
		this.load = true;
		this.timer = new Date().getTime();
	});
	}else{
		this.sWidth = obj.spriteWidth || this.image.width/this.efX;
        this.sHeight = obj.spriteHeight || this.image.height/this.efY;
		    for(let i=this.sfX; i<=this.efX; i++){
			    for(let j=this.sfY; j<=this.efY; j++){
		            this.buffer[i][j].getContext("2d").drawImage(this.image,(i)*this.sWidth,(j)*this.sHeight,this.sWidth,this.sHeight,0,0,this.width,this.height);
			    }
			}
		this.load = true;
		this.timer = new Date().getTime();
	}
}
this.GBT_Animation.prototype.draw = function(){
    if(this.load==true){
		if(new Date().getTime() - this.timer > this.fps){
		    if(this.animationOnXY == true){
                this.cfX++;
				if(this.cfX>=this.efX){
					this.repeat++;
					this.cfX=this.sfX;
					this.cfY++;
				    if(this.cfY>=this.efY){
				    	this.cfY=this.sfY;
				    }
				}
			}
			if(this.animationOnX == true){
				this.cfY=this.sfY;
				this.cfX++;
				if(this.cfX>=this.efX){
					this.repeat++;
					this.cfX=this.sfX;
				}
			}

			if(this.animationOnY == true){
				this.cfX=this.sfX;
				this.cfY++;
				if(this.cfY>=this.efY){
					this.repeat++;
					this.cfY=this.sfY;
				}
			}

            this.timer = new Date().getTime();
		}
        ctx.beginPath();
		ctx.drawImage(this.buffer[this.cfX][this.cfY],this.x,this.y,
			                              this.buffer[this.cfX][this.cfY].width,
			                              this.buffer[this.cfX][this.cfY].height);
	    ctx.closePath();
	}
}
this.GBT_Animation.prototype.setCurrentFrameX = function(cfX){
	 this.cfX = cfX;
}
this.GBT_Animation.prototype.setCurrentFrameY = function(cfY){
	 this.cfY = cfY;
}
this.GBT_Animation.prototype.setStartFrameX = function(sfX){
	 this.sfX = sfX;
}
this.GBT_Animation.prototype.setStartFrameY = function(sfY){
	 this.sfY = sfY;
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
this.GBT_Animation.prototype.setEndFrameX = function(efX){
	this.efX = efX+1;
}
this.GBT_Animation.prototype.setEndFrameY = function(efY){
	this.efY = efY+1;
}
this.GBT_Animation.prototype.setFrameXY = function(frameX,frameY){
	this.sfX = frameX;
	this.sfY = frameY;
	this.efX = this.obj.endFrameX+1;
	this.efY = this.obj.endFrameY+1;
}
this.GBT_Animation.prototype.stopFrame = function(frameX,frameY){
    this.sfX = frameX;
	this.efX = frameX;
	this.sfY = frameY;
	this.efY = frameY;
}
this.GBT_Animation.prototype.illuminationObject = function(){
	ctx.beginPath();
	ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.width,this.height);
	ctx.closePath();
}
this.collisionRect = function(obj_1, obj_2){
return obj_1.x<=obj_2.x+obj_2.width && obj_1.x+obj_1.width>=obj_2.x 
    && obj_1.y<=obj_2.y+obj_2.height && obj_1.y+obj_1.height>=obj_2.y;
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
let p;
this.textDraw = function(obj){
    this.color =  obj.color || "green";
	this.size = obj.size + "px serif" || "48px serif";
	this.text = obj.text || " ";
	this.x = obj.x || 0;//obj.size;
    this.y = obj.y || obj.size;
	this.position = obj.position || 0;
	ctx.textAlign = "left";
	this.xc = 0;
	this.t = ctx.measureText(this.text);
	this.width = this.t.width;
	this.height = obj.size;
	if(this.position != 0){
		ctx.textAlign = "center";
		this.x = obj.x || canvas.width/2;//obj.size;
        this.y = obj.y || canvas.height/2;
		this.xc = this.width/2;
	}
    ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.font = this.size;
	ctx.fillText(this.text, this.x, this.y);

	
	this.rect = {
    x: this.x - this.xc,
    y: this.y-obj.size,
    w: this.width,
    h: obj.size
    };
	//ctx.fillRect(this.rect.x,this.y-obj.size,this.width,this.height);
	ctx.closePath();
	
}
this.textDraw.prototype.onclick = function(){
      canvas.onclick = this.checkStart;
		//canvas.removeEventListener('click', this.checkStart, false);
    if(p!=null){
        if(p.x >= this.rect.x && p.x <= this.rect.x + this.rect.w &&
        p.y >= this.rect.y && p.y <= this.rect.y + this.rect.h){
			p = null;
			if(p==null){
			return true;
			}
		}
	}
	
}
this.textDraw.prototype.checkStart = function(e){
	this.getMousePosition = function(e) {
    let r = canvas.getBoundingClientRect();
    return {
        x: e.clientX - r.left || 0,
        y: e.clientY - r.top || 0
    };
}
    p = this.getMousePosition(e);
}
this.GBT_Rect = function(obj){
	this.width = obj.width || 50;
	this.height = obj.height || 50;
	this.x = obj.x || 0;
	this.y = obj.y || 0;
	this.obj = obj;

}
this.GBT_Rect.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.obj.style || null;
	ctx.fillStroke = this.obj.stroke || null;
	ctx.fillRect(this.x,this.y,this.width,this.height);
	ctx.closePath();
}

	let emX =0 ;
	let emY = 0;
this.getMousePosition = function(){
   canvas.onmousemove = function(e){
		let r = canvas.getBoundingClientRect();
        emX = e.clientX - r.left || 0;
	 	emY = e.clientY - r.top || 0;
	}
	return {
	   x : emX,
       y : emY
       }
}
const keys = {"LEFT":37,"RIGHT":39,"UP":38,"DOWN":40,"SPACE":32,"Q":81,"W":87,"E":69,"R":82,"T":84,"Y":89,"U":85,"I":73,"O":79,"P":80,"A":65,"S":83,"D":68,"F":70,"G":71,"H":72,"J":74,"K":75,"L":76,"Z":90,"X":88,"V":86,"B":66,"N":78,"M":77}
let keyDown = {};
this.GBT_KeyDown = function(keyName){
    return  keyDown[keys[keyName]] == true;
}

addEventListener("keydown", function(event){
    setKey(event.keyCode);
});
addEventListener("keyup", function(event){
    clearKey(event.keyCode);
});
function setKey(e){
	keyDown[e] = true;
}
function clearKey(e){
	keyDown[e] = false;
}
canvas.addEventListener('touchmove', function(event){
	setTouchPosition(event);
});
let etX =0 ;
let etY = 0;
setTouchPosition = function(e){
	    e.preventDefault();
	    e = e.changedTouches[0];
        etX = e.clientX || e.pageX;
	 	etY = e.clientY|| e.pageY;
}
this.getTouchPosition = function(){
	return {
	   x : etX,
       y : etY
       }
}
this.collisionCircle = function(obj_1,obj_2){
    return Math.abs((obj_1.x - obj_2.x)*(obj_1.x - obj_2.x) + (obj_1.y - obj_2.y)*(obj_1.y - obj_2.y)<(obj_1.radius+obj_2.radius)*(obj_1.radius+obj_2.radius));
} 
this.isMobileDevice=function(){return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
}




