function main() {
    hideElementsAtStart();
    bindOnClickToButtons();
}

function hideElementsAtStart() {
    // Hide the maxSubject section
    $("#allSubjects").css("display", "none");  // ! working
}

function bindOnClickToButtons() {
    // Bind function to the addNewSubject button
    $("#addSubjectBtn").on("click", function() {
        console.log("new subject");
    });
}

$(document).ready(main);
