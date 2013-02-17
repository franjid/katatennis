function Player(player) {
    var name = player.name,
        points = 0,
        games = 0;

    return {
        getName : function() {
            return name;
        },
        winPoint : function() {
            points++;
        },
        getPoints : function() {
            return points;
        },
        winGame : function() {
            games++;
        },
        getGames : function() {
            return games;
        },
        resetPoints : function() {
            points = 0;
        }
    };
}

module.exports = Player;