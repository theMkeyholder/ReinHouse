let game;

function init() {
    if (!load()) game = new Game();

    $('msglog').innerHTML = '======== Log ========<br><br>';

    setInterval(game.update,50);

    for (let i of ITEMS) {
        let button = document.createElement('button');
        button.id = i.id;
        button.onclick = () => i.buy();
        button.innerText = `${i.name} - ${f(i.cost)} gold`;
        document.getElementById('shop').appendChild(button);
    }
}

let D = n => ExpantaNum(n);

let $ = id => document.getElementById(id);

let UPGRADES = {
    'autoProgress': new Upgrade('autoProgress', 'Automatically progress through rooms', 240),
    'autoKill': new Upgrade('autoKill', 'Automatically kill enemies', 1e8)
}

let ITEMS = [
    new Item('shp', 'small health potion', 100),
    new Item('mhp', 'medium health potion', 300),
    new Item('lhp', 'large health potion', 800),
    new Item('suhp', 'super health potion', 1800),
    new Item('ssp', 'small strength potion', 500),
    new Item('msp', 'medium strength potion', 2500),
    new Item('lsp', 'large strength potion', 1e8)
]

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
    $('msglog').innerHTML = '======== Log ========<br><br>';
    save();
}