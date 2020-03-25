class Game {
    constructor(d = {}) {
        this.room = D(d.room || 0);
        this.floor = D(d.floor || 0);
        this.dreamLayer = O(d.dreamLayer || 0);

        this.gold = D(d.gold || 0);

        this.currentRoomType = d.currentRoomType || "empty room";
        this.currentEnemy = !d.currentEnemy ? null : new Enemy(d.currentEnemy);

        this.mhp = D(d.mhp || 100);
        this.hp = D(d.hp || 100);
        this.dmg = D(d.dmg || 5);

        this.justDied = false;

        this.upgradesBought = d.upgradesBought || {
            'autoProgress': false
        }
    }

    update() {
        $('deets').innerText = `
        You are currently in room ${f(game.room)} of floor ${f(game.floor)}
        You have ${f(game.gold)} gold
        You have ${f(game.hp)} hp
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
            if (game.upgradesBought.autoProgress) game.nextRoom();
        }
        save();
    }

    attack() {
        this.hurt(this.currentEnemy.dmg);
        if (!this.justDied) this.currentEnemy.hurt(this.dmg);
        this.justDied = false;
    }

    hurt(dmg) {
        this.hp = this.hp.sub(dmg);
        if (this.hp.lte(0)) this.die();
    }

    die() {
        this.hp = D(this.mhp);
        this.room = D(0);
        this.gold = D(0);
        this.justDied = true;
        this.currentEnemy = null;
        this.currentRoomType = 'empty room';
        this.logmsg(`You died and lost your gold! You are going back to the entrance but you'll keep your upgrades!!`);
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
                break;
            case "money room":
                let reward = chooseWeighted(data.moneyTreasures);
                let gain = randBetween(reward.gold[0], reward.gold[1]);
                game.gold = game.gold.add(gain);
                this.logmsg(`You found a${beginsVowel(reward.name) ? 'n' : ''} ${reward.name} worth ${f(gain)} gold!`, 'gold');
        }
    }

    chooseMonster() {
        return chooseWeighted(data.monsters).name;
    }

    logmsg(msg, color = 'black') {
        $('msglog').innerHTML = `<span style="color:${color}">${msg}</span><br><br>${$('msglog').innerHTML}`;
    }
}

class Enemy {
    constructor(name) {
        if (typeof name == 'string') {
            this.name = name;
            this.mhp = D(data.monsterStats[this.name].hp);
            this.hp = D(data.monsterStats[this.name].hp);
            this.dmg = D(data.monsterStats[this.name].dmg);
        } else {
            this.name = name.name;
            this.mhp = D(name.mhp);
            this.hp = D(name.hp);
            this.dmg = D(name.dmg);
        }
    }

    hurt(dmg) {
        this.hp = this.hp.sub(dmg);
        if (this.hp.lte(0)) this.die();
    }

    die() {
        let g = data.monsterStats[this.name].gold;
        let gain = randBetween(g[0], g[1]);
        game.gold = game.gold.add(gain);
        game.logmsg(`You kill the ${game.currentEnemy.name} and it drops ${f(gain)} gold`, 'red');
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