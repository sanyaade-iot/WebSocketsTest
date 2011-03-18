var enemyImage = new Image();
enemyImage.src = "images/enemy.png";

function EnemyShip()
{
    this.x = 150;
    this.y = 150;
    this.rotation = 0.0;
    
    this.update = function()
    {
        
    }

    this.draw = function(context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180.0);
        context.drawImage(enemyImage, -18, -17);
        context.restore();        
    }
}