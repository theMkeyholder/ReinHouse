let game;

function init() {
    if (!load()) game = new Game();

    $('msglog').innerHTML = '====== Log ======';

    setInterval(game.update,50);

    for (let i of ITEMS) {
        let button = document.createElement('button');
        button.id = i.id;
        button.onclick = () => i.buy();
        button.innerText = `${i.name} - ${f(i.cost)} gold`;
        document.getElementById('items').appendChild(button);
    }
}

let D = n => ExpantaNum(n);

let $ = id => document.getElementById(id);

let UPGRADES = {
    'autoProgress': new Upgrade('autoProgress', 'Automatically progress through rooms', 240),
    'autoKill': new Upgrade('autoKill', 'Automatically kill enemies', 1e8),
    'autoBuy': new Upgrade('autoBuy', 'Automatically buy potions', 1e300),
    'autoClimb': new Upgrade('autoClimb', 'Automatically climb stairs', 'ee100'),
    'keepUpg': new Upgrade('keepUpg', 'Keep upgrades into your dreams', 'ee500')
}

let ITEMS = [
    new Item('shp', 'small health potion', 100, 5),
    new Item('mhp', 'medium health potion', 300, 8),
    new Item('lhp', 'large health potion', 800, 12),
    new Item('suhp', 'super health potion', 1800, Infinity),
    new Item('ssp', 'small strength potion', 500, 9),
    new Item('msp', 'medium strength potion', 2500, 14),
    new Item('lsp', 'large strength potion', 1e8, Infinity),
    new Item('slp', 'small luck potion', 1e10, 15),
    new Item('mlp', 'medium luck potion', '1e2000', 20),
    new Item('llp', 'large luck potion', 'ee300', Infinity)
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