function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

var text = document.body.innerHTML;
function replaceText(text) {
    //Regex for capital and lowercase letters
    var rECap = /(?:^|\W)C(\w+)(?!\w)/g, capMatch, capNewText;
    var rELow = /(?:^|\W)c(\w+)(?!\w)/g, lowerMatch;

   // ~*~*~*~*~*~*~*~ This whole loop is essentially what needs to happen: 
   // ~*~*~*~*~*~*~*~ Where capNewText has the rECap or rELow ecexcuted on it, 
   // ~*~*~*~*~*~*~*~ but it doesn't run when it get stored as a variable.
   // ~*~*~*~*~*~*~*~  --it needs to be envoked somehow. I think we
   // ~*~*~*~*~*~*~*~ just need to create another seperate function 
   // ~*~*~*~*~*~*~*~ that can take the value and just do it again 

    while (capMatch = rECap.exec(text)){
        //finds words with capital C 
        var newCapMatch = capMatch[0];
        //takes word without C and adds B emoji
        var newCapBWord = ' 🅱️️' + capMatch[1];
        //replaces each instance
        var capNewText = text.replace(newCapMatch, newCapBWord);

        // ~*~*~*~*~* where it needs to get the text that was regexed and rerun it
        var capMatch2 = rECap.exec(capNewText);
        //finds words with capital C 
        var newCapMatch2 = capMatch2[0];
        //takes word without C and adds B emoji
        var newCapBWord2 = ' 🅱️️' + capMatch2[1];
        //replaces each instance
        var capNewText2 = capNewText.replace(newCapMatch, newCapBWord);
    }
        
    //working loop that scans once    
    while (lowerMatch = rELow.exec(text)) {
        //finds words with lowercase C 
        var newLowerMatch = lowerMatch[0];
        // takes word without C and adds B emoji
        var newLowerBWord = ' 🅱️️' + lowerMatch[1];
        //replaces each instance
        var lowerNewText = text.replace(newLowerMatch, newLowerBWord);
        return lowerNewText;
    } 
    //returns normal text
    return text;
}


// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // // Observe the body so that we replace text in any added/modified nodes
    // bodyObserver = new MutationObserver(observerCallback);
    // bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
