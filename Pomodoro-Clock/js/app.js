'use strict'

var timerModes = {STOPPED: 'stopped', STARTED: 'started'};

var timer = {currentMode: timerModes.STOPPED, initialSessionTime: 1500, currentSessionTime: 1500, initialBreakTime: 300, breakTime: 300, interval: null};

var beep = new Audio('http://soundbible.com/mp3/Short Beep Tone-SoundBible.com-1937840853.mp3');

var progressBar = new ProgressBar.Circle('#progress-bar-container', {
    easing: 'linear',
    duration: 1000,
    strokeWidth: 5,
    trailWidth: 2,
    color: '#009688',
    text: {
      value: 'Session: ' + convertNumToTime(timer.initialSessionTime),
      className: 'progress-bar-label'
    },
});

function convertNumToTime(num) {
    var minutes = Math.floor(num / 60);
    var seconds = num - minutes * 60; 
    if(seconds > 9) {
        return minutes + ':' + seconds;
    }
    else {
        return minutes + ':0' + seconds;
    } 
} 

function startTimer() {
    timer.currentMode = timerModes.STARTED;
    $('#control-button').text('Stop');
    timer.interval = setInterval(subtractTime, 1000);
}

function stopTimer() {
    timer.currentMode = timerModes.STOPPED;
    $('#control-button').text('Start');
    clearInterval(timer.interval);
    progressBar.set(0);
    resetTime();
}

function resetTime() {
    timer.currentSessionTime = timer.initialSessionTime; 
    timer.breakTime =  timer.initialBreakTime;
    $('.progress-bar-label').text('Session: ' + convertNumToTime(timer.currentSessionTime));
}

function subtractTime() {   
    if(timer.currentSessionTime > 0) {
        -- timer.currentSessionTime;
        $('.progress-bar-label').text('Session: ' + convertNumToTime(timer.currentSessionTime));
        var fillPercentage = (timer.initialSessionTime - timer.currentSessionTime) / timer.initialSessionTime;
        progressBar.animate(fillPercentage);
        if(timer.currentSessionTime === 0) {
            beep.play();
            progressBar.set(0);
        }
       
    }
    else if(timer.breakTime > 0) {
        -- timer.breakTime;
        $('.progress-bar-label').text('Break: ' + convertNumToTime(timer.breakTime));
        var fillPercentage = (timer.initialBreakTime - timer.breakTime) / timer.initialBreakTime;
        progressBar.animate(fillPercentage);
        if(timer.breakTime === 0) {
            beep.play();
            progressBar.set(0);
        }
    }
    else {
        resetTime();
    }
}

$(document).ready(function() {
    $('#session-slider').on('input change', function() {
        timer.initialSessionTime = timer.currentSessionTime = 60 * parseInt($('#session-slider').val()); 
        $('#session-slider-label').text('Session Duration: ' + $('#session-slider').val() + ' minute(s)');
        $('.progress-bar-label').text('Session: ' + convertNumToTime(timer.currentSessionTime));
    });
    $('#break-slider').on('input change', function() {
        timer.initialBreakTime = timer.breakTime = 60 * parseInt($('#break-slider').val()); 
        $('#break-slider-label').text('Break Duration: ' + $('#break-slider').val() + ' minute(s)');
    });    
    $('#control-button').click(function() {
        if(timer.currentMode === timerModes.STOPPED) {
            startTimer();
        }
        else {
            stopTimer();            
        }
    });
});