var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'ggj2014_catgame'
});

connection.connect();

/*connection.query('SELECT * FROM ggj2014_catgame.Player;', function(err, rows, fields) {
	if (err) throw err;

	console.log('The solution is: ' + rows[0].nickname);
});*/

exports.listAllScores = function(request, response) {
	connection.query('SELECT p.nickname, s.value as `time`, s.levelName FROM Score s, Player p WHERE s.player_id = p.id ORDER BY s.value LIMIT 0 , 10', function(err, rows, fields) {
		
		if (!err) {
			response.send(rows);
		} else {
			console.log(err);
			response.send({'error':'An error has occurred - ' + err});
		}

		//console.log('The solution is: ' + rows[0].nickname);
	});
};

exports.listScoreByLevel = function(request, response) {
	var levelName = connection.escape(request.params.level_name);
	connection.query('SELECT p.nickname, s.value as `time`, s.levelName FROM Score s, Player p WHERE s.player_id = p.id AND s.levelName = ' + levelName + ' ORDER BY s.value LIMIT 0 , 10', function(err, rows, fields) {
		
		if (!err) {
			response.send(rows);
		} else {
			console.log(err);
			response.send({'error':'An error has occurred - ' + err});
		}

		//console.log('The solution is: ' + rows[0].nickname);
	});	
}

exports.insertScore = function(request, response) {
	console.log(request.body);
	var nickname = request.body.nickname;
	var levelName = request.body.levelName;
	if (nickname !== null && nickname !== undefined && nickname !== '') {
		connection.query('SELECT p.id FROM Player p WHERE p.nickname = ' + connection.escape(nickname), function(err, rows, fields) {
			if (!err) {
				if (rows !== null) {
					if (typeof rows[0] !== 'undefined') {
						//response.send(rows[0]);

						connection.query('INSERT INTO Score (value, player_id, levelName) VALUES (' + connection.escape(request.body.value) + ', ' + rows[0].id + ', ' + connection.escape(levelName) + ')', function(err, result) {
							if (!err) {
								console.log(result.insertId);
								response.send({'success':'Score recorded'});
							} else {
								console.log(err);
								response.send({'error':'An error has occurred - ' + err});
							}
						});

					} else {
						connection.query('INSERT INTO Player (nickname) VALUES (' + connection.escape(nickname) + ')', function(err, result) {
							if (!err) {
								console.log(result.insertId);
								connection.query('INSERT INTO Score (value, player_id) VALUES (' + connection.escape(request.body.value) + ', ' + result.insertId + ')', function(err, result) {
									if (!err) {
										console.log(result.insertId);
										response.send({'success':'Score recorded'});
									} else {
										console.log(err);
										response.send({'error':'An error has occurred - ' + err});
									}
								});
							} else {
								console.log(err);
								response.send({'error':'An error has occurred - ' + err});
							}
						});
					}
				} else {
					
					connection.query('INSERT INTO Player (nickname) VALUES (' + connection.escape(nickname) + ')', function(err, result) {
						if (!err) {
							console.log(result.insertId);
							connection.query('INSERT INTO Score (value, player_id) VALUES (' + connection.escape(request.body.value) + ', ' + result.insertId + ')', function(err, result) {
								if (!err) {
									console.log(result.insertId);
									response.send({'success':'Score recorded'});
								} else {
									console.log(err);
									response.send({'error':'An error has occurred - ' + err});
								}
							});
						} else {
							console.log(err);
							response.send({'error':'An error has occurred - ' + err});
						}
					});

				}
			} else {
				console.log(err);
				response.send({'error':'An error has occurred - ' + err});
			}
		});
		
	} else {
		response.send({'error':'Invalid Nickname'});
	}
};

exports

//connection.end();