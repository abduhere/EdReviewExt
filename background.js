const filter = {
	url: [ {urlMatches: 'https://www.educative.io/'},]
}
chrome.webNavigation.onCompleted.addListener((details) => {
            chrome.tabs.sendMessage(details.tabId, {
                type: "NEW",
                courseId: "test",
                lessonId: "also"
            })
        }, filter);