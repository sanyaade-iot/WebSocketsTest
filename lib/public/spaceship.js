var shipImage = new Image();
shipImage.src = "images/spaceship.png";

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
    
    this.update = function()
    {
        if (this.keyUp)
            this.speed += 0.4;
        else if (this.keyDown)
            this.speed -= 0.4;
            
        this.speed = clamp(this.speed, -8.0, 8.0);
        this.speed = zeroIfTooSmall(this.speed, 0.2);
            
        rotationSpeed = Math.abs(this.speed) * 0.8;    
        
        if (this.keyLeft)
            this.rotation -= rotationSpeed;
        else if (this.keyRight)
            this.rotation += rotationSpeed;            
        
        speedX = 0;
        speedY = -1;
        
        cos = Math.cos(this.rotation * Math.PI / 180.0);
        sin = Math.sin(this.rotation * Math.PI / 180.0);

        rotX = speedX * cos - speedY * sin;
        rotY = speedX * sin + speedY * cos;

        this.x += this.speed * rotX;
        this.y += this.speed * rotY;        
    }

    this.draw = function(context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180.0);
        context.drawImage(shipImage, -18, -17);
        context.restore();
    }
}