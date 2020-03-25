class Game {
    constructor(saveData) {
        this.room = D(0);
        this.floor = D(0);
        this.dreamLayer = D(0);

        this.gold = D(0);

        this.currentRoomType = "empty room";
        this.currentEnemy = null;

        this.hp = D(100);
        this.dmg = D(5);
    }

    update() {
        $('deets').innerText = `
        You are currently in room ${f(game.room)} of floor ${f(game.floor)}
        You have ${f(game.gold)} gold
        `
        if (game.currentEnemy != null) {
            $('nr').disabled = 'disabled';
            $('fight').innerHTML = `
            You are fighting a${beginsVowel(game.currentEnemy.name) ? 'n' : ''} ${game.currentEnemy.name} which has ${game.currentEnemy.hp} health<br>
            `
            $('attack').style.display = 'inline-block';
        } else {
            $('fight').innerText = '';
            $('attack').style.display = 'none';
            $('nr').disabled = '';
        }
    }

    attack() {
        this.currentEnemy.hurt(this.dmg);
    }

    nextRoom() {
        this.room = this.room.add(1);
        this.currentRoomType = chooseWeighted(data.rooms).name;
        this.logmsg(`You are in a${beginsVowel(this.currentRoomType) ? 'n' : ''} ${this.currentRoomType}`);
        switch (this.currentRoomType) {
            case "empty room":
                break;
            case "monster room":
                this.currentEnemy = new Enemy(this.chooseMonster());
                this.logmsg(`A wild ${this.currentEnemy.name} appears!!!`);
        }
    }

    chooseMonster() {
        return chooseWeighted(data.monsters).name;
    }

    logmsg(msg) {
        $('msglog').value = msg + '\r\r' + $('msglog').value;
    }
}

class Enemy {
    constructor(name) {
        this.name = name;
        this.mhp = D(data.monsterStats[this.name].hp);
        this.hp = D(data.monsterStats[this.name].hp);
        this.dmg = D(data.monsterStats[this.name].dmg);

        game.currentEnemy = this.name;
    }

    hurt(dmg) {
        this.hp = this.hp.sub(dmg);
        if (this.hp.lte(0)) this.die();
    }

    die() {
        let g = data.monsterStats[this.name].gold;
        let gain = randBetween(g[0], g[1]);
        game.gold = game.gold.add(gain);
        game.logmsg(`You kill the ${game.currentEnemy.name} and it drops ${f(gain)} gold`);
        game.currentEnemy = null;
    }
}

function chooseWeighted(items) { // SO code
    let chances = items.map(e => e.weight);
    var sum = chances.reduce((acc, el) => acc + el, 0);
    var acc = 0;
    chances = chances.map(el => (acc = el + acc));
    var rand = Math.random() * sum;
    return items[chances.filter(el => el <= rand).length];
}

function randBetween(min, max) {
    return D(max).sub(min).mul(Math.random()).add(min).floor();
}

function beginsVowel(str) {
    return str.search(/[aeiou]/i) === 0;
}