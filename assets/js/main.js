function main() {
    hideElementsAtStart();
    bindOnClickToButtons();
}

function hideElementsAtStart() {
    // Hide the maxSubject section
    $("#maxSubject").css("display", "none");
}

function bindOnClickToButtons() {
    // Bind function to create subject to addSubject button
    $("#addSubjectBtn").on("click", function() {
        // Create subject and append it to max subject screen
        let subject = createSubject();
        $("#maxSubject").append(subject);

        // Change the screens
        toggleWindows();
    });

    // Bind save function to goBack button
    $("#goBackBtn").on("click", function() {
        // Update the stats for the subject
        checkedCount = $("#maxSubject .checked").children("span").length;
        uncheckedCount = $("#maxSubject .unchecked").children("span").length;
        let newText = `Erledigt: ${checkedCount} | Ausstehend: ${uncheckedCount}`;
        $("#maxSubject .subject h4").text(newText);


        // Get conditions for new subject to be not saved
        // CAUTION: values have to match the inital values in subject.js
        let title = $("#maxSubject .subject h2").text() == "Titel";
        let divUncheckedCount = $("#maxSubject .subject .unchecked").children().length == 1;
        let divCheckedCount = $("#maxSubject .subject .checked").children().length == 0;
        let initialEntry = $("#maxSubject .subject .unchecked").children("span").children("label").text() == "Eintrag";
    
        // Check if conditions are true
        if (!(title && divUncheckedCount && divCheckedCount && initialEntry)) {
            // Entry was modified. Place the subject at correct place
            // Get all subjects
            subjects = $("#allSubjects").children("div");

            // If there is no subject in allSubjects, just append it
            if (subjectCount == 1) {
                $("#maxSubject .subject").appendTo($("#allSubjects"));
            } 
            // Otherwise, check where the edited subject needs to go
            else {
                // If edited subject is sub1, place it at top
                if ($("#maxSubject .subject").attr("id") == "sub1") {
                    $("#maxSubject .subject").prependTo($("#allSubjects"));
                }
                // Otherwise, finde the correct position
                else {
                    // Loop through the subjects and check their ids
                    for (let i = 0; i < subjects.length; i++) {
                        if ($(subjects[i]).attr("id") == `sub${$("#maxSubject .subject").attr("id")[3]-1}`) {
                            $(subjects[i]).after($("#maxSubject .subject"));
                            break;
                        }
                    }
                }
            }
        } else {
            // Delete unmodified entry
            $("#maxSubject .subject").remove();
            updateSubjectIDs();
        }

        // Change the screens
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

function updateSubjectIDs() {
    // This function should be called every time a subject will be deleted
    // so the order will still be correct
    subjectCount -= 1;

    // Iterate through all the subjects
    counter = 1;
    subjects = $("#allSubjects").children("div");
    for (let i = 0; i < subjects.length; i++) {
        $(subjects[i]).attr("id", `sub${counter}`);
        counter += 1;
    }
}

$(document).ready(main);
