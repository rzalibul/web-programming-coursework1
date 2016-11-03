"use strict";
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
	// to add: write comments with descending date order, ratings (maybe?), adding links to all comments, XSS protection
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
		$(this).css("opacity") == "0" ? $(this).css("opacity", "1") : $(this).css("opacity", "0");	
		// display the navigation button when hovered and hide it when cursor stops hovering
	}
);

$(".imgNav").click													// to fix: switch from static property to index attribute
(
	function changeImage()
	{
		var imgList = 
		[
			'1.jpg', 
			'2.jpg', 
			'3.jpg', 
			'4.jpg', 
			'5.jpg',
			'6.jpg',
			'7.jpg',
			'8.jpg',
			'9.jpg',
			'10.jpg',
			'11.jpg',
			'12.jpg',
			'13.jpg',
			'14.jpg',
			'15.jpg',
			'16.jpg',
			'17.jpg',
			'18.jpg',
			'19.jpg'
		];
		// defining array of image paths
		var selector = event.target.id;								// selector will hold the id of event trigger (prevImg or nextImg in this case)
		if(selector === "prevImg")
		{
			if(changeImage.position === undefined)					// if static variable hasn't been called yet,
				changeImage.position = 0;							// it will be undefined and therefore initial value needs to be assigned	
			if(changeImage.position > 0)							// force the position to be a non-negative integer
				changeImage.position--;
		}
		else														
		{
			if(changeImage.position === undefined)
				changeImage.position = 1;
			else													// else clause stops the position index from incrementation right after initialisation
			{
				if(changeImage.position < imgList.length)			// eliminates index overflow
					changeImage.position++;
			}
		}
		if(changeImage.position >= 0)								// display the previous/next image in this case
		{
			if(imgList[changeImage.position] != undefined)
				document.getElementById("fullSize").src = "img/" + imgList[changeImage.position];
			if((changeImage.position % 5 == 4 && selector === "prevImg") || (changeImage.position % 5 == 0 && selector === "nextImg"))	// refactor logical expression		
			{																			// 5 images in a slidebar - that means every fifth image is the last 
				var curThumbnails = document.getElementsByClassName("thumbnail");		// position index starts at 0 though; the second argument of the outer logic sum is needed when
				if(selector === "nextImg")											// button for displaying previous image is pressed directly after the slidebar is moved for next 5 images
				{
					for(var i = 4; i > -1; i--)						// iterating downwards makes it easier to manipulate image tags as required
					{
						if (imgList[i + changeImage.position] === undefined)
						{
							$(curThumbnails[i]).attr('src', "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
							// replace image with a pixel; courtesy of https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
							$(curThumbnails[i]).removeAttr('index');
							continue;								// omit the current iteration
						}
						curThumbnails[i].src = "img/" + imgList[i + changeImage.position];
						$(curThumbnails[i]).attr('index', changeImage.position + i);
						// subsequently replace slidebar images
					}
				}
				else
				{
					for(var i = 0; i < 5; i++)																		// possibly do the same as above (not necessary, though)
					{
						curThumbnails[i].src = "img/" + imgList[changeImage.position + (i-4)];
						$(curThumbnails[i]).attr('index', changeImage.position + (i-4));
					}
				}
			}					
		}
		else		// the slidebar could be overflown if desired; otherwise there is nothing else to do
		{
			
		}	
	}
);

$("img.thumbnail").click
(
	function()
	{
		var selector = event.target;
		document.getElementById("fullSize").src = selector.src;
	}
);