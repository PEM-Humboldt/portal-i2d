$(document).ready(function(){
    $bioResults = $('#bioResults');
    $bioResTitle = $('#bioResultsTitle');
    $bioResMore = $('#bioResultsMoreBtn');
    $geoResults = $('#geoResults');
    $geoResTitle = $('#geoResultsTitle');
    $geoResMore = $('#geoResultsMoreBtn');
    // Listen to keyup event of the search input box
    $("#searchInput").keyup(function(event){ 
        if ( event.which === 13 ) {
            doSearch('new');
        }
    });

    //When page loads...
    $(".results").hide();
    $(".reset").hide();

	//On Click Event
	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});

    $('input[type=search]').on('search', function () {
        if(bioTotalRes || geoTotalRes || bioTotalRes == 0 || geoTotalRes == 0) {
            $(".results").hide();
        }
    });
});

var $bioResults,
    $bioResTitle,
    $bioResMore,
    $geoResults,
    $geoResTitle,
    $geoResMore,
    bioTotalRes,
    geoTotalRes,
    doReset = function() {
        if(bioTotalRes || geoTotalRes || bioTotalRes == 0 || geoTotalRes == 0) {
            $('#searchInput').val("")
            $(".results").hide();
            $(".reset").hide();
        }
    },
    doSearch = function( type, searchText ) {
        var text = searchText || $('#searchInput').val();
        if ( type == 'new'){
            bioTotalRes = 0;
            geoTotalRes = 0;
            $bioResults.html('');
            $bioResMore.html('');
            $geoResults.html('');
            $geoResMore.html('');
        }
        if ( text !== undefined && text.trim().length > 0 ){
            text = text.trim();
            
            if (type == 'new'){

                $(".tab_content").hide(); //Hide all tab content
                $(".results").show();
                $("ul.tabs li:first").addClass("active").show(); //Activate first tab
	            $(".tab_content:first").show(); //Show first tab content
                $(".reset").show();


                // Initialize results panel
                $bioResTitle.html('<h3>Resultados Ceiba</h3>');
                $geoResTitle.html('<h3>Resultados GeoNetwork</h3>');
                
                // Disable controls
                $('#searchButton').prop('disabled', true);
                $('#searchInput').prop('disabled', true);
            }
            
            // Search in the Geographic Catalog        
            if (type == 'new' || type == 'moreGeo'){ // i.e., type is new or moreGeo
            
                $('#geoMoreButton').prop('disabled', true); // Disable load more btn
            
                $.getJSON( '/geoSearch/', { 
                        q: text,
                        f: geoTotalRes+1
                        // We don't set a size parameter to handle it from config.js
                    } ).done(function( response ) {
                        if ( response.metadataIds !== undefined ){
                            geoTotalRes += +response.retrieved;
                            // Update results panel
                            $geoResTitle.html('<h3>' + geoTotalRes + ' de ' + response.total + ' resultados</h3>');

                            response.metadataIds.forEach(function(item, idx){
                                getMetadataById( item );
                            });
                            
                            // Is it possible to get more results?
                            if ( geoTotalRes < +response.total ){
                                $geoResMore.html( '<button id="geoMoreButton" class="btn btn-primary btn-block" title="Cargar más resultados" onclick="doSearch(\'moreGeo\',\'' + text + '\')" ><i class="fa fa-plus"></i></button>' );
                            } else {
                                $geoResMore.html('');
                            }
                            
                            // No results to retrieve, enable controls
                            if (response.total == 0){
                                $('#searchButton').prop('disabled', false);
                                $('#searchInput').prop('disabled', false);
                            }
                        }
                    } ).fail( function( jqXHR, textStatus, errorThrown ) {
                        // log the error to the console
                        console.error(
                            'The following error occured:', 
                            jqXHR.status,
                            textStatus, 
                            errorThrown
                        );
                        // Enable controls
                        $('#searchButton').prop('disabled', false);
                        $('#searchInput').prop('disabled', false);
                    });
            }
            
            // Search in the Biological Catalog
            if (type == 'new' || type == 'moreBio'){ // i.e., type is new or moreBio
            
                $('#bioMoreButton').prop('disabled', true); // Disable load more btn
            
                $.getJSON( '/bioSearch/', { 
                        q: text, 
                        f: bioTotalRes
                        // We don't set a size parameter to handle it from config.js
                    } ).done(function( response ) {
                        if ( response.resources !== undefined ){
                            bioTotalRes += response.retrieved;                    
                            //Update results panel 
                            $bioResTitle.html('<h3>' + bioTotalRes + ' de ' + response.total + ' resultados</h3>');
                            
                            response.resources.forEach(function(item, idx){
                               //console.log( "Resource:", item.title );
                               $bioResults.append( getResultInHTML( 'bio', item ) );
                            });
                        
                            // Is it possible to get more results?
                            if ( bioTotalRes < +response.total ){
                                $bioResMore.html( '<button id="bioMoreButton" class="btn btn-primary btn-block" title="Cargar más resultados" onclick="doSearch(\'moreBio\',\'' + text + '\')" ><i class="fa fa-plus"></i></button>' );
                            } else {
                                $bioResMore.html('');
                            }
                            
                            // Enable controls    
                            $('#geoMoreButton').prop('disabled', false); // Enable load more btn
                            //$('#searchButton').prop('disabled', false);
                            //$('#searchInput').prop('disabled', false);

                            // Show geonetwork tab
                            if(bioTotalRes == 0) {
                                $("ul.tabs li").removeClass("active"); //Remove any "active" class
                                $("ul.tabs li:last").addClass("active").show(); //Add "active" class to selected tab
                                $(".tab_content").hide(); //Hide all tab content
                                $('#tab2').fadeIn(); //Fade in the active ID content
                            }
                        }
                    } ).fail( function( jqXHR, textStatus, errorThrown ) {
                        // log the error to the console
                        console.error(
                            'The following error occured:', 
                            jqXHR.status,
                            textStatus, 
                            errorThrown
                        );
                  });
            }

        }
},

getMetadataById = function( metadataId ){
    $.getJSON( '/geoMetadata/', { 
            id: metadataId 
        } ).done(function( response ){
            if ( response.title !== undefined ){
                //console.log( "Metadata:", response.title );
                $geoResults.append( getResultInHTML( 'geo', response ) );
            }
            
            // Enable controls    
            $('#searchButton').prop('disabled', false);
            $('#searchInput').prop('disabled', false);
            $('#geoMoreButton').prop('disabled', false); // Enable load more btn
            
        } ).fail( function( jqXHR, textStatus, errorThrown ){
            // log the error to the console
            console.error(
                'The following error occured:', 
                jqXHR.status,
                textStatus, 
                errorThrown
            );
      });
},

getResultInHTML = function( type, data ){
  if (type == 'bio' ){
      data.url = "http://i2d.humboldt.org.co/ceiba/resource.do?r=" + data.id;
      data.graphicUrl = 'img/logoCeiba.png';
  } else if ( type == 'geo'){
      data.graphicUrl = data.graphicUrl || "https://placeholdit.imgix.net/~text?txtsize=11&txt=GeoNetwork&w=64&h=80&txttrack=0";
      data.url = "http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/" + data.uuid;
  }
  if (data.title === undefined || data.abstract === undefined ){
      console.log("WARNING: Couldn't parse object.", data);
      return "";
  }
  return '<div class="media">' +
        '<div class="media-left">' +
            '<a target="_blank" href="' + data.url + '">' +
                '<img width="64px" src="' + data.graphicUrl + '" class="media-object" alt="Vista previa">' +
            '</a>' +
        '</div>' +
        '<div class="media-body">' +
            '<a target="_blank" href="' + data.url + '">' +
            '<h4 class="media-heading">' + data.title + '</h4>' + 
            '</a>' + 
            '<p><small>' + data.abstract + '</small></p>' +
        '</div>' + 
    '</div>';
};

