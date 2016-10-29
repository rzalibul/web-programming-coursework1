// utility functions for local storage with use of JSON
function setObject(key, value) 
{
	window.localStorage.setItem(key, JSON.stringify(value));
};
function getObject(key) 
{
	var storage = window.localStorage;
	var value = storage.getItem(key);
	return value && JSON.parse(value);
};
function clearStorage() 
{
	// removes everything placed in localstorage
	window.localStorage.clear();
};
/* review page functionality */
function saveComment()
{
	// to add: write comments with descending date order, ratings (maybe?), adding links to all comments
	var cText = $('#commentBox').val();
	var cName = $('#nameBox').val();
	if (cName === "")
		cName = "Anonymous";
	alert('saveComment cName=' + cName + ' cText=' + cText);
	
	var prevComments = $('#commentList').html() == '<span class="cmtName">No comments</span>' ? "" : $('#commentList').html();
	// if there are no comments loaded, 'No comments' span element is present and in order to remove it, it needs to be checked
	// if it is present, assign empty string, otherwise proceed normally
	/*
		equivalent to:
		var prevComments;
		if($('#commentList').html() == '<span class="cmtName">No comments</span>')
			prevComments = "";
		else
			prevComments = $('#commentList').html();
	*/
	var curComment = prevComments + '<span class="cmtName">' + cName + ' says:' + '</span><p class="comment">' + cText + '</p><span class="date">' + Date() + '</span><br />';
	$('#commentList').empty();
	$('#commentList').append(curComment);
	setObject('comments', $('#commentList').html());
}

function clearComment()
{
	if($("#commentBox").val() == "THERE IS NO COW LEVEL")
		clearStorage();
	$("#nameBox").val("");
	$("#commentBox").val("");
}

function fetchComments()
{
	// to add: load comments with descending date order (from the most recent to the least recent)
	var inList = getObject('comments');
	if (inList == null)
		inList = '<span class="cmtName">No comments</span>';
	$('#commentList').empty();
	$('#commentList').append(inList);
}
/* gallery page functionality */

$(".imgNav").hover	// to modify: make it a fade in to stop flicking
(
	function()
	{
		$(this).css("opacity") == "0" ? $(this).css("opacity", "1") : $(this).css("opacity", "0");	// display the navigation button when hovered and hide it when cursor stops hovering
	}
);

$(".imgNav").click
(
	function changeImage()
	{
		var selector = event.target;
		if(selector.id === "prevImg")
			changeImage.position = ++changeImage.position || 1;		// if static variable hasn't been called yet, it will be undefined and therefore initial value needs to be assigned
		else
		{
			changeImage.position = --changeImage.position || -1;	// similarly to above
		}
		if(changeImage.position > 0)								// display the previous/next image in this case
		{
			document.getElementById("fullSize").src = "some_new_relative_path";
		}
		else														// the slidebar could be overflown if desired; otherwise there is nothing else to do
		{
			
		}	
	}
);
