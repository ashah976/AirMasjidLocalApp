﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$(document).ready(function () {
    $(function () {



        $.backstretch("/Images/Wallpapers/olive-green-canvas-fabric-texture.jpg");

      

    }
    );

  
   

    $(window).fontResizer({
        elements: [

            { elem: $('#tblPrayerTimes'), size: 20 },
            { elem: $("#divDigitalClock"), size: 30 },
            { elem: $("#spanBasmala"), size: 120 },
            //{ elem: $("#lblInternalIP"), size: 15 },
            //{ elem: $("#lblExternalIP"), size: 15 },
            { elem: $("#spanRadioInfo"), size: 20 },
            { elem: $("#spanChannels"), size: 20 },
            { elem: $("#divRadioinfo"), size: 20 },
            { elem: $("#divAirMasjidOptions"), size: 25 },
            { elem: $("#divAirMasjidStreamDetails"), size: 25 },
            { elem: $("#divCameraStateInfo"), size: 35 }

            
        ]
        , baseWidth: 1980
        , startResize: true
        , sizeUnit: "px"
    }
    );





    var now = new moment();
    var month = now.format("MMMM");  //April (need this in lower case )
    var date = now.format('DD');   // 22

    //get todays prayer times
    GetPrayerTimesDaily(date, month,"today");


    let dttomorrow = moment(now.add(1, 'days'));
    var tmonth = dttomorrow.format("MMMM");
    var tdate = dttomorrow.format('DD');

    //get tomorrows prayer times
    GetPrayerTimesDaily(tdate, tmonth, "tomorrow");


    GetPrayerTimesJamaat();

    
    GetUserPreferences();

    setInterval(function () {
        GetUserPreferences();
        //alert("called");
    }, 20 * 1000); // 60 * 1000 milsec


   
    
}
);




$(document).ready(function () {
    $(function () {

        $("#divDigitalClock").clock({ "langSet": "en", "format": "24" }); //>> will have military style 24 hour format
    }
    );


}

);




window.onload = function () {

    $("#divDigitalClock").clock({ "langSet": "en", "format": "24" }); //>> will have military style 24 hour format


};

$(function () {
    $("#tblPrayerTimes").resizable(onresize);

}


);


function GetUserPreferences() {

   

    $.ajax({
        type: "POST",
        url: "/Index?handler=getuserpreferences",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        //data: '{ViewMode:"' + ViewMode + '", serial: "' + serial + '" }',
       // data: JSON.stringify("1"),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {
            

            var obj = JSON.parse(data);


            SetMic(obj.micstatus, obj.establishname);

            SetUserOptions(obj.autoscreen, obj.tahajjud, obj.events, obj.establishid, obj.viewmode, obj.establishname);

            SetDashboardState(obj.micstatus, obj.establishname, obj.audiourl, obj.videourl,obj.viewmode,obj.autoscreen,obj.cameradesc,obj.videocdn);

            if ($('#twitter').length > 0) {
                document.querySelector("#twitter").setAttribute("href", obj.tweetid);

                $.getScript("//platform.twitter.com/widgets.js");
            }

          


        },
        failure: function (response) {

            alertfailed("failed to get user preferences");



        }
    }
    );


}

function SetMic(micstatus, establishname) {

    

    if (micstatus == "0") {

       
        console.log("mic is off and camera is " + establishname);
        $("#btnRadioStatus").prop('value', 'offline');
        $("#btnRadioStatus").css('background', 'gray');
        $("#btnRadioStatus").css('color', 'white');
        $("#btnRadioStatus").prop('disabled', true);
    }
    else if (micstatus == "1") {
        console.log("mic is on and camera is " + establishname);

        $("#btnRadioStatus").prop('value', 'Live BroadCasting');
        $("#btnRadioStatus").css('background', 'red');
        $("#btnRadioStatus").css('color', 'white');
        $("#btnRadioStatus").prop('disabled', false);


    }




}





function SetUserOptions(autoscreen, tahajjud, events, establishid, viewmode, establishname) {

    


    //var autoScreen = userOptionsfields[0];
    //var establishID = userOptionsfields[1];
    //var viewMode = userOptionsfields[2];
    //var events = userOptionsfields[3];
    //var establishName = userOptionsfields[4];
    //var tahajjudazan = userOptionsfields[5];

    console.log("user establish name:" + establishname);
    console.log("user tahajjud azan value:" + tahajjud);

    //set hiddenfields to be used by broadcast

    $("#hidViewMode").text(viewmode);
    $("#hidAutoScreen").text(autoscreen);
    $("#hidTahajjudAzan").text(tahajjud);

    $("#streamDescMain").text(establishname);



    if (autoscreen == "0") {

        console.log("viewmode " + autoscreen);
        $("#lblViewModeText").text("Audio Only");
        //          var videostatus = $("#streamDescMain").text();

    }
    else if (autoscreen == "1") {
        console.log("viewmode: " + viewmode);
        $("#lblViewModeText").text("View & Audio");

    }

    if (autoscreen == "0") {
        console.log("autoscreen: " + autoscreen);
        $('#chkAutoScreenStatus').prop('checked', false);

    }
    else if (autoscreen == "1") {
        console.log("autoscreen: " + autoscreen);
        $('#chkAutoScreenStatus').prop('checked', true);

    }




}


function SetDashboardState(micstatus, establishname, audiourl, videourl,viewmode,autoscreen,cameradesc,videocdn) {



    //need to check if tahajjudzan has begun
    //check if audio is live
    //check if video is live
    //access what mode to put screen in (hadith/camera/floating)

    
    viewMode = $("#hidViewMode").text();
    var autoScreen = $("#hidAutoScreen").text();



    console.log("ViewMode from hiddenfield: " + viewMode);

    //var micstatus = estbroadcastfields[1];
    //var audioStream = estbroadcastfields[2];
    //var cameraID = estbroadcastfields[3];
    //var cameraDesc = estbroadcastfields[4];
    //var videoStream = estbroadcastfields[5];
    //var videoCDN = estbroadcastfields[6];
    //var userCount = estbroadcastfields[7];  //estasblishment count

    //var isTahajjud = estbroadcastfields[8];  //estasblishment count
    
   // console.log("isTahajjud: " + estbroadcastfields[8]);


    CheckAudio(audiourl);
    CheckVideo(videourl);

    
    jsHadithShow(cameradesc);  //temp stamp to get carsouel working
    
    GetImages();

   

    
    console.log("autoscreen value=" + autoscreen);
    if (autoscreen == "1" && micstatus == "1") {

        console.log("flip sequence started");
        flipTV();

    }


    if (viewMode == "0") {
        //dont care if mic is on or off            
        jsHadithShow();
        playAudio(audiourl);  //make sure stopping video here  currently stops video after playing audio

    }

    else if (viewmode == "1" && micstatus == "1") {

     
        $("#lblCameraViewDesc").text(cameradesc);
        
        $("#divHadiths").hide();
        $("#divEvents").hide();
        $("#divCamera").show();

        //play video here - videostream will be null if videomode=0
        //if video is null then play audio

        //check for labels on screen if audio/video are online?
       // if (videocdn === "") {




        if ($("#lblvideostatus").text() === "Video Offline") {

            console.log("video stream is offline attempting audio only");

            //sometimes the next stream starts too quickly resulting in a non-playing loop
            playAudio(audiourl);
        }
        else {

            playVideo(videocdn);
        }

    }
    else if (viewmode == "1" && micstatus == "0") {

        $("#lblCameraViewDesc").text("Hadith Time");
        jsHadithShow();
        playAudio(audiourl);  //make sure video is stopped

    }


    //if (cameraDesc == "Floating Camera") {

    //    console.log("Camera is " + cameraDesc);
    //    $("#lblCameraViewDesc").val(cameraDesc);
    //    jsCameraShow();
    //    playVideo(videoCDN);
    //}

    var userTahajjudValue = $("#hidTahajjudAzan").text();

    //check tahajjudazan and play
    console.log("user tahajjud value:" + userTahajjudValue);


    // alert(isTahajjud);
    if (userTahajjudValue == "1" && isTahajjud == "True") {

        //   alert("playing");
        playTahajjud();


    }

    
    //CheckVideo(videourl);


}


function CheckAudio(audiourl) {



    $.ajax({
        type: "POST",
        url: "/Index?handler=checkaudio",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        
         data: JSON.stringify(audiourl),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {


           
            if (data == "true") {
               // alertsuccess("audio running");
               
                    $("#lblaudiostatus").text("Audio Online");
                
            }
            else {
                $("#lblaudiostatus").text("Audio Offline");

            }
        },
        failure: function (response) {

            alertfailed("failed to audio status");



        }
    }
    );

}


function CheckVideo(videourl) {

  


    $.ajax({
        type: "POST",
        url: "/Index?handler=checkvideo",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },

        data: JSON.stringify(videourl),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {



            if (data == "true") {
                // alertsuccess("audio running");

                $("#lblvideostatus").text("Video Online");

            }
            else {
                $("#lblvideostatus").text("Video Offline");

            }
        },
        failure: function (response) {

            alertfailed("failed to get video status");



        }
    }
    );

}


function jsHadithShow(cameradesc) {


    // stopAllOmxplayer();

    stopVideo();

    $("#divHadiths").show();

    $("#divCamera").hide();

    //if ($("#divCamera").is(':hidden')) {
    //    alert("camera hidden")
    //}


    $("#divEvents").hide();

    $("#iframeEvents").attr('src', "");
    $("#iframeCamera").attr('src', "");

    //$("#lblCameraViewDesc").text("Hadith Time");
    $("#lblCameraViewDesc").text(cameradesc);



}


function playAudio(audiostream) {


    //check audiostream here 


    if ($("#lblaudiostatus").text() === "Audio Offline") {
        console.log("audio stream is offline");
        return;
    }

    //add sequence here to return if video is playing otherwise loop will occur....
    //   if (omxCheck()) { console.log("video is playing exiting playAudio sequence...");  return; };



    if (isPlaying(masjidstream)) {

        return;

    }

    // alert("trying to aplay");
    var i = Math.floor((Math.random() * 1000000) + 1);

    // var source = $("#hidAudioUrl").val();



    //   alert(source);

    document.getElementById('masjidstream').src = audiostream + '?nocache=' + i
    var playme = document.getElementById('masjidstream');
    playme.src = audiostream + '?nocache=' + i;
    playme.load();
    playme.play();
    //now kill video
    stopVideo();
    eventstartimage();




}



function playVideo(videocdn) {



    //this will error if now ip defined withing visual studio
    var omxStatus = 'http://localhost:9192/omxcmd?cmd=position';



    $.ajax({
        url: omxStatus,

        success: function (data) {
            if (data === "no player") {
                //  alert("starting omx");
                console.log("client returned status for video: " + data);
                startOmx(videocdn);
            }

        },
        error: function () {
            console.log("error in playVideo");
        }
    });

}

function startOmx(videocdn) {



    $("#lblStreamStatus").text("Video live now");

    //   alert($("#hidCamUrl").val());
    //    var camUrl = $("#hidCamUrl").val();

    

    var camUrl = videocdn;
    console.log("no stream detected on client starting video stream now: " + camUrl);

    $.get(
        camUrl,
        // { paramOne: 1, paramX: 'abc' },
        function (data) {
            eventstartimage();
            //stop audio after video has started maybe check success feedback of ajax
            var playme = document.getElementById('masjidstream');
            playme.pause();

        }
    );

}

function stopVideo() {

    var omxStop = 'http://localhost:9192/stopall';
    $.ajax({
        url: omxStop

    });

}

//function omxCheck() {



//    //this will error if now ip defined withing visual studio
//    var omxStatus = 'http://localhost:9192/omxcmd?cmd=position';

//    $.ajax({
//        url: omxStatus,

//        success: function (data) {
//            if (data == "no player") {
//                //  alert("starting omx");
//                console.log("client returned status for video: " + data);
//                return true;

//            }

//        },
//        error: function () {
//            console.log("error in playVideo");
//        }
//    });

//}


function isPlaying(audelem) {

    return !audelem.paused;
}



function eventstartimage() {

    // var viewmode = $("#hidViewMode").val();


    //var audioStream = "<%=ViewState["streamUrl"] %>";
    //take image from database
    var image = 'http://updates.airmyprayer.co.uk/airmasjid/screenmessages/startevent.jpg';
    var timeout = "10";
    // var viewmode = viewmode;

    var script = "http://localhost:5000/playstream.sh?" + image + "?" + timeout; /*+ "?" + audioStream*/
    // alert(audioStream);

    $.ajax({
        url: script,
        success: function (response) {
            console.log("eventstartimage succeeded");

        },
        error: function () {
            console.log('Error occured in eventstartimage');
        }


    });




}

function GetImages() {

    //need to bring back only 1 image

   
    var allFiles = []; //set up empty array

    $.ajax({
        url: "http://updates.airmyprayer.co.uk/airmasjid/images/ayl-3/",
        success: function (data) {
            $(data).find("td > a").each(function () {

             //   alert($(this).attr("href"));

                allFiles.push($(this).attr("href"));
                // will loop through 
               // alert("Found a file: " + $(this).attr("href"));

             
               // return false;
            });

            i = Math.floor(Math.random() * allFiles.length);

            //decode here removed the %20 from output
            //remove file extension with .replace(/\.[^/.]+$/, "")

            jsCaraHadiths('http://updates.airmyprayer.co.uk/airmasjid/images/ayl-3/' + allFiles[i], decodeURI(allFiles[i]).replace(/\.[^/.]+$/, ""));

        }
    });

}



function flipTV() {

    //change this to script on amp-sys01 and cgi-scripts can only be accessed from vpn
    var fliptv = 'http://localhost:5000/fliptv.sh';
    $.ajax({
        url: fliptv
    });


}


function jsCaraHadiths(imgfileName,fileName) {

       //cleear images before displaying next one

    $('.carousel-inner,.carousel-indicators,.carousel-control-prev,.carousel-control-next').empty();

    // TRANSITION_DURATION in bootstrap file is set to 2000000 (high value) for this to work
    
    //$('<div class="carousel-item"><img class="d-block img-fluid" src="' + imgfileName + '" ><div class="carousel-caption"></div>' + imgfileName + '</div>').appendTo('.carousel-inner');

    $('<div class="carousel-item"><img class="d-block img-fluid" src="' + imgfileName + '" ><div class="carousel-caption d-none d-md-block h4">'+ fileName + '</div></div>').appendTo('.carousel-inner');


    $('<li data-target="#caraHadiths" data-slide-to="' + imgfileName + '"></li>').appendTo('.carousel-indicators');

    //}

    $('.carousel-item').first().addClass('active');

    $('.carousel-indicators > li').first().addClass('active');

    // currentSlide = Math.floor((Math.random() * $('.item').length));

    //  $('#caraHadiths').find('.item').first().addClass('active');

    //rand = currentSlide;
    $('#caraHadiths').carousel({
         //interval: 1000 * 20 //30 second rotate (let postback handle )
    });

    //  );
    //   $('#caraHadiths').fadeIn(1000);



    



}

function jsCameraShow() {


            //separate sequence for floating camera with a refresh???

    alert("camera show");
   
            $("#divHadiths").hide();
            $("#divEvents").hide();

            $("#iframeEvents").attr('src', "");



            $("#lblCameraViewDesc").text($("#hidCurrLiveScreenLabel").val());

            //     getOmxplayerStatus();  not needed 


            if ($("#divCamera").is(':hidden')) {


              //  location.reload();  //removed 28 July 2018



                //problem cameraCDN does not change here until fullrefresh is done the value is correctly assigned in code behind

                var eventUrl = '<%=ViewState["CameraCDN"] %>';

                var currLiveLabel = $("#hidCurrLiveScreenLabel").val();

                var eventUrl = $("#hidCamUrl").val();

            

              

                $("#lblCameraViewDesc").text(currLiveLabel);

                //$("#iframeCamera").attr('src', eventUrl);

                $("#divCamera").show();

               

                //     getOmxplayerStatus();

            }
}






function GetPrayerTimesDaily(date,month,day) {

    //get month and date and use as data

   

    $.ajax({
        type: "POST",
        url: "/Index?handler=getprayertimesdaily",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        //data: '{ViewMode:"' + ViewMode + '", serial: "' + serial + '" }',
       
        data: JSON.stringify({
            "date": date,
            "month":month
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {

         
            var obj = JSON.parse(data);
            
            //set todays prayer times
            if (day === "today") {
                $("#lblbegFajrTime").text(obj.fajr);
                $("#lblbegSunRiseTime").text(obj.sunrise);
                $("#lblbegDhuhrTime").text(obj.dhuhr);
                $("#lblbegAsrTime").text(obj.asr);
                $("#lblbegMaghribTime").text(obj.maghrib);
                $("#lblbegIshaTime").text(obj.isha);
            }

            if (day === "tomorrow") {
                $("#lbltmrwFajrTime").text(obj.fajr);
                $("#lbltmrwSunriseTime").text(obj.sunrise);
                $("#lbltmrwDhuhrTime").text(obj.dhuhr);
                $("#lbltmrwAsrTime").text(obj.asr);
                $("#lbltmrwMaghribTime").text(obj.maghrib);
                $("#lbltmrwIshaTime").text(obj.isha);
            }


            //set tomorrows prayer times if date is tomorrow

            
        },
        failure: function (response) {

            alertfailed("failed to get daily prayer times");
            
        }
    }
    );


}



function GetPrayerTimesJamaat() {



    $.ajax({
        type: "POST",
        url: "/Index?handler=getprayertimesjamaat",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        //data: '{ViewMode:"' + ViewMode + '", serial: "' + serial + '" }',

      
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {


            var obj = JSON.parse(data);

            //set todays prayer times
            
            $("#lblFajrJamaat").text(obj.fajr);
            $("#lblDhuhrJamaat").text(obj.dhuhr);
            $("#lblAsrJamaat").text(obj.asr);
            $("#lblMaghribJamaat").text(obj.maghrib);
            $("#lblIshaJamaat").text(obj.isha);
            $("#lblJummah1Jamaat").text(obj.jummah1);
            $("#lblJummah2Jamaat").text(obj.jummah2);
          


            //set tomorrows prayer times if date is tomorrow


        },
        failure: function (response) {

            alertfailed("failed to get jamaat times");

        }
    }
    );




}





function gmod(n, m) {
    return ((n % m) + m) % m;
}

function kuwaiticalendar(adjust) {
    var today = new Date();
    if (adjust) {
        adjustmili = 1000 * 60 * 60 * 24 * adjust;
        todaymili = today.getTime() + adjustmili;
        today = new Date(todaymili);
    }
    day = today.getDate();
    month = today.getMonth();
    year = today.getFullYear();
    m = month + 1;
    y = year; var AutoScreen = null;

    if ($("#chkAutoScreenStatus").is(':checked'))
        AutoScreen = "1";
    else
        AutoScreen = "0";

    $.ajax({
        type: "POST",
        url: "/settings?handler=updateautoscreen",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        //data: '{ViewMode:"' + ViewMode + '", serial: "' + serial + '" }',
        data: JSON.stringify(AutoScreen),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (data) {

            if (data === "success") {

                alertsuccess("AutoScreen changed!");

            }
            else {

                alertfailed("failed try again!");

                return false;
            }

        },
        failure: function (response) {


            alertfailed("setting autoscreen failed try again!");
        }
    }
    );
    if (m < 3) {
        y -= 1;
        m += 12;
    }

    a = Math.floor(y / 100.);
    b = 2 - a + Math.floor(a / 4.);
    if (y < 1583) b = 0;
    if (y === 1582) {
        if (m > 10) b = -10;
        if (m === 10) {
            b = 0;
            if (day > 4) b = -10;
        }
    }

    jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    b = 0;
    if (jd > 2299160) {
        a = Math.floor((jd - 1867216.25) / 36524.25);
        b = 1 + a - Math.floor(a / 4.);
    }
    bb = jd + b + 1524;
    cc = Math.floor((bb - 122.1) / 365.25);
    dd = Math.floor(365.25 * cc);
    ee = Math.floor((bb - dd) / 30.6001);
    day = (bb - dd) - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
        cc += 1;
        month = ee - 13;
    }
    year = cc - 4716;

    if (adjust) {
        wd = gmod(jd + 1 - adjust, 7) + 1;
    } else {
        wd = gmod(jd + 1, 7) + 1;
    }

    iyear = 10631. / 30.;
    epochastro = 1948084;
    epochcivil = 1948085;

    shift1 = 8.01 / 60.;

    z = jd - epochastro;
    cyc = Math.floor(z / 10631.);
    z = z - 10631 * cyc;
    j = Math.floor((z - shift1) / iyear);
    iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    im = Math.floor((z + 28.5001) / 29.5);
    if (im === 13) im = 12;
    id = z - Math.floor(29.5001 * im - 29);

    var myRes = new Array(8);

    myRes[0] = day; //calculated day (CE)
    myRes[1] = month - 1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd - 1; //julian day number
    myRes[4] = wd - 1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im - 1; //islamic month
    myRes[7] = iy; //islamic year

    return myRes;
}
function writeIslamicDate(adjustment) {
    var wdNames = new Array("Ahad", "Ithnin", "Thulatha", "Arbaa", "Khams", "Jumuah", "Sabt");
    var iMonthNames = new Array("Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
        "Jumadal Ula", "Jumadal Akhira", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja");
    var iDate = kuwaiticalendar(adjustment);
    var outputIslamicDate = wdNames[iDate[4]] + ", "
        + iDate[5] + " " + iMonthNames[iDate[6]] + " " + iDate[7] + " AH";
    return outputIslamicDate;
}





function alertfailed(content) {

    $.alert({
        title: 'Error!',
        type: 'red',
        theme: 'modern',
        content: content
    });

}


function alertsuccess(content) {

    $.alert({
        title: 'Success!',
        type: 'green',
        theme: 'modern',
        content: content
    });

}