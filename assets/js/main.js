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
        // Get conditions for new subject to be not saved
        // CAUTION: values have to match the inital values in subject.js
        let title = $("#maxSubject .subject h2").text() == "";
        let uncheckedEntries = $("#maxSubject .subject .unchecked").children("span").children("label").text() == "";
        let checkedEntries = $("#maxSubject .subject .checked").children("span").children("label").text() == "";

        // Check if conditions are true
        if (!(title && uncheckedEntries && checkedEntries)) {
            // Entry was modified. Place the subject at correct place

            // Delete all empty checkboxes
            $("#maxSubject .subject .unchecked, #maxSubject .subject .checked").children().each(function() {
                if ($(this).children("label").text() == "") {
                    if ($("#maxSubject .subject .unchecked, #maxSubject .subject .checked").children().length > 1) {
                        $(this).remove();
                    }
                }
            });
            // Adapt the hr styling
            checkStyleOfEntries($("#maxSubject .subject hr"));

            // If there is only one empty checkbox, make sure it is unchecked
            let entries = $("#maxSubject .subject .unchecked, #maxSubject .subject .checked").children();
            if (entries.children("label").text() == "" && entries.length == 1) {
                entries.children("input").prop('checked', false);
                $("#maxSubject .subject .unchecked").append(entries);
            }

            // Update the stats for the subject
            let checkedCount = $("#maxSubject .checked").children("span").length;
            let uncheckedCount = $("#maxSubject .unchecked").children("span").length;
            let newText = `Erledigt: ${checkedCount} | Ausstehend: ${uncheckedCount}`;
            $("#maxSubject .subject h4").text(newText);

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
