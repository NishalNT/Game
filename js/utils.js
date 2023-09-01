function rectangularCollision({
    rectangle1,
    rectangle2
}){
    return (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x && 
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height 
    )
}
function determineWinner({player, enemy, timerid}){
    clearTimeout(timerid)
    document.querySelector('#won').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#won').innerHTML = 'Tie'
    } else if(player.health > enemy.health){
        document.querySelector('#won').innerHTML = 'Player 1 Wins'
    } else if(enemy.health > player.health){
        document.querySelector('#won').innerHTML = 'Player 2 Wins'
    }
}
let timer = 60
let timerid
function decreaseTimer(){ 
    if(timer>0) {
        timerid = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if(timer === 0){
        determineWinner({player, enemy, timerid})
    }  
}
