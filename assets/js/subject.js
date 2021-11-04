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
        }
    })

    let h2 = document.createElement("h2");
    $(h2).text("Titel").attr("contenteditable", "true");
    $(h2).on("keydown", function(e) {
        // Prevent the user from hitting enter
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    let h4 = document.createElement("h4");

    let hr = document.createElement("hr");
    $(hr).addClass("hideHr");

    let divUnchecked = document.createElement("div");
    $(divUnchecked).addClass("unchecked");
    let divChecked = document.createElement("div");
    $(divChecked).addClass("checked");

    let checkbox1 = createCheckbox(hr);
    let checkbox2 = createCheckbox(hr);  // !! only while working
    let checkbox3 = createCheckbox(hr);  // !! only while working

    // Append the elements in the correct order
    $(divUnchecked).append(checkbox1, checkbox2, checkbox3);
    $(div).append(h2, h4, divUnchecked, hr, divChecked);

    return div;
}

function createCheckbox(hr) {
    let span = document.createElement("span");

    let input = document.createElement("input");
    $(input).attr({
        type: "checkbox",
        name: "item",
    });
    $(input).on("change", function() {
        // Move the entry in the correct div
        if (input.checked) {
            $(span).appendTo($("#maxSubject .checked"));
        } else {
            $(span).appendTo($("#maxSubject .unchecked"));
        }

        // Check for styling updates
        checkStyleOfEntries(hr);
    });

    let label = document.createElement("label");
    $(label).text("Eintrag");
    $(label).attr({
        for: "item",
        contenteditable: "true",
    });
    $(label).on("keydown", function(e) {
        // Prevent the user from hitting enter
        if (e.keyCode == 13) {
            e.preventDefault();
        } else {
            // TODO: Create new checkbox?
        }
    });

    let cross = document.createElement("span");
    $(cross).addClass("material-icons").text("close");

    // Put the elements together
    $(span).append(input, label, cross);

    return span;
}

function checkStyleOfEntries(hr) {
    // Get amount of checkboxes
    checkedCount = $("#maxSubject .checked").children("span").length;
    uncheckedCount = $("#maxSubject .unchecked").children("span").length;

    // Display the horizontal line only when at least one of both is checked
    if (checkedCount == 0 || uncheckedCount == 0) {
        $(hr).removeClass("showHr").addClass("hideHr");
    } else {
        $(hr).removeClass("hideHr").addClass("showHr");
    }
}
