/* (GNU GENERAL PUBLIC LICENSE)
developed by dm-development.de 2014 - published 2017 - updated 2024 

 * LICENSE: https://github.com/He3556/Mixcloud-Unfollowers/blob/master/LICENSE
 * SOURCE: https://github.com/He3556

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
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
            followingcnt = result.following_count;

            $("#info").append(`Followers: ${followercnt} <br />Following: ${followingcnt}`);

            if (followercnt === 0 || followingcnt === 0) {
                $("#error").append('User was not found on Mixcloud<br /><br /><br /><br />');
                return;
            }

            const cnt = Math.ceil(followercnt / 100);
            const cntb = Math.ceil(followingcnt / 100);

            const followers = await getFollowers(cnt, uname);
            await getFollowing(cntb, uname, followers);

        } catch (error) {
            $("#error").append('An error occurred while fetching data.<br />');
        }
    });

    async function getFollowers(cnt, uname) {
        const followers = [];
        for (let i = 0; i < cnt; i++) {
            const result = await $.getJSON(`https://api.mixcloud.com/${uname}/followers/?limit=100&offset=${i * 100}`);
            result.data.forEach(follower => {
                followers.push(follower.username);
            });
            $("#cntfollowers").text(`>Followers: ${followers.length}`);
        }
        return followers;
    }

    async function getFollowing(cntb, uname, followers) {
        let follok = 0;
        let follnot = 0;

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
