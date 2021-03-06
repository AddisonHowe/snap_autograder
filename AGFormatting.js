/*var onclick_menu = document.getElementById('onclick-menu');
var menu_style = window.getComputedStyle(onclick_menu);
var menu_right = menu_style.getPropertyValue('right');

var button = document.getElementById('autograding_button');
var button_style = window.getComputedStyle(button);
var button_right = button_style.getPropertyValue('right');*/


 /*
 * Makes AG status bar reflect the ungraded state of the outputLog.
 */

var onclick_menu;
var menu_style;
var menu_right;

var button;
var button_style;
var button_right;

function AG_bar_ungraded(outputLog) {
    var button_text = "Get Feedback ";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    button_elem.fadeOut('fast', function() {
        button_elem.html(button_text);
        button_elem.slideDown('fast');
        $('#autograding_button').css('background', 'orange');
    }); 
    //document.getElementById("autograding_button").style.backgroundColor = "orange";         
    $('#autograding_button .hover_darken').show();
    $('#onclick-menu').css('color', 'white');
    if (sessionStorage.getItem(outputLog.taskID + "_test_log")) {
        $('#feedback-button').html("View Previous Feedback");
    } else {
        $('#feedback-button').html("No Feedback Available");
    }
    //document.getElementById("different-feedback").innerHTML = "This feedback does not match what is in the scripting area."
}

/*
 * Makes AG status bar reflect the graded state of the outputLog. This
 * only occurs when all tests on the outputLog have passed.
 */
function AG_bar_graded(outputLog) {
    var button_text = "Get Feedback  ";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    // button_elem.fadeOut('fast', function() {
    //     button_elem.html(button_text);
    //     button_elem.slideDown('fast');
    //     $('#autograding_button').css('background', '#29A629');
    // });
    button_elem.html(button_text);
    $('#autograding_button').css('background', '#29A629');
    $('#autograding_button .hover_darken').hide();
    $('#onclick-menu').css('color', 'white');
    $('#feedback-button').html("Review Feedback");
}
/*
 * Makes AG status bar reflect the semi graded state of the outputLog. 
 * This is called when any test on the outputLog fails.
 */
function AG_bar_semigraded(outputLog) {
    var button_text = "Get Feedback";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp("FEEDBACK","g");
    var num_errors = outputLog.testCount - outputLog.numCorrect;
    var plural = "";
    if (num_errors > 1) { plural = "s"};
    $('#feedback-button').html("View Feedback ("+ 
        num_errors +" Error" + plural + ")");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    // button_elem.fadeOut('fast', function() {
    //     button_elem.html(button_text);
    //     button_elem.slideDown('fast');
    //     $('#autograding_button').css('background', 'red');
    // });
    button_elem.html(button_text);
    $('#autograding_button').css('background', 'red');
    $('#autograding_button .hover_darken').show();
    $('#onclick-menu').css('color', 'orange');
}

function AG_bar_nograde() {
    var button_text = "NOT GRADED";
    var button_elem = $('#autograding_button span');
    button_elem.html(button_text);
    $('#autograding_button').css({"background":"gray", "cursor":"default"});
    document.getElementById('autograding_button').style.pointerEvents = 'none';
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceall(string, find, replace) {
    return (string.replace(new RegExp(escapeRegExp(find), 'g'), replace));
}

/*
 * Re-format the contents of a the hint string to add HTML tags and
 * appropriate CSS. Return the re-formatted string.
 */
function formatFeedback(hint) {
    var tags = 
    [['collapsedivstart', '<input class="toggle-box" id="expander' + String(id_problem) + '" type="checkbox" ><label for="expander' + String(id_problem) + '">Details</label><div id="table-wrapper">'], 
    ['collapsedivend', '</div>'], 
    ['linebreak', '<br /></br />'], 
    ['tablestart', '<table class="results">'], 
    ['tableend', '</table>'], 
    ['rowstart', '<tr>'], 
    ['rowend', '</tr>'], 
    ['headstart', '<th class="titles" style="text-align: center;">'], 
    ['headend', '</th>'], 
    ['datastart', '<td class="data" style="text-align: center;">'], 
    ['evenstart', '<td class="evens" style="text-align: center;">'],
    ['dataend', '</td>'], 
    ['correctstart', '<td class="correctans" style="text-align: center;">'],
    ['wrongstart', '<td class="incorrectans" style="text-align: center;">'],
    ['teststart', '<td class="tests" style="text-align: center;">'],
    ['spanend', '</span>'], 
    ['spanstart', '<span class="message">']];

    var taglength = tags.length;
    var message = String(hint.innerHTML);

    for (var i = 0; i < taglength; i++) {
        message = replaceall(message, tags[i][0], tags[i][1]);
    }
    return message;
}


function toggleMenu() {
    var menu_items = document.getElementsByClassName("bubble")[0];
    if (menu_items.id === "dropdown-closed") {
        menu_items.id = "dropdown-open";
    } else {
        menu_items.id = "dropdown-closed";
    }
}

function openPopup(){
    var overlay = document.getElementById('overlay');
    overlay.classList.remove("is-hidden");
}

function closePopup(){
    var overlay = document.getElementById('overlay');
    overlay.classList.add("is-hidden");
}

function openResults(){
    var overlay = document.getElementById('ag-output');
    overlay.classList.remove("is-hidden");
}

function closeResults(){
    var overlay = document.getElementById('ag-output');
    overlay.classList.add("is-hidden");
}

/*function populateFeedback(outputLog) {
    var taskID = outputLog.taskID;
    //var last_log = sessionStorage.getItem(taskID + "_last_submitted_log");
    var prev_log = sessionStorage.getItem(taskID + "_test_log");
    var edx_caution = document.getElementById("edx-submit-different");
    var caution = document.getElementById("different-feedback");

    // console.log(outputLog);
    var glog = outputLog;
    var log = AG_log(glog);
    var feedback = log["feedback"];
    var title = log["comment"];

    // console.log(feedback);

    // Wipes the feedback clean, including if it has been populated before. 
    caution.innerHTML = "";
    edx_caution.innerHTML = "";
    document.getElementById("comment").innerHTML = "";
    var tableTitles = document.getElementsByClassName("titles");
    var tableResults = document.getElementById("table-data");
    var repTableResults = document.getElementById("reporter-table-data");
    while (tableResults.children.length > 1) {
        tableResults.removeChild(tableResults.children[1]);
    }
    while (repTableResults.children.length > 1) {
        repTableResults.removeChild(repTableResults.children[1]);
    }

    document.getElementById("comment").innerHTML = title;

    // Checks if the grading button has been clicked
    if (title === "Please run the Snap! Autograder to view feedback.") {
        document.getElementById("table-data").style.display = "none";
        document.getElementById("reporter-table-data").style.display = "none";
    } else {
        document.getElementById("table-data").style.display = "table";
        document.getElementById("reporter-table-data").style.display = "table";
        document.getElementById("comment").innerHTML += " (" + String(Math.round(feedback["totalPoints"] * feedback["pScore"])) + "/" + String(feedback["totalPoints"]) + ")";
    }


    // Warnings for when student's feedback differ from what's on the scripting area/what's been submitted to edX
    //document.getElementById("comment").innerHTML = title + "(" + String(Math.round(feedback["totalPoints"] * feedback["pScore"])) + "/" + String(feedback["totalPoints"]) + ")";
    /*if (!last_log) {
        edx_caution.innerHTML = "[WARNING: You have not submitted your results to edX yet.]"
    }
    else if (last_log !== prev_log) {
        edx_caution.innerHTML = "[WARNING: These results differ from your last edX submission.]"
    }*/

    /*var nonRepTest = 1;
    var repTest = 1;
    for (i=1; i<=feedback["testCount"]; i++) {
        var test = String(i);
        var newRow = document.createElement("tr");

        // If test is not a reporter test, only add columns for Test # and Feedback
        if (feedback[test]["testClass"] !== "r") {
            if (document.getElementsByClassName("non-reporter").length === 0) {
                addBasicHeadings();
            }
            addTableCell(String(nonRepTest), "tests", newRow);
            if (nonRepTest % 2 === 0) {
                addTableCell(feedback[test]["pointValue"], ["data", "evens"], newRow);
            } else {
                addTableCell(feedback[test]["pointValue"], "data", newRow);
            }
            nonRepTest += 1;
        }

        // If test is a reporter test, add all columns, including input, output, and expected. Makes the background of every other row light gray.
        if (feedback[test]["testClass"] === "r") {
            if (document.getElementsByClassName("reporter").length === 0) {
                addReporterHeadings();
            }
            addTableCell(String(repTest), "tests", newRow);
            var keys = ["pointValue", "blockSpec", "input", "output", "expOut"];
            for (key=0; key<keys.length; key++) {
                if (keys[key] === "blockSpec") {
                    var blockSpec = feedback[test][keys[key]];
                    // var blockSpecSliced = blockSpec.slice(2, blockSpec.length - 2);
                    // console.log(blockSpecSliced);
                    if (repTest % 2 === 0) {
                        addTableCell(blockSpec, ["data", "evens"], newRow);
                    } else {
                        addTableCell(blockSpec, "data", newRow);
                    }
                } else {
                    if (repTest % 2 === 0) {
                        addTableCell(feedback[test][keys[key]], ["data", "evens"], newRow);
                    } else {
                        addTableCell(feedback[test][keys[key]], "data", newRow);
                    }
                }
            }
            repTest += 1;
        }

        // If test is correct, make the feedback appropriately colored. 
        if (feedback[test]["correct"] === true) {
            addTableCell(feedback[test]["feedback"], "correctans", newRow);
            if (regradeOn) {
                addRegradeButton("Regrade", ["data", "hidden"], newRow);
            }
        } else {
            addTableCell(feedback[test]["feedback"], "incorrectans", newRow);
            if (regradeOn) {
                addRegradeButton("Regrade", ["data", "regrade", test], newRow);
            }
        }

        if (feedback[test]["testClass"] === "r") {
            document.getElementById("reporter-table-data").appendChild(newRow);
        } else {
            document.getElementById("table-data").appendChild(newRow);
        }  
    }
    // console.log(outputLog);
    //outputLog.saveLog();

    if (regradeOn) {
        // makes recently created regrade buttons clickable 
        var regrade_buttons = document.getElementsByClassName("regrade");
        for(var i=0; i<regrade_buttons.length; i++) {
            regrade_buttons[i].onclick = function() {
                var testId = this.classList[2];
                regradeOnClick(outputLog, testId);
            }
        }
    }
}*/

function addBasicHeadings() {
    basicCols = ["Test", "Points", "Feedback"];
    for (i=0; i<basicCols.length; i++) {
        var header = document.createElement("th");
        var text = document.createTextNode(basicCols[i]);
        //var lastCol = document.getElementById("reporter-last-column");
        var titles = document.getElementById("table-titles");
        header.classList.add("titles", "non-reporter");
        header.appendChild(text);
        titles.appendChild(header);
    }
}

function addReporterHeadings() {
    var columns = ["Test", "Points", "Block", "Input", "Output", "Expected", "Feedback"];
    for (i=0; i<columns.length; i++) {
        var header = document.createElement("th");
        var text = document.createTextNode(columns[i]);
        var repTitles = document.getElementById("reporter-table-titles");
        header.classList.add("titles", "reporter");
        header.appendChild(text);
        repTitles.appendChild(header);
    }
}

function addTableCell(text, elemClass, row) {
    var data = document.createElement("td");
    var text = document.createTextNode(text);
    data.appendChild(text);
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else {
        data.classList.add(elemClass);
    }
    row.appendChild(data);
}

function addRegradeButton(text, elemClass, row) {
    var data = document.createElement("td");
    var button = document.createElement("p");
    var text = document.createTextNode(text);
    button.classList.add("regrade-button");
    button.appendChild(text);
    data.appendChild(button);
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else {
        data.classList.add(elemClass);
    }
    row.appendChild(data);
}

function grayOutButtons(snapWorld, taskID) {
    var ide = snapWorld.children[0];
    var curr_xml = ide.serializer.serialize(ide.stage);
    //Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");

    /*var last_xml = sessionStorage.getItem(taskID + "_last_submitted_state");

    var last_submit = document.getElementById("last-submit");
    if (last_xml === null || isSameSnapXML(last_xml, curr_xml)) {
        last_submit.style.color = "#373737";
        last_submit.style.pointerEvents = "none";
        last_submit.parentNode.id = "disabled-button";
    } else {
        last_submit.parentNode.id = "enabled-button";
        last_submit.style.color = "white";
        last_submit.style.pointerEvents = "auto";
    }*/

    var revert_button = document.getElementById("revert-button");
    if (c_prev_xml === null || isSameSnapXML(c_prev_xml, curr_xml)) {
        //revert_button.parent.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        revert_button.style.pointerEvents = "none";
        revert_button.parentNode.id = "disabled-button";
    } else {
        revert_button.parentNode.id = "enabled-button";
        //revert_button.parent.style.backgroundColor = "white";
        revert_button.style.pointerEvents = "auto";
    }

    var undo_button = document.getElementById("undo-button");
    if (prev_xml === null || isSameSnapXML(prev_xml, curr_xml)) {
        //undo_button.parent.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        undo_button.style.pointerEvents = "none";
        undo_button.parentNode.id = "disabled-button";
    } else {
        undo_button.parentNode.id = "enabled-button";
        //undo_button.parent.style.backgroundColor = "white";
        undo_button.style.pointerEvents = "auto";
    }
}


function makeOverlayButton() {
    var grade_button = document.getElementById("autograding_button");
    var overlay_button = parent.document.createElement('button');
    var overlay_button_text = parent.document.createTextNode('Grade');
    overlay_button.appendChild(overlay_button_text);
    overlay_button.classList.add('overlay-button');
    var button = parent.document.getElementsByName('problem_id')[id_problem];
    button.parentNode.insertBefore(overlay_button, button.nextSibling);
    //var overlay_button = parent.document.getElementsByClassName('overlay-button')[id_problem];
    //overlay_button.style.display = "block";
    overlay_button.onclick = function() { 
        overlay_button.style.display = "none";
        grade_button.click(); 
    }
}

function makeFullScreenButton() {
    var autograding_bar = document.getElementById('autograding_bar');
    var full_screen_button = document.createElement('button');
    var full_screen_button_text = document.createTextNode("Full-Screen");
    full_screen_button.appendChild(full_screen_button_text);
    full_screen_button.id = "full-screen";
    full_screen_button.className = "off";
    autograding_bar.parentNode.insertBefore(full_screen_button, autograding_bar.nextSibling);
}

function toggleSnapWindow(button, taskID) {
    var iframe = parent.document.getElementsByTagName('iframe')[id_problem];
    if (button.className === "off") {
        fullScreenSnap(button, taskID);
    } else {
        iframe.style.position = 'initial';
        iframe.style.top = 'initial';
        iframe.style.right = 'initial';
        //iframe.style.width = 'initial';
        iframe.style.height = '500px';
        iframe.style.zIndex = 'initial';
        button.className = "off";
        button.innerHTML = "Full-Screen";
        sessionStorage.removeItem(taskID + "full-screen-on");
        /*button.style.position = 'absolute';
        button.style.right = '31px';
        button.style.bottom = '225px';*/
    }
}

function fullScreenSnap(button, taskID) {
    var iframe = parent.document.getElementsByTagName('iframe')[id_problem];
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.zIndex = '16777270';
    button.className = "on";
    button.innerHTML = "Windowed";
    sessionStorage.setItem(taskID + "full-screen-on", JSON.stringify(true));
}

IDE_Morph.prototype.originalToggleStageSize = IDE_Morph.prototype.toggleStageSize;
IDE_Morph.prototype.toggleStageSize = function (isSmall) {
    this.originalToggleStageSize(isSmall);
    setTimeout(function() {
        moveAutogradingBar()
    }, 100);
}

function moveAutogradingBar() {
    var autograding_bar = document.getElementById('autograding_bar');
    var ide = world.children[0];
    if (ide.stageRatio === 1) {
        autograding_bar.style.right = '9em';
    } else {
        autograding_bar.style.right = '16em';
    }
}


function initializeSnapAdditions(snapWorld, taskID) {

    var pageLocation = JSON.parse(sessionStorage.getItem(taskID + "pageLocation"));
    if (pageLocation) {
        parent.window.scrollTo(pageLocation[0], pageLocation[1]);
        sessionStorage.removeItem(taskID + "pageLocation");
    }

    ide = snapWorld.children[0];

    //AUTOGRADER ADDITION - FEEDBACK FORMATTING
    // Checks if problem has been checked and modifies the autograded output if it has been checked

    //if (isEDX && parent.document.getElementsByClassName("message").length !== 0) {
    if (isEDX && parent.document.getElementsByClassName("message")[id_problem]) {
        var hint = parent.document.getElementsByClassName("message")[id_problem];
        hint.innerHTML = formatFeedback(hint);
        hint.style.display = "inline";
    }

    //AUTOGRADER ADDITION
    //Check if Pre-requisite task has completed
    var req_check = parent.document.getElementById("pre_req");
    if (preReqTaskID !== null) {
        var preReqLog = JSON.parse(sessionStorage.getItem(preReqID + "_test_log"));
        if ((preReqLog === null || !preReqLog.allCorrect) && req_check) {
            req_check.innerHTML = "[WARNING: The previous task must be completed before continuing.]"
        }
    }

    setTimeout(function() {
        //If page has already been loaded, restore previously tested XML
        //TODO: Separate this into its own function.
        //Moved this into the timeout so that keys in session storage have time to be set from setstate in AGEDX before they are called
        var prev_xml = sessionStorage.getItem(taskID + "_test_state");
        if (prev_xml !== null) {
            ide.openProjectString(prev_xml);
        } else if (preReqTaskID !== null) {
            if (preReqLog !== null && preReqLog.allCorrect) {
                ide.openProjectString(sessionStorage.getItem(preReqID));
            }
        }
    }, 500);

    var prev_log = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));

    var reset_button = document.getElementById("reset-button");
    var revert_button = document.getElementById("revert-button");
    var undo_button = document.getElementById("undo-button");
    //var menu_button = document.getElementsByClassName("onclick-menu")[0];
    //var menu_button = document.getElementById("menu-icon");
    var menu_button = document.getElementsByClassName("hover_darken")[0];
    var help_overlay = document.getElementById('overlay');
    //var feedback_button = document.getElementById("feedback-button");
    var results_overlay = document.getElementById("ag-output");
    var regrade_buttons = document.getElementsByClassName("regrade");
    var grade_button = document.getElementById("autograding_button");
    var world_canvas = document.getElementById('world');
    var snap_menu = document.getElementsByClassName('bubble')[0];
    //var edX_submit_button = parent.document.getElementsByClassName('check-label')[id_problem];


    document.addEventListener("click", function() { grayOutButtons(snapWorld, taskID); });
    snap_menu.addEventListener('click', popup_listener);
    //grade_button.addEventListener('click', button_listener);
    //world_canvas.addEventListener("mouseup", update_listener);
    reset_button.onclick = function() { resetState(snapWorld, taskID); toggleMenu(taskID); };
    revert_button.onclick = function() { revertToBestState(snapWorld, taskID); toggleMenu(taskID); };
    undo_button.onclick = function() { revertToLastState(snapWorld, taskID); toggleMenu(taskID); };
    menu_button.onclick = function() { toggleMenu(taskID); };
    //feedback_button.onclick = function() {openResults(); };

    help_overlay.onclick = function(e) {
        closePopup();
    }

    /*help_overlay.onmousemove = function() {
        moveHelp();
    }*/

    results_overlay.onclick = function(e) {
        if (!(document.getElementById('ag-results').contains(e.target)) && e.target.className.indexOf("regrade") === -1) {
            closeResults();
        }
    }

    world_canvas.onclick = function(e) {
        if (document.getElementById('dropdown-open') !== null && !(document.getElementById('onclick-menu').contains(e.target))) {
            toggleMenu();
        }
    }

    var popup_listener = function(event) {
        event.stopPropagation();
    }

    $(".bubble").mouseover(function() {
        moveHelp();
    });

    /*if (isEDX) {
        edX_submit_button.onclick = function() {
            sessionStorage.setItem(taskID + "_popupFeedback", "");
        }
    }*/
    
    // edX_submit_button.onclick = function() {
    //     sessionStorage.setItem(taskID + "_popupFeedback", "");
    // }

    if (isEDX) {

        /*edX_submit_button.onclick = function() {
            sessionStorage.setItem(taskID + "_popupFeedback", "");
        }*/

        var checkExist = setInterval(function() {
            console.log("checking...." + id_problem);
            if (parent.document.getElementsByClassName('check-label')[id_problem]) {
                console.log("Exists!");
                clearInterval(checkExist);
                parent.document.getElementsByClassName('check-label')[id_problem].onclick = function () {
                    sessionStorage.setItem(taskID + "pageLocation", JSON.stringify([parent.window.scrollX, parent.window.scrollY]));
                }

                var button_text = parent.document.getElementsByClassName('check')[id_problem];
                //button_text.innerHTML = "Submit";
                button_text.style.display = "none";

                //makeOverlayButton();
            }

        }, 100);



        /*setTimeout(function() {
            console.log(parent.document.getElementsByClassName('check-label'));
            console.log(id_problem);
            console.log(parent.document.getElementsByClassName('check-label')[id_problem]);
            parent.document.getElementsByClassName('check-label')[id_problem].onclick = function () {
                sessionStorage.setItem(taskID + "pageLocation", JSON.stringify([parent.window.scrollX, parent.window.scrollY]));
            }

            var button_text = parent.document.getElementsByClassName('check-label')[id_problem];
            button_text.innerHTML = "Submit";

            //makeOverlayButton();
            setTimeout(function() {
                makeOverlayButton();
                /*var overlay_button = parent.document.getElementsByClassName('overlay-button')[id_problem];
                //overlay_button.style.display = "block";
                overlay_button.onclick = function() { 
                    overlay_button.style.display = "none";
                    grade_button.click(); 
                } 
            }, 1000);
        }, 500);*/

        /*console.log(parent.document.getElementsByClassName('check-label'));
        console.log(id_problem);
        console.log(parent.document.getElementsByClassName('check-label')[id_problem]);
        parent.document.getElementsByClassName('check-label')[id_problem].onclick = function () {
            sessionStorage.setItem(taskID + "pageLocation", JSON.stringify([parent.window.scrollX, parent.window.scrollY]));
        }

        var button_text = parent.document.getElementsByClassName('check-label')[id_problem];
        button_text.innerHTML = "Submit";

        makeOverlayButton();
        setTimeout(function() {
            var overlay_button = parent.document.getElementsByClassName('overlay-button')[id_problem];
            //overlay_button.style.display = "block";
            overlay_button.onclick = function() { 
                overlay_button.style.display = "none";
                grade_button.click(); 
            } 
        }, 500);*/
        
        makeFullScreenButton();
        var full_screen = document.getElementById('full-screen');
        full_screen.onclick = function() {
            toggleSnapWindow(full_screen, id);
            moveHelp();   
        }
        var full_screen_on = JSON.parse(sessionStorage.getItem(taskID + "full-screen-on"));
        if (full_screen_on) {
            fullScreenSnap(full_screen, id);
        }
    }

    setTimeout(function() {
        // console.log(snapWorld);
        document.getElementById("toggle-correct-tests").innerHTML = '<div class="toggle-correct isOff" id="toggle-correct">See Correct Tests</div><div id="correct-table-wrapper">';
        if (!graded) {return;}


    },500);

    setTimeout(function() {
        onclick_menu = document.getElementById('onclick-menu');
        menu_style = window.getComputedStyle(onclick_menu);
        menu_right = menu_style.getPropertyValue('right');

        button = document.getElementById('autograding_button');
        button_style = window.getComputedStyle(button);
        button_right = button_style.getPropertyValue('right');

        if (prev_log) {
            var outputLog = prev_log;
        } else {
           var outputLog = AGStart(snapWorld, taskID);
        }

        //for some reason, the for loop in populateFeedback doesn't increment correctly the first time it is run, so populateFeedback has to be called twice at the very beginning...
        if (showFeedback && sessionStorage.getItem(taskID + "_popupFeedback") !== null) {
            populateFeedback(outputLog); 
            populateFeedback(outputLog);
            openResults();
            sessionStorage.removeItem(taskID + "_popupFeedback");
        }
        grayOutButtons(snapWorld, taskID);
        moveAutogradingBar();

        var tip_tests = document.getElementsByClassName("data");
        for(var i=0; i < tip_tests.length; i++){
            tip_tests[i].style.maxWidth = String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px";
        }
        //sessionStorage.setItem(id + "_popupFeedback", "");



    }, 1000);

    setTimeout(function() {
        var starter_xml = sessionStorage.getItem(taskID + "starter_file");
        if (starter_xml) {
            ide.openProjectString(starter_xml);
            sessionStorage.removeItem(taskID + "starter_file");
        }

    }, 1500);
}

//Call the test suite when this element is clicked.
var update_listener = function() {
    var outputLog = AGUpdate(world, id);
};
var button_listener = function(event) {
    event.stopPropagation();
    // console.log('PROPAGATION SHOULD STOP');
    var numAttempts = setNumAttempts(id);
    outputLog = new FeedbackLog(world, id, numAttempts);
    outputLog.numAttempts += 1;
    runAGTest(world, id, outputLog);


    var tip_tests = document.getElementsByClassName("data");
    //console.log(String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px");
    for(var i=0; i < tip_tests.length; i++){
        tip_tests[i].style.maxWidth = String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px";
    }
    sessionStorage.setItem(id + "_popupFeedback", "");
}

function moveHelp() {
    var pos = $(".bubble").offset();

    $("#menu-item-help").css({
        position: "absolute",
        top: pos.top + 100 + "px",
        left: pos.left - 250 + "px"
    });
    $("#menu-item-arrow").css({
        position: "absolute",
        top: pos.top + 60 + "px",
        left: pos.left - 30 + "px"
    });
    $("#ag-button-help").css({
        position: "absolute",
        top: pos.top + "px",
        left: pos.left + 200 + "px"
    });
    $("#ag-button-arrow").css({
        position: "absolute",
        top: pos.top - 30 + "px",
        left: pos.left + 270 + "px"
    });
}





















function appendElement(elem, text, elemClass, selector) {
    var data = document.createElement(elem);
    if (text !== null) {
        var text = document.createTextNode(text);
        data.appendChild(text);
    }
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else if (elemClass !== null) {
        data.classList.add(elemClass);
    }
    selector.appendChild(data);
}

function addReporterHeadings(selector) {
    var columns = ["Input", "Output", "Expected", "Comment"];
    var newRow = document.createElement("tr");
    for (z=0; z<columns.length; z++) {
        var header = document.createElement("th");
        var text = document.createTextNode(columns[z]);
        header.classList.add("titles", "reporter");
        header.appendChild(text);
        newRow.appendChild(header);
    }
    selector.appendChild(newRow);
}

function createCollapsibleCorrectSection(selector) {
    var identifier = "something";
    var correct_collapse = document.createElement("div");
    var correct_tip = document.createElement("div");
    //var correct_tip_text = document.createTextNode("Here are the parts you did correctly!");
    //correct_tip_section.appendChild(correct_tip_text);
    correct_tip.id = "correct-tip" + String(identifier);
    correct_tip.classList.add("correct-tip");

    correct_collapse.innerHTML = '<br><input class="details correct-details" id="correct-expander' + String(identifier) + '" type="checkbox" ><label for="correct-expander' + String(identifier) + '">' + "Here are the parts you did correctly!" + '</label><div id="correct-table-wrapper' + String(identifier) + '">';
    correct_collapse.innerHTML = '<br><div class="toggle-correct" id="toggle-correct' + String(identifier) + '">Click Here</div><span class="correct-expander correct-expander' + String(identifier) + '">Here are the parts you did correctly!</span><div id="correct-table-wrapper' + String(identifier) + '">';
    correct_collapse.innerHTML = '<br><div class="toggle-correct" id="toggle-correct' + String(identifier) + '">See Correct Tests</div><div id="correct-table-wrapper' + String(identifier) + '">';
    //example.nextSibling = correct_tip_section;

    selector.insertBefore(correct_tip, selector.firstChild);

    correct_tip.appendChild(correct_collapse);
}

function populateFeedback(feedbackLog, allFeedback, chunknum, tipnum) {

    /*var toggleButton = document.getElementById("toggle-correct");
    toggleButton.style.display = "none";*/
    //document.getElementById("toggle-correct-tests").innerHTML = '<div class="toggle-correct isOff" id="toggle-correct">See Correct Tests</div><div id="correct-table-wrapper">';
    document.getElementById("toggle-correct-tests").onclick = function() {
        //console.log(allFeedback);
        if (toggleButton.classList.contains("isOff")) {
            toggleButton.classList.remove("isOff");
            allFeedback = true;
            toggleButton.innerHTML = "Hide Correct Tests";
        } else {
            toggleButton.classList.add("isOff");
            allFeedback = false;
            toggleButton.innerHTML = "See Correct Tests";
        }

        /*var correct_id = this.id;
        var numberPattern = /\d+/g;
        var num = String(correct_id).match(numberPattern)[0];*/
        //var num = Number(String(correct_id).match(/\d+/)[0]);
        //console.log(String(this.id).match(/\d+/)[0]);
        populateFeedback(feedbackLog, allFeedback);
        setTimeout(function() {
            openResults();
            //document.getElementById(correct_id).parentNode.parentNode.parentNode.previousSibling.click();
        }, 100);
    }

    

    var comment = document.getElementById("comment");

    comment.innerHTML = "";
    while (comment.nextSibling) {
        document.getElementById("ag-results").removeChild(comment.nextSibling);
    }

    var log = feedbackLog;
    var chunks = log["chunk_list"];
    var linebreak = document.createElement("br");
    //var numtips = log["num_errors"];
    var numtips = 0;
    var plural = "";
    /*if (numtips !== 1) {
        plural = "s";
    }*/

    var chunkHasCorrectTip = false;
    var tipHasCorrectTest = false;

    /*if (document.getElementById("numtips").innerHTML === "") {
        var onclick_menu = document.getElementById('onclick-menu');
        var menu_style = window.getComputedStyle(onclick_menu);
        var menu_right = menu_style.getPropertyValue('right');

        var button = document.getElementById('autograding_button');
        var button_style = window.getComputedStyle(button);
        var button_right = button_style.getPropertyValue('right');
    }*/

    onclick_menu.style.right = menu_right;
    button.style.right = button_right;
    document.getElementById("numtips").innerHTML = String(numtips) + " tip" + plural;
    var tipwidth = document.getElementById("numtips").offsetWidth;

    onclick_menu.style.right = String(Number(menu_right.slice(0, menu_right.length - 2)) + tipwidth - 2) + "px";
    
    button.style.right = String(Number(button_right.slice(0, button_right.length - 2)) + tipwidth - 2) + "px";

    button.style.borderRadius = "0px";
    /*} else {
        document.getElementById("numtips").innerHTML = String(numtips) + " tip" + plural;
    }*/
    
    //var feedback_header = document.createElement("p");
    //var header_text = document.createTextNode("We have " + String(numtips) + " tip" + plural + " for you!");
    //feedback_header.appendChild(header_text);
    //document.getElementById("comment").innerHTML = "We have " + String(numtips) + " tip" + plural + " for you!";
    /*if (numtips === 1) {
        appendElement("p", "We have " + String(numtips) + " tip for you!", "feedback-header", document.getElementById("ag-results"));
    } else {
        appendElement("p", "We have " + String(numtips) + " tips for you!", "feedback-header", document.getElementById("ag-results"));
    }*/
    //document.getElementById("ag-results").insertBefore(feedback_header, document.getElementById("ag-results").firstChild);
    //document.getElementById("ag-results").appendChild(feedback_header);

    var correct_section = document.createElement("div");
    var incorrect_section = document.createElement("div");
    var correct_section_text = document.createTextNode("Here is what you did well!");
    var incorrect_section_text = document.createTextNode("Here is what you may want to look at again!");
    correct_section.appendChild(correct_section_text);
    incorrect_section.appendChild(incorrect_section_text);
    correct_section.id = "correct-section";
    incorrect_section.id = "incorrect-section";

    document.getElementById("ag-results").appendChild(correct_section);
    document.getElementById("ag-results").appendChild(incorrect_section);

    document.getElementById("correct-section").style.display = "none";
    document.getElementById("incorrect-section").style.display = "none";

    var chunknum = chunknum = typeof chunknum !== 'undefined' ? chunknum : undefined;

    var tipnum = tipnum = typeof tipnum !== 'undefined' ? tipnum : undefined;

    //for (i=1; i<=Object.keys(chunks).length; i++) {
    for (i=0; i<chunks.length; i++) {
        var chunk = chunks[i];
        var tips = chunk["tip_list"];
        var header = document.createElement("p");
        header.innerHTML = String(chunk["chunk_title"]) + '<br><br>';
        //var title = document.createTextNode(chunk["chunk_title"]);
        //console.log(title);
        //header.appendChild(title);
        //header.appendChild(linebreak);
        
        header.classList.add("chunk-header", "chunk"+String(i));
        //document.getElementById("ag-results").parentNode.insertBefore(header, document.getElementById("ag-results").nextSibling);
        //document.getElementById("ag-results").insertBefore(header, document.getElementById("ag-results").firstChild);
        //document.getElementById("ag-results").appendChild(header); //Instead of chunk being appended directly to agresults, have two other outside sections (what you did well, what we think you should take a look at)
        
        var correct_chunk = header.cloneNode(true);
        correct_chunk.classList.add("correct-chunk" + String(i));

        //console.log(chunk["allCorrect"]);
        
        if (chunk["allCorrect"] === true) {
            document.getElementById("correct-section").style.display = "block";
            document.getElementById("correct-section").appendChild(correct_chunk);

        } else {
            var incorrect_chunk = header.cloneNode(true);
            incorrect_chunk.classList.add("incorrect-chunk" + String(i));
            //console.log(incorrect_chunk);
            //console.log(correct_chunk);
            //document.getElementById("correct-section").appendChild(correct_chunk);
            document.getElementById("incorrect-section").style.display = "block";
            document.getElementById("incorrect-section").appendChild(incorrect_chunk);
        }

        //for (x=1; x<=Object.keys(tips).length; x++) {
        for (x=0; x<tips.length; x++) {
            var tip = tips[x];
            var allFeedback = allFeedback = typeof allFeedback !== 'undefined' ? allFeedback : false;
            //var tipnum = tipnum = typeof tipnum !== 'undefined' ? tipnum : undefined;
            //var current_chunk = document.getElementsByClassName("chunk"+String(i))[0];
            //current_chunk.appendChild(linebreak);
            //addParagraphText(tip["suggestion"], ["tips", "tip"+String(x)], document.getElementsByClassName("chunk"+String(i))[0]);
            var div = document.createElement("div");
            var label_class = "incorrectans";
            var current_chunk = document.getElementsByClassName("incorrect-chunk"+String(i))[0];
            //console.log(current_chunk);
            if (tip["allCorrect"] === true) {
                document.getElementById("correct-section").style.display = "block";
                document.getElementById("correct-section").appendChild(correct_chunk);
                //console.log("if");
                //console.log(document.getElementsByClassName("correct-chunk"+String(i))[0]);
                current_chunk = document.getElementsByClassName("correct-chunk"+String(i))[0];
                //current_chunk.appendChild(linebreak);
                label_class = "correctans";
                //current_chunk.appendChild(div);
                var suggestion = tip["complement"];
            } else {
                //console.log("else");
                //console.log(i);
                numtips += 1;
                var suggestion = tip["suggestion"];
            }

            div.innerHTML = '<input class="details" id="expander' + String(i) + String(x) + '" type="checkbox" ><label class="' + label_class + '" for="expander' + String(i) + String(x) + '">' + String(suggestion) + '</label><div id="table-wrapper' + String(i) + String(x) + '">';

            //current_chunk.appendChild(linebreak);
            //console.log(current_chunk);
            current_chunk.appendChild(div);
            var details = document.getElementById("table-wrapper" + String(i) + String(x));
            //console.log(details.previousSibling);
            details.previousSibling.click();
            var allTests = tip["test_list"];
            //var assertions = tip["ass_list"];
            //var tests = tip["test_list"];
            appendElement("p", "", ["inner-titles", "observations" + String(i) +String(x)], details);
            //console.log(assertions);

            for (j=0; j<allTests.length; j++) {
                var newRow = document.createElement("tr");
                var thisTest = allTests[j];
                if (thisTest["testClass"] !== "r") {
                    if (document.getElementsByClassName("observations-section" + String(i) +String(x)[0]) !== []) {
                        incorrect_assertions = 0;
                        correct_assertions = 0;
                        appendElement("div", "", ["results", "observations-section" + String(i) +String(x)], document.getElementsByClassName("observations" + String(i) +String(x))[0]);
                    }

                    //console.log(tip["allCorrect"]);
                    //console.log(thisTest["correct"]);
                    if (tip["allCorrect"] === false && thisTest["correct"] === true) {
                        tipHasCorrectTest = true;
                        if (!document.getElementById("correct-tip" + String(i) + String(x))) {

                        } 

                    }
                    
                    if (thisTest["correct"] === true) {
                        correct_assertions += 1;
                        //console.log(tipnum);
                        if ((allFeedback) || tip["allCorrect"]) {
                            appendElement("p", "✔", "data", document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                            appendElement("p", "Tests Passed! " + thisTest["feedback"], ["data", "assertion"], document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                            appendElement("br", null, null, document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                        }
                        
                    } else {
                        appendElement("p", "✖", "data", document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                        incorrect_assertions += 1;
                        appendElement("p", "Error Found! " + thisTest["feedback"], ["data", "assertion"], document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                        appendElement("br", null, null, document.getElementsByClassName("observations-section" + String(i) +String(x))[0]);
                    }

                } else {
                    if (document.getElementsByClassName("tests-section" + String(i) +String(x)[0]) !== []) {
                        incorrect_tests = 0;
                        correct_tests = 0;
                        appendElement("div", "", ["results", "tests-section" + String(i) +String(x)], document.getElementsByClassName("observations" + String(i) +String(x))[0]);
                    }
                    if (thisTest["correct"] === true && tip["allCorrect"] === false) {
                        tipHasCorrectTest = true;
                        if (!document.getElementById("correct-tip" + String(i) + String(x))) {

                        }

                    }

                    if (thisTest["correct"]) {
                        correct_tests += 1;
                    } else {
                        incorrect_tests += 1;
                    }

                    var keys = ["input", "output", "expOut", "comment"];
                    //if (test["correct"] === false || tip["correct"] === true) {

                    if (thisTest["correct"] === true) {
                        //correct_assertions += 1;
                        //console.log(tipnum);
                        if ((allFeedback) || tip["allCorrect"]) {
                            appendElement("p", "✔", "data", document.getElementsByClassName("tests-section" + String(i) +String(x))[0]);
                            var string_reporter = document.createElement("div");
                            string_reporter.classList.add("data", "assertion");
                            string_reporter.innerHTML = '<p class="data assertion">' + thisTest["feedback"] + " The " + '<p class = "data assertion bold">input: ' + thisTest["input"] + '</p>' + '<p class="data assertion">, returned the </p>' + '<p class="data assertion bold">expected value: ' + thisTest["expOut"] + '</p>';
                            document.getElementsByClassName("tests-section" + String(i) +String(x))[0].appendChild(string_reporter);
                            appendElement("br", null, null, document.getElementsByClassName("tests-section" + String(i) +String(x))[0]);
                        }
                    } else {
                        appendElement("p", "✖", "data", document.getElementsByClassName("tests-section" + String(i) +String(x))[0]);
                        //incorrect_assertions += 1;
                        

                        var string_reporter = document.createElement("div");
                        string_reporter.classList.add("data", "assertion");
                        string_reporter.innerHTML = '<p class="data assertion">' + thisTest["feedback"] + " The " + '<p class = "data assertion bold">input: ' + thisTest["input"] + '</p>' + '<p class="data assertion"> did NOT return the </p>' + '<p class="data assertion bold">expected value: ' + thisTest["expOut"] + '.<p class="data assertion"> Instead it returned ' + '<p class="data assertion bold">the output: ' + thisTest["output"] + '</p>';
                        document.getElementsByClassName("tests-section" + String(i) +String(x))[0].appendChild(string_reporter);
                        appendElement("br", null, null, document.getElementsByClassName("tests-section" + String(i) +String(x))[0]);
                    }
                }
            }
        }
    }
    if (document.getElementsByClassName("incorrectans")[0] !== undefined) {
        document.getElementsByClassName("incorrectans")[0].click();
    }
    //document.getElementsByClassName("incorrectans")[0].click();
    correct_width = document.getElementById("correct-section").offsetWidth;
    incorrect_width = document.getElementById("incorrect-section").offsetWidth;
    popup_width = document.getElementById("ag-results").offsetWidth - 60; //To-do, make the subtracted value work for any padding values
    if (document.getElementsByClassName("incorrectans")[0] !== undefined) {
        document.getElementsByClassName("incorrectans")[0].click();
    }
    //document.getElementsByClassName("incorrectans")[0].click();
    //console.log(correct_width);
    //console.log(incorrect_width);
    //console.log(popup_width);

    var correct_section = document.getElementById('correct-section');
    var correct_section_style = window.getComputedStyle(correct_section);
    var correct_section_display = correct_section_style.getPropertyValue('display');

    var incorrect_section = document.getElementById('incorrect-section');
    var incorrect_section_style = window.getComputedStyle(incorrect_section);
    var incorrect_section_display = incorrect_section_style.getPropertyValue('display');

    if ((correct_width + incorrect_width) <= popup_width) {
        if (correct_section_display !== "none") {
            correct_section.style.display = "inline-block";
        }
        if (incorrect_section_display !== "none") {
            incorrect_section.style.display = "inline-block";
        }
        //document.getElementById("correct-section").style.display = "inline-block";
        //document.getElementById("incorrect-section").style.display = "inline-block";
    } else {
        if (correct_section_display !== "none") {
            correct_section.style.display = "default";
        }
        if (incorrect_section_display !== "none") {
            incorrect_section.style.display = "default";
        }
        //document.getElementById("correct-section").style.float = "default";
        //document.getElementById("incorrect-section").style.float = "default";
    }
    //console.log(feedbackLog);

    if (numtips !== 1) {
        plural = "s";
    }

    document.getElementById("comment").innerHTML = "We have " + String(numtips) + " tip" + plural + " for you!";

    onclick_menu.style.right = menu_right;
    button.style.right = button_right;
    document.getElementById("numtips").innerHTML = String(numtips) + " tip" + plural;
    var tipwidth = document.getElementById("numtips").offsetWidth;

    onclick_menu.style.right = String(Number(menu_right.slice(0, menu_right.length - 2)) + tipwidth - 2) + "px";
    
    button.style.right = String(Number(button_right.slice(0, button_right.length - 2)) + tipwidth - 2) + "px";

    button.style.borderRadius = "0px";

    var toggleButton = document.getElementById("toggle-correct");
    if (tipHasCorrectTest) {
        toggleButton.style.display = "block";
    } else {
        toggleButton.style.display = "none";
    }

    /*var tip_tests = document.getElementsByClassName("data");
    console.log(String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px");
    for(var i=0; i < tip_tests.length; i++){
        tip_tests[i].style.maxWidth = String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px";
    }*/

}











