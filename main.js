let game;

function init() {
    if (!load()) game = new Game();

    $('msglog').innerHTML = '====== Log ======';

    setInterval(game.update,50);

    for (let i of ITEMS) {
        let button = $$('button');
        button.id = i.id;
        button.onclick = () => i.buy();
        button.innerText = `${i.name} - ${f(i.cost)} ${i.nightmare ? 'nightmare fuel' : 'gold'}`;
        document.getElementById(i.nightmare ? 'nitems' : 'items').appendChild(button);
    }
    if (game.NL) $('theme').href = 'dark.css';
    game.tabTo(0);
    for (let i in game.roomWeights) for (let j in data.rooms) if (i === data.rooms[j].name) { data.rooms[j].weight = game.roomWeights[i]; break; }
    for (let i of data.rooms) {
        let span = $$('div');
        span.id = i.name + '_s';
        span.className = 'roomweightthing';
        span.innerHTML = i.name + ' ';
        let input = $$('input');
        input.id = i.name + '_i';
        input.value = i.weight;
        span.appendChild(input);
        $('roomeditor').appendChild(span);
    }
}

let D = n => ExpantaNum(n);

let $ = id => document.getElementById(id);
let $$ = id => document.createElement(id);

let UPGRADES = {
    'autoProgress': new Upgrade('autoProgress', 'Automatically progress through rooms', 240),
    'autoKill': new Upgrade('autoKill', 'Automatically kill enemies', 1e8),
    'autoBuy': new Upgrade('autoBuy', 'Automatically buy potions', 1e300),
    'autoClimb': new Upgrade('autoClimb', 'Automatically climb stairs', 'ee100'),
    'keepUpg': new Upgrade('keepUpg', 'Keep upgrades into your dreams', 'eee5000'),
    'autoNightmare': new Upgrade('autoNightmare', 'Passively generate nightmare fuel', 100, true)
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
    new Item('llp', 'large luck potion', 'eee3', Infinity),
    new Item('dhp', 'dark health potion', 1, Infinity, true),
    new Item('dsp', 'dark strength potion', 1, Infinity, true),
    new Item('dlp', 'dark luck potion', 1, Infinity, true),
    new Item('pdhp', 'potent dark health potion', 10, Infinity, true),
    new Item('pdsp', 'potent dark strength potion', 10, Infinity, true),
    new Item('pdlp', 'potent dark luck potion', 10, Infinity, true),
    new Item('np', 'nightmare potion', 1000, Infinity, true),
    new Item('sb', 'shadow blood','10^^10', Infinity, true)
];

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
    if (confirm('Are you sure you want to wipe your save?')) {
        game = new Game();
        $('msglog').innerHTML = '======== Log ========<br><br>';
        save();
    }
}
