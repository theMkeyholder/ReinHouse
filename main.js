let game;

function init() {
    game = new Game();

    $('msglog').value = '======== Log ========\r\r';

    setInterval(game.update,50);
}

let D = n => ExpantaNum(n);

let $ = id => document.getElementById(id);