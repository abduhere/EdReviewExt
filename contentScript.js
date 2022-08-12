const removeAllChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

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

// This function calls rule functions according to the lesson category
function checkChallengeA() {
    var rpt = document.getElementById("dvRevDtl");
    if(rpt!=null){
		removeAllChildren(rpt); // clean up the reporting div
	}
	else{
		rpt = document.createElement("div");
		rpt.id = "dvRevDtl";
		document.getElementById("dvReview").appendChild(rpt);
	}

	if(getSelectedCategory()!="D"){
		console.log("Rules only set up for Model Lesson A.");
		return;
	}

	rpt.appendChild(document.createElement("p"));
    const titleIssues = lessonTitleViolations();
    rpt.appendChild(titleIssues);
    const summaryIssues = lessonSummaryViolation();
    rpt.appendChild(summaryIssues);
    const tocIssues = lessonSubTitleViolations();
    rpt.appendChild(tocIssues)
    const textIssues = compolsoryTextViolations();
    rpt.appendChild(textIssues);
    const quizTitleIssues = quizTitleViolations();
    rpt.appendChild(quizTitleIssues);
    const constraintsIssues = constraintsViolations();
    rpt.appendChild(constraintsIssues);
    const permutationIssues = permutationViolations();
    rpt.appendChild(permutationIssues);
    const codeIssues = codeViolations();
    rpt.appendChild(codeIssues);
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

function getSelectedCategory() {
    categoryRadioButtons = document.getElementsByName("category");
    for(i = 0; i < categoryRadioButtons.length; i++){
    	if(categoryRadioButtons[i].checked){
    		return categoryRadioButtons[i].value;
    	}
    }
}

// Returns a list of violations in Lesson Title
function lessonTitleViolations() {
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    const list = document.createElement("ul");
    title = title.split(' ');
    if (title[0] != "Challenge:") {
        const li = document.createElement("li");
        li.innerHTML = "Lesson title not as per template."
        li.style.color = "red";
        list.appendChild(li);
    }
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
function lessonSummaryViolation() {
    const summaryElement = document.getElementsByClassName("PageSummary__Description-der42c-2 fOqKyO");
    const list = document.createElement("ul");
    let title = document.getElementsByClassName("text-left mb-2")[0].innerHTML;
    title = title.substring(11);
    const summary = "Try to solve the " + title + " problem.";
    if (summaryElement[0].innerText.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Lesson summary is missing!";
        li.style.color = "red";
        list.appendChild(li);
    } else if (summaryElement[0].innerText.toLowerCase() != summary.toLowerCase()) {
        const li = document.createElement("li");
        li.innerHTML = "Lesson summary not as per category D summary template.";
        li.style.color = "red";
        list.appendChild(li);
    } else if (summaryElement[0].innerText.substring(17, 17 + title.length) != title) {
        const li = document.createElement("li");
        li.innerHTML = "Problem Title should be in Title Case in lesson summary.";
        li.style.color = "red";
        list.appendChild(li);
    }else if (summaryElement[0].innerText[summaryElement[0].innerText.length - 1] != '.') {
        const li = document.createElement("li");
        li.innerHTML = "The summary should end with the period symbol.";
        li.style.color = "red";
        list.appendChild(li);
    }
    return list;
}

// Returns a list of violations in TOC
function lessonSubTitleViolations() {
    const list = document.createElement("ul");
	let toc = document.getElementsByClassName("markdownViewer  Widget_markdown-default__1HZqM Widget_markdown-table__2o-wV Widget_markdown-viewer__2usZh Widget_markdown-viewer-rendered-in-toc__2EVsp")
	if (toc.length==0){
        const li = document.createElement("li");
        li.innerHTML = "No sections defined!";
        li.style.color = "red";
        list.appendChild(li);
        return list;
	}
    let subTitles = document.getElementsByClassName("markdownViewer  Widget_markdown-default__1HZqM Widget_markdown-table__2o-wV Widget_markdown-viewer__2usZh Widget_markdown-viewer-rendered-in-toc__2EVsp")[0].innerText;
    subTitles = subTitles.split('\n');
    const givenSubtitles = ["statement", "examples", "test your understanding of the problem", "figure it out!", "try it yourself"];
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

    // Checking heading level violations
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
function compolsoryTextViolations() {
    const list = document.createElement("ul");

    // Checking Test your understanding of the problem text violationa
    const headingTest = document.getElementById("Test-your-understanding-of-the-problem");
    if (headingTest.nextElementSibling == null) {
        if (headingTest.closest(".mt-5").nextElementSibling.innerText != "Let’s take a moment to make sure we have correctly understood the problem. The quiz below helps us to check that we are solving precisely the right problem:") {
            const li = document.createElement("li");
            li.innerHTML = "\"Test your understanding of the problem\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    } else {
        if (headingTest.nextElementSibling.innerText != "Let's take a moment to make sure we have correctly understood the problem. The quiz below helps us to check that we are solving precisely the right problem:") {
            const li = document.createElement("li");
            li.innerHTML = "\"Test your understanding of the problem\" Section text missing/not as per template."
            li.style.color = "red";
            list.appendChild(li);
        }
    }

    // Checking Figure it out! text violations
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

    // Checking Try it yourself text violations
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
function quizTitleViolations() {
    const list = document.createElement("ul");
    const quizTitleElement = document.getElementsByClassName("quiz-title");
    if (quizTitleElement.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Quiz title is missing.";
        li.style.color = "red";
        list.appendChild(li);
    } else {
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
function constraintsViolations() {
    const list = document.createElement("ul");
    const statementHeading = document.getElementById("Statement");
    const constraintHeading = statementHeading.nextElementSibling.nextElementSibling;
    if (constraintHeading.innerText != "Constraints" && constraintHeading.innerText != "Constraints#") {
        const li = document.createElement("li");
        li.innerHTML = "Constraints are missing.";
        li.style.color = "red";
        list.appendChild(li);
    } else {
        if (constraintHeading.firstElementChild == null || constraintHeading.tagName == "H2" || constraintHeading.tagName == "H3" || constraintHeading.tagName == "H4" || constraintHeading.tagName == "H5" || constraintHeading.tagName == "H6") {
            const li = document.createElement("li");
            li.innerHTML = "Constraints should be written in bold.";
            li.style.color = "red";
            list.appendChild(li);
        }
    }
    // Checking for LaTex violations
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
function permutationViolations() {
    const list = document.createElement("ul");
    const description = document.getElementsByClassName("flex items-center bg-gray-A200 px-4 py-2");
    if (description[0].innerText.length == 0) {
        const li = document.createElement("li");
        li.innerHTML = "Permutation widget text missing.";
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