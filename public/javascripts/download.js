$(function() {
	// Handler for .ready() called.
	var loc = window.location.pathname;
	var dir = loc.substring(0, loc.lastIndexOf('/'));

	$.get( '/download/filenames', function( data ) {
		console.log(data);
		for (var i=0; i<data.length; i++){
			$('#files').append(`<li><a href='/download/${data[i]}'> ${data[i]} </a></li>`);
		}
	});
});