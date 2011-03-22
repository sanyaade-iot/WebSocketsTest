var shipImage = new Image();
shipImage.src = "images/spaceship.png";

var rocketImage = new Image();
rocketImage.src = "images/rocket.png";

const screenWidth = 1400;
const screenHeight = 850;

const radToDeg = Math.PI / 180.0;
const degToRad = 180.0 / Math.PI;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function vector(x, y)
{
    this.x = x;
    this.y = y;

    this.rotate = function(rotation)
    {
        var cos = Math.cos(rotation * radToDeg);
        var sin = Math.sin(rotation * radToDeg);

        var rotX = this.x * cos - this.y * sin;
        var rotY = this.x * sin + this.y * cos;

        this.x = rotX;
        this.y = rotY;
    }

    this.mul = function(s)
    {
        this.x *= s;
        this.y *= s;
    }

    this.div = function(s)
    {
        this.x /= s;
        this.y /= s;
    }

    this.add = function(v)
    {
        this.x += v.x;
        this.y += v.y;
    }

    this.sub = function(v)
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    this.isOutOfBounds = function()
    {
        if (this.x < 0 || this.x > screenWidth)
            return true;
        if (this.y < 0 || this.y > screenHeight)
            return true;
        return false;
    }

    this.flipBounds = function()
    {
        if (this.x < 0)
            this.x = screenWidth - 1;
        else if (this.x > screenWidth)
            this.x = 0;

        if (this.y < 0)
            this.y = screenHeight - 1;
        else if (this.y > screenHeight)
            this.y = 0;
    }
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

function Rocket(x, y, rotation)
{
    this.position = new vector(x, y);
    this.rotation = rotation;
    
    this.update = function()
    {
        var v = new vector(0, -14.0);
        v.rotate(rotation);
        this.position.add(v);        
    }
    
    this.draw = function(context)
    {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * radToDeg);
        context.drawImage(rocketImage, -2, -7);
        context.restore();
    }
}

function SpaceShip()
{
    this.position = new vector(screenWidth / 2, screenHeight / 2);
    
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

        var speedVector = new vector(0, -this.speed);
        speedVector.rotate(this.rotation);
        this.position.add(speedVector);

        this.position.flipBounds();
        
        if (this.rocketCounter <= maxRocketCounter)
            this.rocketCounter++;
        
        if (this.keySpace && this.rocketCounter > maxRocketCounter)
        {
            rocketVector1 = new vector(-18.0, 0);
            rocketVector2 = new vector(18.0, 0);

            rocketVector1.rotate(this.rotation);
            rocketVector2.rotate(this.rotation);

            rocketVector1.add(this.position);
            rocketVector2.add(this.position);
            
            this.rocketCounter = 0;
            this.rockets.push(new Rocket(rocketVector1.x, rocketVector1.y, this.rotation));
            this.rockets.push(new Rocket(rocketVector2.x, rocketVector2.y, this.rotation));
        }
        
        for (var i = 0; i < this.rockets.length; i++)
        {
            this.rockets[i].update();
            if (this.rockets[i].position.isOutOfBounds())
            {
                this.rockets.remove(i);
                i--;
            }
        }
    }

    this.draw = function(context)
    {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180.0);
        context.drawImage(shipImage, -18, -17);
        context.restore();
        
        for (var i = 0; i < this.rockets.length; i++)
        {
            this.rockets[i].draw(context);
        }
    }
}