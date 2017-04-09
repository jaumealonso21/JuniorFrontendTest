/*
 * Javascript related to test
 * 
 * Author: Jaume Alonso
 */

//Global variables
var searchText;//Tag contains searching user
var errorDiv;//Div contains error message
var exitDiv;//Div contains succesful fetching data
var subText;//Button exec searching
var userInf;//Ceiling contains data from user
var userImg;//Img contains user avatar
var userLogin;//Ceiling contains user login
var userFullName;//Ceiling contains user full name
var userBio;//Ceiling ontains user bio
var reposInf;//Ceiling contains data from repos

window.onload = initRepos();

//Initializing function
function initRepos() {
    searchText = document.getElementById("searchText");
    searchText.value = "Search username...";
    searchText.addEventListener("focus", function(){ searchText.value = "";}, false);
    errorDiv = document.getElementById("errorDiv");
    exitDiv = document.getElementById("exitDiv");
    subText = document.getElementById("subText");
    subText.addEventListener("click", searchRepos, false);
    userInf = document.getElementById("userInf");
    userImg = document.getElementById("userImg");
    userLogin = document.getElementById("userLogin");
    userFullName = document.getElementById("userFullName");
    userBio = document.getElementById("userBio");
    reposInf = document.getElementById("reposInf");
}

//Avaluating whether introduced user exists
function searchRepos() {
    errorDiv.style.display = "none";//Starting searching, backing to initial status
    exitDiv.style.display = "none";//Starting searching, backing to initial status
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) { //Ok
            request.onload = printRepoCount;
        }else if (this.status === 404){//GET - User not found
            errorDiv.style.display = "block";
        }
    };
    request.open('get', 'https://api.github.com/users/' + searchText.value, true);
    request.send();      
}
//Fetching inf from user
function printRepoCount() {
    exitDiv.style.display = "block";//Showing up the data containing div
    var responseObj = JSON.parse(this.responseText);
    userImg.src = responseObj.avatar_url;
    userImg.alt = responseObj.login + " avatar";//Adding alt to the avatar user img
    userLogin.innerHTML = responseObj.login;
    if(!responseObj.name) {//In case there is no inserted name
        userFullName.innerHTML = "No inserted name";
    } else {
        userFullName.innerHTML = responseObj.name;
    }
    if(!responseObj.bio) {//In case there is no inserted bio
        userBio.innerHTML = "No inserted bio";
    } else {
        userBio.innerHTML = responseObj.bio;
    }   
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {//Ok
            request.onload = printRepos;
        }else if (this.status === 404){//GET - just in case!! no found user
            errorDiv.style.display = "block";
            exitDiv.style.display = "none";
        }
    };
    request.open('get', 'https://api.github.com/users/' + searchText.value + '/repos', true);
    request.send();
}

//Fetching data from fork and stargazers
function printRepos() {
    reposInf.innerHTML = "";//Cleanig lines, initial state
    var responseObj = JSON.parse(this.responseText);
    for (var x in responseObj) {//Inserting requested data from repositories
        reposInf.innerHTML += "<div id='repoNum'>" + responseObj[x].name + "</div>\n\
            <div id='repoData'><img src='img/star_small.png' alt='star-icon' class='icons'>\n\
            <span class='data'>" + responseObj[x].stargazers_count + "</span>\n\
            <img src='img/fork_small.png' alt='fork-icon' class='icons'><span class='data'>" 
            + responseObj[x].forks_count + "</span></div><div class='clear'></div>\n\
            <p class='hLineRep'></p>";
    }
}