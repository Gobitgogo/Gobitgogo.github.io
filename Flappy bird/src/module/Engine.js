class GBT
{
    createScene()
    {
        this.defolt = {
            width: window.innerWidth,
            height: window.innerHeight,
            background: "white",
            id: "canvas"
        };
        let canvas = document.createElement("canvas");
        let body = document.body;
        body.style.margin = 0;
        body.appendChild(canvas);
        this.setParametersScene(
        {}, canvas);
        return canvas;
    };
    onClick(scene)
    {
        this.setClick = () =>
        {
            this.click = true;
        }
        if (this.click === undefined)
        {
            this.click = false;
            scene.addEventListener("click", this.setClick);
        }
        if (this.click)
        {
            this.click = false;
            return true;
        }
        return false;
    }
    setParametersScene(data, scene)
    {
        scene.width = data.width || this.defolt.width;
        scene.height = data.height || this.defolt.height;
        scene.style.backgroundColor = data.background || this.defolt.background;
        scene.id = data.id || this.defolt.id;
    };
    startGameLoop(game)
    {
        this.game = game;
        this.game.entry();
        let lastUpdate;
        let firstStep = (millils) =>
        {
            if (lastUpdate)
            {
                this.game.render((millils - lastUpdate) / 1000);
            }
            lastUpdate = millils;
            nextStep();
        };
        let nextStep = () =>
        {
            this.request = requestAnimationFrame(firstStep);
        };
        firstStep();
    };
    setGameLoop(stage)
    {
        this.game = stage
        this.game.entry();
    };
    paint(scene)
    {
        let ctx = scene.getContext("2d");

        /*setInterval(()=>{
          ctx.clearRect(0, 0, scene.width, scene.height);
        },1000/60);*/
        this.objPaint = {
            drawRect: (rect) =>
            {
                ctx.fillStyle = rect.fillColor || "black";
                ctx.strokeStyle = rect.strokeColor || "black";
                ctx.lineWidth = rect.lineWidth || 1;
                if (rect.fill || rect.fill == undefined && rect.stroke == undefined)
                {
                    ctx.beginPath();
                    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                    ctx.closePath();
                }
                if (rect.stroke)
                {
                    ctx.beginPath();
                    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    ctx.closePath();
                }
            },
            drawImage: (img) =>
            {
                if (img.angle != undefined)
                {
                    ctx.save();
                    let rx = img.x + img.width / 2;
                    let ry = img.y + img.height / 2;
                    let angle = img.angle * Math.PI / 180;
                    ctx.translate(rx, ry);
                    ctx.rotate(angle);
                    ctx.translate(-rx, -ry);
                }
             
                ctx.beginPath();
               /* ctx.mozImageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false*/
                ctx.drawImage(img.img, img.x || 0, img.y || 0, img.width || scene.width, img.height || scene.height);
                ctx.closePath();
                 ctx.restore();
            },
            drawAnimation: (anim) =>
            {
                if (anim.angle != undefined)
                {
                    ctx.save();
                    if (anim.fpsA == null) anim.fpsA = new Date();
                    let rx = anim.x + anim.width / 2;
                    let ry = anim.y + anim.height / 2;
                    let angle = anim.angle * Math.PI / 180;
                    ctx.translate(rx, ry);
                    ctx.rotate(angle);
                    ctx.translate(-rx, -ry);
                   
                }
                let sx = anim.img.width / (anim.frameCount + 1);
                if (new Date - anim.fpsA > anim.fps)
                {
                    anim.currentFrame === anim.frameCount ? anim.currentFrame = 0 : anim.currentFrame++;
                    anim.fpsA = null;
                  
                }
                ctx.beginPath();
                ctx.drawImage(anim.img, sx * anim.currentFrame, 0, sx, anim.img.height, anim.x, anim.y, anim.width, anim.height);
                ctx.closePath();
                ctx.restore();
            },
            stopAnimation: (anim, frame) =>
            {
                anim.currentFrame = frame;
                anim.fpsA = null;
            },
            drawSprite(sprite)
            {
                ctx.beginPath();
                ctx.drawImage(sprite.img, sprite.sx, sprite.sy, sprite.sWidth, sprite.sHeight, sprite.x, sprite.y, sprite.width, sprite.height);
                ctx.closePath();
            },
            clearScene: (scene) =>
            {

                ctx.clearRect(0, 0, scene.width, scene.height);

            }
        };

        return this.objPaint;
    }
    spriteSheet(img, sx, sy, sw, sh, w, h)
    {
        let buffer = document.createElement("canvas");
        buffer.width = w || sw;
        buffer.height = h || sh;
        buffer.getContext("2d")
            .drawImage(img, sx, sy, sw, sh, 0, 0, buffer.width, buffer.height);
        return buffer;
    }

    loadResourse(resourse)
    {
        let promises = [];
        for (let i = 0; i < resourse.length; i++)
        {
            promises[i] = new Promise((resolve) =>
            {
                const image = new Image();
                image.onload = () =>
                {
                    resolve(image);
                }
                image.src = resourse[i];
            });
        }
        return Promise.all(promises)
            .then();
    }
    getRandom(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    collisionRect(obj_1, obj_2)
    {
        return obj_1.x <= obj_2.x + obj_2.width && obj_1.x + obj_1.width >= obj_2.x &&
            obj_1.y <= obj_2.y + obj_2.height && obj_1.y + obj_1.height >= obj_2.y

    }
};
