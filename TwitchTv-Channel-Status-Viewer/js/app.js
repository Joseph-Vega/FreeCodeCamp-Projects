function getChannelData(){
    var channelsURL = "https://api.twitch.tv/kraken/channels/";
    var streamsURL = "https://api.twitch.tv/kraken/streams/";
    var channels = ["freecodecamp", "OgamingSC2", "gsl", "ESL_SC2", "dreadztv", "thijshs", "noobs2ninjas", "cretetion", "comster404", "brunofin"];   
    channels.forEach(function(channel) {
         $.getJSON(streamsURL + channel + "?callback=?", function(data) {
             var status, logo, url, description;
             if (data.stream === null) {
                 status = "offline";
                 description = "Offline";
             } else if (data.stream === undefined) {
                 status = "offline";
                 description = "Invalid";
             } else {
                 status = "online";
                 description = data.stream.game + ": " + data.stream.channel.status;
             };               
             $.getJSON(channelsURL + channel + "?callback=?", function(data) {
                 logo = data.logo != null ? data.logo : "http://dummyimage.com/100X100/000/fff.png&text=0x3F";
                 url = "https://www.twitch.tv/" + channel;                 
                 var html = '<div class="row valign-wrapper z-depth-1 ' + status + '">' + 
                     '<div class="channelLogo col s4 m2 l1 valign">'+ '<img class="responsive-img" src="' + logo + '">' + '</div>' + 
                     '<div class="channelName col s4 m5 l5 valign center-align">' + '<a href="' + url + '">' + channel + '</a></div>' +
                     '<div class="channelDescription col s4 m5 l6 valign center-align truncate">' + description + '</div>'
                     '</div>';                       
                status === "online" ? $("#channels").prepend(html) : $("#channels").append(html);             
            });
        });        
    });
}
$(document).ready(function() {
    getChannelData();
    $(".filterButton").on("click", function() {
            if($(this).attr("id") === "offlineButton") {
                $(".offline").removeClass("hide"); 
                $(".online").addClass("hide");               
            }
            else if($(this).attr("id") === "onlineButton") {
                $(".online").removeClass("hide");
                $(".offline").addClass("hide");                
            } else {               
                $(".online").removeClass("hide");
                $(".offline").removeClass("hide");
            }       
    });
});