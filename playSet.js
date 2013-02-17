var player = require('./lib/player'),
    tennis = require('./lib/tennis');

var player1 = player({name: 'Nadal'});
var player2 = player({name: 'Federer'});
var tennis = tennis(player1, player2);

tennis.playSet();