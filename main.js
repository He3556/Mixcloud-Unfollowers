/* (GNU GENERAL PUBLIC LICENSE)

developed by dm-development.de 2014 - published 2017
 * LICENSE: https://github.com/He3556/Mixcloud-Unfollowers/blob/master/LICENSE
 * SOURCE: https://github.com/He3556
The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
*/


var follers = new Array(); // Array of followers
var ing = 0; // Array pointer - username to check
var j; // counter of follower (Frontend: Data Calculated)
var w; // counter of following (Frontend: Data Calculated)
var followercnt; // Counter of (your) followers
var followingcnt; // Counter (DJs you are) following
var cnt;  //counter
var offst = 0; // for paging of content
var lmt = 100; //  limit 100 for 1 page
var follok = 0; //number of followers that are following back (green)
var follnot = 0; //number of followers that are NOT following back (green)


$(document).ready(function () {
$("#searchtext").focus(); // Focus on the text input

// Get the click - "GOBACK" Button (ToDO: Reset Funktion)
$('#goback').click(function () {
        var uname = "";
        var follers = 0; // Array of followers
        var ing = 0;
        var j = 0;
        var followercnt = 0; // Counter of (your) followers
        var followingcnt = 0; // Counter (DJs you are) following
    });



// Get the click on page 1 ("push it real good")
$('#input').click(function () {
        var uname = $("#searchtext").val();
        if (uname == "") {
            $("#error").append('There was nothing to search for!<br />');
        }

        var result = new Array();
        var j = 0;
        var followercnt = 0;
        var followingcnt = 0;



// Get the JSON object - with number of followers and number of following +++++++++++++++++++++++++
$.getJSON('https://api.mixcloud.com/' + uname + '/?metadata=1', function (result) {

            // +++++ Get metadata from Mixloud
            var tfo = (result.follower_count);
            followercnt = parseInt(tfo);
            followingcnt = (result.following_count);

            // Show data
            $("#info").append('Followers:' + followercnt + ' <br />Following:' + followingcnt + '');

            // how often get 100x followers
            if (followercnt == "0") {
                $("#error").append('User was not found on Mixcloud<br /><br /><br /><br />');}
            var tempcnt = (followercnt / 100);
            var cnt = Math.ceil(tempcnt);

            // how often get 100x following
            if (followingcnt == "0") {
            $("#error").append('User was not found on Mixcloud<br /><br /><br /><br />'); }
            var tempcntb = (followingcnt / 100);
            var cntb = Math.ceil(tempcntb);


// ************* START *************
// 1 - get list of followers
getfolls(cnt, uname);

// 2 - get list of ppl you follow
getfollowing(cntb, uname);

});


// Get list of followers +++++++++++++++++++++++++
function getfolls(cnt, uname) {

                  for (var i = 0; i < cnt; i++) {
                          $.getJSON('https://api.mixcloud.com/' + uname + '/followers/?limit=' + lmt + '&offset=' + offst + '', function (result) {
                                  // +++++ Get 100 packs of followers in the array
                                  for (var r = 0; r < 100; r++) {
                                     var temp = (result.data[r].username);
                                     follers[j] = temp;
                                     j++;
                                     $("#cntfollowers").text('Followers:' + j + ' ');
                               };
                             });
                           offst = (offst + 100);
                 };
  return follers
}

// Get list of ppl you follow +++++++++++++++++++++++++
function getfollowing(cntb, uname) {
        var offstb = 0;
        var lmtb = 100;
        var w = 0; // counter of following (Frontend: Data Calculated)

        for (var i = 0; i < cntb; i++) {

              $.getJSON('https://api.mixcloud.com/' + uname + '/following/?limit=' + lmtb + '&offset=' + offstb + '', function (result) {

                for (var r = 0; r < 100; r++) {
                    ing = result.data[r].username;
                    var realname = result.data[r].name;
                    w++;
                    $("#cntfollowing").text(' Following:' + w + '');
                    var tr = follers.indexOf(ing);
                    if (tr != -1) {
                         follok = follok + 1;
                         $("#fok").html('<div>' + follok + ' </div>');
                         $("#followingok").append('<div><img src="./pictures/ok.png" height="12" width="12"> ' + ing + ' <a target=\'_blank\' href=\'https://mixcloud.com/' + ing + '\'>open profile</a></div>');
                    } else {
                        follnot = follnot + 1;
                        $("#fnot").html('<div>' + follnot + ' </div>');
                        $("#followingmiss").append('<div><img src="./pictures/missing.png" height="12" width="12"> ' + ing + ' <a target=\'_blank\' href=\'https://mixcloud.com/' + ing + '\'>open profile</a></div>');
                    }
                }
              });
             offstb = (offstb + 100);
           }; // Get JSON missing
}; // end function getfollowing

});       // Click button Input page 1
});   // Document Ready
