var game = {
    isPowered: false,
    hasStarted: false,
    isStrict: false,
    isPlayingSequence: false,
    playerHasClicked: false,
    levelLimit: 20,
    values: ['green', 'red', 'yellow', 'blue'],
    sounds: {
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        error: new Audio('http://soundbible.com/mp3/Computer Error Alert-SoundBible.com-783113881.mp3'),
        win: new Audio('http://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3')
    },
    sequence: [],
    playerSequenceCount: 0,
    sequenceInterval: null
};

function handleColorButtonClick() {
    if (game.isPowered && game.hasStarted && !game.isPlayingSequence && !game.playerHasClicked) {
        var playerInput = $(this).data('value');
        game.playerHasClicked = true;
        if (playerInput === game.sequence[game.playerSequenceCount]) {
            $(".color-button[data-value=" + game.sequence[game.playerSequenceCount] + "]").addClass('active');
            game.sounds[game.sequence[game.playerSequenceCount]].play();
            game.sounds[game.sequence[game.playerSequenceCount]].addEventListener("ended", function() {
                $(".color-button[data-value=" + game.sequence[game.playerSequenceCount] + "]").removeClass('active');
                if (game.playerSequenceCount < game.levelLimit) {
                    game.playerHasClicked = false;
                }
            });
            game.playerSequenceCount++;
            if (game.playerSequenceCount === game.sequence.length) {
                if (game.sequence.length === game.levelLimit) {
                    setSequenceCountDisplay('W');
                    setTimeout(function() {
                        game.sounds.win.play();
                    }, 500);
                    setTimeout(function() {
                        startGame();
                    }, 2000);
                } else {
                    game.playerSequenceCount = 0;
                    addToSequence();
                    setTimeout(function() {
                        playSequence();
                    }, 500);
                }
            }
        } else {
            game.sounds.error.play();
            setSequenceCountDisplay('X');
            if (game.isStrict) {
                setTimeout(function() {
                    startGame();
                }, 1000);
            } else {
                setTimeout(function() {
                    game.playerSequenceCount = 0;
                    game.playerHasClicked = false;
                    playSequence();
                }, 500);
            }
        }
    }
}

function playSequence() {
    var count = 0;
    game.isPlayingSequence = true;
    game.sequenceInterval = setInterval(function() {
        if (count < game.sequence.length) {
            $(".color-button[data-value=" + game.sequence[count] + "]").addClass('active');
            game.sounds[game.sequence[count]].play();
            game.sounds[game.sequence[count]].addEventListener("ended", function() {
                $(".color-button[data-value=" + game.sequence[count - 1] + "]").removeClass('active');
            });
            count++;
            setSequenceCountDisplay(game.sequence.length);
        } else {
            game.isPlayingSequence = false;
            clearInterval(game.sequenceInterval);
        }
    }, 1000);
}

function startGame() {
    if (game.isPowered) {
        if (game.hasStarted) {
            resetGameConditions();
        } else {
            game.hasStarted = true;
        }
        addToSequence();
        playSequence();
    }
}

function togglePower() {
    if (game.isPowered) {
        resetGameConditions('all');
    } else {
        game.isPowered = true;
        $('#switch').addClass('switch-on');
        setSequenceCountDisplay('--');
    }
}

function resetGameConditions(type) {
    game.sequence = [];
    game.playerSequenceCount = 0;
    game.playerHasClicked = false;
    clearInterval(game.sequenceInterval);
    setSequenceCountDisplay('--');
    $('.color-button').removeClass('active');
    if (type === 'all') {
        game.isPowered = false;
        game.isStrict = false;
        game.hasStarted = false;
        setSequenceCountDisplay('');
        $('#switch').removeClass('switch-on');
        $('#strict-mode-indicator').removeClass('active');
    }
}

function setSequenceCountDisplay(message) {
    $('#sequence-count').text(message);
}

function addToSequence() {
    game.sequence.push(game.values[Math.floor(Math.random() * game.values.length)]);
}

function toggleStrictMode() {
    var strictModeIndicator = $('#strict-mode-indicator');
    if (game.isPowered) {
        if (game.isStrict) {
            game.isStrict = false;
            strictModeIndicator.removeClass('active');
        } else {
            game.isStrict = true;
            strictModeIndicator.addClass('active');
        }
    }
}

$(function() {
    $('#switch-slot').on('click', togglePower);
    $('#start-button').on('click', startGame);
    $('#strict-button').on('click', toggleStrictMode);
    $('.color-button').on('click', handleColorButtonClick);
});