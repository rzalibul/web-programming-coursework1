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

$(document).ready
(
	function()
	{
		if (($.browser.msie && $.browser.version < 10) || $.browser.opera) 			// ensures compatibility of disabling text selection
			$('#galleryWrap').attr('unselectable', 'on');
		// source: http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css/8099186#8099186
	}
)

/* review page functionality */
function saveComment()
{
	// to add: write comments with descending date order, ratings (maybe?), adding links to all comments, XSS protection
	var cText = $('#commentBox').val();
	var cName = $('#nameBox').val();
	if (cName === "")
		cName = "Anonymous";
	//alert('saveComment cName=' + cName + ' cText=' + cText);
	
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
	var curComment = '<span class="cmtName">' + cName + ' says:' + '</span><p class="comment">' + cText + '</p><span class="date">' + Date() + '</span><br />' + prevComments;
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
/*
$(".imgNav, .imgSlideNav").hover	// to modify: make it a fade in to stop flicking
(
	function()
	{
		$(this).css("opacity") == "0" ? $(this).css("opacity", "1") : $(this).css("opacity", "0");	
		// display the navigation button when hovered and hide it when cursor stops hovering
	}
);
*/
/*
function preloadImgs()
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
	$(imgList).each
	(
		function()
		{
			new Image().src = "img/" + this;
		}
	);
}
*/
function changeSlidebar(imgList, index, reverse)						// if reverse is true, then get the previous indices
{
	var curThumbnails = document.getElementsByClassName("thumbnail");
	if(reverse)
	{
		if(index % 5 == 4)									// 5 images in a slidebar - that means every fifth image is the last
		{
			for(var j = 0; j < 5; j++)						// possibly do the same as above (not necessary, though)
			{
				$("div#prevSlidebarImg").after("<img class='thumbnail' src='img/" + imgList[index - j] + "' index='" + (index - j) + "' />");
				/*curThumbnails[j].src = "img/" + imgList[index + (j-4)];
				$(curThumbnails[j]).attr('index', index + (j-4));*/
				// subsequently replace slidebar images
			}
			$("img.thumbnail").css("top", "-810px");
			$("img.thumbnail").animate
			(
				{
					top: "-3vh"
				},
				1000,
				function()
				{
					$("img.thumbnail").css("top", "-3vh");
				}
			);
			
			setTimeout
			(
				function()
				{
					for(var j = 4; j > -1; j--)
						$(curThumbnails[5]).remove();	
				},
				1000
			);
		
		}
	}
	else								// if reverse is anything but true or 1, then load next thumbnails
	{
		if(index % 5 == 0)
		{
			for(var j = 0; j < 5; j++)						// iterating downwards makes it easier to manipulate image tags as required
			{
				if (imgList[j + index] === undefined)
				{
					$("div#nextSlidebarImg").before("<img class='thumbnail' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' />");
					// replace image with a transparent pixel; source: https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
				}
				else
				{
					$("div#nextSlidebarImg").before("<img class='thumbnail' src='img/" + imgList[index + j] + "' index='" + (index + j) + "' />");
					/*curThumbnails[j].src = "img/" + imgList[j + index];
					$(curThumbnails[j]).attr('index', index + j);*/
					// subsequently replace slidebar images
				}
			}
			$("img.thumbnail").animate
			(
				{
					top: "-810px"
				},
				1000,
				function()
				{
					$("img.thumbnail").css("top", "-3vh");
				}
			);	
			setTimeout
			(
				function()
				{
					for(var j = 0; j < 5; j++)
						$(curThumbnails[0]).remove();
				},
				1000
			);
		}
	}
	
	$("img.thumbnail").click					// need to rebind event handler as event triggers were subsequently removed and appended
	(
		function()
		{
			var selector = event.target;
			if($(selector).attr("index") == null)
				return;
			var index = parseInt($(selector).attr("index"));
			var mainImg = document.getElementById("fullSize");
			mainImg.src = selector.src;
			$(mainImg).attr("index", $(selector).attr("index"));
		}
	);
}

$(".imgNav").click
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
		var index = parseInt($("img#fullSize").attr("index"));		// get the index from the current displayed image and cast it to integer
		//console.log("index = " + index);
		if(selector === "prevImg")
			index--;
		else														
			index++;
		
		if(index >= 0)												// display the previous/next image in this case
		{
			if(imgList[index] != undefined)
			{
				var mainImg = document.getElementById("fullSize");
				mainImg.src = "img/" + imgList[index];
				$(mainImg).attr("index", index);			
			}
			
			if(selector === "prevImg")
				changeSlidebar(imgList, index, true);
			else
				changeSlidebar(imgList, index, false);
		}
		else		// the slidebar could be overflown if desired; otherwise there is nothing else to do
		{
			
		}	
	}
);

$("div.imgSlideNav").click
(
	function()
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
		var firstIndex = parseInt($("img.thumbnail").attr("index"));

		if(event.target.id == "prevSlidebarImg")
			changeSlidebar(imgList, firstIndex - 1, true);
		else
		{
			if(firstIndex > imgList.length - 5)				// prevent the slidebar from getting a bunch of "empty images"
				return;
			changeSlidebar(imgList, firstIndex + 5, false);
		}
		// when faced with multiple selection, .attr() method returns the first element's result
		// therefore, index must be increased to a value out of bounds for current slidebar selection
		// 1 to the left (previous) is already out of bounds relative to the first element
		// while 5 needs to be added to the first index as it is the overall number of images in slidebar
	}
);

$("img#fullSize").click
(
	function()
	{
		var imgSrc = event.target.src;
		$("div#mainImg").append("<div class='fullScreen'></div><img class='bigImage' src='" + imgSrc + "' />");
		$(".fullScreen, .bigImage").click				// events need to be bound here as relevant nodes are not present until they are appended
		(
			function()
			{
				$(".fullScreen").remove();
				$(".bigImage").remove();
			}
		);
	}
);

$("img.thumbnail").click
(
	function()
	{
		var selector = event.target;
		if($(selector).attr("index") == null)
			return;
		var index = parseInt($(selector).attr("index"));
		var mainImg = document.getElementById("fullSize");
		mainImg.src = selector.src;
		$(mainImg).attr("index", $(selector).attr("index"));
	}
);