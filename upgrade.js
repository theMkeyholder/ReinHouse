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