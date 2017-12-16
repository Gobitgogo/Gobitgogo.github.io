let width = window.innerWidth-20;
let height = window.innerHeight-20;
if(width>height){width=height;}
const scene = new GBT_Scene({width : 400,
                           height : 500,
					       style : "grey"
						   });
const ENEMY_START_POSITION = 300;
let bg = [];
let playerShip;
let enemyShips = [];
let newEnemyShips = [];
let playerBullets = [];
let enemyBullets = [];
let urls = [];
let enemyExplosions = [];
let playerBullInd = 0;
let enemyBullInd = 0;
let playerShoot = new scene.GBT_TimerOut();
let enemyShoot = [];
let enemyShipsTimerMove  = new scene.GBT_TimerOut();	

const game = function(){

	this.create = function(){
		urls[0] = "res/enemy.png";
		urls[1] = "res/enemyShip_2.png";
			for(let i = 0; i < 35; i++){
        let rand = Math.floor(Math.random() * 2);			
		enemyShip = new scene.GBT_Image({url : urls[rand],
                            width : scene.WIDTH/10, height : scene.HEIGHT/10,
							dx : 0, 
							
						    });
							
							if(rand == 0){
							enemyShip.dy = Math.round(scene.HEIGHT/120);
							enemyShip.live = 0;
							enemyShip.ind = 0;
							enemyShip.shootSpeed = 800;
							}else if(rand == 1){
							enemyShip.dy = Math.round(scene.HEIGHT/180);
							enemyShip.live = 1;
							enemyShip.ind = 1;
							enemyShip.shootSpeed = 300;
							}
							if(i == 0){
								enemyShip.y = -ENEMY_START_POSITION-scene.HEIGHT;
								
							}else{
								enemyShip.y = i*-ENEMY_START_POSITION;
							}
							enemyShip.x =  Math.floor(Math.random() * (scene.WIDTH-enemyShip.width - 
							                                              enemyShip.width/2) + 
						                                                  enemyShip.width/2);
																	  
		enemyShips.push(enemyShip);														  															  
		enemyExplosions[i] = new scene.GBT_Animation({
	                                                      url : "res/bum.png",
	                                                      x : 0, y : 0,
	                                                      width: enemyShips[i].width*1.5, height : enemyShips[i].height*1.5,
	                                                      endFrameX : 4,
	                                                      endFrameY : 4,
                                                          animationOnXY : true,
	                                                      fps : 1000/60
                                                       });
		enemyExplosions[i].explos = false; 
		//enemyExplosions.push(enemyExplosion);
		
		enemyShips[i].die = false;
		enemyShoot[i] = new scene.GBT_TimerOut();
		}
		for(let i = 0; i < enemyShips.length; i++){
            enemyBullets[i] = [];	
                for(let j = 0; j < 10; j++){		
		                enemyBullets[i][j] = new scene.GBT_Image({url : "res/bullenemy.png",
                                                                 dx : 0, dy : 0,
																 width : enemyShips[i].width/5,
																 height : enemyShips[i].height/5
							                               });
		        }	
		}
		for(let i = 0; i < 2; i++){
	        bg[i] = new scene.GBT_Image({url : //"https://i.pinimg.com/736x/50/ac/e5/50ace556e8f1e0c422f59ec1863593dc.jpg",
			//"https://www.nasa.gov/sites/default/files/thumbnails/image/hubble-udf.jpg",
			"http://ask-like.net/uploads/posts/2013-03/1364660574_ga_camoq2pg.jpg",
                                   x : 0, y : i*-scene.HEIGHT,
                                   dy : Math.round(scene.HEIGHT/210),
						           width : scene.WIDTH, height : scene.HEIGHT+1,
		        });

		}
		playerShip = new scene.GBT_Image({url : "res/ship.png",
                            width : scene.WIDTH/10, height : scene.HEIGHT/10,
							dx : 0, dy : 0
						    });
							playerShip.x = scene.WIDTH/2 - playerShip.width/2;
							playerShip.y = scene.HEIGHT - 100;
							playerShip.shootSpeed = 300;
							
		playerExplosion = new scene.GBT_Animation({
	                                                      url : "res/bum.png",
	                                                      x : 0, y : 0,
	                                                      width: playerShip.width*1.5, height : playerShip.height*1.5,
	                                                      endFrameX : 4,
	                                                      endFrameY : 4,
                                                          animationOnXY : true,
	                                                      fps : 1000/60
                                                         });
														
		playerExplosion.explos = false;	
		for(let i = 0; i < 10; i++){
		playerBullets[i] = new scene.GBT_Image({url : "res/clash2.png",
                                width : playerShip.width/5, height : playerShip.height/5,
							    dx : 0, dy : 0
							    });					
		}

    }			
		
	this.update = function(){
		bgMove();
		playerShipMove();
	 	playerBulletsMove();
        enemyShipsMove();
		enemyBulletsMove();
		handleInput();
		//illuminationObject();
        collision();
		deleteEnemy();
		//scene.fpsDraw(0,48,48,"red");
	}
		
    this.render = function(){
	    for(let i = 0; i <bg.length;i++){
		        bg[i].draw();
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
			//playerShip.x = null;
			//playerShip.y = null;
			if(playerExplosion.getCurrentFrameX()+1 == playerExplosion.getEndFrameX()&&
    			playerExplosion.getCurrentFrameY()+1 == playerExplosion.getEndFrameY()){
			    playerExplosion.explos = false;
			    //scene.setGameLoop(gameOver);
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
	}
	
	function handleInput(){
		if(scene.GBT_KeyDown("SPACE")){
            playerShoot.start(function(){
            playerBullets[playerBullInd].dy = -Math.round(scene.HEIGHT/90);
			playerBullInd++;
            },playerShip.shootSpeed);
		}
		if(scene.GBT_KeyDown("LEFT")){
			playerShip.dx = -Math.round(scene.HEIGHT/120);
			playerShip.dy = 0;
		}
		else if(scene.GBT_KeyDown("RIGHT")){
		    playerShip.dx = Math.round(scene.HEIGHT/120);
		    playerShip.dy = 0;
		}
		else{
			playerShip.dx = 0;
		}
	    if(scene.GBT_KeyDown("UP")){
			playerShip.dy = -Math.round(scene.HEIGHT/120);
			playerShip.dx = 0;
		}
		else if(scene.GBT_KeyDown("DOWN")){
		    playerShip.dy = Math.round(scene.HEIGHT/120);
			playerShip.dx = 0;
		}
		else{
			playerShip.dy = 0;
		}
		
	}	
   
    function bgMove(){
		for(let i = 0; i <bg.length;i++){
			bg[i].y+=bg[i].dy;
			if(bg[i].y>=scene.HEIGHT) {bg[i].y = -scene.HEIGHT+1};
		}
	}
  
    function playerShipMove(){
		playerShip.x += playerShip.dx;
		playerShip.y += playerShip.dy;
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
	}
  
    function enemyShipsMove(){
		for(let i = 0; i < enemyShips.length; i++){	
		enemyShips[i].x += enemyShips[i].dx;
		enemyShips[i].y += enemyShips[i].dy;
		if(enemyShips[i].x>=scene.WIDTH-enemyShips[i].width){
			let rand = Math.floor(Math.random() * -3)+1;
		    enemyShips[i].dx = rand
			
		}
		if(enemyShips[i].x<=0){
			let rand = Math.floor(Math.random() * 3);
			
			enemyShips[i].dx = rand;
		}
		    if(enemyShips[i].y>scene.HEIGHT){
			enemyShips[i].x =  Math.floor(Math.random() * (scene.WIDTH-enemyShips[i].width - 
			enemyShips[i].width/2) + enemyShips[i].width/2);
			enemyShips[i].y =  (enemyShips.length-1)-scene.HEIGHT+ENEMY_START_POSITION;
			if(enemyShips[i].ind == 1){
				enemyShips[i].live = 1;
			}
			//enemyShips[i].die = true;
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
   
    function collision(){
         
            playerBullets.forEach(bull=>{
				for(let i = 0; i < enemyShips.length; i++){	
				if(enemyShips[i].y>0 && bull.dy!=0){
                    if(scene.collision(bull,enemyShips[i])){
						if(enemyShips[i].live == 0){
						enemyExplosions[i].explos = true;
						enemyExplosions[i].x = enemyShips[i].x;
						enemyExplosions[i].y = enemyShips[i].y;
						enemyShips[i].y =  (enemyShips.length-1)*-ENEMY_START_POSITION+ENEMY_START_POSITION;
						if(enemyShips[i].ind == 1){
				        enemyShips[i].live = 1;
			            }
						//enemyShips[i].die = true;
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
				if(enemyBullets[i][j].dy!=0)
				{
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
					enemyShips[i].y =  (enemyShips.length-1)*-ENEMY_START_POSITION+ENEMY_START_POSITION;
			 		if(enemyShips[i].ind == 1){
			    	enemyShips[i].live = 1;
		         	}
					//enemyShips[i].die = true;
				    }
                }
            
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
						i--;
		}
		
		}
	}

	function restart(){
		alert("Game_over");
	for(let i = 0; i < enemyBullets.length; i++){	
	
		    for(let j = 0; j < enemyBullets[i].length; j++){
			 enemyBullets[i][j].x = enemyShips[i].x + enemyShips[i].width/2 - enemyBullets[i][j].width/2,
			 enemyBullets[i][j].y = enemyShips[i].y+enemyShips[i].height/2;
			 enemyBullets[i][j].dy=0;
	    }
	}
    playerBullInd = 0;
    enemyBullInd = 0;
	playerShip.x = scene.WIDTH/2 - playerShip.width/2;
							playerShip.y = scene.HEIGHT - 100;
							playerShip.shootSpeed = 300;
	playerBullets.forEach(bull=>{
		        bull.dy = 0;
				bull.x = playerShip.x + playerShip.width/2 - bull.width/2, bull.y = playerShip.y;
			});
	for(let i = 0; i < enemyShips.length; i++){
	if(i == 0){
								enemyShips[i].y = -ENEMY_START_POSITION-scene.HEIGHT;
							}else{
								enemyShips[i].y = i*-ENEMY_START_POSITION;
							}
	}
	//createEnemyShip();
	// scene.setGameLoop(game);
	}
}

const gameOver = function(){
	
	this.create = function(){
   
    }			
		
	this.update = function(){
    scene.setGameLoop(game);
	}
    
    this.render = function(){
        
    }
    
}



let animation;
const anim = function(){
	
	this.create = function(){
   
    }			
		
	this.update = function(){

	}
    
    this.render = function(){
        
    }
    
}


scene.gameLoop(game);
//ctx.drawImage(characterImg,0,characterImg.height/4,characterImg.width/4,characterImg.height/4,0,0,64,64);