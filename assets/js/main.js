function main() {
    hideElementsAtStart();
    bindOnClickToButtons();
}

function hideElementsAtStart() {
    // Hide the maxSubject section
    $("#sec_allSubjects").css("display", "none");  // ! working
}

function bindOnClickToButtons() {
    // Bind function to the addNewSubject button
    $("#btn_addNewSubject").on("click", function() {
        console.log("new subject");
    });
}

$(document).ready(main);
