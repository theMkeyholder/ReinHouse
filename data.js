let data = {
    rooms: [
        { name: "empty room", weight: 100 },
        { name: "monster room", weight: 50 },
        { name: "money room", weight: 10 }
    ],
    monsters: [
        { name: "blob", weight: 100 },
        { name: "skeleton", weight: 10 }
    ],
    moneyTreasures: [
        { name: "coin", weight: 20, gold: [1, 1] },
        { name: "pile of coins", weight: 40, gold: [5, 10] },
        { name: "piggy bank", weight: 15, gold: [5, 50] },
        { name: "safe", weight: 5, gold: [0, 100] },
        { name: "treasure chest", weight: 1, gold: [100, 500] },
        { name: "dragon's hoard", weight: 0.1, gold: [5000, 10000] }
    ],
    monsterStats: {
        blob: { hp: 10, dmg: 1, gold: [5, 15] },
        skeleton: { hp: 40, dmg: 5, gold: [60,80] }
    }
}