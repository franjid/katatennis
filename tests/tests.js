var assert = require('assert'),
    player = require('../lib/player'),
    tennis = require('../lib/tennis');

describe('There should be players with a name and some functions to win points and get them', function() {
    it('should create a player and get its name', function() {
        var player1 = player({name: 'Nadal'});
        assert.equal('Nadal', player1.getName());
    });

    it('should make a player win a point and get total points', function() {
        var player1 = player({name: 'Nadal'});

        player1.winPoint();
        assert.equal(1, player1.getPoints());
    });

    it('should make a player win a game and get total games', function() {
        var player1 = player({name: 'Nadal'});

        player1.winGame();
        player1.winGame();
        assert.equal(2, player1.getGames());
    });

    it('should be able to reset points', function() {
        var player1 = player({name: 'Nadal'});

        player1.winPoint();
        player1.resetPoints();
        assert.equal(0, player1.getPoints());
    });  
});

describe('Get points in tennis format', function() {
    it('should return the correct format from a tennis game', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        assert.deepEqual([0,0], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual([15,0], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual([30,0], tennisMatch.getGameScore());
        player2.winPoint();
        assert.deepEqual([30,15], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual([40,15], tennisMatch.getGameScore());
    });
});

describe('Deuce and advantage cases', function() {
    it('should handle special cases', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        player1.winPoint();
        player1.winPoint();
        player1.winPoint();
        player2.winPoint();
        player2.winPoint();
        assert.deepEqual([40,30], tennisMatch.getGameScore());
        player2.winPoint();
        assert.deepEqual(['deuce','deuce'], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual(['advantage',40], tennisMatch.getGameScore());
        player2.winPoint();
        assert.deepEqual(['deuce','deuce'], tennisMatch.getGameScore());
        player2.winPoint();
        assert.deepEqual([40,'advantage'], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual(['deuce','deuce'], tennisMatch.getGameScore());
        player1.winPoint();
        assert.deepEqual(['advantage',40], tennisMatch.getGameScore());
    });
});

describe('One game must have a winner', function() {
    it('should know when some player has won a normal game', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint();
        player1.winPoint();
        player1.winPoint(); // 40,0
        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint();
        assert.equal(true, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
    });

    it('should know when some player has won a game after deuce and some advantages', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint();
        player1.winPoint();
        player1.winPoint(); // 40,0
        player2.winPoint();
        player2.winPoint();
        player2.winPoint(); // deuce
        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player2.winPoint(); // player2 advantage
        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint(); // deuce
        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint(); // advantage
        assert.equal(false, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        player1.winPoint(); // player1 wins the game
        assert.equal(true, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
    });

    it('should know which player has won a game', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        player1.winPoint();
        player1.winPoint();
        player1.winPoint(); // 40,0
        player1.winPoint();
        assert.equal(true, tennisMatch.weHaveGameWinner(player1.getPoints(), player2.getPoints()));
        assert.deepEqual(player1, tennisMatch.getGameWinner(player1, player2));
    });
});

describe('One set must have a winner', function() {
    it('should know when some player has won a normal set', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame();
        player1.winGame();
        player1.winGame(); // 3,0
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame();
        player1.winGame(); // 5,0
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player2.winGame(); // 5,1
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame(); // 6,1
        assert.equal(true, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
    });

    it('should know when some player has won a set after reaching 6,6', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        for (var i = 0; i < 7; i++) {
            player1.winGame();
            player2.winGame();
        } // 6,6
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame(); // 7,6
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player2.winGame(); // 7,7
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame(); // 8,7
        assert.equal(false, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        player1.winGame(); // 9,7
        assert.equal(true, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
    });

    it('should know which player has won a set', function() {
        var player1 = player({name: 'Nadal'}),
            player2 = player({name: 'Federer'}),
            tennisMatch = tennis(player1, player2);

        for (var i = 0; i < 7; i++) {
            player2.winGame();
        } // 0,6
        assert.equal(true, tennisMatch.weHaveSetWinner(player1.getGames(), player2.getGames()));
        assert.deepEqual(player2, tennisMatch.getSetWinner(player1, player2));
    });
});