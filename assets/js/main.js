function main() {
    fetchDataJSON();
    hideElementsAtStart();
    bindOnClickToButtons();
}

function fetchDataJSON() {
    // Get the saved data from json file
    url = "https://api.jsonbin.io/b/618aa8a7820eda3cc81a6f0f";
    $.getJSON(url + "/latest", function(data) {
        if (data["empty"] == false) {
            for (let i = 1; i <= Object.keys(data["subjects"]).length; i++) {
                sub = data["subjects"]["sub"+i];

                // Create subject
                let subject = createSubject();

                // Fill in the data
                $(subject).children("h2").text(sub["title"]);
                $(subject).css("background-color", sub["color"]);

                let hr = $(subject).children("hr");
                let checkedCount = sub["checkedItems"].length;
                let uncheckedCount = sub["uncheckedItems"].length;

                // Delete empy entry if there is at least one item
                if (checkedCount > 0 || uncheckedCount > 0) {
                    $(subject).children(".unchecked").children("span").remove();
                }

                // Append checked items
                for (let i = 0; i < checkedCount; i++) {
                    let checkbox = createCheckbox(hr, true);
                    $(checkbox).children("label").text(sub["checkedItems"][i]);
                    $(subject).children(".checked").append(checkbox);
                }

                // Append unchecked items
                for (let i = 0; i < uncheckedCount; i++) {
                    let checkbox = createCheckbox(hr, false);
                    $(checkbox).children("label").text(sub["uncheckedItems"][i]);
                    $(subject).children(".unchecked").append(checkbox);
                }

                // Display the subject
                $("#allSubjects").append(subject);

                // Adapt the hr styling
                checkStyleOfEntries($(subject).children("hr"), ("sub"+i));

                // Update the stats of the subject
                updateStats("sub"+i);
            }
        }
    }).fail(function() {
        // TODO: handle case if json file could not be loaded
    });
}

function hideElementsAtStart() {
    // Hide the maxSubject section and color palette
    $("#maxSubject, #colorPalette, #deleteWarning").css("display", "none");
}

function bindOnClickToButtons() {
    // Bind function to create subject to addSubject button
    $("#addSubjectBtn").on("click", function() {
        // Create subject and append it to max subject screen
        let subject = createSubject();
        $("#maxSubject").append(subject);

        // Make sure inital background color is white
        $("#maxSubject").css("background-color", "white");

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
            checkStyleOfEntries($("#maxSubject .subject hr"), $("#maxSubject .subject").attr("id"));

            // If there is only one empty checkbox, make sure it is unchecked
            let entries = $("#maxSubject .subject .unchecked, #maxSubject .subject .checked").children();
            if (entries.children("label").text() == "" && entries.length == 1) {
                entries.children("input").prop('checked', false);
                $("#maxSubject .subject .unchecked").append(entries);
            };

            // Update the stats for the subject
            updateStats($("#maxSubject .subject").attr("id"));

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

    // Bind functions to color palette
    $("#changeColorBtn").on("click", function() {
        $("#colorPalette").css("display", "block");
        $("html, body").addClass("disableScroll");
    });
    $("#exitColorPalette").on("click", function() {
        $("#colorPalette").css("display", "none");
        $("html, body").removeClass("disableScroll");
    });

    // Bind a function to every color in color palette
    $("#colors").children().on("click", function(e) {
        let color = $(e.target).css("color");
        $("#maxSubject").css("background-color", color);
        $("#maxSubject .subject").css("background-color", color);
    });

    // Bind function to delete button to delete single subjects
    $("#delSubjectBtn").on("click", function() {
        // Display the delete warning
        // $("#deleteWarning").css("display", "flex");
        $("#deleteWarning").fadeIn(200);
    });

    // Bind function to the buttons in the delete warning
    $("#deleteWarningBtnYes").on("click", function() {
        $("#maxSubject .subject").remove();
        $("#deleteWarning").css("display", "none");
        updateSubjectIDs();
        toggleWindows();
    });
    $("#deleteWarningBtnNo").on("click", function() {
        // Hide the delete warning
        // $("#deleteWarning").css("display", "none");
        $("#deleteWarning").fadeOut(200);
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
