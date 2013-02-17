function Tennis(player1, player2) {
    var player1 = player1,
        player2 = player2,
        gamePlaying = 1;

    return {
        playSet : function() {
            var player1Games = player1.getGames(),
                player2Games = player2.getGames();

            do {
                this.playGame();
                player1Games = player1.getGames();
                player2Games = player2.getGames();
                console.log('\t', this.getSetScore());
            } while (!this.weHaveSetWinner(player1Games, player2Games));

            console.log('\nAnd the winner is... ' + this.getSetWinner(player1, player2).getName());
        },
        playGame : function() {
            var player1Points = player1.getPoints(),
                player2Points = player2.getPoints(),
                weHaveGameWinner = false,
                winnerPlayer = null;

            do {
                this.playPoint();
                player1Points = player1.getPoints();
                player2Points = player2.getPoints();
                weHaveGameWinner = this.weHaveGameWinner(player1Points, player2Points);
                if (!weHaveGameWinner) {
                    console.log('\t', this.getGameScore());
                }
            } while (!weHaveGameWinner);

            winnerPlayer = this.getGameWinner(player1, player2);
            winnerPlayer.winGame();
            console.log('.Game won by: ' + winnerPlayer.getName());

            player1.resetPoints();
            player2.resetPoints();
            gamePlaying++;
        },
        playPoint : function() {
            var pointWonByPlayer1 = Math.floor((Math.random() * 2) + 1 );

            if (pointWonByPlayer1 == 1) {
                player1.winPoint();
                console.log('+Point won by: ' + player1.getName());
            } else {
                player2.winPoint();
                console.log('+Point won by: ' + player2.getName());
            }
        },
        weHaveGameWinner : function(player1Points, player2Points) {
            return (player1Points > 3 || player2Points > 3) 
                    && (Math.abs(player1Points - player2Points) >= 2);
        },
        getGameWinner : function(player1, player2) {
            return player1.getPoints() > player2.getPoints() ? player1 : player2;
        },
        weHaveSetWinner : function (player1Games, player2Games) {
            return (player1Games > 5 || player2Games > 5) 
                    && (Math.abs(player1Games - player2Games) >= 2);
        },
        getSetWinner : function(player1, player2) {
            return player1.getGames() > player2.getGames() ? player1 : player2;
        },
        getGameScore : function() {
            var points = {
                    0: 0,
                    1: 15,
                    2: 30,
                    3: 40
                },
                player1Points = player1.getPoints(),
                player2Points = player2.getPoints(),
                player1PointsFormatted,
                player2PointsFormatted;

            if (player1Points <= 3) {
                player1PointsFormatted = points[player1Points];
            } else {
                if (player1Points > player2Points) {
                    player1PointsFormatted = 'advantage';
                } else {
                    player1PointsFormatted = player1Points == player2Points ? 'deuce' : 40;
                }
            }

            if (player2Points <= 3) {
                player2PointsFormatted = points[player2Points];
            } else {
                if (player2Points > player1Points) {
                    player2PointsFormatted = 'advantage';
                } else {
                    player2PointsFormatted = player2Points == player1Points ? 'deuce' : 40;
                }
            }

            if (player1Points == player2Points && player1Points == 3) {
                player1PointsFormatted = player2PointsFormatted = 'deuce';
            }

            return [player1PointsFormatted, player2PointsFormatted];
        },
        getSetScore : function() {
            var player1Games = player1.getGames(),
                player2Games = player2.getGames();

            return [player1Games, player2Games];
        }
    };
}

module.exports = Tennis;