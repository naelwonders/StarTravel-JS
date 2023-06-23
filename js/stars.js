// idees: 
// les plus petites etoiles bougent plus lentement car plus loin
// les plus grandes spawn petites puis grandissent
// l'asteroid spawn petit et grandit (plus pres)

let config = {
    type: Phaser.AUTO,
    width: 800, // en pixels
    height: 800,
    background : 'black',
    physics: {
        default: 'arcade' //detecter les positions
    },
    scene: { //differents etats (gauche: nom de l'etat; droite: nom de la fontion qu'on va creer)
        preload : preload,     
        create: create,     
        update : update   
    }
};

//variables globales
let game = new Phaser.Game(config);
let stars, asteroid;
let speed = 1;
let acceleration = 0.001; 
let directionX, directionY, velocity;
let centerX, centerY;

function preload() {
    // on charge l'image mais elle ne s'affiche pas encore
    //on assigne notre image a un alias (1er string entrée)
    // "." fait ref au repertoire courants (chemin relatif)
    this.load.image('star', './assets/images/obj/star.png'); 
    this.load.image('asteroid', './assets/images/asteroid.png'); 
}

//CREATE c'est un equivalent du draw dans pygame zero
function create() {

    //on ajoute 30 etoiles statiques mais de tailles differentes et positionnées au hazard 
    stars = this.add.group();

    for(let i = 0; i < 100 ; i++) {
        star = this.add.image(Phaser.Math.Between(0, config.width),Phaser.Math.Between(0, config.height),'star'); 
        //le random fonctionne avec des entiers donc faut diviser par 10 pour avoir des chiffre à vigule
        star.setScale(Phaser.Math.Between(3, 10)/10); // il existe un methode pour les chiffre à virgules (float.Between) 
        stars.add(star)   
    }

    asteroid = this.add.image(Phaser.Math.Between(0, config.width),Phaser.Math.Between(0, config.height),'asteroid')
    asteroid.setScale(0.1);

    // Add event listeners for arrow keys
    this.input.keyboard.on('keydown', handleKeyDown);
    this.input.keyboard.on('keyup', handleKeyUp);
}

function update() {

    centerX = config.width / 2;
    centerY = config.height / 2;

    speed += acceleration;

    stars.getChildren().forEach(star => {
        let dx = star.x - centerX;
        let dy = star.y - centerY;
        let distance = Math.sqrt(dx * dx + dy *dy);

        directionX = dx / distance;
        directionY = dy / distance;

        velocity = speed * distance * 0.01;
        movementObject(star)
    });
    movementObject(asteroid);
    
}

function movementObject(object){
    object.x += directionX * velocity;
    object.y += directionY * velocity;

    let edgeX = Math.abs(centerX - object.x) > centerX ? (centerX > object.x ? 0 : config.width) : object.x;
    let edgeY = Math.abs(centerY - object.y) > centerY ? (centerY > object.y ? 0 : config.height) : object.y;

    let edgeDistanceX = Math.abs(edgeX - object.x);
    let edgeDistanceY = Math.abs(edgeY - object.y);

    if(edgeDistanceX < edgeDistanceY){
        object.x = edgeX;
    } else {
        object.y = edgeY;
    }
    
    if (object.x < 0 || object.x > config.width || object.y < 0 || object.y > config.height) {
        respawnStar(object);
      }

}

function respawnStar(object) {
    const x = Phaser.Math.Between(0, config.width);
    const y = Phaser.Math.Between(0, config.height);
    object.x = x;
    object.y = y;
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowUp') {
      acceleration += 0.001; // Increase acceleration when ArrowUp is pressed
    } else if (event.key === 'ArrowDown') {
      if (speed > 0) {
        acceleration -= 0.001; // Decrease acceleration when ArrowDown is pressed, only if speed is positive
      }
    }
  }
  
  function handleKeyUp(event) {
    if (event.key === 'ArrowUp') {
      acceleration = 0.001; // Reset acceleration to default when ArrowUp is released
    } else if (event.key === 'ArrowDown') {
      acceleration = 0; // Set acceleration to 0 when ArrowDown is released
    }
  }
