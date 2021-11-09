url = "https://api.jsonbin.io/b/618ac413763da443125e1a3b";
JSONdata = null;

function main() {
    fetchDataJSON();
    hideElementsAtStart();
    bindOnClickToButtons();
}

function fetchDataJSON() {
    // Get the saved data from json file
    $.getJSON(url + "/latest").done(function(data) {
        JSONdata = data;
        if (data["empty"] == "0") {
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
                for (let j = 0; j < checkedCount; j++) {
                    let checkbox = createCheckbox(hr, true, ("sub"+i));
                    $(checkbox).children("label").text(sub["checkedItems"][j]);
                    $(subject).children(".checked").append(checkbox);
                }

                // Append unchecked items
                for (let j = 0; j < uncheckedCount; j++) {
                    let checkbox = createCheckbox(hr, false, ("sub"+i));
                    $(checkbox).children("label").text(sub["uncheckedItems"][j]);
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

            // Save data in json file
            let req = new XMLHttpRequest();
            req.open("PUT", url, true);
            req.setRequestHeader("Content-Type", "application/json");

            // Check if it is the first element in the json file
            if (JSONdata["empty"] == "1") {
                JSONdata["empty"] = "0";
                JSONdata["subjects"] = {};
            }

            // If the subject is new, create a new dict in json file
            let id = $("#maxSubject .subject").attr("id");
            if (!Object.keys(JSONdata["subjects"]).includes(id)) {
                JSONdata["subjects"][id] = {};
            }

            // Modify the data for the subject
            JSONdata["subjects"][id]["title"] = $("#maxSubject .subject h2").text();
            JSONdata["subjects"][id]["color"] = $("#maxSubject .subject").css("background-color");

            JSONdata["subjects"][id]["checkedItems"] = []
            for (let i = 0; i < $("#maxSubject .subject .checked").children().length; i++) {
                let item = $("#maxSubject .subject .checked").children("span")[i];
                JSONdata["subjects"][id]["checkedItems"].push($(item).children("label").text());
            };

            JSONdata["subjects"][id]["uncheckedItems"] = []
            for (let i = 0; i < $("#maxSubject .subject .unchecked").children().length; i++) {
                let item = $("#maxSubject .subject .unchecked").children("span")[i];
                JSONdata["subjects"][id]["uncheckedItems"].push($(item).children("label").text());
            };

            // Update the json file
            req.send(JSON.stringify(JSONdata));

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
        $("#deleteWarning").css("display", "flex");
        // $("#deleteWarning").fadeIn(200);
    });

    // Bind function to the buttons in the delete warning
    $("#deleteWarningBtnYes").on("click", function() {
        let req = new XMLHttpRequest();
        req.open("PUT", url, true);
        req.setRequestHeader("Content-Type", "application/json");

        // Modify the data for the subject
        delete JSONdata["subjects"][$("#maxSubject .subject").attr("id")];

        // Check if there are any subjects left
        if (Object.keys(JSONdata["subjects"]).length == 0) {
            JSONdata["empty"] = "1";
        };

        // Delete entry and switch to main screen
        $("#maxSubject .subject").remove();
        $("#deleteWarning").css("display", "none");
        toggleWindows();
        updateSubjectIDs();

        // Update the json file
        req.send(JSON.stringify(JSONdata));
    });
    $("#deleteWarningBtnNo").on("click", function() {
        // Hide the delete warning
        $("#deleteWarning").css("display", "none");
        // $("#deleteWarning").fadeOut(200);
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
    let counter = 1;
    let subjects = $("#allSubjects").children("div");
    for (let i = 0; i < subjects.length; i++) {
        $(subjects[i]).attr("id", `sub${counter}`);
        counter += 1;
    }

    // Update names in json file
    let subs = JSONdata["subjects"];
    let newSubs = {}
    for (let i = 1; i <= Object.keys(subs).length; i++) {
        newSubs["sub"+i] = Object.values(subs)[i-1];
    }
    JSONdata["subjects"] = newSubs;
}

$(document).ready(main);
