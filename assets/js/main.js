function main() {
    hideElementsAtStart();
    bindOnClickToButtons();
}

function hideElementsAtStart() {
    // Hide the maxSubject section
    $("#maxSubject").css("display", "none");
}

function bindOnClickToButtons() {
    // Bind function to the addNewSubject button in allSubjects and
    // the goBack button in maxSubject
    $("#addSubjectBtn, #goBackBtn").on("click", function() {
        toggleWindows();
    });
}

function toggleWindows() {
    // Change between allSubjects and maxSubject depending on
    // which windows is displayed at the moment
    if ($("#maxSubject").css("display") == "none") {
        $("#maxSubject").css("display", "block");
        $("#allSubjects").css("display", "none");
    } else {
        $("#maxSubject").css("display", "none");
        $("#allSubjects").css("display", "block");
    }
}

$(document).ready(main);
