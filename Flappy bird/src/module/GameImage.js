class GameImage
{
    constructor(img, x, y, w, h)
    {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
}
class Vec
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Bird extends GameImage
{
    constructor(img, x, y, w, h)
    {
        super(img, x, y, w, h);
        this.vel = new Vec;
        this.currentFrame = 0;
        this.frameCount = 3;
        this.fps = 1000 / 30;
        this.angle = 0;
    }
}
class Sprite extends GameImage
{
    constructor(img,sx,sy,sw,sh,x,y,w,h)
    {
        super(img, x, y, w, h);
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sw;
        this.sHeight = sh;
    }
}
class Game
{
    constructor()
    {
        this.gbt = new GBT();
        this.gameScene = this.gbt.createScene();
        /* if(game.gameScene.width>game.gameScene.height){
           game.gbt.setParametersScene({width: game.gameScene.height},game.gameScene);
         }*/

        this.gameWidth = this.gameScene.width;
        this.gameHeight = this.gameScene.height;
        this.paint = this.gbt.paint(this.gameScene);
        let images = [
            "https://image.ibb.co/g4fYOR/spr_b3_strip4.png",
            "https://image.ibb.co/fcUGcm/spr_b2_strip4.png",
            "https://image.ibb.co/bOuoq6/spr_b1_strip4.png",
            'src/res/all.png'
        ];
        this.bgs = [];
        this.grs = [];
        this.birds = [];
        this.pipeTop = [];
        this.pipeBottom = [];
        this.playbtn;
        this.titleFlappyBird;
        this.titleGetReady;
        this.tap;
        this.space = this.changeForScreeningH(4.6);

        this.gbt.loadResourse(images)
            .then(([birdImg_1, birdImg_2, birdImg_3, allImg]) =>
            {
                let bgSprites = [
                    this.gbt.spriteSheet(allImg, 0, 0, 288, 511, 288, this.gameHeight),
                    this.gbt.spriteSheet(allImg, 292, 0, 288, 511, 288, this.gameHeight)
                ];

                for (let i = 0; i < bgSprites.length; i++)
                {
                    this.bgs[i] = [];
                    for (let j = 0; j < 6; j++)
                    {
                        this.bgs[i][j] = new GameImage(bgSprites[i],
                            j * bgSprites[i].width,
                            0,
                            bgSprites[i].width,
                            bgSprites[i].height);
                    }
                }

                let posGr = this.changeForScreeningH(100) * 10;
                let grSprite = this.gbt.spriteSheet(allImg, 600, 0, 288, 110, 288, posGr);
                for (let i = 0; i < 6; i++)
                {
                    this.grs.push(new GameImage(grSprite,
                        i * grSprite.width,
                        this.gameHeight - grSprite.height,
                        grSprite.width,
                        grSprite.height));
                }

                let birdsImg = [birdImg_1, birdImg_2, birdImg_3];
                for (let i = 0; i < birdsImg.length; i++)
                {
                    this.birds.push(new Bird(birdsImg[i],
                        0,
                        0,
                        this.changeForScreeningH(12),
                        this.changeForScreeningH(18)));
                }

                let pipeTopSprites = [
                    this.gbt.spriteSheet(allImg,
                        112,
                        646.5,
                        52,
                        319.5),
                    this.gbt.spriteSheet(allImg,
                        0,
                        646.5,
                        52,
                        319.5
                    )
                ];


                let pipeBottomSprites = [
                    this.gbt.spriteSheet(allImg,
                        168,
                        646.5,
                        52,
                        319.5),
                    this.gbt.spriteSheet(allImg,
                        0,
                        646.5,
                        52,
                        319.5)
                ];
                for (let i = 0; i < pipeTopSprites.length; i++)
                {
                    this.pipeTop[i] = [];
                    this.pipeBottom[i] = [];
                    for (let j = 0; j < 5; j++)
                    {

                        this.pipeTop[i][j] = new GameImage(pipeTopSprites[i],
                            0,
                            0,
                            this.changeForScreeningH(10),
                            this.changeForScreeningH(1.5));
                        // this.pipeTop[j].angle = 180;
                        this.pipeBottom[i][j] = new GameImage(pipeBottomSprites[i],
                            0,
                            0,
                            this.changeForScreeningH(10),
                            this.changeForScreeningH(1.5));
                    }
                }
                let playbtnSprite = this.gbt.spriteSheet(allImg, 707, 236, 105, 58);
                this.playbtn = new GameImage(playbtnSprite,
                    0,
                    0,
                    playbtnSprite.width,
                    playbtnSprite.height)

                let titleFlappyBirdSprite = this.gbt.spriteSheet(allImg, 700, 180, 180, 50);
                this.titleFlappyBird = new GameImage(titleFlappyBirdSprite,
                    0,
                    0,
                    titleFlappyBirdSprite.width,
                    titleFlappyBirdSprite.height);

                let titleGetReadySprite = this.gbt.spriteSheet(allImg, 590, 118, 185, 50,this.changeForScreeningH(3.5), this.changeForScreeningH(3.5));
                this.titleGetReady = new GameImage(titleGetReadySprite,
                    this.gameWidth / 2 - titleGetReadySprite.width / 2,
                    this.changeForScreeningH(8),
                    titleGetReadySprite.width,
                    titleGetReadySprite.height);

                let tapSprite = this.gbt.spriteSheet(allImg, 584, 168, 116, 110,this.changeForScreeningH(3.5), this.changeForScreeningH(3.5));
                this.tap = new GameImage(tapSprite,
                    0,
                    0,
                    tapSprite.width,
                    tapSprite.height);
               // this.tap = new Sprite(allImg, 584, 168, 116, 110,0,0, this.changeForScreeningH(3.5), this.changeForScreeningH(3.5));
    

                this.gbt.startGameLoop(startStage);
            });
    }
    changeForScreeningH(i)
    {
        return this.gameHeight / i;
    }
}


class PlayStage
{
    entry()
    {
        let rand = Math.floor(Math.random() * 3);
        game.bird = game.birds[rand];
        game.bird.vel.y = game.changeForScreeningH(200);
        game.bird.angle = 0;
        game.bird.x = game.gameWidth / 2 - game.bird.width;
        game.bird.y = game.changeForScreeningH(2) - game.bird.height / 2;
        game.tap.x = game.bird.x;
        game.tap.y = game.bird.y - game.tap.height / 2.2;
        rand = Math.floor(Math.random() * 2);
        this.pipeTop = game.pipeTop[rand];
        this.pipeBottom = game.pipeBottom[rand];

        for (let i = 0; i < this.pipeTop.length; i++)
        {
            if (rand == 1)
            {
                this.pipeTop[i].angle = 180;
            }
            let y = game.gbt.getRandom(
                game.changeForScreeningH(100) * 15,
                game.gameHeight - (game.changeForScreeningH(100)) * 40);
            let pT = this.pipeTop[i];
            let pB = this.pipeBottom[i];
            pT.x = i == 0 ? game.gameWidth : game.gameWidth + i * game.gameHeight / 2;
            pT.y = y - game.changeForScreeningH(1.5);
            pB.x = pT.x;
            pB.y = pT.y + pT.height + game.space;
        }
        this.bgs = startStage.bgs;
        this.switchGame = {
            sceneState: "start"
        }
    }

    render(delta)
    {
        this.update(delta);
        game.paint.clearScene(game.gameScene);

        for (let bg of this.bgs)
        {
            game.paint.drawImage(bg);
        }

        for (let i = 0; i < this.pipeTop.length; i++)
        {
            let pT = this.pipeTop[i];
            let pB = this.pipeBottom[i];
            game.paint.drawImage(pT);
            game.paint.drawImage(pB);
        }

        for (let gr of game.grs)
        {
            game.paint.drawImage(gr);
        }
        if (this.switchGame.sceneState === "start")
        {
            game.paint.drawImage(game.titleGetReady);
            game.paint.drawImage(game.tap);
          // game.paint.drawSprite(game.tap);
        }
        game.paint.drawAnimation(game.bird);
    }

    update(delta)
    {
        this.birdUpdate(delta);
        this.bgUpdate(delta);
        this.grUpdate(delta);
        this.pipeUpdate(delta);
        if (game.gbt.onClick(game.gameScene))
        {
            if (this.switchGame.sceneState === "start" ||
                this.switchGame.sceneState === "play")
            {
                this.switchGame.sceneState = "play";
                game.bird.vel.y = -game.changeForScreeningH(110);
                if (game.bird.angle > -90)
                {
                    game.bird.angle = -50;
                }
            }
            else if (this.switchGame.sceneState === "gameOver")
            {
                game.gbt.setGameLoop(startStage);
            }
        }
    }
    bgUpdate(delta)
    {
        if (this.switchGame.sceneState === "start" ||
            this.switchGame.sceneState === "play"
        )
        {
            for (let bg of this.bgs)
            {
                bg.x <= -bg.width ? bg.x = this.oldB.x + this.oldB.width - 5 : bg.x -= delta * 60;
                this.oldB = bg;
            }
        }
    }
    grUpdate(delta)
    {
        if (this.switchGame.sceneState === "start" ||
            this.switchGame.sceneState === "play"
        )
        {
            for (let gr of game.grs)
            {
                gr.x <= -gr.width ? gr.x = this.oldG.x + this.oldG.width - 5 : gr.x -= delta * 100;
                this.oldG = gr;
            }
        }
    }
    pipeUpdate(delta)
    {
        if (this.switchGame.sceneState === "play")
        {
            for (let i = 0; i < this.pipeTop.length; i++)
            {
                let pT = this.pipeTop[i];
                let pB = this.pipeBottom[i];
                pT.x -= delta * game.changeForScreeningH(4);
                pB.x = pT.x;
                if (pT.x + pT.width < 0)
                {
                    pT.x = this.pipeTop.length * game.gameHeight / 2;
                    let y = game.gbt.getRandom(
                        game.gameHeight / 100 * 20,
                        game.gameHeight - (game.changeForScreeningH(100)) * 40);
                    pT.y = y - game.changeForScreeningH(1.5);
                    pB.y = pT.y + pT.height + game.space;
                }
                if (game.gbt.collisionRect(game.bird, pT) || game.gbt.collisionRect(game.bird, pB))
                {
                    this.switchGame.sceneState = "gameOver";
                }
            }
        }
    }
    birdUpdate(delta)
    {
        game.bird.vel.y += delta * game.changeForScreeningH(40);

        if (this.switchGame.sceneState === "play")
        {
            game.bird.y += game.bird.vel.y;
            if (game.bird.angle < 90)
            {
                game.bird.angle += delta * 100;
            }
        }
        if (this.switchGame.sceneState === "gameOver")
        {
            game.paint.stopAnimation(game.bird, 2);
            game.bird.y += delta * 200;
            if (game.bird.angle <= 90)
            {
                game.bird.angle += delta * 160;
            }


        }
        if (game.bird.y + game.bird.height >= game.grs[0].y)
        {
            game.bird.y = game.grs[0].y - game.bird.height;
            this.switchGame.sceneState = "gameOver"
        }
    }
}

class StartStage
{
    entry()
    {
        game.playbtn.x = game.gameWidth / 2 - game.playbtn.width / 2;
        game.playbtn.y = game.gameHeight / 2 - game.playbtn.height / 2;
        game.titleFlappyBird.x = game.gameWidth / 2 - game.titleFlappyBird.width / 2;
        game.titleFlappyBird.y = game.changeForScreeningH(8);
        let rand = Math.floor(Math.random() * 2);
        this.bgs = game.bgs[rand];
    }

    render(delta)
    {
        for (let bg of this.bgs)
        {
            game.paint.drawImage(bg);
        }
        game.paint.drawImage(game.titleFlappyBird);
        game.paint.drawImage(game.playbtn);
        if (game.gbt.onClick(game.gameScene))
        {
            game.gbt.setGameLoop(playStage);
        }
    }
}
let playStage = new PlayStage;
let startStage = new StartStage;
let game = new Game();
