canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

class Helper {
    static random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static removeIndex(array, index) {
        if (index >= array.length || array.length <= 0) {
            return;
        }

        array[index] = array[array.length - 1];
        array[array.length - 1] = undefined;
        array.length = array.length - 1;
    }
}

class Player
{
    constructor(x, y, dx, context) {
        this.x = x;
        this.y = y;
        this.w = 109;
        this.h = 167;
        this.dx = dx;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/player.png';
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Score
{
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = 78;
        this.h = 33;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/score.png';
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Money {
    constructor(x, y, dy, context) {
        this.x = x;
        this.y = y;
        this.w = 70;
        this.h = 34;
        this.dy = dy;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/dollar.png';
    }

    update()
    {
        this.y += this.dy;
    }

    draw() {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Game
{
    constructor(context, event) {
        this.ctx = context;
        this.player = new Player(50, 410, 7, ctx);
        this.money = new Money(2000, 30, 3, this.ctx);
        this.scoreimg = new Score(20,20,this.ctx);
        this.moneys = [];
        this.moneySpawnInterval = 500;
        this.moneyTimer = 1;
        this.score = 0;
        this.keyStates = {};
        this.keyboardListen();
        this.loop();
    }

    loop()
    {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.player.update();
        this.money.update();
        this.handleInput();
        this.scoreimg.update();
        if (this.moneyTimer % this.moneySpawnInterval === 0)
        {
            this.moneys.push(new Money(
                Math.floor(Math.random() * 750),
                30,
                3,
                this.ctx
            ));

            this.moneyTimer = 0;
        }
        this.moneyTimer++;
        this.moneys.forEach((money, index) => {
            if (money.y > 600)
            {
                Helper.removeIndex(this.moneys, index);
            }

            const moneyCenterX = money.x + money.w;
            const moneyCenterY = money.y + money.h;
            if (
                moneyCenterX >= this.player.x &&
                money.x <= this.player.x + this.player.w &&
                moneyCenterY >= this.player.y &&
                moneyCenterY <= this.player.y + this.player.h
            ){
               Helper.removeIndex(this.moneys, index);
               this._scoreUpdate();
            }


            money.update();
        });

        if (this.player.x >= 800 - this.player.w)
        {
            this.player.x -= this.player.dx;
        }
        if (this.player.x <= 0)
        {
            this.player.x += this.player.dx;
        }
    }

    draw()
    {
        this.ctx.clearRect(0,0,800,600);
        this.player.draw();
        this.money.draw();
        this.scoreimg.draw();
        for (let i in this.moneys)
        {
            if (this.moneys.hasOwnProperty(i))
                this.scoreimg.draw();
                this.moneys[i].draw();
        }
    }

    keyboardListen()
    {
        document.addEventListener('keydown', (e) =>
        {
            this.setKeyState(true, e);
        });
        document.addEventListener('keyup', (e) =>
        {
            this.setKeyState(false, e);
        });
    }

    setKeyState(keydown, e)
    {
        this.keyStates[e.keyCode] = keydown;
    }

    handleInput()
    {
        if (this.keyStates[37])
        {
            this.player.x -= this.player.dx;
        }

        if (this.keyStates[39])
        {
            this.player.x += this.player.dx;
        }
    }

    _scoreUpdate()
    {
        document.getElementById('game-score').innerText = '' + ++this.score;
    }

}





game = new Game(ctx);
game.update();
game.draw();