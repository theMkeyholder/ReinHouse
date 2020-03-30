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

    update() {
        if (game.upgradesBought[this.id]) $(this.id).style.display = 'none';
        else {
            if (!(this.id == 'keepUpg' && game.dreamLayer.lt(3))) {
                $(this.id).style.display = 'inline-block';
        
                $(this.id).style.borderColor = game.gold.gte(this.cost) ? 'green' : 'red';
                $(this.id).style.backgroundColor = game.gold.gte(this.cost) ? 'lime' : 'pink';
            }
        }
    }
}

class Item {
    constructor(id, name, cost, maxFloor = Infinity, nightmare = false) {
        this.id = id;
        this.name = name;
        this.cost = D(cost);
        this.maxFloor = D(maxFloor);
        this.nightmare = nightmare;
    }

    buy() {
        if (game[this.nightmare ? 'nightmareFuel' : 'gold'].gte(this.cost)) {
            game[this.nightmare ? 'nightmareFuel' : 'gold'] = game[this.nightmare ? 'nightmareFuel' : 'gold'].sub(this.cost);
            this.effect();
        }
    }

    update() {
        if (game.floor.gt(this.maxFloor)) $(this.id).style.display = 'none';
        else $(this.id).style.display = 'inline-block';
        $(this.id).style.borderColor = game[this.nightmare ? 'nightmareFuel' : 'gold'].gte(this.cost) ? 'green' : 'red';
        $(this.id).style.backgroundColor = game[this.nightmare ? 'nightmareFuel' : 'gold'].gte(this.cost) ? 'lime' : 'pink';
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
            case 'small luck potion':
                game.lck = game.lck.add(2);
                break;
            case 'medium luck potion':
                game.lck = game.lck.mul(2);
                break;
            case 'large luck potion':
                game.lck = game.lck.pow(2);
                break;
            case 'super luck potion':
                game.lck = game.lck.tetr(2);
                break;
            case 'dark health potion':
                game.hp = game.hp.add(game.dmg);
                break;
            case 'dark strength potion':
                game.dmg = game.dmg.add(game.lck);
                break;
            case 'dark luck potion':
                game.lck = game.lck.add(game.hp.log10());
                break;
        }
    }
}