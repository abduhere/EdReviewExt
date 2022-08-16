// Clears the list of previous rules if reviewer is run again
const removeAllChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

// Returns HTML for UI for selecting categories
function setUpCategoryChoices(){
	var strRadioGrp = `Select Lesson Category: &nbsp; &nbsp; &nbsp;<input type="radio" name="category" value="A" checked="checked"> A
					<input type="radio" name="category" value="B"> B
					<input type="radio" name="category" value="C"> C
					<input type="radio" name="category" value="D"> D`;

	return strRadioGrp;
}

// This function is called when the page has loaded
function addReview() {
    const div = document.createElement("div");
    div.id = "dvReview"
    div.style.position = "fixed"
    div.style.top = "64px";
    div.style.right = "0px";
    div.style.width = "400px";
    div.style.backgroundColor = "rgba(200, 100, 200, 0.1)";
    const buttonA = document.createElement("button");
    buttonA.innerHTML = "Check Challenge";
    buttonA.id = "btnChA";
    buttonA.addEventListener("click", checkChallengeA);
    buttonA.style.backgroundColor = "rgb(85,83,255)";
    const buttonB = document.createElement("button");
    buttonB.innerHTML = "Check Solution";
    buttonB.id = "btnSolA";
    buttonB.addEventListener("click", checkSolutionA);
    buttonB.style.backgroundColor = "rgb(85,83,255)";
    
	div.innerHTML = setUpCategoryChoices();
    div.append(document.createElement("p"));
    div.appendChild(buttonA);
    div.append(document.createElement("p")); 
    div.appendChild(buttonB)
    
    document.body.appendChild(div);
    document.getElementById("dvReview").style.zIndex = "1000"
}

// Returns the selected category of lessons
function getSelectedCategory() {
    categoryRadioButtons = document.getElementsByName("category");
    for(i = 0; i < categoryRadioButtons.length; i++){
        if(categoryRadioButtons[i].checked){
            return categoryRadioButtons[i].value;
        }
    }
}

// This function calls rule functions according to the lesson category
function checkChallengeA() {
    var rpt = document.getElementById("dvRevDtl");
    if (rpt != null) {
		removeAllChildren(rpt); // clean up the reporting div
	}
	else {
		rpt = document.createElement("div");
		rpt.id = "dvRevDtl";
		document.getElementById("dvReview").appendChild(rpt);
	}

    const category = getSelectedCategory();

	rpt.appendChild(document.createElement("p"));
    const titleIssues = lessonTitleViolations(category);
    rpt.appendChild(titleIssues);
    const summaryIssues = lessonSummaryViolation(category);
    rpt.appendChild(summaryIssues);
    const tocIssues = lessonSubTitleViolations(category);
    rpt.appendChild(tocIssues)
    const textIssues = compolsoryTextViolations(category);
    rpt.appendChild(textIssues);
    const quizTitleIssues = quizTitleViolations(category);
    rpt.appendChild(quizTitleIssues);
    const constraintsIssues = constraintsViolations(category);
    rpt.appendChild(constraintsIssues);
    const permutationIssues = permutationViolations(category);
    rpt.appendChild(permutationIssues);
    const codeIssues = codeViolations();
    rpt.appendChild(codeIssues);
    const examplesIssues = examplesViolations(category);
    rpt.appendChild(examplesIssues);
    if (titleIssues.childElementCount + summaryIssues.childElementCount + tocIssues.childElementCount + textIssues.childElementCount + quizTitleIssues.childElementCount + constraintsIssues.childElementCount + permutationIssues.childElementCount + codeIssues.childElementCount == 0){
    	const allGood = document.createElement("span");
    	allGood.textContent = "All good!"
        allGood.style.color = "green";
    	rpt.appendChild(allGood)
    }
}

function checkSolutionA() {
    console.log("HELLO from Solution A checker!");
//     getSelectedCategory();
}


// Returns a list of violations in Lesson Title
function lessonTitleViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = titleTemplateViolation(list);
        list = titleTitleCaseViolation(list);
    }
    return list;
}

// Checks if title is as per template
function titleTemplateViolation(list) {
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.split(' ');
    if (title[0] != "Challenge:") {
        const li = document.createElement("li");
        li.innerHTML = "Lesson title not as per template."
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Checks if title is in Title Case
function titleTitleCaseViolation(list) {
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.split(' ');
    for (var i=0; i<title.length; i++) {
        if (title[i].charAt(0) == title[i].charAt(0).toLowerCase()) {
            const li = document.createElement("li");
            li.innerHTML = "Please use Title Case in the lesson title."
            li.style.color = "red";
            list.appendChild(li);
            break;
        }
    }
    return list;
}

// Returns a list df violations in Lesson Summary
function lessonSummaryViolation(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = summaryMissingViolation(list);
        if (list.childElementCount == 0) {
            list = summaryPeriodViolation(list);
        }
        if (list.childElementCount == 0) {
            list = summaryProblemTitleViolation(list);
        }
        if (list.childElementCount == 0) {
            list = summaryTemplateViolation(list);
        }
    }
    return list;
}

// Checks if lesson summary is missing
function summaryMissingViolation(list) {
    const summaryElement = document.getElementsByClassName("PageSummary__Description-der42c-2 fOqKyO");
    if (summaryElement[0].innerText.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Lesson summary is missing!";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Check if lesson summary as per template
function summaryTemplateViolation(list) {
    const summaryElement = document.getElementsByClassName("PageSummary__Description-der42c-2 fOqKyO");
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.substring(11);
    const summary = "Try to solve the " + title + " problem.";
    if (summaryElement[0].innerText.toLowerCase() != summary.toLowerCase()) {
        const li = document.createElement("li");
        li.innerHTML = "Lesson summary not as per category D summary template.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Checks if Problem Title is in Title Case in summary
function summaryProblemTitleViolation(list) {
    const summaryElement = document.getElementsByClassName("PageSummary__Description-der42c-2 fOqKyO");
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.substring(11);
    if (summaryElement[0].innerText.substring(17, 17 + title.length) != title) {
        const li = document.createElement("li");
        li.innerHTML = "Problem Title should be in Title Case in lesson summary.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Checks if lesson summary ends in period
function summaryPeriodViolation(list) {
    const summaryElement = document.getElementsByClassName("PageSummary__Description-der42c-2 fOqKyO");
    if (summaryElement[0].innerText[summaryElement[0].innerText.length - 1] != '.') {
        const li = document.createElement("li");
        li.innerHTML = "The summary should end with the period symbol.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Returns a list of violations in TOC
function lessonSubTitleViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list  = tocUnavailableViolation(list);
        if (list.childElementCount == 0) {
            list  = tocSentenceCaseViolation(list);
        }
        if (list.childElementCount == 0) {
            list = tocMissingHeadingViolation(list);
        }
        if (list.childElementCount == 0) {
            list = tocHeadingLevelViolation(list);
        }
    }
    return list;
}

// Checks if TOC is present or not
function tocUnavailableViolation(list) {
    let toc = document.getElementsByClassName("markdownViewer  Widget_markdown-default__1HZqM Widget_markdown-table__2o-wV Widget_markdown-viewer__2usZh Widget_markdown-viewer-rendered-in-toc__2EVsp")
	if (toc.length==0){
        const li = document.createElement("li");
        li.innerHTML = "No sections defined!";
        li.style.color = "red";
        list.appendChild(li);
	}
    return list;
}

// Checks if TOC headings are in Sentence case
function tocSentenceCaseViolation(list) {
    let subTitles = document.getElementsByClassName("markdownViewer  Widget_markdown-default__1HZqM Widget_markdown-table__2o-wV Widget_markdown-viewer__2usZh Widget_markdown-viewer-rendered-in-toc__2EVsp")[0].innerText;
    subTitles = subTitles.split('\n');
    let check = 0;
    for (var i=0; i<subTitles.length; i++) {
        const words = subTitles[i].split(" ");
        if (words[0][0] != words[0][0].toUpperCase() && check==0) {
            const li = document.createElement("li");
            li.innerHTML = "Convert TOC headings to Sentence case.";
            li.style.color = "red";
            list.appendChild(li);
            check += 1;
        }
        for (var j=1; j<words.length; j++) {
            if (words[j][0] == words[j][0].toUpperCase() && check==0) {
                const li = document.createElement("li");
                li.innerHTML = "Convert TOC headings to Sentence case.";
                li.style.color = "red";
                list.appendChild(li);
                check += 1;
            }
        }
    }
    return list;
}

// Checks if any TOC heading is missing
function tocMissingHeadingViolation(list) {
    let subTitles = document.getElementsByClassName("markdownViewer  Widget_markdown-default__1HZqM Widget_markdown-table__2o-wV Widget_markdown-viewer__2usZh Widget_markdown-viewer-rendered-in-toc__2EVsp")[0].innerText;
    subTitles = subTitles.split('\n');
    const givenSubtitles = ["statement", "examples", "test your understanding of the problem", "figure it out!", "try it yourself"];
    for (var i=0; i<subTitles.length; i++) {
        subTitles[i] = subTitles[i].toLowerCase();
    }
    for (var i=0; i<subTitles.length; i++) {
        if (!subTitles.includes(givenSubtitles[i])) {
            const li = document.createElement("li");
            li.style.color = "red";
            li.innerHTML = "\"" + givenSubtitles[i] + "\" heading missing from TOC.";
            list.appendChild(li);
        }
    }
    return list;
}

// Check if TOC headings are at correct heading level
function tocHeadingLevelViolation(list) {
    const ids = ["Statement", "Examples", "Test-your-understanding-of-the-problem", "Figure-it-out!", "Try-it-yourself"];
    for (var i=0; i<ids.length; i++) {
        const element = document.getElementById(ids[i]);
        const tag = element.tagName;
        if (tag != "H2") {
            const li = document.createElement("li");
            li.innerHTML = "\"" + element.innerText + "\" heading level not correct.";
            li.style.color = "red";
            list.appendChild(li);
            element.style.color = "red";
        }
    }
    return list;
}

// Returns a list of violations in compulsory texts
function compolsoryTextViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = testTextViolation(list);
        list = figureTextViolation(list);
        list = tryTextViolation(list);
    }
    return list;
}

// Check if Test your understanding of the problem text is as per template
function testTextViolation(list) {
    const headingTest = document.getElementById("Test-your-understanding-of-the-problem");
    if (headingTest.nextElementSibling == null) {
        if (headingTest.closest(".mt-5").nextElementSibling.innerText != "Let’s take a moment to make sure we have correctly understood the problem. The quiz below helps us to check that we are solving precisely the right problem:") {
            const li = document.createElement("li");
            li.innerHTML = "\"Test your understanding of the problem\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    } else {
        if (headingTest.nextElementSibling.innerText != "Let’s take a moment to make sure we have correctly understood the problem. The quiz below helps us to check that we are solving precisely the right problem:") {
            const li = document.createElement("li");
            li.innerHTML = "\"Test your understanding of the problem\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    }
    return list;
}

// Check if Figure it out! text is as per template
function figureTextViolation(list) {
    const headingFigure = document.getElementById("Figure-it-out!");
    if (headingFigure.nextElementSibling == null) {
        if (headingFigure.closest(".mt-5").nextElementSibling.innerText != "We have a game for you to play: re-arrange the logical building blocks to develop a clearer understanding of how to solve this problem.") {
            const li = document.createElement("li");
            li.innerHTML = "\"Figure it out!\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    } else {
        if (headingFigure.nextElementSibling.innerText != "We have a game for you to play: re-arrange the logical building blocks to develop a clearer understanding of how to solve this problem.") {
            const li = document.createElement("li");
            li.innerHTML = "\"Figure it out!\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    }
    return list;
}

// Check if Try it yourself text is as per template
function tryTextViolation(list) {
    const sentences = ["We have provided a useful code template in the other file, that you may build on to solve this problem.", "We have provided some useful code templates in the other files, that you may build on to solve this problem.", "We have provided some useful code templates in the other file, that you may build on to solve this problem."]
    const headingTry = document.getElementById("Try-it-yourself");
    const files = document.getElementsByClassName("styles__Files-sc-2pjuhh-9 ksBJCN");
    if (headingTry.nextElementSibling == null) {
        let text = headingTry.closest(".mt-5").nextElementSibling.innerText;
        if (files.length == 0) {
            if (text != "Implement your solution in main.py in the following coding playground.") {
                const li = document.createElement("li");
                li.innerHTML = "\"Try it yourself\" Section text missing/not as per template."
                li.style.color = "red";
                list.appendChild(li);
            }
        } else {
            if (!sentences.includes(text[1])) {
                const li = document.createElement("li");
                li.innerHTML = "In \"Try it yourself\", guide the learner about the additional files."
                li.style.color = "red";
                list.appendChild(li);
            }
        }
    } else {
        let text = headingTry.nextElementSibling.innerText;
        if (files.length == 0) {
            if (text != "Implement your solution in main.py in the following coding playground.") {
                const li = document.createElement("li");
                li.innerHTML = "\"Try it yourself\" Section text missing/not as per template."
                li.style.color = "red";
                list.appendChild(li);
            }
        } else {
            text = text.split(". ");
            if (text[0] != "Implement your solution in main.py in the following coding playground") {
                const li = document.createElement("li");
                li.innerHTML = "\"Try it yourself\" Section text missing/not as per template."
                li.style.color = "red";
                list.appendChild(li);
            }
            if (!sentences.includes(text[1])) {
                const li = document.createElement("li");
                li.innerHTML = "In \"Try it yourself\", guide the learner about the additional files."
                li.style.color = "red";
                list.appendChild(li);
            }
        }
    }
    return list;
}

// Returns a list of violations in Quiz Title
function quizTitleViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = quizTitleMisisngViolation(list);
        list = quizTitleTemplateViolation(list);
    }
    return list;
}

// Check if quiz title is missing
function quizTitleMisisngViolation(list) {
    const quizTitleElement = document.getElementsByClassName("quiz-title");
    if (quizTitleElement.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Quiz title is missing.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Check if quiz title is as per template and in Title Case
function quizTitleTemplateViolation(list) {
    const quizTitleElement = document.getElementsByClassName("quiz-title");
    if (quizTitleElement.length != 0) {
        const quizTitle = quizTitleElement[0].innerText;
        let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
        title = title.substring(11);
        if (quizTitle != title) {
            const li = document.createElement("li");
            li.style.color = "red";
            if (quizTitle.toLowerCase() == title.toLowerCase()) {
                li.innerHTML = "Quiz title should be in Title Case.";
            } else {
                li.innerHTML = "Quiz title should be the same as the problem title.";
            }
            list.appendChild(li);
        }
    }
    return list;
}

// Returns a list of violations in Constraints
function constraintsViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = constraintsMissingViolation(list);
        list = constraintsBoldViolation(list);
        list = constraintsLatexViolation(list);
    }
    return list;
}

// Check if contraints are missing
function constraintsMissingViolation(list) {
    const statementHeading = document.getElementById("Statement");
    const constraintHeading = statementHeading.nextElementSibling.nextElementSibling;
    if (constraintHeading.innerText != "Constraints" && constraintHeading.innerText != "Constraints#") {
        const li = document.createElement("li");
        li.innerHTML = "Constraints are missing.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Check if constraints heading is other than bold
function constraintsBoldViolation(list) {
    const statementHeading = document.getElementById("Statement");
    const constraintHeading = statementHeading.nextElementSibling.nextElementSibling;
    if (constraintHeading.innerText == "Constraints" || constraintHeading.innerText == "Constraints#") {
        if (constraintHeading.firstElementChild == null || constraintHeading.tagName == "H2" || constraintHeading.tagName == "H3" || constraintHeading.tagName == "H4" || constraintHeading.tagName == "H5" || constraintHeading.tagName == "H6") {
            const li = document.createElement("li");
            li.innerHTML = "Constraints should be written in bold.";
            li.style.color = "red";
            list.appendChild(li);
        }
    }
    return list;
}

// Check if there are any LaTex violations in constraints
function constraintsLatexViolation(list) {
    const statementHeading = document.getElementById("Statement");
    const constraintHeading = statementHeading.nextElementSibling.nextElementSibling;
    const constraints = constraintHeading.nextElementSibling;
    if (constraints.innerText.includes("<=") || constraints.innerText.includes(">=")) {
        const li = document.createElement("li");
        li.innerHTML = "Please use LaTex for mathematical symbols.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Returns list of violations in Permutation Widget
function permutationViolations(category) {
    let list = document.createElement("ul");
    if (category == "A" || category == "B" || category == "C" || category == "D") {
        list = permutationMissingViolation(list);
        list = permutationTextTemplateViolation(list);
    }
    return list;
}

// Check if permutation widget text is missing
function permutationMissingViolation(list) {
    const description = document.getElementsByClassName("flex items-center bg-gray-A200 px-4 py-2");
    if (description[0].innerText.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Permutation widget text missing.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Check if permutation widget text as per template
function permutationTextTemplateViolation(list) {
    const description = document.getElementsByClassName("flex items-center bg-gray-A200 px-4 py-2");
    if (description[0].innerText.length != 0) {
        if (description[0].innerText != "Drag and drop the cards to re-arrange them in the correct sequence.") {
            const li = document.createElement("li");
            li.innerHTML = "Permutation widget text not as per template.";
            li.style.color = "red";
            list.appendChild(li);
        }
    }
    return list;
}

// Returns list of violations in Examples heading
function examplesViolations(category) {
    let list = document.createElement("ul");
    if (category == "B" || category == "C") {
        list = examplesSlideMissingViolation(list);
        if (list.childElementCount == 0) {
            list = examplesSlideSingleViolation(list);
        }
    }
    return list;
}

// Checks if Examples slide deck is missing
function examplesSlideMissingViolation(list) {
    const examplesHeading = document.getElementById("Examples");
    const slideDeck = examplesHeading.closest(".mt-5").nextElementSibling;
    if (slideDeck.getElementsByClassName("text-center block").length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "There is no slide deck in examples.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Checks if Examples slide deck has only one slide
function examplesSlideSingleViolation(list) {
    const examplesHeading = document.getElementById("Examples");
    const slideDeck = examplesHeading.closest(".mt-5").nextElementSibling;
    console.log(slideDeck.getElementsByClassName("text-center hidden"));
    if (slideDeck.getElementsByClassName("text-center hidden").length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "There is only one slide in the slide deck, kindly add at least one more example.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Returns list of violations in Code Widget
function codeViolations() {
    const list = document.createElement("ul");
    const caption = document.getElementsByClassName("styles__CaptionStyled-pzuq02-0 fDAxae");
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.substring(11);
    if (caption[0] == undefined) {
        const li = document.createElement("li");
        li.innerHTML = "Code widget caption missing.";
        li.style.color = "red";
        list.appendChild(li);
    } else if (caption[0].innerText != title) {
        const li = document.createElement("li");
        li.innerHTML = "Code widget caption not as per template."
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

function imageCaptionViolations() {
    // Check image captions
    const widgets = document.querySelectorAll('.widget');
    let ret = {
        imageCount: 0,
        capViolationCount: 0
    }
    if (widgets) {
        widgets.forEach(function (wi) {
            const w = wi.querySelector('object')
            if (w.getAttribute('data')) {
                if (w.getAttribute('data').includes('image')) {
                    ret.imageCount = ret.imageCount + 1;
                    const cap = wi.querySelector('.fDAxae')
                    if (!cap) {
                        ret.capViolationCount = ret.capViolationCount + 1;
                        let newp = document.createElement('p');
                        newp.style.color = 'red';
                        newp.innerText = 'No image caption';
                        wi.appendChild(newp);
                    }
                }
            }
        })
    }
    return ret;
}

// Waits for the page to load
if (document.readyState !== 'complete') {
    window.addEventListener('load',afterWindowLoaded);
} else {
    afterWindowLoaded();
}

function afterWindowLoaded(){
    addReview();
}