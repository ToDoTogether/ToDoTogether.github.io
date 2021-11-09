subjectCount = 0

function createSubject() {
    // Increase the subject count
    subjectCount += 1;

    // Create all needed elements
    let div = document.createElement("div");
    $(div).attr("id", `sub${subjectCount}`).addClass("subject");
    $(div).on("click", function() {
        // Check if allSubjects windows is shown
        if ($("#maxSubject").css("display") == "none") {
            toggleWindows();
            $(div).appendTo($("#maxSubject"));

            // Change color of maxSubject to match subject
            $("#maxSubject").css("background-color", $(div).css("background-color"));
        }
    })

    let h2 = document.createElement("h2");
    $(h2).attr("contenteditable", "true");
    $(h2).attr("data-placeholder", "Unbekannter Titel");
    $(h2).on("keydown", function(e) {
        // Prevent the user from hitting enter
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    let h4 = document.createElement("h4");

    let hr = document.createElement("hr");
    $(hr).addClass("hide");

    let divUnchecked = document.createElement("div");
    $(divUnchecked).addClass("unchecked");
    let divChecked = document.createElement("div");
    $(divChecked).addClass("checked");

    let checkbox = createCheckbox(hr, false, $(div).attr("id"));

    // Append the elements in the correct order
    $(divUnchecked).append(checkbox);
    $(div).append(h2, h4, divUnchecked, hr, divChecked);

    return div;
}

function createCheckbox(hr, checked, id) {
    let span = document.createElement("span");

    let input = document.createElement("input");
    $(input).attr({
        type: "checkbox",
        name: "item",
    });
    $(input).on("change", function(e) {
        // Move the entry in the correct div
        if (input.checked) {
            $(span).appendTo($("#maxSubject .checked"));
        } else {
            $(span).appendTo($("#maxSubject .unchecked"));
        }

        // Check for styling updates
        checkStyleOfEntries(hr, id);
    });
    if (checked) {
        input.checked = true;
    }

    let label = document.createElement("label");
    $(label).attr("data-placeholder", "Eintrag");
    $(label).attr({
        for: "item",
        contenteditable: "true",
    });
    $(label).on("keydown", function(e) {
        // Prevent the user from hitting enter
        // Create new checkbox instead
        if (e.keyCode == 13) {
            e.preventDefault();
            
            // Check wether the checkbox where enter was hit is checked
            checked = false;
            if (input.checked) {
                checked = true;
            }

            // Insert the new checkbox
            let newCheckbox = createCheckbox(hr, checked, id);
            $(span).after(newCheckbox);

            // Scroll down (if necessary) to the checkbox
            if (($(newCheckbox).offset().top + $(newCheckbox).height()) > window.innerHeight) {
                span.scrollIntoView(true);
            }

            // Set the cursor correctly
            // CREDIT: https://stackoverflow.com/questions/6249095/how-to-set-the-caret-cursor-position-in-a-contenteditable-element-div
            let range = document.createRange();
            let sel = window.getSelection();

            range.setStart(newCheckbox.childNodes[1], 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    });

    let cross = document.createElement("i");
    $(cross).addClass("material-icons").text("close");
    $(cross).on("click", function(e) {
        let checkedCount = $("#maxSubject .checked").children("span").length;
        let uncheckedCount = $("#maxSubject .unchecked").children("span").length;

        if (checkedCount + uncheckedCount > 1) {
            $(span).remove();
            checkStyleOfEntries(hr, id);
        }
    })

    // Put the elements together
    $(span).append(input, label, cross);

    return span;
}

function checkStyleOfEntries(hr, id) {
    let checkedCount = $("#" + id + " .checked").children("span").length;
    let uncheckedCount = $("#" + id + " .unchecked").children("span").length;

    // Display the horizontal line only when at least one of both is checked
    if (checkedCount == 0 || uncheckedCount == 0) {
        $(hr).removeClass("show").addClass("hide");
    } else {
        $(hr).removeClass("hide").addClass("show");
    }
}

function updateStats(id) {
    let checkedCount = $("#" + id + " .checked").children("span").length;
    let uncheckedCount = $("#" + id + " .unchecked").children("span").length;

    // Make sure the empty one is not counted
    if (uncheckedCount == 1 && $("#" + id + " .unchecked").children("span").children("label").text() == "") {
        uncheckedCount -= 1;
    }

    let newText = `Erledigt: ${checkedCount} | Ausstehend: ${uncheckedCount}`;
    $("#" + id + " h4").text(newText);
}
