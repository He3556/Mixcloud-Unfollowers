/* (GNU GENERAL PUBLIC LICENSE)
developed by dm-development.de 2014 - published 2017 - updated 2024 

 * LICENSE: https://github.com/He3556/Mixcloud-Unfollowers/blob/master/LICENSE
 * SOURCE: https://github.com/He3556

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
*/

/* 
follers = new Array(); // Array of followers
ing = 0; // Array pointer - username to check
j; // counter of follower (Frontend: Data Calculated)
w; // counter of following (Frontend: Data Calculated)
followercnt; // Counter of (your) followers
followingcnt; // Counter (DJs you are) following
cnt;  //counter
offst = 0; // for paging of content
lmt = 100; //  limit 100 for 1 page
var follok = 0; //number of followers that are following back (green)
var follnot = 0; //number of followers that are NOT following back (green)
*/

$(document).ready(function () {
    $("#searchtext").focus(); // Focus on the text input

    // Reset function
    $('#goback').click(function () {
        $("#searchtext").val("");
        $("#error").empty();
        $("#info").empty();
        $("#cntfollowers").text('Followers: 0');
        $("#cntfollowing").text('Following: 0');
        $("#fok").html('<div>0</div>');
        $("#fnot").html('<div>0</div>');
        $("#followingok").empty();
        $("#followingmiss").empty();
    });

    // Search function
    $('#input').click(async function () {
        const uname = $("#searchtext").val();
        if (uname === "") {
            $("#error").append('There was nothing to search for!<br />');
            return;
        }

        let followercnt = 0;
        let followingcnt = 0;

        try {
            const result = await $.getJSON(`https://api.mixcloud.com/${uname}/?metadata=1`);
            followercnt = parseInt(result.follower_count);
            followingcnt = parseInt(result.following_count);

            $("#info").append(`Followers: ${followercnt} <br />Following: ${followingcnt}`);

            if (followercnt === 0 || followingcnt === 0) {
                $("#error").append('User was not found on Mixcloud<br /><br /><br /><br />');
                return;
            }

            const cnt = Math.ceil(followercnt / 100);
            const cntb = Math.ceil(followingcnt / 100);

            const followers = await getFollowers(cnt, uname);
            await getFollowing(cntb, uname, followers);

            // Kontrolle, ob alle Entitäten verarbeitet wurden
            if (followers.length === followercnt) {
                console.log('Alle Follower wurden erfolgreich verarbeitet.');
            } else {    
                console.log(`Es wurden nicht alle Follower verarbeitet. Erwartet: ${followercnt}, Verarbeitet: ${followers.length}`);
            }

            const totalFollowingProcessed = follok + follnot;
            if (totalFollowingProcessed === followingcnt) {
                console.log('Alle gefolgten Benutzer wurden erfolgreich verarbeitet.');
            } else {
                console.log(`Es wurden nicht alle gefolgten Benutzer verarbeitet. Erwartet: ${followingcnt}, Verarbeitet: ${totalFollowingProcessed}`);
            }
            
        } catch (error) {
            $("#error").append(`An error occurred while fetching data: ${error.message}<br />`);
            console.error('Error fetching data:', error);
        }
    });

    async function getFollowers(cnt, uname) {
        const followers = [];
        for (let i = 0; i < cnt; i++) {
            const result = await $.getJSON(`https://api.mixcloud.com/${uname}/followers/?limit=100&offset=${i * 100}`);
            result.data.forEach(follower => {
                followers.push(follower.username);
            });
            $("#cntfollowers").text(`Followers: ${followers.length}`);
        }
        return followers;
    }

    async function getFollowing(cntb, uname, followers) {
        follok = 0;
        follnot = 0;

        $("#followingok").empty();
        $("#followingmiss").empty();

        for (let i = 0; i < cntb; i++) {
            const result = await $.getJSON(`https://api.mixcloud.com/${uname}/following/?limit=100&offset=${i * 100}`);
            result.data.forEach(following => {
                const ing = following.username;
                const isFollowingBack = followers.includes(ing);
                if (isFollowingBack) {
                    follok++;
                    $("#fok").html(`<div>${follok}</div>`);
                    $("#followingok").append(`<div><img src="./pictures/ok.png" height="12" width="12"> ${ing} <a target='_blank' href='https://mixcloud.com/${ing}'>open profile</a></div>`);
                } else {
                    follnot++;
                    $("#fnot").html(`<div>${follnot}</div>`);
                    $("#followingmiss").append(`<div><img src="./pictures/missing.png" height="12" width="12"> ${ing} <a target='_blank' href='https://mixcloud.com/${ing}'>open profile</a></div>`);
                }
                $("#cntfollowing").text(`Following: ${follok + follnot}`);
            });
        }
    }
});
