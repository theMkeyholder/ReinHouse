class Game {
    constructor(d = {}) {
        this.room = D(d.room || 0);
        this.floor = D(d.floor || 0);
        this.dreamLayer = O(d.dreamLayer || 0);

        this.gold = D(d.gold || 0);

        this.currentRoomType = d.currentRoomType || "empty room";
        this.currentEnemy = !d.currentEnemy ? null : new Enemy(d.currentEnemy);

        this.hp = D(d.hp || 100);
        this.dmg = D(d.dmg || 5);
        this.lck = D(d.lck || 1);

        this.justDied = false;

        this.isInStairwell = false;

        this.upgradesBought = d.upgradesBought || {
            'autoProgress': false
        }
    }

    update() {
        $('deets').innerText = `
        You are currently in room ${f(game.room)} of floor ${f(game.floor)} which is a${beginsVowel(game.currentRoomType) ? 'n' : ''} ${game.currentRoomType}
        You have ${f(game.gold)} gold
        You have ${f(game.hp)} hp
        `
        if (game.currentEnemy instanceof Enemy) {
            $('nr').disabled = 'disabled';
            $('fight').innerHTML = `
            You are fighting a${beginsVowel(game.currentEnemy.name) ? 'n' : ''} ${game.currentEnemy.name} which has ${f(game.currentEnemy.hp)} health<br>
            `
            $('attack').style.display = 'inline-block';
            if (game.upgradesBought.autoKill) game.attack();
        } else {
            $('fight').innerText = '';
            $('attack').style.display = 'none';
            if (game.isInStairwell) {
                $('nr').disabled = 'disabled';
            } else {
                $('nr').disabled = '';
                if (game.upgradesBought.autoProgress) game.nextRoom();
            }
        }
        if (game.isInStairwell) {
            $('stairs').innerText = 'Do you want to climb to the next floor of Reinhardt\'s House?? Enemies will be much stronger but killing them will be even more rewarding!';
            $('climb').style.display = 'inline-block';
            $('noclimb').style.display = 'inline-block';
        } else {
            $('stairs').innerText = '';
            $('climb').style.display = 'none';
            $('noclimb').style.display = 'none';
        }
        if ($('msglog').innerHTML.length > 1500) $('msglog').innerHTML = $('msglog').innerHTML.substring(0, 1500);
        save();
    }

    attack() {
        if (this.currentEnemy != null) {
            this.hurt(this.currentEnemy.dmg);
            if (!this.justDied) this.currentEnemy.hurt(this.dmg);
            this.justDied = false;
        }
    }

    hurt(dmg) {
        this.hp = this.hp.sub(dmg);
        if (this.hp.lte(0)) this.die();
    }

    die() {
        this.hp = D(100);
        this.room = D(0);
        this.floor = D(0);
        this.gold = D(0);
        this.justDied = true;
        this.currentEnemy = null;
        this.currentRoomType = 'empty room';
        this.logmsg(`You died and lost your gold! You are back at the entrance but you'll keep your upgrades, damage and luck!!`, 'darkred');
    }

    nextRoom() {
        this.room = this.room.add(1);
        this.currentRoomType = chooseWeighted(data.rooms).name;
        switch (this.currentRoomType) {
            case "empty room":
                break;
            case "monster room":
                this.currentEnemy = new Enemy(this.chooseMonster());
                this.logmsg(`A wild ${this.currentEnemy.name} appears!!!`);
                break;
            case "money room":
                let reward = chooseWeighted(data.moneyTreasures);
                let gain = randBetween(reward.gold[0], reward.gold[1]).mul(game.lck);
                game.gold = game.gold.add(gain);
                this.logmsg(`You found a${beginsVowel(reward.name) ? 'n' : ''} ${reward.name} worth ${f(gain)} gold!`, 'gold');
                break;
            case "potion lab":
                let potion = chooseWeighted(data.potions);
                switch (potion.type) {
                    case "heal":
                        game.hp = game.hp.add(D(potion.potency).pow(game.floor.add(1)));
                        this.logmsg(`You found a${beginsVowel(potion.name) ? 'n' : ''} ${potion.name} that healed you for ${potion.potency} hp!!`, 'blue');
                        break;
                }
                break;
            case "stairwell":
                if (this.room.lt(100)) {
                    this.room = this.room.sub(1);
                    this.nextRoom();
                } else {
                    this.isInStairwell = true;
                    this.logmsg(`You found tall staircase! Do you want to climb up to the next floor of Reinhardt's House?`, 'lime');
                }
                break;
        }
    }

    climb(bool) {
        game.isInStairwell = false;
        if (bool) {
            game.floor = game.floor.add(1);
            game.room = D(0);
            game.logmsg(`You are now on floor ${f(game.floor)}!`, 'hotpink');
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
            this.hp = D(data.monsterStats[this.name].hp).pow(game.floor.add(1));
            this.dmg = D(data.monsterStats[this.name].dmg).pow(game.floor.add(1));
        } else {
            this.name = name.name;
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
        game.gold = game.gold.add(gain.pow(game.floor.mul(2).add(1)));
        game.logmsg(`You kill the ${game.currentEnemy.name} and it drops ${f(gain)} gold`, 'red');
        game.currentEnemy = null;
    }
}

function chooseWeighted(items) { // StackOverflow code
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