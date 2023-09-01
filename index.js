const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// canvas frame
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)


const gravity = 0.7

//creating the background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    frameMax: 6
})



// player location
const player = new Fighter({
    position:{
        x: 120,
        y: 0
    },
    velocity:{
        x: 0,
        y: 10
    },
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            frameMax: 6
        },
        takehit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50           
        },
        width: 160,
        height: 50
    }
})



// enemy location
const enemy = new Fighter({
    position:{
        x: 800,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            frameMax: 4
        },
        takehit: {
            imageSrc: './img/kenji/Take hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})



console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}



decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0
    //player movement
    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    //jump
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }
    //jump
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect collision & hit
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.frameCurrent === 4
    ){
        enemy.takehit()
        player.isAttacking = false
        // document.querySelector('#enemyhealth').style.width = enemy.health + '%'
        gsap.to('#enemyhealth', {
            width: enemy.health + '%'
        })
    }

    //misses attack
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.frameCurrent === 2
    ){
        player.takehit()
        enemy.isAttacking = false
        // document.querySelector('#playerhealth').style.width = player.health + '%'
        gsap.to('#playerhealth', {
            width: player.health + '%'
        })
    }

    //enemy misses
    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }

    //end game
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerid})
    }
}
animate()

window.addEventListener('keydown', () => {
    if(!player.dead){
    switch(event.key){
        case 'd':
            //makes it move right
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            //makes it move left
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            //makes it jump
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break 
        }
    }
    if(!enemy.dead){
        switch(event.key){
            //arrow key movement of enemy
            case 'ArrowRight':
                //makes it move right
                keys.ArrowRight.pressed = true
                enemy.lastKey =  'ArrowRight'
                break
            case 'ArrowLeft':
                //makes it move left
                keys.ArrowLeft.pressed = true
                enemy.lastKey =  'ArrowLeft'
                break
            case 'ArrowUp':
                //makes it jump
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                //enemy attack
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', () => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})