let game;

function init() {
    if (!load()) game = new Game();

    $('msglog').innerHTML = '======== Log ========<br><br>';

    setInterval(game.update,50);
}

let D = n => ExpantaNum(n);

let $ = id => document.getElementById(id);

let UPGRADES = {
    'autoProgress': new Upgrade('autoProgress', 'Automatically progress through rooms', 240)
}

function save() {
    let j = JSON.stringify(game);
    let e = btoa(j);
    localStorage.setItem('rhsave', e);
}

function load() {
    let s = localStorage.getItem('rhsave');
    if (s != null) {
        s = JSON.parse(atob(s));
        game = new Game(s);
        return true;
    }
    return false;
}

function wipe() {
    game = new Game();
    save();
}