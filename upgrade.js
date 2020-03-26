class Upgrade {
    constructor(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = D(cost);
    }

    buy() {
        if (!game.upgradesBought[this.id] && game.gold.gte(this.cost)) {
            game.gold = game.gold.sub(this.cost);
            game.upgradesBought[this.id] = true;
        }
    }
}

class Item {
    constructor(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = D(cost);
    }

    buy() {
        if (game.gold.gte(this.cost)) {
            game.gold = game.gold.sub(this.cost);
            this.effect();
        }
    }

    effect() {
        switch(this.name) {
            case 'small health potion':
                game.hp = game.hp.add(D(10).pow(game.floor.add(1)));
                break;
            case 'medium health potion':
                game.hp = game.hp.add(D(60).pow(game.floor.add(1)));
                break;
            case 'large health potion':
                game.hp = game.hp.add(D(300).pow(game.floor.add(1)));
                break;
            case 'super health potion':
                game.hp = game.hp.add(D(1000).pow(game.floor.add(1)));
                break;
            case 'small strength potion':
                game.dmg = game.dmg.add(5);
                break;
            case 'medium strength potion':
                game.dmg = game.dmg.mul(2);
                break;
            case 'large strength potion':
                game.dmg = game.dmg.pow(2);
                break;
            case 'super strength potion':
                game.dmg = game.dmg.tetr(2);
                break;
        }
    }
}