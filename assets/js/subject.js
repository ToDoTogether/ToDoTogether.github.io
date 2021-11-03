function createSubject() {
    // Create all needed elements
    let div = document.createElement("div");
    $(div).addClass("subject");

    let h2 = document.createElement("h2");
    $(h2).text("Titel").attr("contenteditable", "true");

    let h4 = document.createElement("h4");
    $(h4).text("Erledigt: 0 | Ausstehend: 0");

    let hr = document.createElement("hr");

    let divUnchecked = document.createElement("div");
    $(divUnchecked).addClass("unchecked");
    let divChecked = document.createElement("div");
    $(divChecked).addClass("checked");

    let span = document.createElement("span");

    let input = document.createElement("input");
    $(input).attr({
        type: "checkbox",
        name: "item",
    })

    let label = document.createElement("label");
    $(label).attr("for", "item").text("Eintrag");

    let cross = document.createElement("span");
    $(cross).addClass("material-icons").text("close");

    // Append the elements in the correct order
    $(span).append(input, label, cross);
    $(divUnchecked).append(span);
    $(div).append(h2, h4, divUnchecked, hr, divChecked);

    return div;
}
