var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);


//oyuncuları tutacağımız dict
var players = {};
var playersIP = {};
//silahları tutacagımız dict
var weapons = {};
var weaponsIDcounter = 0;
//kutuları tutacagımız dict
var boxes = {};
var boxesIDcounter = 0;
//mermi cephanesini tut
var ammos = {};
var ammosIDcounter = 0;
//hp tut
var hps = {};
var hpsIDcounter = 0;
//ölüleri tut
var deadBodies = {};
var deadBodiesIDcounter = 0;
//zombies tut
var zombies = {};
var zombiesIDcounter = 0;

var deadZombieBodies = {};
var deadZombieBodiesIDcounter = 0;

var playerIDcounter = 0;

var randomBoxCoroutine;
var zombieCoroutine;
var randomZombieCoroutine;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(80, function () {

  console.log(`Listening on ${server.address().port}`);

  randomBoxCoroutine = setInterval(createBox, 10000);
  zombieCoroutine = setInterval(zombieUpdate, 1000);
  randomZombieCoroutine = setInterval(createZombie, 120000);//60000




  //weaponType = 0 silah yok demek
  //silah isOccupied yapıldıysa client görmesin
  weapons[weaponsIDcounter] = {
    silahID: weaponsIDcounter++,
    x: 50,
    y: 50,
    weaponType: 1, //bos
    isOccupied: false,
    ammo: 0,
  };

  weapons[weaponsIDcounter] = {
    silahID: weaponsIDcounter++,
    x: 300,
    y: 300,
    weaponType: 2, //pompali
    isOccupied: false,
    ammo: 100,
  };
  /*
    weapons[weaponsIDcounter] = {
      silahID: weaponsIDcounter++,
      x: 150,
      y: 50,
      weaponType: 2, //pompali
      isOccupied: false,
      ammo: 10,
    };
  
    //mermiler
    ammos[ammosIDcounter] = {
      ammoID: ammosIDcounter++,
      x: 150,
      y: 100,
      ammoType: 2, //pompali mermisi
      isOccupied: false,
      ammo: 10,
    };
  
    ammos[ammosIDcounter] = {
      ammoID: ammosIDcounter++,
      x: 200,
      y: 100,
      ammoType: 2, //pompali mermisi
      isOccupied: false,
      ammo: 10,
    };
  */
  //hp ler
  /*
  hps[hpsIDcounter] = {
    hpID: hpsIDcounter++,
    x: 300,
    y: 150,
    isOccupied: false,
    amount: 50,
  };
*/

  //kutular, rewardType: 0 = empty, 1: pompali, 2: ammo, 3: health
  /*
  for (var i = 0; i < 20; i++) {
    boxes[boxesIDcounter] = {
      boxID: boxesIDcounter++,
      x: i * 50,
      y: 500,
      rewardType: i % 4,
      isBroke: false,
    };
  }dddddd
*/
});

function zombieUpdate() {

  for (var i = 0; i < Object.keys(zombies).length; i++) {
    if (zombies[i] != undefined && zombies[i].isDead == false) {
      //her bir zombi için en yakın player ı bul
      var minDistance = 99999;
      var minDistanceIndex = -1;
      var ii = 0;
      var minDistancePlayer;
      Object.values(players).forEach(function (player) {
        if (zombies[i] != undefined && player != undefined && player.hp > 0 && player.afk == false) {
          var a = zombies[i].x - player.x;
          var b = zombies[i].y - player.y;
          var c = Math.sqrt(a * a + b * b);
          if (c < minDistance) {
            minDistance = c;
            minDistancePlayer = player;
          }
        }
        ii++;
      });

      //alt kısım sürekli çalışmalı fakat üst kısım 3 sn de bir çalışsa da olur

      //eğer minDistanceIndex -1 değilse en yakın oyuncu bulundu
      if (minDistancePlayer == undefined) { //takip edecek kimse yok oldugu yerde bekle

      } else { //takip edecek birisi var

        var xChanged = false;
        var yChanged = false;
        if (minDistancePlayer.x - zombies[i].x > 15) {//sağındaysa
          zombies[i].dir = true;
          zombies[i].x += 70 + Math.random() * 50;
          xChanged = true;
        } else if (minDistancePlayer.x - zombies[i].x < -15) {//solundaysa
          zombies[i].dir = false;
          zombies[i].x -= 70 + Math.random() * 50;
          xChanged = true;
        }
        if (minDistancePlayer.y - zombies[i].y < -15) {//üstündeyse
          zombies[i].y -= 70 + Math.random() * 50;
          yChanged = true;
        } else if (minDistancePlayer.y - zombies[i].y > 15) {//altındaysa
          zombies[i].y += 70 + Math.random() * 50;
          yChanged = true;
        }

        if (xChanged == false && yChanged == false) {
          //attack animation
        } else {
          io.emit('zombieMovementEvent', zombies[i]);
        }

      }
    }
  }
}

var gunCount = 0;
function createBox() {
  var cesetSayisi = 0;
  for (var i = 0; i < Object.keys(deadBodies).length; i++) {
    if (deadBodies[i] != undefined) { //saglam kutuları say
      cesetSayisi++;
    }
  }
  //fazla ceset olmasın
  if (cesetSayisi > 30) {
    deadBodies = {};
    deadBodiesIDcounter = 0;
  }

  cesetSayisi = 0;
  for (var i = 0; i < Object.keys(deadZombieBodies).length; i++) {
    if (deadZombieBodies[i] != undefined) { //saglam kutuları say
      cesetSayisi++;
    }
  }
  //fazla ceset olmasın
  if (cesetSayisi > 30) {
    deadZombieBodies = {};
    deadZombieBodiesIDcounter = 0;
  }

  var saglamKutu = 0;
  //kırılmamış kutuları say
  for (var i = 0; i < Object.keys(boxes).length; i++) {
    if (boxes[i] != undefined && boxes[i].isBroke == false) { //saglam kutuları say
      saglamKutu++;
    } else {
      //delete boxes[i]; //kırık kutuyu sil
    }
  }


  //fazla kutu olmasın
  if (saglamKutu > 20) {

    return;
  }

  var randomX = Math.random() * 4800;
  var randomY = Math.random() * 2700;

  //sınırlar içinde kalsın diye
  if (randomX < 200) {
    randomX += 200;
  }
  if (randomX > 4600) {
    randomX -= 200;
  }
  if (randomY < 200) {
    randomY += 200;
  }
  if (randomY > 2500) {
    randomY -= 200;
  }

  //çok fazla gun olmasın
  var randomSayi = Math.round(randomX % 3);
  if (randomSayi == 1) {
    if (gunCount >= 10) {
      randomSayi = 0;
    } else {
      gunCount++;
    }
  }


  boxes[boxesIDcounter] = {
    boxID: boxesIDcounter++,
    x: randomX,
    y: randomY,
    rewardType: randomSayi,
    isBroke: false,
  };

  io.emit('randomBoxEvent', boxes[boxesIDcounter - 1]);
}

var maxZombie = 20;
function createZombie() {
  var saglamZombie = 0;
  //kırılmamış kutuları say
  for (var i = 0; i < Object.keys(zombies).length; i++) {
    if (zombies[i] != undefined && zombies[i].isDead == false) { //saglam kutuları say
      saglamZombie++;
    }
  }

  for (var i = 0; i < maxZombie; i++) {
    //fazla zombie olmasın
    if (saglamZombie >= 3) {
      break;
    }

    var randomX = 0;
    var randomY = 0;

    //sadece kenarladan çıksın diye
    if (Math.random() > 0.5) {
      randomY = Math.random() * 2700;
    } else {
      randomX = Math.random() * 4800;
    }


    zombies[zombiesIDcounter] = {
      zombieID: zombiesIDcounter++,
      x: randomX,
      y: randomY,
      health: 100,
      dir: false,
      isDead: false,
    };

    io.emit('randomZombieEvent', zombies[zombiesIDcounter - 1]);
  }
}

io.on('connection', function (socket) {


  const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];

  if (players[socket.id] != undefined) {
    socket.disconnect();
    return;
  }

  Object.values(players).forEach(function (p) {
    if ((socket.id == p.id)) {
      socket.disconnect();
      return;
    }
  });


  playersIP[socket.id] = { pIP: ip };
  console.log(socket.id + ' connected');
  console.log(ip);


  var randomX = Math.random() * 4800;
  var randomY = Math.random() * 2700;

  //sınırlar içinde kalsın diye
  if (randomX < 200) {
    randomX += 200;
  }
  if (randomX > 4600) {
    randomX -= 200;
  }
  if (randomY < 200) {
    randomY += 200;
  }
  if (randomY > 2500) {
    randomY -= 200;
  }

  // create a new player and add it to our players object
  players[socket.id] = {
    x: randomX,
    y: randomY,
    playerId: socket.id,
    index: playerIDcounter++,
    dir: false,
    angle: 0,
    hp: 100,
    weaponID: 0,
    weaponType: 1, //elinde bıçak var
    level: 1,
    score: 0,
    username: "noname",
    afk: false
  };

  // send the players object to the new player
  //emit: sadece yeni gelen kişiye gönderir
  socket.emit('currentPlayers', players);
  socket.emit('zombies', zombies);
  socket.emit('weapons', weapons);
  socket.emit('boxes', boxes);
  socket.emit('ammos', ammos);
  socket.emit('hps', hps);
  socket.emit('deadBodies', deadBodies);
  socket.emit('deadZombieBodies', deadZombieBodies);

  // update all other players of the new player
  //broadcast.emit: yeni gelen hariç diğer herkese gönderilir
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('user ' + socket.id + ' disconnected');

    if (players[socket.id].username == "noname") {
      // remove this player from our players object
      delete players[socket.id];
      delete playersIP[socket.id];


      // emit a message to all players to remove this player
      //io emit diyince herkese mesaj gider

      io.emit('disconnected', socket.id);
      return;
    }

    //silahını bırak
    weapons[players[socket.id].weaponID].isOccupied = false;
    weapons[players[socket.id].weaponID].x = players[socket.id].x;
    weapons[players[socket.id].weaponID].y = players[socket.id].y;

    deadBodies[deadBodiesIDcounter] = {
      id: deadBodiesIDcounter++,
      x: players[socket.id].x,
      y: players[socket.id].y,
      dir: players[socket.id].dir
    }
    io.emit('playeDroppedWeapon', { info: players[socket.id], wID: players[socket.id].weaponID, wType: players[socket.id].weaponType, ammo: weapons[players[socket.id].weaponID].ammo });

    // remove this player from our players object
    delete players[socket.id];
    delete playersIP[socket.id];


    // emit a message to all players to remove this player
    //io emit diyince herkese mesaj gider

    io.emit('disconnected', socket.id);
  });


  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].afk = false;
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('playerUsername', function (username) {
    players[socket.id].username = username;
    io.emit('scoreUpdate', players);
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerUsernameEvent', players[socket.id]);
  });

  // when a player changes direction
  socket.on('playerDir', function (dir) {
    players[socket.id].dir = dir;
    socket.broadcast.emit('playerChangedDir', players[socket.id]);
  });

  // when a player changes weapon
  socket.on('playerChangedWeapon', function (wID) {
    players[socket.id].weaponType = wID;
    socket.broadcast.emit('playerChangedWeapon', players[socket.id]);
  });

  // when a player stopped moving (dir: durdugu yön)
  socket.on('playerStopped', function () {
    socket.broadcast.emit('playerStoppedDir', players[socket.id]);
  });

  // silah rotasyonunu gönder
  socket.on('playerWeaponRotation', function (angle) {
    players[socket.id].angle = angle;
    socket.broadcast.emit('playerReceiveWeaponRotation', players[socket.id]);
  });

  // biri ateş etti
  socket.on('playerShoot', function (shootInfo) {
    if (weapons[players[socket.id].weaponID].ammo > 0) { //kurşun varsa ateş et
      weapons[players[socket.id].weaponID].ammo--;
      socket.broadcast.emit('playerShootEvent', { owner: socket.id, info: shootInfo });
    }

  });

  // biri beni vurdu
  socket.on('playerDamaged', function (shooterid) {
    players[socket.id].hp -= 25;
    if (players[shooterid] != undefined) {
      players[shooterid].score += 50;
    }

    //karakter öldü
    if (players[socket.id].hp <= 0) {
      if (players[shooterid] != undefined) {
        players[shooterid].score += 200;
        if (players[socket.id] != undefined) {
          players[shooterid].score += players[socket.id].score;

          hps[hpsIDcounter] = {
            hpID: hpsIDcounter++,
            x: 300,
            y: 150,
            isOccupied: false,
            amount: 50,
          };
          players[shooterid].hp += 50;
          io.emit('playerGrabbedHp', { info: players[shooterid], hp: hps[hpsIDcounter - 1] });
        }

      }

      deadBodies[deadBodiesIDcounter] = {
        id: deadBodiesIDcounter++,
        x: players[socket.id].x,
        y: players[socket.id].y,
        dir: players[socket.id].dir
      }
      var username = "zombie";
      if (players[shooterid] != undefined) {
        username = players[shooterid].username;
      }
      var usernamekilled = "noname";
      if (players[socket.id] != undefined) {
        usernamekilled = players[socket.id].username;
      }
      io.emit('playerKilledBy', { shooter: username, killed: usernamekilled });
      io.emit('playerDied', players[socket.id]);

    }
    io.emit('scoreUpdate', players);
  });

  // biri zombi vurdu
  socket.on('zombieDamaged', function (info) {
    if (zombies[info.id] != undefined) {
      zombies[info.id].health -= 25;

      //zombie öldü
      if (zombies[info.id].isDead == false) {
        if (zombies[info.id].health <= 0) {
          zombies[info.id].isDead = true;
          if (players[info.shooter] != undefined) {
            players[info.shooter].score += 50;
          }
          //zombi için dead body yap
          /*
          deadBodies[deadBodiesIDcounter] = {
            id: deadBodiesIDcounter++,
            x: players[id].x,
            y: players[id].y,
            dir: players[id].dir
          }
          */
          deadZombieBodies[deadZombieBodiesIDcounter] = {
            id: deadZombieBodiesIDcounter++,
            x: zombies[info.id].x,
            y: zombies[info.id].y,
            dir: zombies[info.id].dir
          }
          io.emit('zombieDied', info.id);
        } else {
          if (players[info.shooter] != undefined) {
            players[info.shooter].score += 10;
          }
        }
      }


      io.emit('scoreUpdate', players);
    }
  });

  // biri silah almaya çalıştı
  socket.on('grabWeapon', function (weaponID) {
    if (weapons[weaponID] != undefined && weapons[weaponID].isOccupied == false) { //silah alınmadıysa al
      weapons[weaponID].isOccupied = true;
      players[socket.id].weaponID = weaponID;
      players[socket.id].weaponType = weapons[weaponID].weaponType;
      io.emit('playerGrabbedWeapon', players[socket.id]);
    }
  });

  // biri silah bıraktı
  socket.on('dropWeapon', function (weaponInfo) {
    if (weapons[weaponInfo.weaponID] != undefined && weapons[weaponInfo.weaponID].isOccupied == true) { //silah alındıysa bırak
      weapons[weaponInfo.weaponID].isOccupied = false;
      weapons[weaponInfo.weaponID].x = weaponInfo.x;
      weapons[weaponInfo.weaponID].y = weaponInfo.y;
      players[socket.id].weaponID = 0;
      players[socket.id].weaponType = 1;
      io.emit('playeDroppedWeapon', { info: players[socket.id], wID: weaponInfo.weaponID, wType: weapons[weaponInfo.weaponID].weaponType, ammo: weapons[weaponInfo.weaponID].ammo });
    }
  });

  // biri bıçak salladı
  socket.on('playerStab', function () {
    socket.broadcast.emit('playerStabEvent', socket.id); //bıcak sallayanın id sini gönder
  });

  // biri kutu kırdı
  socket.on('boxBroke', function (boxID) {
    var sentID = 0;//hediye esyanın id si
    if (boxes[boxID] != undefined) {
      boxes[boxID].isBroke = true;
    }

    if (boxes[boxID] != undefined && boxes[boxID].rewardType == 1) { //pompali
      sentID = weaponsIDcounter;

      weapons[weaponsIDcounter] = {
        silahID: weaponsIDcounter++,
        x: boxes[boxID].x,
        y: boxes[boxID].y,
        weaponType: 2, //pompali
        isOccupied: false,
        ammo: 10,
      };

    } else if (boxes[boxID] != undefined && boxes[boxID].rewardType == 2) { //ammo
      sentID = ammosIDcounter;

      ammos[ammosIDcounter] = {
        ammoID: ammosIDcounter++,
        x: boxes[boxID].x,
        y: boxes[boxID].y,
        ammoType: 2, //pompali mermisi
        isOccupied: false,
        ammo: 20,
      };

    } else if (boxes[boxID] != undefined && boxes[boxID].rewardType == 3) { //health
      sentID = hpsIDcounter;

      hps[hpsIDcounter] = {
        hpID: hpsIDcounter++,
        x: boxes[boxID].x,
        y: boxes[boxID].y,
        isOccupied: false,
        amount: 50,
      };

    }

    var rewID = Math.round(Math.random() * 3);
    if (boxes[boxID] != undefined) {
      rewID = boxes[boxID].rewardType;

    }
    io.emit('boxBrokeEvent', { id: boxID, reward: rewID, rewardID: sentID });
  });

  // biri ammo almaya çalıştı
  socket.on('grabAmmo', function (ammoID) {
    if (ammos[ammoID] != undefined && ammos[ammoID].isOccupied == false) { //ammo alınmadıysa al
      ammos[ammoID].isOccupied = true;
      weapons[players[socket.id].weaponID].ammo += ammos[ammoID].ammo;
      io.emit('playerGrabbedAmmo', { info: players[socket.id], ammo: ammos[ammoID] });
    }
  });

  // biri hp almaya çalıştı
  socket.on('grabHp', function (hpID) {
    if (hps[hpID] != undefined && hps[hpID].isOccupied == false) { //hp alınmadıysa al
      hps[hpID].isOccupied = true;
      players[socket.id].hp += hps[hpID].amount;
      if (players[socket.id].hp > players[socket.id].level * 100) {
        players[socket.id].hp = players[socket.id].level * 100;
      }
      io.emit('playerGrabbedHp', { info: players[socket.id], hp: hps[hpID] });
    }
  });

  // biri afk oldu
  socket.on('afk', function (userid) {
    if (players[userid] != undefined) {
      players[userid].afk = true;
      io.emit('afkEvent', socket.id);
    }
  });

  // biri not afk oldu
  socket.on('notafk', function (userid) {
    if (players[userid] != undefined) {
      players[userid].afk = false;
      io.emit('notafkEvent', socket.id);
    }
  });

  // biri mesaj gönderdi
  socket.on('chatmsg', function (msg) {
    if (msg != lastMsg && msg .length < 20) {
      socket.broadcast.emit('chatmsgEvent', msg);
      lastMsg = msg;
    }

  });
});

var lastMsg = "";