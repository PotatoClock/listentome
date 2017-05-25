function initialRun() {
    var audio = new Audio();
    // SEARCH QUERY
    function searchTracks(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                if (response.tracks.items.length) {
                    var track = response.tracks.items[0];
                    if (track.is_playable) {
                        communicateAction('<div>Unfortunately, this track is not playable from your current location :( Please try another Track!</div>');
                    } else {
                        $(".now-playing").remove();
                        communicateAction('<div class="text-center now-playing"> Now Playing ' + track.name + ' by ' + track.artists[0].name + '</div><img width="150" src="' + track.album.images[1].url + '">');
                        audio.src = track.preview_url;
                        audio.play();
                    }
                }
            }
        });
    }

    function playSong(songName, artistName) {
        var query = songName;
        if (artistName) {
            query += ' artist:' + artistName;
        }

        searchTracks(query);
    }

    function communicateAction(text) {
        var rec = document.getElementById('conversation');
        rec.innerHTML += '<div class="action now-playing text-center">' + text + '</div>';
    }

    function recognized(text) {
        var rec = document.getElementById('conversation');
        rec.innerHTML += '<div class="recognized text-center now-playing"><div>' + text + '</div></div>';
    }

    function makeListen() {
        console.log("click");
        annyang.start();
    }

    if (annyang) {
        // ANNYANG COMMANDS
        var commands = {
            'stop': function () {
                audio.pause();
            },
            'play track *song': function (song) {
                recognized('Play track ' + song);
                playSong(song);
            },
            'play *song by *artist': function (song, artist) {
                recognized('Play song ' + song + ' by ' + artist);
                playSong(song, artist);
            },
            'play song *song': function (song) {
                recognized('Play song ' + song);
                playSong(song);
            },
            'play *song': function (song) {
                recognized('Play ' + song);
                playSong(song);
            },

            ':nomatch': function (message) {
                recognized(message);
                communicateAction('I could not understand your command. Please try again!');
            }
        };

        // Add commands to annyang
        annyang.addCommands(commands);

        // SUBROUTINE TO START ANNYANG IN A BUTTON
        $('.btn').click(function () {
            console.log("click");
            annyang.start();
        });

        // Initialize SpeechKITT GUI
        speechKittIntitialize();
    }
    // DASTARDLY ERROR MESSAGE; NEED TO ADD MORE DEBUGGING FEATURES HERE.

    /* annyang.addCallback('error', function () {
        communicateAction('error');
    }); */

    annyang.addCallback('start', function () {
        communicateAction('Listern Event Started');
    });
    annyang.addCallback('soundstart', function () {
        communicatedAction('soundstart');
    });
    annyang.addCallback('resultNoMatch', function () {
        communicatedAction('Command Not Found');
    });
    annyang.addCallback('errorPermissionBlocked', function () {
        communicatedAction('Microphone Permission Blocked. Please Check Your Browser Settings.');
    });
    annyang.addCallback('errorNetwork', function () {
        communicatedAction('Network Error');
    });
    annyang.addCallback('errorPermissionDenied', function () {
        communicatedAction('Microphone Permission Denied By User');
    });
    annyang.addCallback('resultMatch', function (userInput, cmdText, tString) {
        console.log(userInput);
        console.log(cmdText);
        console.log(tString);
    });
}

function speechKittIntitialize() {
    SpeechKITT.annyang();
    SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');
    SpeechKITT.vroom();
}
