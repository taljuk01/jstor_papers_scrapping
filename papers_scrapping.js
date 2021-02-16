function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
	var htmlToReturn = []
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var response = xmlHttp.responseText;
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = response;
	htmlToReturn.push(htmlObject)
	htmlObject.remove()
    return htmlToReturn;
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

function getPapersData(currentView, pageNumber, page_url){
	var URLs= currentView.querySelectorAll("pharos-heading a")
	for(var i = 0; i < URLs.length ; i++){
		try{
			console.log("---------------------------------------")
			console.log("Title number " + i.toString() + " Page " + pageNumber.toString())
			var response = httpGet(URLs[i])[0] // list with one element
			var title = response.querySelector(".title-font").innerText.trim()
			var authors = response.querySelector(".author-font").innerText.trim()
			var summary = response.querySelector("[class*='turn-away-content__summary']").innerText.trim().split("\n")
			var paper = {}
			paper.url = page_url
			paper.title = title
			paper.authors = authors
			paper.summary = summary
			console.log("############### DOWNLOADING ################")
			downloadObjectAsJson(paper, "paper_" + i.toString() + "_page_number_" + pageNumber.toString())
		}catch(e){console.log("error while requesting data")}
	}
}

//create variables pagination
var allviews = [] // all pages to request
var pages_offest = 0 // when somehting goes wrong, star requests from this page
var view = document
var total_pages = 100  // total pages to request (100 is the max. This is a site problem)
var pages_counter = 0 + pages_offest

// Get data from first view
console.log("---------------------------------------")
console.log("getting view number " + pages_counter.toString())
getPapersData(view, pages_counter, window.location.href)
console.log("done!")

// Handle pagination
while(pages_counter!==total_pages){
    try{
		pages_counter+=1
		console.log("---------------------------------------")
		console.log("getting view number " + pages_counter.toString())
        nextUrl = view.querySelectorAll("#next-page")[1].href // [div, div] --> elem 0 not works well
        view = httpGet(nextUrl)[0] // list with one element
		getPapersData(view, pages_counter, nextUrl)
    }catch(e){
		alert("error while requesting view number " + pages_counter.toString())
		alert("url is: \n" + nextUrl)
		window.open(nextUrl)
	}
}







