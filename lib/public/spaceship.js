var shipImage = new Image();
shipImage.src = "images/spaceship.png";

var rocketImage = new Image();
rocketImage.src = "images/rocket.png";

function isOutOfBounds(x, y)
{
    if (x < 0 || x > 1400)
        return true;
    if (y < 0 || y > 850)
        return true;
    return false;
}

function clamp(value, min, max)
{
    return (value < min) ? min : (value > max) ? max : value;
}

function zeroIfTooSmall(value, min)
{
    if (Math.abs(value) < min)
        return 0;
    return value;
}

function vectorFromRotation(rotation)
{
    vx = 0;
    vy = -1;
    
    cos = Math.cos(rotation * Math.PI / 180.0);
    sin = Math.sin(rotation * Math.PI / 180.0);

    rotX = vx * cos - vy * sin;
    rotY = vx * sin + vy * cos;
    
    return { x : rotX, y : rotY };
}

function Rocket(x, y, rotation)
{
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    
    const rocketSpeed = 20.0;
    
    this.update = function()
    {
        vector = vectorFromRotation(this.rotation);
        this.x += rocketSpeed * vector.x;
        this.y += rocketSpeed * vector.y;
    }
    
    this.draw = function(context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180.0);
        context.drawImage(rocketImage, -2, -7);
        context.restore();
    }
}

function SpaceShip()
{
    this.x = 320;
    this.y = 240;

    this.rotation = 0.0;
    this.speed = 0.0;
    
    this.keyLeft = false;
    this.keyRight = false;
    this.keyUp = false;
    this.keyDown = false;
    this.keySpace = false;
    
    const maxRocketCounter = 20;
    
    this.rocketCounter = maxRocketCounter;
    this.rockets = [];
    
    this.update = function()
    {
        if (this.keyUp)
            this.speed += 0.6;
        else if (this.keyDown)
            this.speed -= 0.6;
            
        this.speed = clamp(this.speed, -8.0, 8.0);
        this.speed = zeroIfTooSmall(this.speed, 0.2);
            
        rotationSpeed = Math.abs(this.speed) * 0.8;    
        
        if (this.keyLeft)
            this.rotation -= rotationSpeed;
        else if (this.keyRight)
            this.rotation += rotationSpeed;            
        
        vector = vectorFromRotation(this.rotation);

        this.x += this.speed * vector.x;
        this.y += this.speed * vector.y;
        
        if (this.rocketCounter <= maxRocketCounter)
            this.rocketCounter++;
        
        if (this.keySpace && this.rocketCounter > maxRocketCounter)
        {
            this.rocketCounter = 0;
            this.rockets.push(new Rocket(this.x, this.y, this.rotation));
        }
        
        for (var i = 0; i < this.rockets.length; i++)
        {
            this.rockets[i].update();
        }
    }

    this.draw = function(context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180.0);
        context.drawImage(shipImage, -18, -17);
        context.restore();
        
        for (var i = 0; i < this.rockets.length; i++)
        {
            this.rockets[i].draw(context);
        }
    }
}