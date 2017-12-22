let width;
let height;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		  width = window.innerWidth-20;
          height = window.innerHeight-20;
	}else{
     width = 600;
     height = 480;	
	}
//if(width>height){width=height;}
const scene = new GBT_Scene({width : width,
                           height : height,
					       style : "grey"
						   });
function fullScreen(c){
if(c.requestFullScreen)
        c.requestFullScreen();
    else if(c.webkitRequestFullScreen)
        c.webkitRequestFullScreen();
    else if(c.mozRequestFullScreen)
        c.mozRequestFullScreen();

}			   

				canvas.onclick = function(){
				fullScreen(canvas);
				}

const ENEMY_START_POSITION = 600;
let bgs = [];
let scor;	
let urls = [];

let resourse;
    urls[0] = scene.loadResourse("res/enemy.png");
	urls[1] = scene.loadResourse("res/enemyShip_2.png");
	urls[2] = scene.loadResourse("res/bullenemy.png");
	urls[3] = scene.loadResourse("res/bum.png");
	urls[4] = scene.loadResourse("res/ship.png");
	urls[5] = scene.loadResourse("res/clash2.png");
	urls[6] = scene.loadResourse("http://ask-like.net/uploads/posts/2013-03/1364660574_ga_camoq2pg.jpg");
	urls[7] = scene.loadResourse("res/bonusFast.png");
scene.loadAll(urls).then(images=>{
	resourse = images;
	scene.gameLoop(new startGame());
});	

 alert("Управление из клавиатуры вверх W, вниз S, влево A, вправо D, стрелять SPACE.");
 /*
 VK.init(function() { 
     // API initialization succeeded 
     // Your code here 
  }, function() { 
     // API initialization failed 
     // Can reload page here 
}, '5.69'); 
*/
function createBg(bgImage){
	for(let i = 0; i < 2; i++){
	    bg = new scene.GBT_Image({image : bgImage,
                                  x : 0, y : i*-scene.HEIGHT,
                                  dy : Math.round(scene.HEIGHT/210),
						          width : scene.WIDTH, height : scene.HEIGHT+1,
		                          });
	    bgs.push(bg);
        }
}

function bgsMove(){
	for(let i = 0; i <bgs.length;i++){
		bgs[i].y+=bgs[i].dy;
			if(bgs[i].y>=scene.HEIGHT) {
				bgs[i].y = -scene.HEIGHT+1
			};
		}
}

const game = function(){
   let playerShip;
   let enemyShips = [];
   let playerBullets = [];
   let enemyBullets = [];
   let enemyExplosions = [];
   let playerBullInd = 0;
   let enemyBullInd = 0;
   let playerShoot = new scene.GBT_TimerOut();
   let enemyShipsTimerMove  = new scene.GBT_TimerOut();
   let bonusFastShootAdd = new scene.GBT_TimerOut();
   let enemyShoot = [];
   let imgEnemyShips = [];

	this.create = function(){
	    imgEnemyShips.push(resourse[0]);
	    imgEnemyShips.push(resourse[1]);
        createEnemyShips(imgEnemyShips);
		createEnemyBullets(resourse[2]);
	    createEnemyExplosions(resourse[3]);
	    createPlayerShip(resourse[4]);
	    createPlayerBullets(resourse[5]);
		createPlaterExplosion(resourse[3]);
	   // createBg(resourse[6]);
		createBonusFastShoot(resourse[7]);
        scor = 0;
		playerShip.x = scene.WIDTH/2 - playerShip.width/2;
		playerShip.y = scene.HEIGHT - 100;
    }			
		
	this.update = function(){
		bgsMove();
		playerShipMove();
	 	playerBulletsMove();
		handleInput();
        enemyShipsMove();
		enemyBulletsMove();
		bonusFastShootMove();
		collision();
		deleteEnemy();
		//illuminationObject();
		//scene.fpsDraw(0,48,48,"red");
	}
		
    this.render = function(){
		for(let i = 0; i <bgs.length;i++){
		    bgs[i].draw();
		}
		playerBullets.forEach(bull=>{
			if(bull.dy!=0){
	         	bull.draw();
			}
		});
		for(let i = 0; i < enemyBullets.length; i++){	
  	        for(let j = 0; j < enemyBullets[i].length; j++){
				if(enemyBullets[i][j].y>0 && enemyBullets[i][j].dy !=0){
					if(enemyShips[i] != null){
			            enemyBullets[i][j].draw();
					}
				}
		    }
		}
		if(playerExplosion.explos == true){
            playerExplosion.draw();
			if(playerExplosion.getCurrentFrameX()+1 == playerExplosion.getEndFrameX()&&
    			playerExplosion.getCurrentFrameY()+1 == playerExplosion.getEndFrameY()){
			    playerExplosion.explos = false;
				restart();
				}
			}
			else{
				playerShip.draw();
			}

	    for(let i = 0; i < enemyExplosions.length; i++){	
		    if(enemyExplosions[i].explos == true){
			    enemyExplosions[i].draw();
			    if(enemyExplosions[i].getCurrentFrameX()+1 == enemyExplosions[i].getEndFrameX() &&
    		        enemyExplosions[i].getCurrentFrameY()+1 == enemyExplosions[i].getEndFrameY()){
			        enemyExplosions[i].explos = false;
				}
			}
		}
		for(let i = 0; i < enemyShips.length; i++){
            enemyShips[i].draw();			 
		}
		scores = scene.textDraw({text : "Scores: " + scor, size : 25,color : "white"});
		
		bonusFastShoot.draw();
	}
	
	function handleInput(){
		if(scene.GBT_KeyDown("SPACE")){
            playerShoot.start(function(){
            playerBullets[playerBullInd].dy = -Math.round(scene.HEIGHT/90);
			playerBullInd++;
            },playerShip.shootSpeed);
		}
		if(scene.GBT_KeyDown("A")){
			playerShip.dx = -Math.round(scene.HEIGHT/110);
			//playerShip.dy = 0;
		}
		else if(scene.GBT_KeyDown("D")){
		    playerShip.dx = Math.round(scene.HEIGHT/110);
		   // playerShip.dy = 0;
		}
		else{
			//playerShip.dx = 0;
		}
	    if(scene.GBT_KeyDown("W")){
			playerShip.dy = -Math.round(scene.HEIGHT/110);
			//playerShip.dx = 0;
		}
		else if(scene.GBT_KeyDown("S")){
		    playerShip.dy = Math.round(scene.HEIGHT/110);
			//playerShip.dx = 0;
		}
		else{
			//playerShip.dy = 0;
		
		}
		
	}	
   
    function bgsMove(){
		for(let i = 0; i <bgs.length;i++){
			bgs[i].y+=bgs[i].dy;
			if(bgs[i].y>=scene.HEIGHT) {
				bgs[i].y = -scene.HEIGHT+1
			};
		}
	}
  
    function playerShipMove(){
		//playerShip.x += playerShip.dx;
		//playerShip.y += playerShip.dy;
		if(scene.isMobileDevice()){
		if(scene.getTouchPosition().x !=0 && scene.getTouchPosition().y !=0){
	       	playerShip.x = /*scene.getMousePosition().x-(playerShip.width/2) || */scene.getTouchPosition().x-(playerShip.width/2);
	       	playerShip.y = /*scene.getMousePosition().y-playerShip.height ||*/ scene.getTouchPosition().y-playerShip.height;
		}
		}else{
			if(scene.getMousePosition().x !=0 && scene.getMousePosition().y !=0){
		        playerShip.x = scene.getMousePosition().x-(playerShip.width/2);
		        playerShip.y = scene.getMousePosition().y-playerShip.height;
		    }
		}
		if(playerShip.x>scene.WIDTH-playerShip.width){
		    playerShip.x = scene.WIDTH-playerShip.width;
		}
		if(playerShip.x<0){
			playerShip.x = 0;
		}
		if(playerShip.y>scene.HEIGHT-playerShip.height){
			playerShip.y = scene.HEIGHT-playerShip.height;
		}
		if(playerShip.y<0){
		    playerShip.y = 0;
		}
		
		/*
		if(playerShip.x+30 <= scene.getTouchPosition().x){
		    playerShip.dx =8;
	}
	else if (playerShip.x+30 > scene.getTouchPosition().x){
		playerShip.dx=-8;
	  }
	if(Math.abs(playerShip.x+30 - scene.getTouchPosition().x)<11){
		playerShip.dx=0;	 
	  }
	if (playerShip.y+30 > scene.getTouchPosition().y){
		playerShip.dy=-8;
    }
	else if(playerShip.y+30 <= scene.getTouchPosition().y){
		playerShip.dy=8;
	}
	if(Math.abs(playerShip.y+30 - scene.getTouchPosition().y)<11){
		playerShip.dy=0;
	}*/
	}
  
    function playerBulletsMove(){
		playerBullets.forEach(bull=>{
		    bull.y += bull.dy;
			if(bull.dy == 0){
				bull.x = playerShip.x + playerShip.width/2 - bull.width/2, bull.y = playerShip.y;
			}
			if(bull.y<0){
				bull.dy = 0;
				bull.x = playerShip.x + playerShip.width/2 - bull.width/2, bull.y = playerShip.y;
			}
		});
		if(playerBullInd>playerBullets.length-1){
			playerBullInd = 0;
		}
		playerShoot.start(function(){
            playerBullets[playerBullInd].dy = -Math.round(scene.HEIGHT/90);
			playerBullInd++;
            },playerShip.shootSpeed);
	}
  
    function enemyShipsMove(){
		for(let i = 0; i < enemyShips.length; i++){	
		    if(enemyShips[i].load == true){
		        enemyShips[i].x += enemyShips[i].dx;
		        enemyShips[i].y += enemyShips[i].dy;
			}
		    if(enemyShips[i].x>=scene.WIDTH-enemyShips[i].width){
		    	let rand = Math.floor(Math.random() * -3)+1;
		        enemyShips[i].dx = rand
		    }
		    if(enemyShips[i].x<=0){
		    	let rand = Math.floor(Math.random() * 3);
			    enemyShips[i].dx = rand;
		    }
		    if(enemyShips[i].y>scene.HEIGHT){
			   //enemyShips[i].x =  Math.floor(Math.random() * (scene.WIDTH-enemyShips[i].width - 
			   //enemyShips[i].width/2) + enemyShips[i].width/2);
			   //enemyShips[i].y =  (enemyShips.length-1)-scene.HEIGHT+ENEMY_START_POSITION;
			   /*if(enemyShips[i].ind == 1){
				    enemyShips[i].live = 1;
			    }*/
			    enemyShips[i].die = true;
		    }
		}
		enemyShipsTimerMove.start(function(){
			for(let i = 0; i < enemyShips.length; i++){	
			    let rand = Math.floor(Math.random() * (Math.round(scene.HEIGHT/320)-(-Math.round(scene.HEIGHT/320)))+(-Math.round(scene.HEIGHT/320)));
			    enemyShips[i].dx = rand;
			}
		},2000);
	}
  
    function enemyBulletsMove(){
		for(let i = 0; i < enemyShips.length; i++){	
		   for(let j = 0; j < enemyBullets[i].length; j++){
				enemyBullets[i][j].y += enemyBullets[i][j].dy;
				if(enemyBullets[i][j].dy == 0){
		    	    enemyBullets[i][j].x = enemyShips[i].x + enemyShips[i].width/2 - enemyBullets[i][j].width/2,
					enemyBullets[i][j].y = enemyShips[i].y+enemyShips[i].height/2;
				}
			    if(enemyBullets[i][j].y>scene.HEIGHT){
				   enemyBullets[i][j].dy = 0;
				   enemyBullets[i][j].x = enemyShips[i].x + enemyShips[i].width/2 - enemyBullets[i][j].width/2,
				   enemyBullets[i][j].y = enemyShips[i].y+enemyShips[i].height/2;;
			    }
			}
        }
        for(let i = 0; i < enemyShips.length; i++){	
            enemyShoot[i].start(function(){
                if(enemyShips[i].y>-enemyShips[i].height){
                    enemyBullInd++;
			    	if(enemyBullInd<enemyBullets[i].length){
			    		enemyBullets[i][enemyBullInd].dy=Math.round(scene.HEIGHT/90);
                    }
                }		
            },enemyShips[i].shootSpeed);
		}
        if(enemyBullInd>8){
			enemyBullInd = 0;
		}
	}
   
    function bonusFastShootMove(){
		bonusFastShootAdd.start(function(){
			bonusFastShoot.dy =  Math.round(scene.HEIGHT/180);
		},bonusFastShoot.time);
		bonusFastShoot.y += bonusFastShoot.dy;
		if(bonusFastShoot.y>scene.HEIGHT){
			bonusFastShoot.x = Math.floor(Math.random() * ((scene.WIDTH-(playerShip.width/2))-(playerShip.width/2))+(playerShip.width/2));
			bonusFastShoot.y = -scene.HEIGHT;
			bonusFastShoot.dy = 0;
			bonusFastShoot.time = Math.floor(Math.random() * (40000-20000)+20000);
		}
	}
   
    function createPlayerShip(imgPlayerShip){
		playerShip = new scene.GBT_Image({image : imgPlayerShip,
                                          width : scene.WIDTH/10, 
										  height : scene.HEIGHT/10,
							              dx : 0, dy : 0,
										  x : scene.WIDTH/2 - (scene.WIDTH/10)/2,
		                                  y : scene.HEIGHT - 100
						                 });

		playerShip.shootSpeed = 300;
	}

	function createPlayerBullets(imgPlayerBullets){
		 for(let i = 0; i < 10; i++){
		        playerBullet = new scene.GBT_Image({image : imgPlayerBullets,
                                                   width : playerShip.width/5,
								                   height : playerShip.height/5,
												   
							                       });	
				playerBullets.push(playerBullet);								   
		    }

	}
	
	function createPlaterExplosion(imgExplosions){
		playerExplosion = new scene.GBT_Animation({image : imgExplosions,
	                                               width: playerShip.width*1.5, height : playerShip.height*1.5,
	                                               endFrameX : 4,
	                                               endFrameY : 4,
                                                   animationOnXY : true,
	                                               fps : 1000/60
                                                    });
	}
	
	function createEnemyShips(imgEnemyShip){
		for(let i = enemyShips.length; i < 10; i++){
            let rand = Math.floor(Math.random() * 2);			
		    enemyShip = new scene.GBT_Image({image : imgEnemyShip[rand],
                                            width : scene.WIDTH/10,
											height : scene.HEIGHT/10,
							                y : i*-scene.HEIGHT-ENEMY_START_POSITION,
							                x : Math.floor(Math.random() * (scene.WIDTH-scene.WIDTH/10 - 
							                                               (scene.WIDTH/10)/2) + 
						                                                   (scene.WIDTH/10)/2),
							                });
			if(i == 9){
				enemyShip.y = -scene.HEIGHT-ENEMY_START_POSITION;
			}
            if(rand == 0){enemyShip.live = 0;
			              enemyShip.width = scene.WIDTH/10;
					      enemyShip.shootSpeed = 800;
						  enemyShip.dy = Math.round(scene.HEIGHT/120);
						  enemyShip.shipClass = 0;
						  }else if(rand == 1){
							    enemyShip.live = 1;
							    enemyShip.shootSpeed = 300;
							    enemyShip.dy = Math.round(scene.HEIGHT/180);
								enemyShip.shipClass = 1;
							}				
		    enemyShips.push(enemyShip);														  
																  															  		
		}
	}
	
	function createEnemyBullets(imgEnemyBullet){
		for(let i = 0; i< enemyShips.length; i++){
		    enemyShoot[i] = new scene.GBT_TimerOut();
		    enemyBullets[i] = [];
			
            	for(let j = 0; j < 10; j++){		
		            enemyBullet = new scene.GBT_Image({image : imgEnemyBullet,
                                                       dx : 0, dy : 0,
													   width : enemyShips[i].width/5,
													   height : enemyShips[i].height/5
							                            });
		            enemyBullets[i].push(enemyBullet);	
		        }
		}
	}
	
	function createEnemyExplosions(imgEnemyExplosions){
		for(let i = 0; i< enemyShips.length; i++){
		    enemyExplosion = new scene.GBT_Animation({image : imgEnemyExplosions,
	                                                  width: enemyShips[i].width*1.5, height : enemyShips[i].height*1.5,
	                                                  endFrameX : 4,
	                                                  endFrameY : 4,
                                                      animationOnXY : true,
	                                                  fps : 1000/60
                                                       });
		    enemyExplosion.explos = false; 
		    enemyExplosions.push(enemyExplosion);
		}
	}

	function createBonusFastShoot(imgBFS){
		bonusFastShoot = new scene.GBT_Image({
			image : imgBFS,
			x : Math.floor(Math.random() * ((scene.WIDTH-(playerShip.width/2))-(playerShip.width/2))+(playerShip.width/2)),
			y : -scene.HEIGHT*2,
			width : playerShip.width/2,
			height : playerShip.height/2
		});
		bonusFastShoot.time = Math.floor(Math.random() * (40000-20000)+20000);
		
	}

	function collision(){
        playerBullets.forEach(bull=>{
			for(let i = 0; i < enemyShips.length; i++){	
				if(enemyShips[i].y>0 && bull.dy!=0){
                    if(scene.collision(bull,enemyShips[i])){
						if(enemyShips[i].live == 0){
						    enemyExplosions[i].explos = true;
						    enemyExplosions[i].x = enemyShips[i].x;
						    enemyExplosions[i].y = enemyShips[i].y;
							if(enemyShips[i].shipClass == 0){
								scor+=50;
							}
							if(enemyShips[i].shipClass == 1){
								scor+=100;
							}
						    enemyShips[i].die = true;
						}else{
						    enemyShips[i].live--;
						}
                        bull.dy = 0;
                        bull.x = playerShip.x + playerShip.width/2 - bull.width/2, bull.y = playerShip.y;
					}
                }
            }
        });
        for(let i = 0; i < enemyShips.length; i++){	
		    for(let j = 0; j < enemyBullets[i].length; j++){
				if(enemyBullets[i][j].dy!=0){
                    if(scene.collision(enemyBullets[i][j],playerShip)){
					    playerExplosion.explos = true;
					    playerExplosion.x = playerShip.x;
				        playerExplosion.y = playerShip.y;
                        enemyBullets[i][j].dy = 0;
                        enemyBullets[i][j].x = enemyShips[i].x + enemyShips[i].width/2 - enemyBullets[i][j].width/2, 
					    enemyBullets[i][j].y = enemyShips[i].y;
                    }	
                }
		        playerBullets.forEach(bull=>{
			        if(enemyBullets[i][j].dy!=0 && bull.dy!=0){
			            if(scene.collision(enemyBullets[i][j],bull)){
			            	bull.dy = 0;
                            bull.x = playerShip.x + playerShip.width/2 - bull.width/2, bull.y = playerShip.y;
			            	enemyBullets[i][j].dy = 0;
			    	        enemyBullets[i][j].x = enemyShips[i].x + enemyShips[i].width/2 - enemyBullets[i][j].width/2,
			            	enemyBullets[i][j].y = enemyShips[i].y;
			            }
			        }
		        });
            }
        }
		for(let i = 0; i < enemyShips.length; i++){	
            if(enemyShips[i].y>0){
				if(scene.collision(playerShip,enemyShips[i])){
					playerExplosion.explos = true;
					enemyExplosions[i].explos = true;
					playerExplosion.x = playerShip.x;
				    playerExplosion.y = playerShip.y;
                    enemyExplosions[i].x = enemyShips[i].x;
					enemyExplosions[i].y = enemyShips[i].y;
					enemyShips[i].die = true;
				}
            }
        }
		if(scene.collision(playerShip,bonusFastShoot)){
			if(playerShip.shootSpeed>150){
			playerShip.shootSpeed -=50;
			}else{
				scor+=20;
			}
			bonusFastShoot.x = Math.floor(Math.random() * ((scene.WIDTH-(playerShip.width/2))-(playerShip.width/2))+(playerShip.width/2));
			bonusFastShoot.y = -scene.HEIGHT;
			bonusFastShoot.dy = 0;
			bonusFastShoot.time = Math.floor(Math.random() * (40000-20000)+20000);
		}
    } 
	
	function illuminationObject(){
		playerShip.illuminationObject();
		enemyShips.forEach(enemy=>{
		    enemy.illuminationObject();
		});
		playerBullets.forEach(bull=>{
		    bull.illuminationObject();
		});
		for(let i = 0; i < enemyBullets.length; i++){	
  	        for(let j = 0; j < enemyBullets[i].length; j++){
				enemyBullets[i][j].illuminationObject();
		    }
		}
	}

	function deleteEnemy(){
		for(let i = 0; i<enemyShips.length; i ++){
			if(enemyShips[i].die == true){
		        enemyShips.splice(i,1);
		        createEnemyShips(imgEnemyShips);
				i--;
		    }
		}
	}

	function restart(){
    enemyShips = [];
	playerBullets = [];
	playerShip = null;
	for(let i = 0; i<enemyBullets.length; i++){
		enemyBullets[i] = [];
		for(let j = 0; j<enemyBullets[i].length; j++){
	        enemyBullets = [];
	    }
	}
	 scene.setGameLoop(new gameOver());
	}

	
	}

const gameOver = function(){
	
	this.create = function(){
        //createBg(resourse[6]);
    }			
		
	this.update = function(){
        bgsMove();
       /* if(scene.onclick()){
		    scene.setGameLoop(game);
	    }*/
	}
    
    this.render = function(){
		for(let i = 0; i <bgs.length;i++){
		    bgs[i].draw();
		}
        scores = new scene.textDraw({text : "You scores: " + scor,position : "center",y : scene.HEIGHT/3, size : 50,color : "white"});
	    start = new scene.textDraw({text : "Click to start",position : "center", size : 40,color : "white"});
	    if(start.onclick()){
	    	scene.setGameLoop(new game());
	    }
	    publish = new scene.textDraw({text : "Publish on VK",position : "center", y : start.y+start.height*2, size : 40,color : "#45688E"});
	    if(publish.onclick()){
	    	VK.api("wall.post", {"message": "https://vk.com/app6300619_57832844 \n Я набрал "+scor+" очков в приложении SpaceShoter, а сколько сможешь ты?",
				     "attachments" : "photo57832844_456239466"   }, function (data) {
            //alert("Post ID:" + data.response.post_id);
			             
            });
	    
        }
    }
    
}

const startGame = function(){
	
	this.create = function(){
        createBg(resourse[6]);
    }			
		
	this.update = function(){
		bgsMove();
	}
    
    this.render = function(){
		for(let i = 0; i <bgs.length;i++){
		    bgs[i].draw();
		}
	    start = new scene.textDraw({text : "Click to start", position : "center", size : 50,color : "white"});
		if(start.onclick()){
		    scene.setGameLoop(new game());
		}
    }
}




















/*


const test = function(){
	
	this.create = function(){
    obj_1 ={
		x:100,
		y:100,
	}
	    obj_2 ={
		x:10,
		y:10,
	}
    }			
		let dX = 0;
		let dY = 0;
	this.update = function(){
		obj_1.x+=dX;  
		obj_1.y+=dY; 
        obj_2.x = scene.getMousePosition().x;
		obj_2.y = scene.getMousePosition().y;
    if(obj_1.x <= scene.getMousePosition().x){
		dX =5;
	}
	else if (obj_1.x > scene.getMousePosition().x){
		dX=-5;
	  }
	if(Math.abs(obj_1.x - scene.getMousePosition().x)<10){
		dX=0;	 
	  }
	if (obj_1.y > scene.getMousePosition().y){
		dY=-5;
    }
	else if(obj_1.y <= scene.getMousePosition().y){
		dY=5;
	}
	if(Math.abs(obj_1.y - scene.getMousePosition().y)<10){
		dY=0;
	}
	

	 /*  if(scene.collision(obj_2,obj_1)){
		  dY=0;
		  dX=0;
	  }
		*/
	/*}
   
    this.render = function(){
	ctx.beginPath();
    ctx.arc(obj_1.x,obj_1.y,50,Math.PI*2,false);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
    ctx.arc(obj_2.x,obj_2.y,obj_2.radius,Math.PI*2,false);
	ctx.stroke();
	ctx.closePath();
    }


}
scene.gameLoop(new test());*/