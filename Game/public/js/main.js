
/** @type {import("../../typings/phaser")} */

var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {
            Phaser.Scene.call(this, { key: 'MenuScene' });
        },

    preload: function () {
        this.load.image('ground', '../assets/ground.png');
        this.load.html('nameform', '../nameform.html');
        this.load.audio('menumusic', 'assets/sounds/menumusic.mp3');
    },

    init: function (data) {
        if (data == true) {
            location.reload();
            data = false;
        }

    },

    create: function () {

        if (GameScene != undefined && GameScene.gamemusic != undefined) {
            GameScene.gamemusic.stop();

        }

        this.add.sprite(0, 0, 'ground').setScale(2);

        this.menumusic = this.sound.add('menumusic');
        MenuScene.menumusic = this.menumusic;
        this.menumusic.setLoop(true);
        this.menumusic.volume = 0.2;
        this.menumusic.play();

        this.loginUI = this.add.dom(this.scale.width / 2, this.scale.height).createFromCache('nameform');
        MenuScene.loginUI = this.loginUI;
        this.loginUI.addListener('click');
        var that = this;

        this.loginUI.on('click', function (event) {
            if (event.target.name === 'playButton') {
                var inputText = this.getChildByName('nameField');

                //  Have they entered anything?
                if (inputText.value !== '') {
                    //  Turn off the click events
                    this.removeListener('click');

                    //  Hide the login element
                    this.setVisible(false);
                    that.scene.start('GameScene', { username: inputText.value });
                    //  Populate the text with whatever they typed in
                    //console.log('Welcome ' + inputText.value);

                }

            }

        });

        this.tweens.add({
            targets: this.loginUI,
            y: this.scale.height / 2,
            duration: 1000,
            ease: 'Power3'
        });
    }

});

var pCount = 0;
var menumusic;
var gamemusic;

var walkSpeed;
var runSpeed;

var healthBar;

var score0;
var score1;
var score2;
var score3;
var score4;

var username;
var loginUI;
var lastTimeDamaged;
var zombies;
var ots;
var platforms;
var bloods;
var bulletFires;
var weapons;
var boxes;
var ammos;
var hps;
var health;
var level;
var bulletsGroup;
var input;
var playerBullets;
var enemyBullets;
var time = 0;
var lastFired = 0;
var lastWeaponRotation;

var stopDirSent = false;
var isMovingX = false;
var isMovingY = false;
var dir = false;
var bullets;
var physics;

var hpText;
var ammoText;

var playerContainer;
var crosshairX;
var crosshairY;
var canShoot;

var isTouchingShotgun;
var touchingShotgun; //temas ettiğimiz shotgun
var isTouchingShotgunEnumerator;

var isTouchingAmmo;
var touchingAmmo; //temas ettiğimiz ammo
var isTouchingAmmoEnumerator;

var isTouchingHp;
var touchingHp; //temas ettiğimiz hp
var isTouchingHpEnumerator;

// Shortcuts
const Rectangle = Phaser.Geom.Rectangle;
const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
const GetRectangleIntersection = Phaser.Geom.Intersects.GetRectangleIntersection;
const GetBounds = Phaser.Display.Bounds.GetBounds;

// For recycling
const rect1 = new Rectangle();
const rect2 = new Rectangle();
const overlap = new Rectangle();

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, { key: 'GameScene' });
        },

    preload: function () {

        var loadingText = this.add.text(this.scale.width / 2 - 128, this.scale.height / 2 - 32, 'Loading', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        this.load.on('progress', function (value) {
            try {
                loadingText.setText("Loading " + Math.round(value * 100) + "%");
            } catch (error) {

            }

        });

        this.load.on('fileprogress', function (file) {
        });

        this.load.on('complete', function () {
            loadingText.destroy();
        });

        this.load.image('ground', '../assets/ground.png');
        this.load.image('blockX', '../assets/vertical_block.png');
        this.load.image('blockY', '../assets/horizontal_block.png');
        this.load.spritesheet('police',
            '../assets/skins/nude_ss-scaled.png',
            { frameWidth: 400, frameHeight: 400 }
        );
        this.load.image('shotgun', '../assets/weapons/shotgun-scaled.png');
        this.load.image('shotgun_collectable', '../assets/weapons/shotgun-scaled-nohand.png');
        this.load.image('knife', '../assets/weapons/dagger-export.png');
        this.load.image('bullet', '../assets/bullet.png');
        this.load.image('bullet_fire', '../assets/fire_bullet.png');
        this.load.image('blood', '../assets/blood-export.png');
        this.load.image('box', '../assets/kutu-export.png');
        this.load.image('ammo', '../assets/shotgun_ammo_pack-export.png');
        this.load.image('hp', '../assets/hp-export.png');
        this.load.spritesheet('ground-out',
            '../assets/ground-out-ss.png',
            { frameWidth: 960, frameHeight: 540 }
        );
        this.load.image('ot-1', '../assets/ot-1.png');
        this.load.image('ot-2', '../assets/ot-2.png');
        this.load.image('ot-3', '../assets/ot-3.png');

        this.load.image('rock-1', '../assets/rock-1.png');
        this.load.image('rock-2', '../assets/rock-2.png');
        this.load.image('rock-3', '../assets/rock-3.png');
        this.load.image('rock-4', '../assets/rock-4.png');
        this.load.spritesheet('zombie',
            '../assets/zombie/zombie.png',
            { frameWidth: 200, frameHeight: 200 }
        );
        this.load.image('heart', '../assets/heart-export.png');

        this.load.audio('gamemusic', 'assets/sounds/gamemusic.mp3');

        this.load.image('uzi', '../assets/weapons/uzi-scaled.png');
        this.load.image('uzi_collectable', '../assets/weapons/uzi-scaled-nohand.png');

        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        this.load.image('hand', '../assets/hand.png');
        this.load.image('trash', '../assets/trash.png');
        this.load.image('refresh', '../assets/refresh.png');

        this.load.html('chatform', '../chatform.html');

        this.load.image('chatui', '../assets/chatui.png');
    },

    init: function (data) {
        if (data != undefined)
            this.username = data.username;
    },

    create: function () {
        input = this.input;
        this.lastWeaponRotation = 0;
        this.health = 100;
        this.level = 1;
        this.lastTimeDamaged = 0;
        this.walkSpeed = 160;
        this.runSpeed = 200;


        if (MenuScene != undefined) {
            MenuScene.menumusic.stop();
        } else {
        }

        this.joySticks = [
            this.CreateJoyStick(this, this.scale.width / 6, this.scale.height - (this.scale.height / 4)),
            this.CreateJoyStick(this, this.scale.width - (this.scale.width / 6), this.scale.height - (this.scale.height / 4)),
        ];

        this.gamemusic = this.sound.add('gamemusic');
        GameScene.gamemusic = this.gamemusic;
        this.gamemusic.setLoop(true);
        this.gamemusic.volume = 0.2;
        this.gamemusic.play();

        //bağlan
        var self = this;
        this.socket = io();
        this.pCount = 0;
        this.otherPlayersDead = this.physics.add.group(); //kendimiz hariç diğer oyuncular
        this.otherPlayers = this.physics.add.group(); //kendimiz hariç diğer oyuncular

        // OYUNU YAYINLAMADAN ÖNCE AÇ!!!!!!!!!!!!

        this.game.events.addListener(Phaser.Core.Events.BLUR, function () {
            if (self.playerContainer != undefined && self.playerContainer.list[0] != undefined) {
                self.playerContainer.list[0].that.socket.emit('afk', self.playerContainer.list[0].playerId);
                self.playerContainer.list[0].afk = true;
                self.playerContainer.setActive(false).setVisible(false);
                self.gamepaused.setText('Game Paused, Click To Continue..');
                self.playerContainer.body.setSize(0, 0);
                self.playerContainer.body.enable = false;
            }

        }, this);

        this.game.events.addListener(Phaser.Core.Events.FOCUS, function () {
            self.playerContainer.list[0].afk = false;
            self.playerContainer.setActive(true).setVisible(true);
            self.playerContainer.list[0].that.socket.emit('notafk', self.playerContainer.list[0].playerId);
            self.gamepaused.setText('');
            self.playerContainer.body.setSize(32, 40);
            self.playerContainer.body.enable = true;

        }, this);

        this.socket.on('playerKilledBy', function (usernames) {
            lastUserMessage = usernames.shooter + " killed " + usernames.killed;
            //adds the value of the chatbox to the array messages
            messages.push(lastUserMessage);
            //outputs the last few array elements of messages to html
            for (var i = 1; i < 6; i++) {
                if (messages[messages.length - i])
                    document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
            }
        });



        this.socket.on('afkEvent', function (userid) {
            self.otherPlayers.getChildren().forEach(function (otherplayer) {
                if (otherplayer.list[0].playerId == userid) {
                    otherplayer.list[0].afk = true;
                    otherplayer.setActive(false).setVisible(false);
                    otherplayer.body.setSize(0, 0);
                    otherplayer.body.enable = false;
                }
            });
        });

        this.socket.on('notafkEvent', function (userid) {
            self.otherPlayers.getChildren().forEach(function (otherplayer) {
                if (otherplayer.list[0].playerId == userid) {
                    otherplayer.list[0].afk = false;
                    otherplayer.setActive(true).setVisible(true);
                    otherplayer.body.setSize(32, 40);
                    otherplayer.body.enable = true;
                }
            });
        });


        this.socket.on('chatmsgEvent', function (msg) {
            lastUserMessage = msg;
            //adds the value of the chatbox to the array messages
            messages.push(lastUserMessage);
            //outputs the last few array elements of messages to html
            for (var i = 1; i < 6; i++) {
                if (messages[messages.length - i])
                    document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
            }

            self.tweens.add({
                targets: self.chatUI,
                duration: 500,
                scaleX: 0.05,
                scaleY: 0.05,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'

            });
        });

        this.socket.on('currentPlayers', function (players) {
            self.playercount = Object.keys(players).length;
            upper.setText('SCORE (' + self.playercount + ' Online)');
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId == self.socket.id) {
                    self.addPlayer(self, players[id]);
                } else {
                    self.addOtherPlayers(self, players[id]);
                }
            });
        });

        this.socket.on('scoreUpdate', function (players) {
            var maxSkor = -1;
            var target;
            Object.values(players).forEach(function (player) {
                if (player != undefined && player.score > maxSkor) {
                    maxSkor = player.score;
                    target = player;
                }

                if (self.playerContainer.list[0].playerId == player.playerId) {
                    self.playerContainer.list[3].setText(self.playerContainer.list[0].username + " | " + player.score);
                } else {
                    self.otherPlayers.getChildren().forEach(function (otherplayer) {
                        if (player != undefined && otherplayer != undefined && otherplayer.list[0].playerId == player.playerId) {
                            otherplayer.list[3].setText(player.username + " | " + player.score);
                        }
                    });
                }
            });



            if (target != undefined) {
                self.score0.setText(" 1) " + target.username + " | " + target.score);
                delete players[target.playerId];

                maxSkor = -1;
                target = undefined;
                Object.values(players).forEach(function (player) {
                    if (player != undefined && player.score > maxSkor) {
                        maxSkor = player.score;
                        target = player;
                    }
                });

                if (target != undefined) {
                    self.score1.setText(" 2) " + target.username + " | " + target.score);
                    delete players[target.playerId];

                    maxSkor = -1;
                    target = undefined;
                    Object.values(players).forEach(function (player) {
                        if (player != undefined && player.score > maxSkor) {
                            maxSkor = player.score;
                            target = player;
                        }
                    });

                    if (target != undefined) {
                        self.score2.setText(" 3) " + target.username + " | " + target.score);
                        delete players[target.playerId];

                        maxSkor = -1;
                        target = undefined;
                        Object.values(players).forEach(function (player) {
                            if (player != undefined && player.score > maxSkor) {
                                maxSkor = player.score;
                                target = player;
                            }
                        });

                        if (target != undefined) {
                            self.score3.setText(" 4) " + target.username + " | " + target.score);
                            delete players[target.playerId];

                            maxSkor = -1;
                            target = undefined;
                            Object.values(players).forEach(function (player) {
                                if (player != undefined && player.score > maxSkor) {
                                    maxSkor = player.score;
                                    target = player;
                                }
                            });

                            if (target != undefined) {
                                self.score4.setText(" 5) " + target.username + " | " + target.score);
                                delete players[target.playerId];

                                maxSkor = -1;
                                target = undefined;
                                Object.values(players).forEach(function (player) {
                                    if (player != undefined && player.score > maxSkor) {
                                        maxSkor = player.score;
                                        target = player;
                                    }
                                });
                            }
                        }
                    }
                }
            }



        });

        this.socket.on('zombies', function (zombies) {
            Object.keys(zombies).forEach(function (id) {
                if (zombies[id].isDead == false) {
                    var zombie = self.zombies.create(zombies[id].x, zombies[id].y, 'zombie').setScale(0.6);
                    zombie.that = self;
                    zombie.health = zombies[id].health;
                    zombie.zombieID = zombies[id].zombieID;
                    zombie.depth = zombie.y + 20;
                    zombie.body.offset.x = -zombie.body.width / 4;
                    zombie.body.offset.y = -zombie.body.height / 4;
                    zombie.body.setSize(30, 60);
                    zombie.anims.play('stop_left-zombie', true);
                }
            });
        });

        this.socket.on('weapons', function (weapons) {
            Object.keys(weapons).forEach(function (id) {
                if (weapons[id].weaponType == 2) { //shotgun
                    var silah = self.weapons.create(weapons[id].x, weapons[id].y, 'shotgun_collectable').setScale(0.5);
                    silah.ammo = weapons[id].ammo;
                    silah.depth = 10;
                    silah.weaponID = weapons[id].silahID;
                    if (weapons[id].isOccupied == true) {
                        silah.setActive(false).setVisible(false);
                    }
                }
            });
        });

        this.socket.on('boxes', function (boxes) {
            Object.keys(boxes).forEach(function (id) {
                if (boxes[id].isBroke == false) { //shotgun
                    var box = self.boxes.create(boxes[id].x, boxes[id].y, 'box').setScale(0.5).setOrigin(0.5, 0.5);
                    box.body.offset.x = -box.body.width / 4;
                    box.body.offset.y = -box.body.height / 4;
                    box.body.setSize(30, 20);
                    box.that = self;
                    box.boxID = boxes[id].boxID;
                    box.depth = box.y + 10;
                    box.hp = 1;
                }
            });
        });

        this.socket.on('ammos', function (ammos) {
            Object.keys(ammos).forEach(function (id) {
                if (ammos[id].isOccupied == false) {
                    var ammo = self.ammos.create(ammos[id].x, ammos[id].y, 'ammo').setScale(0.5).setOrigin(0.5, 0.5);
                    ammo.body.offset.x = -ammo.body.width / 4;
                    ammo.body.offset.y = -ammo.body.height / 4;
                    ammo.body.setSize(30, 30);
                    ammo.depth = ammo.y + 3;
                    ammo.ammoID = ammos[id].ammoID;
                }
            });
        });

        this.socket.on('hps', function (hps) {
            Object.keys(hps).forEach(function (id) {
                if (hps[id].isOccupied == false) {
                    var hp = self.hps.create(hps[id].x, hps[id].y, 'hp').setScale(0.5).setOrigin(0.5, 0.5);
                    hp.body.offset.x = -hp.body.width / 4;
                    hp.body.offset.y = -hp.body.height / 4;
                    hp.body.setSize(30, 30);
                    hp.depth = 10;
                    hp.hpID = hps[id].hpID;
                    hp.depth = hp.y + 10;
                }
            });
        });

        this.socket.on('playerUsernameEvent', function (gelenPlayer) {
            self.otherPlayers.getChildren().forEach(function (otherplayer) {
                if (otherplayer.list[0].playerId == gelenPlayer.playerId) {
                    otherplayer.list[0].username = gelenPlayer.username;
                    otherplayer.list[3].setText(gelenPlayer.username);
                }
            });
        });

        this.socket.on('deadBodies', function (deadBodies) {
            Object.keys(deadBodies).forEach(function (id) {
                var deadBody = self.add.sprite(deadBodies[id].x, deadBodies[id].y, 'police').setScale(0.3).setOrigin(0.5, 0.5);
                if (deadBodies[id].dir) {
                    deadBody.flipX = true;
                }
                deadBody.anims.play('died', true);
                deadBody.depth = deadBody.y + 20;
            });
        });

        this.socket.on('deadZombieBodies', function (deadZombieBodies) {
            Object.keys(deadZombieBodies).forEach(function (id) {
                var deadBody = self.add.sprite(deadZombieBodies[id].x, deadZombieBodies[id].y, 'zombie').setScale(0.6);
                if (deadZombieBodies[id].dir == false) {
                    deadBody.flipX = true;
                }
                deadBody.anims.play('died-zombie', true);
                deadBody.depth = deadBody.y + 20;
            });
        });

        this.socket.on('newPlayer', function (playerInfo) {
            self.playercount += 1;
            upper.setText('SCORE (' + self.playercount + ' Online)');
            self.addOtherPlayers(self, playerInfo);
        });

        this.socket.on('disconnected', function (playerId) {
            if (self.playercount > 1) {
                self.playercount -= 1;
            }
            upper.setText('SCORE (' + self.playercount + ' Online)');

            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                self.pCount++;
                if (otherPlayer.list[0].username != "noname") {
                    if (playerId == otherPlayer.list[0].playerId) {
                        //yeni silah eklendiğinde ekle
                        otherPlayer.list[0].setActive(false);
                        otherPlayer.list[1].setActive(false).setVisible(false);
                        otherPlayer.list[2].setActive(false).setVisible(false);
                        otherPlayer.list[3].setActive(false).setVisible(false);
                        self.otherPlayers.remove(otherPlayer);
                        self.otherPlayersDead.add(otherPlayer);
                        otherPlayer.list[0].anims.play('died', true);
                    }
                }else{
                    otherPlayer.destroy();
                }

            });

            if(self.pCount > 30){
                self.pCount = 0;
                self.otherPlayersDead.destroy();
            }
        });


        this.socket.on('zombieDied', function (zombieID) {
            var zCount = 0;
            self.zombies.getChildren().forEach(function (zombie) {
                zCount++;
                if (zombieID == zombie.zombieID) {
                    self.zombies.remove(zombie);
                    zombie.setActive(false).setVisible(false);
                    var deadBody = self.add.sprite(zombie.x, zombie.y, 'zombie').setScale(0.6);
                    if (zombie.dir) {
                        deadBody.flipX = false;
                    } else {
                        deadBody.flipX = true;
                    }
                    deadBody.depth = deadBody.y + 20;
                    deadBody.anims.play('died-zombie', true);
                }
            });

            if(zCount > 30){
                self.zombies.destroy();
            }
        });

        this.socket.on('playerMoved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId == otherPlayer.list[0].playerId) {
                    self.playerContainer.list[0].afk = false;
                    var tween = self.tweens.add({
                        targets: otherPlayer,
                        x: playerInfo.x,
                        y: playerInfo.y,
                        ease: 'Linear',
                        duration: 120,
                        yoyo: false,
                        repeat: 0,
                    });
                    otherPlayer.list[0].anims.play('left', true);
                }
            });
        });

        this.socket.on('zombieMovementEvent', function (zombieInfo) {
            self.zombies.getChildren().forEach(function (zombie) {
                if (zombieInfo.zombieID == zombie.zombieID) {
                    zombie.dir = zombieInfo.dir;
                    var tween = self.tweens.add({
                        targets: zombie,
                        x: zombieInfo.x,
                        y: zombieInfo.y,
                        ease: 'Linear',
                        //duration: 50,
                        yoyo: false,
                        repeat: 0,
                    });
                    if (zombieInfo.dir == false) {
                        zombie.flipX = true;
                    } else {
                        zombie.flipX = false;
                    }
                    zombie.anims.play('left-zombie', true);
                }
            });
        });

        this.socket.on('playerChangedDir', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId == otherPlayer.list[0].playerId) {
                    if (playerInfo.dir) {
                        otherPlayer.list[0].flipX = true;

                        otherPlayer.list[1].flipX = true;
                        otherPlayer.list[1].setRotation(-0.3);
                        otherPlayer.list[1].x = -20;

                        otherPlayer.list[2].flipY = true;
                        otherPlayer.list[2].x = -15;
                    } else {
                        otherPlayer.list[0].flipX = false;

                        otherPlayer.list[1].flipX = false;
                        otherPlayer.list[1].setRotation(0.3);
                        otherPlayer.list[1].x = 20;

                        otherPlayer.list[2].flipY = false;
                        otherPlayer.list[2].x = 15;
                    }
                }
            });
        });

        this.socket.on('playerStoppedDir', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId == otherPlayer.list[0].playerId) {
                    otherPlayer.list[0].anims.play('stop_left', true);
                }
            });
        });

        this.socket.on('playerReceiveWeaponRotation', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId == otherPlayer.list[0].playerId) {
                    otherPlayer.list[2].setRotation(playerInfo.angle);
                    lastWeaponRotation = playerInfo.angle;
                }
            });
        });

        var that = this;
        this.socket.on('playerShootEvent', function (shootInfo) {
            self.ShootReceived(that, shootInfo);
        });

        this.socket.on('playerDied', function (playerInfo) {
            if (playerInfo.playerId == self.playerContainer.list[0].playerId) {
                self.playerContainer.list[0].that.socket.disconnect();
                self.input.keyboard.resetKeys();
                self.playerContainer.list[0].that.scene.start('MenuScene', true);
            }
        });

        this.socket.on('playerGrabbedWeapon', function (playerInfo) {
            //başkasına geldiyse
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId == otherPlayer.list[0].playerId) {

                    //yeni silah ekleyince burada ekle
                    otherPlayer.list[1].setActive(false).setVisible(false);
                    otherPlayer.list[2].setActive(false).setVisible(false);
                    otherPlayer.list[playerInfo.weaponType].setActive(true).setVisible(true);


                    otherPlayer.weaponType = playerInfo.weaponType;

                    self.weapons.getChildren().forEach(function (wp) {
                        if (wp.weaponID == playerInfo.weaponID) {
                            wp.setActive(false).setVisible(false);
                            otherPlayer.activeWeaponRef = wp;
                        }
                    });

                    otherPlayer.list[playerInfo.weaponType].setActive(true).setVisible(true);
                }
            });
            //kendime geldiyse
            if (playerInfo.playerId == self.playerContainer.list[0].playerId) {
                self.playerContainer.weaponID = playerInfo.weaponID;
                self.playerContainer.weaponType = playerInfo.weaponType;
                self.playerContainer.activeWeaponRef = self.touchingShotgun;

                //yeni silah ekleyince burada ekle
                self.playerContainer.list[1].setActive(false).setVisible(false);
                self.playerContainer.list[2].setActive(false).setVisible(false);
                self.playerContainer.list[playerInfo.weaponType].setActive(true).setVisible(true);

                self.touchingShotgun.setActive(false).setVisible(false);
                self.playerContainer.list[playerInfo.weaponType].setActive(true).setVisible(true);

                self.ammoText.setText('' + self.playerContainer.activeWeaponRef.ammo);

            }
        });

        this.socket.on('playeDroppedWeapon', function (playerInfo) {
            //başkasına geldiyse
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.info.playerId == otherPlayer.list[0].playerId) {

                    self.weapons.getChildren().forEach(function (wp) {
                        if (wp.weaponID == playerInfo.wID) {
                            wp.setActive(true).setVisible(true);
                            otherPlayer.activeWeaponRef = wp;
                            otherPlayer.activeWeaponRef.ammo = playerInfo.ammo;
                            //console.log("gelen mermi: " + playerInfo.ammo);
                            otherPlayer.activeWeaponRef.setRotation((Math.random() * 4));
                        }
                    });

                    if (otherPlayer.activeWeaponRef != undefined) {
                        otherPlayer.activeWeaponRef.setPosition(otherPlayer.x, otherPlayer.y);
                        otherPlayer.activeWeaponRef.setActive(true).setVisible(true);
                        otherPlayer.activeWeaponRef = null;
                    }
                    otherPlayer.weaponType = 1;
                    //eline bıcagı ver
                    otherPlayer.list[1].setActive(true).setVisible(true);
                    otherPlayer.list[playerInfo.wType].setActive(false).setVisible(false);

                }
            });
            //kendime geldiyse
            if (playerInfo.info.playerId == self.playerContainer.list[0].playerId) {
                self.playerContainer.activeWeaponRef.setPosition(self.playerContainer.x, self.playerContainer.y);
                self.playerContainer.activeWeaponRef.setActive(true).setVisible(true);
                self.playerContainer.list[playerInfo.wType].setActive(false).setVisible(false);
                self.weapons.add(self.playerContainer.activeWeaponRef);
                self.ammoText.setText('');
                self.playerContainer.activeWeaponRef.setRotation((Math.random() * 4));
                self.playerContainer.activeWeaponRef = null;
                self.playerContainer.weaponType = 1;
                //eline bıcagı ver
                self.playerContainer.list[1].setActive(true).setVisible(true);
            }
        });

        this.socket.on('playerGrabbedAmmo', function (playerInfo) {
            //başkasına geldiyse
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.info.playerId == otherPlayer.list[0].playerId) {

                    self.ammos.getChildren().forEach(function (ammo) {
                        if (playerInfo.ammo.ammoID == ammo.ammoID) {

                            ammo.setActive(false).setVisible(false);
                            self.ammos.remove(ammo);
                            if (otherPlayer.activeWeaponRef != undefined) {
                                otherPlayer.activeWeaponRef.ammo += playerInfo.ammo.ammo;
                            }
                        }
                    });

                }
            });
            //kendime geldiyse
            if (playerInfo.info.playerId == self.playerContainer.list[0].playerId) {
                self.ammos.getChildren().forEach(function (ammo) {
                    if (playerInfo.ammo.ammoID == ammo.ammoID) {
                        if (self.playerContainer.activeWeaponRef != undefined) {
                            ammo.setActive(false).setVisible(false);
                            self.ammos.remove(ammo);
                            self.playerContainer.activeWeaponRef.ammo += playerInfo.ammo.ammo;
                        }
                    }
                });

                self.ammoText.setText(self.playerContainer.activeWeaponRef.ammo);

            }
        });

        this.socket.on('playerGrabbedHp', function (playerInfo) {
            //başkasına geldiyse
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.info.playerId == otherPlayer.list[0].playerId) {

                    self.hps.getChildren().forEach(function (hp) {
                        if (playerInfo.hp.hpID == hp.hpID) {
                            hp.setActive(false).setVisible(false);
                            self.hps.remove(hp);
                        }
                    });

                }
            });
            //kendime geldiyse
            if (playerInfo.info.playerId == self.playerContainer.list[0].playerId) {
                self.health += playerInfo.hp.amount;
                if (self.health > self.level * 100) {
                    self.health = self.level * 100;
                }
                self.hps.getChildren().forEach(function (hp) {
                    if (playerInfo.hp.hpID == hp.hpID) {
                        hp.setActive(false).setVisible(false);
                        self.hps.remove(hp);
                    }
                });

                //self.hpText.setText('HP: ' + self.health);
                self.setValue(self.healthBar, self.health);

            }
        });

        this.socket.on('playerStabEvent', function (stabberID) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (stabberID == otherPlayer.list[0].playerId) {
                    var bullet = self.playerBullets.get().setActive(true).setVisible(false);
                    bullet.owner = otherPlayer;

                    var startPoint = new Phaser.Geom.Point(otherPlayer.x, otherPlayer.y);

                    var point = new Phaser.Geom.Point(otherPlayer.x + otherPlayer.list[1].x, otherPlayer.y);

                    bullet.fire(startPoint, point);

                    self.physics.add.collider(self.myplayerGroup, bullet, self.GetDamage);
                    self.physics.add.collider(platforms, bullet, self.ShootWall);
                    self.physics.add.collider(self.boxes, bullet, self.ShootWall);

                    setTimeout(function () {
                        bullet.destroy();
                    }, 100);

                    var tween = self.tweens.add({
                        targets: otherPlayer.list[1],
                        x: (otherPlayer.list[0].flipX == true ? -35 : 35),
                        ease: 'Power1',
                        duration: 50,
                        yoyo: false,
                        repeat: 0,
                        onComplete: self.recoilOnCompleteHandler,
                        onCompleteParams: [self, otherPlayer.list[0], otherPlayer.list[1], -20, 20, 200]
                    });
                }
            });
        });

        this.socket.on('playerChangedWeapon', function (p) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (p.playerId == otherPlayer.list[0].playerId) {
                    otherPlayer.list[1].setActive(false).setVisible(false);
                    otherPlayer.list[2].setActive(false).setVisible(false);
                    otherPlayer.list[p.weaponType].setActive(true).setVisible(true);
                }
            });
        });


        this.socket.on('boxBrokeEvent', function (targetBox) {
            self.boxes.getChildren().forEach(function (box) {
                if (box.boxID == targetBox.id) {
                    self.boxes.remove(box);
                    //box.setActive(false).setVisible(false);
                    self.tweens.add({
                        targets: box,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        y: '+=32',
                        angle: 180,
                        ease: 'Power3',
                        duration: 1000,
                    });

                    if (targetBox.reward == 1) { //pompali
                        var silah = self.weapons.create(box.x, box.y, 'shotgun_collectable').setScale(0.5);
                        silah.depth = 10;
                        silah.ammo = 20;
                        silah.weaponID = targetBox.rewardID;
                        silah.setActive(true).setVisible(true);

                    } else if (targetBox.reward == 2) { //ammo
                        var ammo = self.ammos.create(box.x, box.y, 'ammo').setScale(0.5).setOrigin(0.5, 0.5);
                        ammo.body.offset.x = -ammo.body.width / 4;
                        ammo.body.offset.y = -ammo.body.height / 4;
                        ammo.body.setSize(30, 30);
                        ammo.depth = ammo.y + 3;
                        ammo.ammoID = targetBox.rewardID;
                        ammo.setActive(true).setVisible(true);

                    } else if (targetBox.reward == 3) { //health
                        var hp = self.hps.create(box.x, box.y, 'hp').setScale(0.5).setOrigin(0.5, 0.5);
                        hp.body.offset.x = -hp.body.width / 4;
                        hp.body.offset.y = -hp.body.height / 4;
                        hp.body.setSize(30, 30);
                        hp.depth = hp.y + 10;
                        hp.hpID = targetBox.rewardID;
                        hp.setActive(true).setVisible(true);
                    }
                    else if (targetBox.reward == 4) { //uzi
                        var silah = self.weapons.create(box.x, box.y, 'uzi_collectable').setScale(0.5);
                        silah.depth = 10;
                        silah.ammo = 30;
                        silah.weaponID = targetBox.rewardID;
                        silah.setActive(true).setVisible(true);
                    }
                }
            });
        });

        this.socket.on('randomBoxEvent', function (targetBox) {
            if (targetBox.isBroke == false) { //shotgun
                var box = self.boxes.create(targetBox.x, targetBox.y, 'box').setScale(0.5).setOrigin(0.5, 0.5);
                box.body.offset.x = -box.body.width / 4;
                box.body.offset.y = -box.body.height / 4;
                box.body.setSize(30, 20);
                box.depth = box.y + 10;
                box.that = self;
                box.hp = 1;
                box.boxID = targetBox.boxID;
                box.depth = box.y + box.height / 2;
                box.angle = 180;
                box.scale = 0;
                self.tweens.add({
                    targets: box,
                    scale: 0.5,
                    angle: 0,
                    _ease: 'Sine.easeInOut',
                    ease: 'Power2',
                    duration: 250,
                });
            }
        });

        this.socket.on('randomZombieEvent', function (targetZombie) {
            var zombie = self.zombies.create(targetZombie.x, targetZombie.y, 'zombie').setScale(0.6);
            zombie.that = self;
            zombie.health = targetZombie.health;
            zombie.zombieID = targetZombie.zombieID;
            zombie.depth = zombie.y + 20;
            zombie.body.offset.x = -zombie.body.width / 4;
            zombie.body.offset.y = -zombie.body.height / 4;
            zombie.body.setSize(30, 60);
            zombie.anims.play('left-zombie', true);
        });








        var gr = this.add.sprite(2400, 1350, 'ground').setScale(5);
        var groundOut = this.add.sprite(2400, 1350, 'ground-out').setScale(5.2);
        this.anims.create({
            key: 'groundAnim',
            frames: this.anims.generateFrameNumbers('ground-out', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1 //-1 loop yap demek
        });
        groundOut.anims.play('groundAnim', true);
        groundOut.depth = 1000000;
        platforms = this.physics.add.staticGroup();
        this.ots = this.physics.add.staticGroup();
        this.zombies = this.physics.add.group();

        //scale yaptığımız için refreshBody dememiz gerek
        platforms.create(2400, 0, 'blockX').setScale(5.2).refreshBody().setVisible(false);
        platforms.create(2400, 2700, 'blockX').setScale(5.2).refreshBody().setVisible(false);
        platforms.create(0, 1350, 'blockY').setScale(5.2).refreshBody().setVisible(false);
        platforms.create(4800, 1350, 'blockY').setScale(5.2).refreshBody().setVisible(false);


        bloods = this.physics.add.staticGroup();
        bulletFires = this.physics.add.staticGroup();
        this.weapons = this.physics.add.group();
        this.boxes = this.physics.add.staticGroup();
        this.ammos = this.physics.add.staticGroup();
        this.hps = this.physics.add.staticGroup();



        // Make a predictable pseudorandom number generator.
        var myrng = new Math.seedrandom('hello.');

        noise.seed(99);
        for (var xx = 0; xx < 1000; xx++) {
            var value = Math.abs(Math.round((noise.simplex2(xx / 100, xx / 100) * 100) % 3));
            let randomX = Math.round(myrng() * 4800);
            let randomY = Math.round(myrng() * 2700);
            var targetOt;
            if (value == 0) {
                targetOt = this.ots.create(randomX, randomY, 'ot-1');
                targetOt.depth = targetOt.y + targetOt.height / 6;
                targetOt.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetOt.flipX = true;
                }
            } else if (value == 1) {
                targetOt = this.ots.create(randomX, randomY, 'ot-2');
                targetOt.depth = targetOt.y + targetOt.height / 6;
                targetOt.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetOt.flipX = true;
                }
            } else if (value == 2) {
                targetOt = this.ots.create(randomX, randomY, 'ot-3');
                targetOt.depth = targetOt.y + targetOt.height / 6;
                targetOt.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetOt.flipX = true;
                }
            }

            value = Math.abs(Math.round((myrng() * 4800) % 10));
            randomX = Math.round(myrng() * 4800);
            randomY = Math.round(myrng() * 2700);
            var targetRock;
            if (value == 0) {
                targetRock = this.ots.create(randomX, randomY, 'rock-1').setScale(0.3);
                targetRock.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetRock.flipX = true;
                }
            } else if (value == 1) {
                targetRock = this.ots.create(randomX, randomY, 'rock-2').setScale(0.3);
                targetRock.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetRock.flipX = true;
                }
            } else if (value == 2) {
                targetRock = this.ots.create(randomX, randomY, 'rock-3').setScale(0.3);
                targetRock.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetRock.flipX = true;
                }
            } else if (value == 3) {
                targetRock = this.ots.create(randomX, randomY, 'rock-4').setScale(0.3);
                targetRock.setRotation((Math.random() * 2 - 1) / 10);
                if (Math.random() > 0.5) {
                    targetRock.flipX = true;
                }
            }
        }

        /*
        noise.seed(99);
        for(var xx = 0; xx < this.scale.width/10; xx++){
            for(var yy = 0; yy < this.scale.height/10; yy++){
                var value = Math.abs(Math.round(noise.simplex2(xx/100, yy/100)*100)%10);
                console.log(value);
                if(value == 0){
                    this.ots.create(xx*100, yy*100, 'ot-1').setScale(0.2).refreshBody();
                }else if(value == 1){
                    this.ots.create(xx*100, yy*100,  'ot-2').setScale(0.2).refreshBody();
                }if(value == 2){
                    this.ots.create(xx*100, yy*100,  'ot-3').setScale(0.2).refreshBody();
                }
            }
        }*/


        this.myplayerGroup = this.physics.add.group();

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Fires bullet from player on left click of mouse
        this.lastFired = 0;
        if (this.sys.game.device.os.desktop) {
            this.input.on('pointer', function (pointer, time, lastFired) {

                if (self.time > self.lastFired) {
                    if (self.playerContainer.list[2].active && canShoot && self.playerContainer.activeWeaponRef != undefined && self.playerContainer.activeWeaponRef.ammo > 0) {
                        var bullet = self.playerBullets.get().setActive(true).setVisible(true);
                        if (bullet) {
                            var startPoint = new Phaser.Geom.Point(self.playerContainer.x + self.playerContainer.list[2].x, self.playerContainer.y + self.playerContainer.list[2].y);

                            var point = new Phaser.Geom.Point(self.crosshairX, self.crosshairY);

                            //açıyı hesapladık
                            var angle = Phaser.Math.Angle.BetweenPoints(startPoint, point);
                            var b = Math.sin(angle) * (180 / Math.PI); //16 silahın uzunlugu
                            var a = Math.cos(angle) * (180 / Math.PI);
                            startPoint.x += a / 1.2;
                            startPoint.y += b / 1.2;
                            bullet.setRotation(angle);
                            bullet.depth = 5;
                            bullet.fire(startPoint, point);
                            bullet.owner = self.playerContainer;
                            self.playerContainer.activeWeaponRef.ammo--;
                            self.ammoText.setText(self.playerContainer.activeWeaponRef.ammo);

                            self.physics.add.collider(self.otherPlayers, bullet, self.GetDamage);
                            self.physics.add.collider(platforms, bullet, self.ShootWall);
                            self.physics.add.collider(self.boxes, bullet, self.ShootBox);
                            self.physics.add.collider(self.zombies, bullet, self.ZombieGetDamage);

                            var bulletInstance = bulletFires.create(startPoint.x, startPoint.y, 'bullet_fire').setScale(1.5);
                            bulletInstance.depth = 5000;
                            //silahtan çıkan ateşi siler
                            setTimeout(function () {
                                bulletInstance.destroy();
                            }, 30);

                            //recoil
                            var tween = self.tweens.add({
                                targets: self.playerContainer.list[2],
                                x: (self.player.flipX == true ? -7 : 7),
                                ease: 'Power1',
                                duration: 20,
                                yoyo: false,
                                repeat: 0,
                                onComplete: self.recoilOnCompleteHandler,
                                onCompleteParams: [self, self.playerContainer.list[0], self.playerContainer.list[2], -15, 15, 100]
                            });

                            self.socket.emit('playerShoot', { weaponType: 0, x1: startPoint.x, y1: startPoint.y, x2: point.x, y2: point.y });
                            self.lastFired = self.time + 500;

                            self.cameras.main.shake(100, 0.005);
                        }
                    } else if (self.playerContainer.list[1].active) {
                        var bullet = self.playerBullets.get().setActive(true).setVisible(false);

                        var startPoint = new Phaser.Geom.Point(self.playerContainer.x, self.playerContainer.y);

                        var point = new Phaser.Geom.Point(self.playerContainer.x + self.playerContainer.list[1].x, self.playerContainer.y);
                        bullet.owner = self.playerContainer;
                        bullet.fire(startPoint, point);

                        self.physics.add.collider(self.otherPlayers, bullet, self.GetDamage);
                        self.physics.add.collider(platforms, bullet, self.ShootWall);
                        self.physics.add.collider(self.boxes, bullet, self.ShootBox);
                        self.physics.add.collider(self.zombies, bullet, self.ZombieGetDamage);

                        setTimeout(function () {
                            bullet.destroy();
                        }, 100);

                        var tween = self.tweens.add({
                            targets: self.playerContainer.list[1],
                            x: (self.player.flipX == true ? -35 : 35),
                            ease: 'Power1',
                            duration: 50,
                            yoyo: false,
                            repeat: 0,
                            onComplete: self.recoilOnCompleteHandler,
                            onCompleteParams: [self, self.playerContainer.list[0], self.playerContainer.list[1], -20, 20, 200]
                        });
                        //bıçağı ileri savur
                        self.socket.emit('playerStab');
                        self.lastFired = self.time + 300;
                    }

                }
            }, this);
        }

        cursors = this.input.keyboard.createCursorKeys();
        mouse = this.input.mousePointer;
        this.input.keyboard.on('keyup', this.anyKey, this);

        //collectable shotgun
        this.isTouchingShotgun = false;

        this.physics.add.overlap(this.myplayerGroup, this.weapons, this.GetWeaponFromGround);
        this.physics.add.overlap(this.myplayerGroup, this.ammos, this.GetAmmoFromGround);
        this.physics.add.overlap(this.myplayerGroup, this.hps, this.GetHpFromGround);
        this.physics.add.overlap(this.myplayerGroup, this.zombies, this.GetDamageFromZombie);
        this.physics.add.overlap(this.otherPlayers, this.zombies, this.GetDamageFromZombieOthers);
        this.physics.add.collider(this.myplayerGroup, this.boxes);

        keys = this.input.keyboard.addKeys("W,A,S,D", false);

        //this.hpText = this.add.text(32, 0, 'HP: 100', { fontFamily: 'Arial', fontSize: 32, color: '#00ff00' });
        //this.hpText.setScrollFactor(0);
        //this.hpText.depth = 1000000;
        let hpBackground = this.add.rectangle(0, 20, 500, 39).setOrigin(0.5);
        hpBackground.setFillStyle(0x333333, 0.8);
        hpBackground.setScrollFactor(0);
        hpBackground.depth = 1000000;
        hpBackground.setStrokeStyle(3, 0x000000, 1);

        let ammoBackground = this.add.rectangle(0, 236, 500, 32).setOrigin(0.5);
        ammoBackground.setFillStyle(0x333333, 0.8);
        ammoBackground.setScrollFactor(0);
        ammoBackground.depth = 1300000;
        ammoBackground.setStrokeStyle(3, 0x000000, 1);

        var ammob = this.add.sprite(6, 224, 'ammo').setScale(0.8).setOrigin(0);
        ammob.setScrollFactor(0);
        ammob.depth = 1900000;

        this.ammoText = this.add.text(65, 224, '', { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' });
        this.ammoText.setScrollFactor(0);
        this.ammoText.depth = 1500000;

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        this.boxes.getChildren().forEach(function (box) {
            box.depth = box.y + box.height / 2;
        });

        this.lastScrollY = 0;
        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            if (self.lastScrollY >= 125) {
                self.lastScrollY = 0;
            } else if (self.lastScrollY <= 0) {
                self.lastScrollY = 125;
            } else {
                self.lastScrollY += deltaY;
            }
            if (self.lastScrollY == 125) { //pompali
                if (self.playerContainer.activeWeaponRef != undefined) { //silahım varsa
                    self.playerContainer.list[1].setActive(false).setVisible(false);
                    self.playerContainer.list[2].setActive(true).setVisible(true);
                    self.socket.emit('playerChangedWeapon', 2);
                }
            } else if (self.lastScrollY == 0) { //bıçak
                self.playerContainer.list[1].setActive(true).setVisible(true);
                self.playerContainer.list[2].setActive(false).setVisible(false);
                self.socket.emit('playerChangedWeapon', 1);
            }
        });


        var upper = this.add.text(0, 43, ' SCORE', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff', fontStyle: 'bold' }).setOrigin(0);
        upper.setScrollFactor(0);
        upper.depth = 1500000;

        this.score0 = this.add.text(0, 68, ' 1) ', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0);
        this.score0.setFixedSize(500, 32);
        this.score0.setScrollFactor(0);
        this.score0.depth = 1500000;

        this.score1 = this.add.text(0, 98, ' 2) ', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0);
        this.score1.setFixedSize(500, 32);
        this.score1.setScrollFactor(0);
        this.score1.depth = 1500000;

        this.score2 = this.add.text(0, 128, ' 3) ', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0);
        this.score2.setFixedSize(500, 32);
        this.score2.setScrollFactor(0);
        this.score2.depth = 1500000;

        this.score3 = this.add.text(0, 158, ' 4)', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0);
        this.score3.setFixedSize(500, 32);
        this.score3.setScrollFactor(0);
        this.score3.depth = 1500000;

        this.score4 = this.add.text(0, 188, ' 5) ', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0);
        this.score4.setFixedSize(500, 32);
        this.score4.setScrollFactor(0);
        this.score4.depth = 1500000;


        let scoreBackground = this.add.rectangle(0, 130, 500, 180).setOrigin(0.5);
        scoreBackground.setFillStyle(0x333333, 0.8);
        scoreBackground.setScrollFactor(0);
        scoreBackground.depth = 1300000;
        scoreBackground.setStrokeStyle(3, 0x000000, 1);

        this.healthBar = this.makeBar(30, 2, 0x2ecd71);
        this.healthBar.setScrollFactor(0);
        this.healthBar.depth = 1500000;
        this.setValue(this.healthBar, this.health);

        var heart = this.add.sprite(24, 18, 'heart').setScale(0.9).setOrigin(0.5);
        heart.setScrollFactor(0);
        heart.depth = 1900000;
        this.tweens.add({
            targets: heart,
            duration: 500,
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'

        });

        this.mousePoint = this.add.sprite(0, 0, 'heart').setOrigin(0.5).setVisible(false);
        this.mousePoint.depth = 10000;



        this.hand = this.add.sprite(this.scale.width - (this.scale.width / 6), (this.scale.height / 8), 'hand').setVisible(false).setScale(0.06).setInteractive();
        this.hand.alpha = 0.6;
        this.hand.depth = 1000000;
        this.hand.setScrollFactor(0);
        this.hand.on('pointerdown', function (pointer) {
            if (self.isTouchingShotgun == true && self.playerContainer.activeWeaponRef == null) {
                self.socket.emit('grabWeapon', self.touchingShotgun.weaponID);
            } else if (self.isTouchingAmmo == true && self.playerContainer.activeWeaponRef != null) {
                self.socket.emit('grabAmmo', self.touchingAmmo.ammoID);
            } else if (self.isTouchingHp == true && self.health < self.level * 100) {
                self.socket.emit('grabHp', self.touchingHp.hpID);
            }
        });

        this.trash = this.add.sprite(this.scale.width - (this.scale.width / 20), (this.scale.height / 8), 'trash').setVisible(false).setScale(0.06).setInteractive();
        this.trash.alpha = 0.6;
        this.trash.depth = 1000000;
        this.trash.setScrollFactor(0);
        this.trash.on('pointerdown', function (pointer) {
            if (self.playerContainer.activeWeaponRef != undefined) {
                self.socket.emit('dropWeapon', { weaponID: self.playerContainer.weaponID, x: self.playerContainer.x, y: self.playerContainer.y });
            }
        });

        this.refresh = this.add.sprite(32, (this.scale.height / 1.9), 'refresh').setVisible(false).setScale(0.1).setInteractive();
        this.refresh.alpha = 0.6;
        this.refresh.depth = 1000000;
        this.refresh.setScrollFactor(0);
        this.lastScrollY = 0;
        this.refresh.on('pointerdown', function (pointer) {
            var deltaY = 0;
            if (self.lastScrollY >= 125) {
                self.lastScrollY = 0;
            } else if (self.lastScrollY <= 0) {
                self.lastScrollY = 125;
            } else {
                self.lastScrollY += deltaY;
            }
            if (self.lastScrollY == 125) { //pompali
                if (self.playerContainer.activeWeaponRef != undefined) { //silahım varsa
                    self.playerContainer.list[1].setActive(false).setVisible(false);
                    self.playerContainer.list[2].setActive(true).setVisible(true);
                    self.socket.emit('playerChangedWeapon', 2);
                }
            } else if (self.lastScrollY == 0) { //bıçak
                self.playerContainer.list[1].setActive(true).setVisible(true);
                self.playerContainer.list[2].setActive(false).setVisible(false);
                self.socket.emit('playerChangedWeapon', 1);
            }
        });

        this.gamepaused = this.add.text(this.scale.width / 2, this.scale.height / 2, '', { fontFamily: 'Arial', fontSize: 30, color: '#000000', fontStyle: 'bold' }).setOrigin(0.5);
        this.gamepaused.setScrollFactor(0);
        this.gamepaused.depth = 1500000;

        this.chat = this.add.dom(116, 475).createFromCache('chatform').setVisible(false);
        this.chat.setScrollFactor(0);
        this.chat.setPerspective(800);
        this.chat.setDepth(15000000);


        this.chatUI = this.add.sprite(this.scale.width / 2, this.scale.height - 50, 'chatui').setVisible(false).setScale(0.06).setInteractive();
        this.chatUI.alpha = 0.6;
        this.chatUI.depth = 1000000;
        this.chatUI.setScrollFactor(0);
        this.chatUI.on('pointerdown', function (pointer) {
            if (self.chat.visible == false) {
                self.chat.setVisible(true);
                self.joySticks[0].setVisible(false);
                self.joySticks[1].setVisible(false);
            } else {
                self.chat.setVisible(false);
                self.joySticks[0].setEnable(true).setVisible(true);
                self.joySticks[1].setEnable(true).setVisible(true);
            }

        });

        if (this.sys.game.device.os.desktop == false) {
            this.chatUI.setVisible(true);
        } else {
            this.chat.setVisible(true);
        }

    },

    update: function (time, delta) {
        //yüklenene kadar bekle
        if (this.player == undefined || this.playerContainer.body == undefined) {
            return;
        }

        //this.mousePoint.setPosition(this.playerContainer.x, this.playerContainer.y);

        var up0 = false;
        var left0 = false;
        var right0 = false;
        var down0 = false;

        var up1 = false;
        var left1 = false;
        var right1 = false;
        var down1 = false;

        for (var i = 0, cnt = this.joySticks.length; i < cnt; i++) {
            var cursorKeys = this.joySticks[i].createCursorKeys();
            for (var name in cursorKeys) {
                if (cursorKeys[name].isDown) {
                    if (name == "up") {
                        if (i == 0) {
                            up0 = true;
                        } else {
                            up1 = true;


                        }
                    }
                    if (name == "down") {
                        if (i == 0) {
                            down0 = true;
                        } else {
                            down1 = true;

                        }
                    }
                    if (name == "right") {
                        if (i == 0) {
                            right0 = true;
                        } else {
                            right1 = true;

                        }
                    }
                    if (name == "left") {
                        if (i == 0) {
                            left0 = true;
                        } else {
                            left1 = true;

                        }
                    }
                }
            }
        }


        if (this.sys.game.device.os.desktop) {
            if (this.input.activePointer.isDown) {

                if (this.time > this.lastFired) {
                    if (this.playerContainer.list[2].active && canShoot && this.playerContainer.activeWeaponRef != undefined && this.playerContainer.activeWeaponRef.ammo > 0) {
                        var bullet = this.playerBullets.get().setActive(true).setVisible(true);
                        if (bullet) {
                            var startPoint = new Phaser.Geom.Point(this.playerContainer.x + this.playerContainer.list[2].x, this.playerContainer.y + this.playerContainer.list[2].y);

                            var point = new Phaser.Geom.Point(this.crosshairX, this.crosshairY);

                            //açıyı hesapladık
                            var angle = Phaser.Math.Angle.BetweenPoints(startPoint, point);
                            var b = Math.sin(angle) * (180 / Math.PI); //16 silahın uzunlugu
                            var a = Math.cos(angle) * (180 / Math.PI);
                            startPoint.x += a / 1.2;
                            startPoint.y += b / 1.2;
                            bullet.setRotation(angle);
                            bullet.depth = 5;
                            bullet.fire(startPoint, point);
                            bullet.owner = this.playerContainer;
                            this.playerContainer.activeWeaponRef.ammo--;
                            this.ammoText.setText(this.playerContainer.activeWeaponRef.ammo);

                            this.physics.add.collider(this.otherPlayers, bullet, this.GetDamage);
                            this.physics.add.collider(platforms, bullet, this.ShootWall);
                            this.physics.add.collider(this.boxes, bullet, this.ShootBox);
                            this.physics.add.collider(this.zombies, bullet, this.ZombieGetDamage);

                            var bulletInstance = bulletFires.create(startPoint.x, startPoint.y, 'bullet_fire').setScale(1.5);
                            bulletInstance.depth = 5000;
                            //silahtan çıkan ateşi siler
                            setTimeout(function () {
                                bulletInstance.destroy();
                            }, 30);

                            //recoil
                            var tween = this.tweens.add({
                                targets: this.playerContainer.list[2],
                                x: (this.player.flipX == true ? -7 : 7),
                                ease: 'Power1',
                                duration: 20,
                                yoyo: false,
                                repeat: 0,
                                onComplete: this.recoilOnCompleteHandler,
                                onCompleteParams: [this, this.playerContainer.list[0], this.playerContainer.list[2], -15, 15, 100]
                            });

                            this.socket.emit('playerShoot', { weaponType: 0, x1: startPoint.x, y1: startPoint.y, x2: point.x, y2: point.y });
                            this.lastFired = this.time + 500;

                            this.cameras.main.shake(100, 0.005);
                        }
                    } else if (this.playerContainer.list[1].active) {
                        var bullet = this.playerBullets.get().setActive(true).setVisible(false);

                        var startPoint = new Phaser.Geom.Point(this.playerContainer.x, this.playerContainer.y);

                        var point = new Phaser.Geom.Point(this.playerContainer.x + this.playerContainer.list[1].x, this.playerContainer.y);
                        bullet.owner = this.playerContainer;
                        bullet.fire(startPoint, point);

                        this.physics.add.collider(this.otherPlayers, bullet, this.GetDamage);
                        this.physics.add.collider(platforms, bullet, this.ShootWall);
                        this.physics.add.collider(this.boxes, bullet, this.ShootBox);
                        this.physics.add.collider(this.zombies, bullet, this.ZombieGetDamage);

                        setTimeout(function () {
                            bullet.destroy();
                        }, 100);

                        var tween = this.tweens.add({
                            targets: this.playerContainer.list[1],
                            x: (this.player.flipX == true ? -35 : 35),
                            ease: 'Power1',
                            duration: 50,
                            yoyo: false,
                            repeat: 0,
                            onComplete: this.recoilOnCompleteHandler,
                            onCompleteParams: [this, this.playerContainer.list[0], this.playerContainer.list[1], -20, 20, 200]
                        });
                        //bıçağı ileri savur
                        this.socket.emit('playerStab');
                        this.lastFired = this.time + 300;
                    }

                }
            }
        }


        //sağ joystick bırakıldı
        if (right1 == false && left1 == false && up1 == false && down1 == false) {
            //this.mousePoint.setPosition(this.playerContainer.x, this.playerContainer.y);
        } else {
            this.mousePoint.angle = this.joySticks[1].angle - 90;

            if (this.time > this.lastFired) {
                if (this.playerContainer.list[2].active && canShoot && this.playerContainer.activeWeaponRef != undefined && this.playerContainer.activeWeaponRef.ammo > 0) {
                    var bullet = this.playerBullets.get().setActive(true).setVisible(true);
                    if (bullet) {
                        var startPoint = new Phaser.Geom.Point(this.playerContainer.x + this.playerContainer.list[2].x, this.playerContainer.y + this.playerContainer.list[2].y);

                        var point = new Phaser.Geom.Point(this.crosshairX, this.crosshairY);

                        //açıyı hesapladık
                        var angle = Phaser.Math.Angle.BetweenPoints(startPoint, point);
                        var b = Math.sin(angle) * (180 / Math.PI); //16 silahın uzunlugu
                        var a = Math.cos(angle) * (180 / Math.PI);
                        startPoint.x += a / 1.2;
                        startPoint.y += b / 1.2;
                        bullet.setRotation(angle);
                        bullet.depth = 5;
                        bullet.fire(startPoint, point);
                        bullet.owner = this.playerContainer;
                        this.playerContainer.activeWeaponRef.ammo--;
                        this.ammoText.setText(this.playerContainer.activeWeaponRef.ammo);

                        this.physics.add.collider(this.otherPlayers, bullet, this.GetDamage);
                        this.physics.add.collider(platforms, bullet, this.ShootWall);
                        this.physics.add.collider(this.boxes, bullet, this.ShootBox);
                        this.physics.add.collider(this.zombies, bullet, this.ZombieGetDamage);

                        var bulletInstance = bulletFires.create(startPoint.x, startPoint.y, 'bullet_fire').setScale(1.5);
                        bulletInstance.depth = 5000;
                        //silahtan çıkan ateşi siler
                        setTimeout(function () {
                            bulletInstance.destroy();
                        }, 30);

                        //recoil
                        var tween = this.tweens.add({
                            targets: this.playerContainer.list[2],
                            x: (this.player.flipX == true ? -7 : 7),
                            ease: 'Power1',
                            duration: 20,
                            yoyo: false,
                            repeat: 0,
                            onComplete: this.recoilOnCompleteHandler,
                            onCompleteParams: [this, this.playerContainer.list[0], this.playerContainer.list[2], -15, 15, 100]
                        });

                        this.socket.emit('playerShoot', { weaponType: 0, x1: startPoint.x, y1: startPoint.y, x2: point.x, y2: point.y });
                        this.lastFired = this.time + 500;

                        this.cameras.main.shake(100, 0.005);
                    }
                } else if (this.playerContainer.list[1].active) {
                    var bullet = this.playerBullets.get().setActive(true).setVisible(false);

                    var startPoint = new Phaser.Geom.Point(this.playerContainer.x, this.playerContainer.y);

                    var point = new Phaser.Geom.Point(this.playerContainer.x + this.playerContainer.list[1].x, this.playerContainer.y);
                    bullet.owner = this.playerContainer;
                    bullet.fire(startPoint, point);

                    this.physics.add.collider(this.otherPlayers, bullet, this.GetDamage);
                    this.physics.add.collider(platforms, bullet, this.ShootWall);
                    this.physics.add.collider(this.boxes, bullet, this.ShootBox);
                    this.physics.add.collider(this.zombies, bullet, this.ZombieGetDamage);

                    setTimeout(function () {
                        bullet.destroy();
                    }, 100);

                    var tween = this.tweens.add({
                        targets: this.playerContainer.list[1],
                        x: (this.player.flipX == true ? -35 : 35),
                        ease: 'Power1',
                        duration: 50,
                        yoyo: false,
                        repeat: 0,
                        onComplete: this.recoilOnCompleteHandler,
                        onCompleteParams: [this, this.playerContainer.list[0], this.playerContainer.list[1], -20, 20, 200]
                    });
                    //bıçağı ileri savur
                    this.socket.emit('playerStab');
                    this.lastFired = this.time + 300;
                }

            }
        }

        let speed;
        if (this.playerContainer.list[2].active == true) { //pompali acık
            speed = this.walkSpeed;
        } else if (this.playerContainer.list[1].active == true) { //bıçak açık
            speed = this.runSpeed;
        } else {
            speed = this.walkSpeed;
        }

        this.time = time;
        physics = this.physics;


        this.otherPlayers.getChildren().forEach(function (otherPlayer) {
            otherPlayer.body.setVelocityX(0);
            otherPlayer.body.setVelocityY(0);
        });



        //ordering
        this.otherPlayers.getChildren().forEach(function (otherPlayer) {
            otherPlayer.depth = otherPlayer.y + otherPlayer.height / 2;
        });

        this.zombies.getChildren().forEach(function (zombie) {
            zombie.depth = zombie.y + 20;
        });

        this.playerContainer.depth = this.playerContainer.y + this.playerContainer.height / 2;

        //yazı yazarken movement çalışmasın
        if (document.getElementById("chatbox") != document.activeElement) {
            //movement
            if (keys.A.isDown || left0 == true) {
                isMovingX = true;
                this.playerContainer.body.setVelocityX(-speed);
                player.anims.play('left', true);
            }
            else if (keys.D.isDown || right0 == true) {
                isMovingX = true;
                this.playerContainer.body.setVelocityX(speed);
                player.anims.play('left', true);
            }
            else {
                isMovingX = false;
                this.playerContainer.body.setVelocityX(0);
            }

            if (keys.W.isDown || up0 == true) {
                isMovingY = true;
                this.playerContainer.body.setVelocityY(-speed);
                player.anims.play('left', true);
            } else if (keys.S.isDown || down0 == true) {
                isMovingY = true;
                this.playerContainer.body.setVelocityY(speed);
                player.anims.play('left', true);
            } else {
                isMovingY = false;
                this.playerContainer.body.setVelocityY(0);

            }
        }

        this.handleMovement(this);
        this.handleWeaponDegree(this);


        if (isMovingX == false && isMovingY == false && stopDirSent == false) {
            stopDirSent = true;
            //baktığı yönde durdur
            this.handleStopDir(this);
        }

    },

    CreateJoyStick: function (scene, x, y) {
        let joys = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: x, y: y,
            radius: 75,
            base: this.add.circle(0, 0, 100).setStrokeStyle(5, 0x0f0000),
            thumb: this.add.circle(0, 0, 50, 0xcccccc).setStrokeStyle(5),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        }).setScrollFactor(0);
        joys.base.depth = 10000000;
        joys.thumb.depth = 12000000;
        if (this.sys.game.device.os.desktop) {
            joys.enable = false;
            joys.base.setActive(false).setVisible(false);
            joys.thumb.setActive(false).setVisible(false);
        }
        else {
            joys.enable = true;
        }
        return joys;
    },

    handleMovement: function (self) {
        // emit player movement
        var x = self.playerContainer.x;
        var y = self.playerContainer.y;

        //iki nokta arası uzaklık
        if (self.player.oldPosition != undefined) {
            var a = self.playerContainer.x - self.player.oldPosition.x;
            var b = self.playerContainer.y - self.player.oldPosition.y;
            var c = Math.sqrt(a * a + b * b);
            if (c > 10) {
                self.socket.emit('playerMovement', { x: self.playerContainer.x, y: self.playerContainer.y });

                // save old position data
                self.player.oldPosition = {
                    x: self.playerContainer.x,
                    y: self.playerContainer.y
                };
            } else {
                stopDirSent = false;
            }
        } else {
            self.player.oldPosition = {
                x: self.playerContainer.x,
                y: self.playerContainer.y
            };
        }



    },

    rationalize: function (rational, epsilon) {
        var denominator = 0;
        var numerator;
        var error;

        do {
            denominator++;
            numerator = Math.round((rational.numerator * denominator) / rational.denominator);
            error = Math.abs(rational.minus(numerator / denominator));
        } while (error > epsilon);
        return bigRat(numerator, denominator);
    },

    handleWeaponDegree: function (self) {
        var mobile = false;
        if (self.sys.game.device.os.desktop) {
            self.crosshairX = input.mousePointer.x + self.cameras.main.worldView.x;
            self.crosshairY = input.mousePointer.y + self.cameras.main.worldView.y;
        }
        else {
            mobile = true;
            //yeni silah ekleyince buraya da ekle
            if (self.playerContainer.list[2].active) { //yere silah bırakma ui açar
                self.trash.setVisible(true);
            } else {
                self.trash.setVisible(false);
            }

            if (self.playerContainer.activeWeaponRef != undefined) { //silah değiştirme ui açar
                self.refresh.setVisible(true);
            } else {
                self.refresh.setVisible(false);
            }


            self.crosshairX = self.playerContainer.x + Math.cos(self.mousePoint.rotation + (90 * Math.PI / 180)) * 30 * 5;
            self.crosshairY = self.playerContainer.y + Math.sin(self.mousePoint.rotation + (90 * Math.PI / 180)) * 30 * 5;
            //console.log(self.crosshairX + ", " + self.crosshairY);

            self.mousePoint.setPosition(self.crosshairX, self.crosshairY);
        }

        if (mobile) {
            let angle = self.mousePoint.angle + 90;//-90 yaoınca silah doru yone bakıo ama yanlış yere ateş edio
            self.shotgun.angle = angle;

            if (angle - 90 > 0) {
                if (self.player.flipX == false) {
                    self.socket.emit('playerDir', true);
                    dir = true;

                    //yeni silah ekleyince buraya da ekle
                    self.playerContainer.list[1].flipX = true;
                    self.playerContainer.list[1].setRotation(-0.3);
                    self.playerContainer.list[1].x = -20;

                    self.playerContainer.list[2].flipY = true;
                    self.playerContainer.list[2].x = -15;
                }
                self.player.flipX = true;
            } else {
                if (self.player.flipX == true) {
                    //self.shotgun.x = 15;
                    self.socket.emit('playerDir', false);
                    dir = false;

                    self.playerContainer.list[1].flipX = false;
                    self.playerContainer.list[1].setRotation(0.3);
                    self.playerContainer.list[1].x = 20;

                    self.playerContainer.list[2].flipY = false;
                    self.playerContainer.list[2].x = 15;
                }
                self.player.flipX = false;
            }

            if (self.player.oldWeaponRotation == undefined) {
                self.player.oldWeaponRotation = 0;
            }

            angle = (angle * Math.PI) / 180; //degree to radian

            if (self.player.oldWeaponRotation != angle && Math.abs(self.player.oldWeaponRotation - angle) > 0.1) {
                self.socket.emit('playerWeaponRotation', angle);
                self.player.oldWeaponRotation = angle;
            }

            canShoot = true;
        } else {
            let angle = Phaser.Math.Angle.Between(self.playerContainer.x + self.shotgun.x, self.playerContainer.y + self.shotgun.y, self.crosshairX, self.crosshairY);
            self.shotgun.setRotation(angle);

            if (self.crosshairX < self.playerContainer.body.x + 16) {
                if (self.player.flipX == false) {
                    //self.shotgun.x = -15;
                    self.socket.emit('playerDir', true);
                    dir = true;

                    //yeni silah ekleyince buraya da ekle
                    self.playerContainer.list[1].flipX = true;
                    self.playerContainer.list[1].setRotation(-0.3);
                    self.playerContainer.list[1].x = -20;

                    self.playerContainer.list[2].flipY = true;
                    self.playerContainer.list[2].x = -15;
                }
                self.player.flipX = true;
            } else {
                if (self.player.flipX == true) {
                    //self.shotgun.x = 15;
                    self.socket.emit('playerDir', false);
                    dir = false;

                    self.playerContainer.list[1].flipX = false;
                    self.playerContainer.list[1].setRotation(0.3);
                    self.playerContainer.list[1].x = 20;

                    self.playerContainer.list[2].flipY = false;
                    self.playerContainer.list[2].x = 15;
                }
                self.player.flipX = false;
            }

            if (self.player.oldWeaponRotation == undefined) {
                self.player.oldWeaponRotation = 0;
            }

            if (self.player.oldWeaponRotation != angle && Math.abs(self.player.oldWeaponRotation - angle) > 0.1) {
                self.socket.emit('playerWeaponRotation', angle);
                self.player.oldWeaponRotation = angle;
            }

            if (Phaser.Math.Distance.Between(self.crosshairX, self.crosshairY, self.playerContainer.x, self.playerContainer.y) > 65) {
                canShoot = true
            } else {
                canShoot = false;
            }
        }
    },

    handleStopDir: function (self) {
        //baktığı yönde durdur
        player.anims.play('stop_left', true);
        if (dir == true) { //sağa bakıyor
            self.socket.emit('playerStopped'); //sağa bakarak durdu
        } else { //sola bakıyor
            self.socket.emit('playerStopped'); //sola bakarak durdu
        }
    },


    addPlayer: function (self, playerInfo) {
        self.player = self.add.sprite(0, 0, 'police').setScale(0.3);
        self.knife = self.add.sprite(0, 7, 'knife').setOrigin(0.5, 0.65).setScale(0.6).setRotation(0.3);
        self.shotgun = self.add.sprite(0, 7, 'shotgun').setOrigin(0.20, 0.5).setScale(0.6);
        if (playerInfo.weaponType == 1) {
            self.knife.setActive(true).setVisible(true);
            self.shotgun.setActive(false).setVisible(false);
        } else if (playerInfo.weaponType == 2) {
            self.knife.setActive(false).setVisible(false);
            self.shotgun.setActive(true).setVisible(true);
        }
        self.player.playerId = playerInfo.playerId;
        self.player.that = self;
        self.player.username = self.username;
        self.socket.emit('playerUsername', self.player.username);

        var nameText = self.add.text(0, -50, self.username + " | " + playerInfo.score, { fontFamily: 'Arial', fontSize: 22, color: '#000000' }).setOrigin(0.5);
        nameText.depth = 1000000;

        self.playerContainer = self.add.container(playerInfo.x, playerInfo.y, [self.player, self.knife, self.shotgun, nameText]);
        self.playerContainer.setSize(32, 40);
        //self.physics.world.enable(self.playerContainer);
        //self.playerContainer.body.setCollideWorldBounds(true);

        //self.playerContainer.body.setDrag(500,500);

        //self.player.setBounce(0);
        //dünya dışına çıkamasın diyoruz
        //self.player.setCollideWorldBounds(true);
        //karaktere yerçekimi verdik
        //self.player.body.setGravityY(300);

        //animasyonları oluşturuyoruz
        self.anims.create({
            key: 'left',
            frames: self.anims.generateFrameNumbers('police', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: -1 //-1 loop yap demek
        });

        self.anims.create({
            key: 'stop_left',
            frames: self.anims.generateFrameNumbers('police', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1 //-1 loop yap demek
        });

        self.anims.create({
            key: 'died',
            frames: self.anims.generateFrameNumbers('police', { start: 4, end: 4 }),
        });

        //zombi
        self.anims.create({
            key: 'left-zombie',
            frames: self.anims.generateFrameNumbers('zombie', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: -1 //-1 loop yap demek
        });

        self.anims.create({
            key: 'stop_left-zombie',
            frames: self.anims.generateFrameNumbers('zombie', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1 //-1 loop yap demek
        });

        self.anims.create({
            key: 'died-zombie',
            frames: self.anims.generateFrameNumbers('zombie', { start: 4, end: 4 }),
        });

        //player ve platform birbirine çarpacak dedik
        self.physics.add.collider(self.playerContainer, platforms);

        player = self.player;

        self.cameras.main.startFollow(self.playerContainer, false, 0.05, 0.05);

        self.myplayerGroup.add(self.playerContainer);

        if (playerInfo.dir) {
            self.playerContainer.list[0].flipX = true;

            self.playerContainer.list[1].flipX = true;
            self.playerContainer.list[1].setRotation(-0.3);
            self.playerContainer.list[1].x = -20;

            self.playerContainer.list[2].flipY = true;
            self.playerContainer.list[2].x = -15;
        } else {
            self.playerContainer.list[0].flipX = false;

            self.playerContainer.list[1].flipX = false;
            self.playerContainer.list[1].setRotation(0.3);
            self.playerContainer.list[1].x = 20;

            self.playerContainer.list[2].flipY = false;
            self.playerContainer.list[2].x = 15;
        }

        if (playerInfo.afk == true) {
            self.playerContainer.setActive(false).setVisible(false);
        }
    },


    addOtherPlayers: function (self, playerInfo) {
        var otherPlayer = self.add.sprite(0, 0, 'police').setScale(0.3);
        var otherPlayerKnife = self.add.sprite(0, 7, 'knife').setOrigin(0.5, 0.65).setScale(0.6).setRotation(0.3);
        var otherPlayerShotGun = self.add.sprite(0, 7, 'shotgun').setOrigin(0.20, 0.5).setScale(0.6);
        if (playerInfo.weaponType == 1) {
            otherPlayerKnife.setActive(true).setVisible(true);
            otherPlayerShotGun.setActive(false).setVisible(false);
        } else if (playerInfo.weaponType == 2) {
            otherPlayerKnife.setActive(false).setVisible(false);
            otherPlayerShotGun.setActive(true).setVisible(true);
        }
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.username = playerInfo.username;
        otherPlayer.that = self;
        otherPlayer.lastTimeDamagedOther = 0;

        var nameText = self.add.text(0, -50, playerInfo.username + " | " + playerInfo.score, { fontFamily: 'Arial', fontSize: 22, color: '#000000' }).setOrigin(0.5);
        nameText.depth = 1000000;

        var playerContainerOther = self.add.container(playerInfo.x, playerInfo.y, [otherPlayer, otherPlayerKnife, otherPlayerShotGun, nameText]);
        playerContainerOther.setSize(32, 40);
        //self.physics.world.enable(playerContainerOther);
        //playerContainerOther.body.setCollideWorldBounds(true);

        //playerContainerOther.body.setDrag(500,500);
        //self.physics.add.overlap(self.platforms, self.bulletsGroup, GetDamage, null, this);

        if (playerInfo.dir) {
            playerContainerOther.list[0].flipX = true;

            playerContainerOther.list[1].flipX = true;
            playerContainerOther.list[1].setRotation(-0.3);
            playerContainerOther.list[1].x = -20;

            playerContainerOther.list[2].flipY = true;
            playerContainerOther.list[2].x = -15;
        } else {
            playerContainerOther.list[0].flipX = false;

            playerContainerOther.list[1].flipX = false;
            playerContainerOther.list[1].setRotation(0.3);
            playerContainerOther.list[1].x = 20;

            playerContainerOther.list[2].flipY = false;
            playerContainerOther.list[2].x = 15;
        }



        playerContainerOther.list[2].setRotation(playerInfo.angle);
        //player ve platform birbirine çarpacak dedik
        //self.physics.add.collider(self.otherPlayer, platforms);

        if (playerInfo.afk == true) {
            playerContainerOther.setActive(false).setVisible(false);
        }

        self.otherPlayers.add(playerContainerOther);
    },


    GetDamage: function (bullet, player) {
        if (bullet.active == true && player.active == true) {
            bullet.setActive(false).setVisible(false);

            var bloodInstance = bloods.create(player.body.x + (player.width / 2) + Phaser.Math.Between(-24, 24), player.body.y + (player.height / 2) + Phaser.Math.Between(-20, 20), 'blood').setScale(0.5).refreshBody();
            bloodInstance.setRotation(Phaser.Math.Between(0, 360));
            bloodInstance.depth = 1;

            if (player.list[0].that.playerContainer.list[0].playerId == player.list[0].playerId) {
                //sadece vurulan bilgi göndersin

                if (bullet.owner != undefined && bullet.owner.list[0].username != "noname" && bullet.owner.list[0].username.indexOf(player.list[0].username.substring(0, 3)) < 0) {
                    player.list[0].that.socket.emit('playerDamaged', bullet.owner.list[0].playerId);

                    player.list[0].that.health -= 25;
                    player.list[0].that.cameras.main.shake(200, 0.01);
                    //player.list[0].that.hpText.setText('HP: ' + player.list[0].that.health);
                    player.list[0].that.setValue(player.list[0].that.healthBar, player.list[0].that.health);
                    //console.log("VURULDUM");
                }


            } else {
                //console.log("vurdum");
            }

            player.list[0].that.tweens.addCounter({
                from: 0,
                to: 255,
                duration: 200,
                onUpdate: function (tween) {
                    const value = Math.floor(tween.getValue());

                    player.list[0].setTint(Phaser.Display.Color.GetColor(255, value, value));
                }
            });
        }

    },

    GetDamageFromZombie: function (player, zombie) {
        if (player.list[0].that.lastTimeDamaged < player.list[0].that.time && player.active == true) {
            var bloodInstance = bloods.create(player.body.x + (player.width / 2) + Phaser.Math.Between(-24, 24), player.body.y + (player.height / 2) + Phaser.Math.Between(-20, 20), 'blood').setScale(0.5).refreshBody();
            bloodInstance.setRotation(Phaser.Math.Between(0, 360));
            bloodInstance.depth = 1;

            player.list[0].that.health -= 25;
            player.list[0].that.socket.emit('playerDamaged');
            player.list[0].that.cameras.main.shake(200, 0.01);
            //player.list[0].that.hpText.setText('HP: ' + player.list[0].that.health);
            player.list[0].that.setValue(player.list[0].that.healthBar, player.list[0].that.health);
            player.list[0].that.lastTimeDamaged = player.list[0].that.time + 1000;

            player.list[0].that.tweens.addCounter({
                from: 0,
                to: 255,
                duration: 200,
                onUpdate: function (tween) {
                    const value = Math.floor(tween.getValue());

                    player.list[0].setTint(Phaser.Display.Color.GetColor(255, value, value));
                }
            });
        }
    },

    //üsttekinin aynısı sadece veri göndermiyor
    GetDamageFromZombieOthers: function (player, zombie) {
        if (player.list[0].lastTimeDamagedOther < player.list[0].that.time) {
            var bloodInstance = bloods.create(player.body.x + (player.width / 2) + Phaser.Math.Between(-24, 24), player.body.y + (player.height / 2) + Phaser.Math.Between(-20, 20), 'blood').setScale(0.5).refreshBody();
            bloodInstance.setRotation(Phaser.Math.Between(0, 360));
            bloodInstance.depth = 1;

            player.list[0].lastTimeDamagedOther = player.list[0].that.time + 1000;

            player.list[0].that.tweens.addCounter({
                from: 0,
                to: 255,
                duration: 200,
                onUpdate: function (tween) {
                    const value = Math.floor(tween.getValue());

                    player.list[0].setTint(Phaser.Display.Color.GetColor(255, value, value));
                }
            });
        }
    },

    ShootWall: function (bullet, wall) {
        if (bullet.active == true) {
            bullet.setActive(false).setVisible(false);
        }
    },

    ShootBox: function (bullet, box) {
        if (bullet.active == true) {
            if (box.hp <= 0) {
                box.that.socket.emit('boxBroke', box.boxID);
            } else {
                box.hp -= 1;
                box.that.tweens.addCounter({
                    from: 255,
                    to: 150,
                    duration: 100,
                    onUpdate: function (tween) {
                        const value = Math.floor(tween.getValue());

                        box.setTint(Phaser.Display.Color.GetColor(value, value, value));
                    }
                });
            }
            bullet.setActive(false).setVisible(false);
        }
    },

    ZombieGetDamage: function (bullet, zombie) {
        if (bullet.active == true) {
            bullet.setActive(false).setVisible(false);

            var bloodInstance = bloods.create(bullet.x, bullet.y, 'blood').setScale(0.5).refreshBody();
            bloodInstance.setRotation(Phaser.Math.Between(0, 360));
            bloodInstance.depth = 1;

            zombie.health -= 25;
            if (bullet.owner != undefined) {
                zombie.that.socket.emit('zombieDamaged', { id: zombie.zombieID, shooter: bullet.owner.list[0].playerId });
            } else {
                console.log("Bullet has no owner!");
            }


            zombie.that.tweens.addCounter({
                from: 0,
                to: 255,
                duration: 200,
                onUpdate: function (tween) {
                    const value = Math.floor(tween.getValue());

                    zombie.setTint(Phaser.Display.Color.GetColor(255, value, value));
                }
            });
        }

    },

    //üsttekinin aynısı sadece veri göndermiyor
    ZombieGetDamageOthers: function (bullet, zombie) {
        if (bullet.active == true) {
            bullet.setActive(false).setVisible(false);

            var bloodInstance = bloods.create(bullet.x, bullet.y, 'blood').setScale(0.5).refreshBody();
            bloodInstance.setRotation(Phaser.Math.Between(0, 360));
            bloodInstance.depth = 1;

            zombie.health -= 25;

            zombie.that.tweens.addCounter({
                from: 0,
                to: 255,
                duration: 200,
                onUpdate: function (tween) {
                    const value = Math.floor(tween.getValue());

                    zombie.setTint(Phaser.Display.Color.GetColor(255, value, value));
                }
            });
        }

    },

    recoilOnCompleteHandler: function (tween, targets, self, weaponOwner, weapon, x1, x2, t) {
        //recoil
        var tween = self.tweens.add({
            targets: weapon,
            x: weaponOwner.flipX == true ? x1 : x2,
            ease: 'Linear',
            duration: t,
            yoyo: false,
            repeat: 0,
        });
    },


    ShootReceived: function (self, shootInfo) {
        var playerInfo = shootInfo.owner; //shooter
        var info = shootInfo.info;

        var bullet = self.enemyBullets.get().setActive(true).setVisible(true);




        var findPlayer;
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo == otherPlayer.list[0].playerId) {
                findPlayer = otherPlayer;
            }
        });


        if (bullet) {
            bullet.owner = findPlayer;
            console.log(bullet.owner.list[0].username);

            var startPoint = new Phaser.Geom.Point(info.x1, info.y1);
            var point = new Phaser.Geom.Point(info.x2, info.y2);

            //açıyı hesapladık
            var angle = Phaser.Math.Angle.BetweenPoints(startPoint, point);
            bullet.setRotation(angle);
            bullet.depth = 5;

            bullet.fire(startPoint, point);

            //ateş edenin kendisi hariç diğerlerine temas edebilecek kurşun

            self.physics.add.collider(self.myplayerGroup, bullet, self.GetDamage);
            self.physics.add.collider(platforms, bullet, self.ShootWall);
            self.physics.add.collider(self.boxes, bullet, self.ShootWall);
            self.physics.add.collider(self.zombies, bullet, self.ZombieGetDamageOthers);

            var bulletInstance = bulletFires.create(startPoint.x, startPoint.y, 'bullet_fire').setScale(1.5);
            bulletInstance.depth = 5000;
            //silahtan çıkan ateşi siler
            setTimeout(function () {
                bulletInstance.destroy();
            }, 30);

            if (findPlayer != undefined) {
                //recoil
                var tween = self.tweens.add({
                    targets: findPlayer.list[2],
                    x: (findPlayer.list[0].flipX == true ? -3 : 3),
                    ease: 'Power1',
                    duration: 20,
                    yoyo: false,
                    repeat: 0,
                    onComplete: self.recoilOnCompleteHandler,
                    onCompleteParams: [self, findPlayer.list[0], findPlayer.list[2], -15, 15, 100]

                });
            }

        }

    },
    /*
    if (this.sys.game.device.os.desktop == false) {
                }*/
    GetWeaponFromGround: function (player, shotgun) {
        if (shotgun.active == true) {
            if (player.list[0].that.isTouchingShotgunEnumerator != undefined) {
                clearTimeout(player.list[0].that.isTouchingShotgunEnumerator);
            }

            if (player.list[0] != undefined) {
                player.list[0].that.isTouchingShotgunEnumerator = setTimeout(function () {
                    if (player.list[0] != undefined) {
                        player.list[0].that.CheckCollisionForWeapon(player.list[0].that);
                    }
                }, 200);


                player.list[0].that.isTouchingShotgun = true;
                player.list[0].that.touchingShotgun = shotgun;
                if (player.list[0].that.sys.game.device.os.desktop == false) {
                    player.list[0].that.hand.setVisible(true);
                }
            }

        }
    },

    GetAmmoFromGround: function (player, ammo) {
        if (player.list[0].that.isTouchingAmmoEnumerator != undefined) {
            clearTimeout(player.list[0].that.isTouchingAmmoEnumerator);
        }

        if (player.list[0] != undefined) {
            player.list[0].that.isTouchingAmmoEnumerator = setTimeout(function () {
                if (player.list[0] != undefined) {
                    player.list[0].that.CheckCollisionForAmmo(player.list[0].that);
                }
            }, 200);
            player.list[0].that.isTouchingAmmo = true;
            player.list[0].that.touchingAmmo = ammo;
            if (player.list[0].that.sys.game.device.os.desktop == false) {
                player.list[0].that.hand.setVisible(true);
            }
        }
    },

    GetHpFromGround: function (player, hp) {
        if (player.list[0].that.isTouchingHpEnumerator != undefined) {
            clearTimeout(player.list[0].that.isTouchingHpEnumerator);
        }

        if (player.list[0] != undefined) {
            player.list[0].that.isTouchingHpEnumerator = setTimeout(function () {
                if (player.list[0] != undefined) {
                    player.list[0].that.CheckCollisionForHp(player.list[0].that);
                }
            }, 200);
            player.list[0].that.isTouchingHp = true;
            player.list[0].that.touchingHp = hp;
            if (player.list[0].that.sys.game.device.os.desktop == false) {
                player.list[0].that.hand.setVisible(true);
            }
        }
    },

    CheckCollisionForWeapon: function (self) {
        self.isTouchingShotgun = false;
        self.hand.setVisible(false);
    },

    CheckCollisionForAmmo: function (self) {
        self.isTouchingAmmo = false;
        self.hand.setVisible(false);
    },

    CheckCollisionForHp: function (self) {
        self.isTouchingHp = false;
        self.hand.setVisible(false);
    },

    anyKey: function (event) {
        let code = event.keyCode;
        if (code == Phaser.Input.Keyboard.KeyCodes.E) {
            if (this.isTouchingShotgun == true && this.playerContainer.activeWeaponRef == null) {
                this.socket.emit('grabWeapon', this.touchingShotgun.weaponID);
            } else if (this.isTouchingAmmo == true && this.playerContainer.activeWeaponRef != null) {
                this.socket.emit('grabAmmo', this.touchingAmmo.ammoID);
            } else if (this.isTouchingHp == true && this.health < this.level * 100) {
                this.socket.emit('grabHp', this.touchingHp.hpID);
            }
        }

        if (code == Phaser.Input.Keyboard.KeyCodes.G) {
            if (this.playerContainer.activeWeaponRef != undefined) {
                this.socket.emit('dropWeapon', { weaponID: this.playerContainer.weaponID, x: this.playerContainer.x, y: this.playerContainer.y });
            }
        }

        if (code == Phaser.Input.Keyboard.KeyCodes.ENTER) {
            if (document.getElementById("chatbox").value != "") {
                //pulls the value from the chatbox ands sets it to lastUserMessage
                lastUserMessage = this.username + ": " + document.getElementById("chatbox").value;
                this.socket.emit('chatmsg', lastUserMessage);

                //sets the chat box to be clear
                document.getElementById("chatbox").value = "";
                //adds the value of the chatbox to the array messages
                messages.push(lastUserMessage);
                //outputs the last few array elements of messages to html
                for (var i = 1; i < 6; i++) {
                    if (messages[messages.length - i])
                        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
                }

            }
            let el = document.querySelector(':focus');
            if (el) el.blur();
        }

        if (code == Phaser.Input.Keyboard.KeyCodes.T) {
            document.getElementById("chatbox").focus();
        }

    },
    makeBar(x, y, color) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 8, 200, 18);


        let barRed = this.add.graphics();

        //color the bar
        barRed.fillStyle(0xff0000, 1);

        //fill the bar with a rectangle
        barRed.fillRect(0, 8, 200, 18);
        barRed.setScrollFactor(0);
        barRed.depth = 1450000;

        let barBlack = this.add.graphics();

        //color the bar
        barBlack.fillStyle(0x000000, 1);

        //fill the bar with a rectangle
        barBlack.fillRect(-5, 4, 209, 26);
        barBlack.setScrollFactor(0);
        barBlack.depth = 1350000;

        //position the bar
        bar.x = x;
        bar.y = y;

        barRed.x = x;
        barRed.y = y;

        barBlack.x = x;
        barBlack.y = y;

        //return the bar
        return bar;
    },

    setValue(bar, percentage) {
        //scale the bar
        bar.scaleX = percentage / 100;
    }

});
var DEFAULT_WIDTH = 960;
var DEFAULT_HEIGHT = 540;

var config = {
    type: Phaser.AUTO,
    scale: {
        // we do scale the game manually in resize()
        mode: Phaser.Scale.FIT,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    input: {
        activePointers: 4,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    audio: {
        disableWebAudio: true
    },
    scene: [MenuScene, GameScene]
};

var game;
window.addEventListener('load', () => {
    game = new Phaser.Game(config)

});

//OYUN YAYINLANMADAN AÇ

document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        if (document.getElementById("chatbox") != undefined && document.getElementById("chatbox") == document.activeElement) {
            document.getElementById("chatbox").value += " ";
        }
    }

    if (e.ctrlKey || e.keyCode == 123) {
        return false;
    } else {
        return true;
    }
};

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

var messages = [], //array that hold the record of each string in chat
    lastUserMessage = ""; //keeps track of the most recent input string from the user

//var game = new Phaser.Game(config);

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

        // Bullet Constructor
        function Bullet(scene) {
            Phaser.GameObjects.Image.call(this, scene);

            this.setTexture('bullet');
            this.setPosition(0, 0);
            this.speed = 1;
            this.born = 0;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setScale(2);
            //this.setSize(12, 12, true);

        },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target) {

        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        //this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned

    },

    // Updates the position of the bullet each cycle
    update: function (time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});
