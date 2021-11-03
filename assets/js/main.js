function main() {
    hideElementsAtStart();
    bindOnClickToButtons();
}

function hideElementsAtStart() {
    // Hide the maxSubject section
    $("#maxSubject").css("display", "none");
}

function bindOnClickToButtons() {
    // Bind function to toggle windows to the addSubject button in
    // allSubjects and the goBack button in maxSubject
    $("#addSubjectBtn, #goBackBtn").on("click", function() {
        toggleWindows();
    });

    // Bind function to create subject to addSubject button
    $("#addSubjectBtn").on("click", function() {
        let subject = createSubject();
        $("#maxSubject").append(subject);
    });

    // Bind save function to goBack button
    $("#goBackBtn").on("click", function() {
        // Get conditions for new subject to be not saved
        // CAUTION: values have to match the inital values in subject.js
        let title = $("#maxSubject .subject h2").text() == "Titel";
        let divUncheckedCount = $("#maxSubject .subject .unchecked").children().length == 1;
        let divCheckedCount = $("#maxSubject .subject .checked").children().length == 0;
        let initialEntry = $("#maxSubject .subject .unchecked").children("span").children("label").text() == "Eintrag";
    
        // Check if conditions are true
        if (!(title && divUncheckedCount && divUncheckedCount && initialEntry)) {
            // Entry was modified
            $("#maxSubject .subject").appendTo($("#allSubjects"));
        } else {
            // Delete unmodified entry
            $("#maxSubject .subject").remove();
        }
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
