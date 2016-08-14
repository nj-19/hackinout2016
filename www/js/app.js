// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordovaOauth']);
var isPaused = 0;

var lat1 = -1,lon1 = -1,lat2,lon2;
var start;

var distance = 0;
var time = 0;
var j=0;

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    $('#popup').hide();
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    //$('#splashscreen').fadeOut(200);
    //route('stop');
    route('home');
    $('#ahome').click(function(){
      route('home');
    });

    $('#run').click(function(){
      route('run');
      
      start = new Date().getTime();
      h=0; m=0; s=0;

      
      setTimeout(function(){
        getLocation();
      },10);
      

      setTimeout(function(){
        updateDummyDist();
      },1000);
    });

   

    $('#popup').click(function(){
      $('#popup').hide();
    });

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

function updateDummyDist(){
  
    j+=4;
    document.getElementById('tour').innerHTML = j+"m";
  if(pauseflag==0){
    setTimeout(function(){
      updateDummyDist();
    },1000);
  }
}

app.controller('RunCtrl',function($scope,$cordovaOauth,$http){
    window.cordovaOauth = $cordovaOauth;
    window.http = $http;
    
});


function tlogin(){
  window.cordovaOauth.twitter('osg2oAyy0GKAi2sXYUMUIucQn','wtlVHrZlBkIfTj2ivzmb0tWezy0IhlPLHaj8DtJbtyftr0H52C').then(function(res){
    console.log(res);
    setTimeout(function(){
      $('#splashscreen').fadeOut(200);
    },700);
  },function(err){
    alert(err);
  });

  

}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var pauseflag = 0;

function getLocation(){
  console.log("geo caled!!");
  navigator.geolocation.getCurrentPosition(function(pos){
      if(lat1==-1){
        lat1 = pos.coords.latitude;
        lon1 = pos.coords.longitude;
        console.log(lat1+" "+lon1);
      }
      else{
        lat2 = pos.coords.latitude;
        lon2 = pos.coords.longitude;

        console.log(lat2+" "+lon2);

        var R = 6371; // metres
        var φ1 = lat1.toRad();
        var φ2 = lat2.toRad();
        var Δφ = (lat2-lat1).toRad();
        var Δλ = (lon2-lon1).toRad();

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
        distance += (d);
       // document.getElementById('tour').innerHTML = sanitize(distance)+"m";
        var t = new Date().getTime(); 
        time = t - start;
      
        h = Math.floor(time/(60*60000))%12;
        m = Math.floor((time-h*60*60000)/(60*1000))%60;
        s = Math.floor((time-m*60*1000)/1000)%60;
        document.getElementById('dur').innerHTML = h+"h"+m+"m"+s+"s";
        lat1 = lat2;
        lon1 = lon2;
      }

      if(pauseflag==0){
         setTimeout(function(){
           getLocation();
         },10);
      }

  },function(){
    //alert('error');
  });
}


function route(id){
  document.getElementById('viewCont').innerHTML = (document.getElementById(id+'View').innerHTML);
  $('#viewCont').fadeIn(2000);
}

function timer(t){
    t = t*100;
    t = Math.floor(t);
    t = t/100;
    return t;
}

function foodSug(){
  $('#text').html("eat healthy stay fit!!");
  $('#popup').fadeIn();
}

function exerSug(){
  $('#text').html("exercise well, don't be lazy!!");
  $('#popup').fadeIn();
}

function miscSug(){
  $('#text').html("enjoy good music while running!!");
  $('#popup').fadeIn();
}

function sanitize(a){
  a = a*10000;
  a = Math.floor(a);
  a = a/10000;
  return a;
}

function pause(){
    if(isPaused==0){
        $('#pause').css('background','#35d177');
        $('#pause').html("Resume");
        isPaused = 1;
        pauseflag = 1;
        $('#running').hide();
        $('#standing').css('width','10%');
        $('#standing').show();
        $('#back').addClass('backpause');
    }else{
        $('#pause').css('background','#00acc1');
        $('#pause').html("Pause");    
        isPaused = 0; 
        pauseflag = 0;
        $('#running').show();
        $('#standing').hide();
        $('#back').removeClass('backpause'); 
        
        setTimeout(function(){
          getLocation();
        },10);

        setTimeout(function(){
          updateDummyDist();
        },1000);
    }
}

function stop(){
  route('stop');
  document.getElementById('resultd').innerHTML = j+"m";
  document.getElementById('resultt').innerHTML = h+"h "+m+"m "+s+"s";
}