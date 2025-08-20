document.addEventListener("DOMContentLoaded", () => {

    const user_input = document.querySelector("#user-input");
    const search = document.querySelector("#search-btn");
    const stat_container = document.querySelector(".stat-container");
    const easy_progress_circle = document.querySelector(".easy-progress");
    const medium_progress_circle = document.querySelector(".medium-progress");
    const hard_progress_circle = document.querySelector(".hard-progress");
    const easy_label = document.querySelector("#easy-label");
    const medium_label = document.querySelector("#medium-label");
    const hard_label = document.querySelector("#hard-label");
    const stat_card = document.querySelector(".stats-cards");
    const accept_Rate = document.querySelector(".accepentace-rate");
    const rank = document.querySelector(".ranking");
    const C_points = document.querySelector(".contribution");


    function validateUser(username) {
        if (username.trim() === "") {
            alert("Username cannot be Empty!!");
            return false;
        }

        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_\- ]{2,29}$/;
        let ismatching = usernameRegex.test(username);
        if (!ismatching) {
            alert("invalild Username");
        }
        return ismatching;
    }

    function resetStats() {
        // Reset progress circles
        easy_progress_circle.style.setProperty("--progress--degree", "0%");
        medium_progress_circle.style.setProperty("--progress--degree", "0%");
        hard_progress_circle.style.setProperty("--progress--degree", "0%");

        // Reset labels
        easy_label.innerHTML = "Easy";
        medium_label.innerHTML = "Medium";
        hard_label.innerHTML = "Hard";

        // Reset other stats
        accept_Rate.innerHTML = "Acceptance Rate";
        rank.innerHTML = "Ranking";
        C_points.innerHTML = "Contribution"; 
    }

    async function fetchUserDetails(username) {

        try {
            resetStats();

            search.textContent = "Searching";
            search.disabled = true;
            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            let response = await fetch(url);
            if (!response.ok) {
                throw new error("Failed to get Data!!!")
            }
            let parsedata = await response.json();
            if (!parsedata) {
                stat_container.textContent = "Data not found!!";
            }
            console.log(parsedata);

            if (parsedata.status === "error") {
                stat_container.textContent = "User Not Exist!!";
            }

            displayData(parsedata);
        }
        finally {
            search.textContent = "Search";
            search.disabled = false;
        }


    }


    function updateprogress(solved, total, label, circle) {

        const progressdegree = solved / total * 100;
        circle.style.setProperty("--progress--degree", `${progressdegree}%`);
        label.innerHTML += `<br>${solved}/${total}`;
    }




    function displayData(parsedata) {
        const totalQuestion = parsedata.totalQuestions;
        const totalEasyQuestion = parsedata.totalEasy;
        const totalMediumQuestion = parsedata.totalMedium;
        const totalHardQuestion = parsedata.totalHard;


        const totalQuestionSolved = parsedata.totalSolved;
        const totaleasysolved = parsedata.easySolved;
        const totalmediumsolved = parsedata.mediumSolved;
        const totalhardsolved = parsedata.hardSolved;

        const acceptance_rate = parsedata.acceptanceRate;
        const Ranking = parsedata.ranking;
        const Contribution_points = parsedata.contributionPoints;

        //  accept_Rate.innerHTML+=`<br>${acceptance_rate}`;
        // rank.innerHTML+=`<br>${Ranking}`;
        // C_points.innerHTML+=`<br>${Contribution_points}`;

        accept_Rate.innerHTML = `Acceptance Rate<br>${acceptance_rate}`;
        rank.innerHTML = `Ranking<br>${Ranking}`;
        C_points.innerHTML = `Contribution<br>${Contribution_points}`;



        updateprogress(totaleasysolved, totalEasyQuestion, easy_label, easy_progress_circle);
        updateprogress(totalmediumsolved, totalMediumQuestion, medium_label, medium_progress_circle);
        updateprogress(totalhardsolved, totalHardQuestion, hard_label, hard_progress_circle);

    }


    search.addEventListener("click", () => {
        const username = user_input.value;

        if (validateUser(username)) {
            fetchUserDetails(username);

        }
    });
})

