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
});

var $bioResults,
    $bioResTitle,
    $bioResMore,
    $geoResults,
    $geoResTitle,
    $geoResMore,
    bioTotalRes,
    geoTotalRes,
    doSearch = function( type, searchText ){
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
            
            if ( type == 'new'){
                // Initialize results panel
                $bioResTitle.html('<h3>Resultados Ceiba</h3>');
                $geoResTitle.html('<h3>Resultados GeoNetwork</h3>');
            }
            
            // Disable controls
            
            // Search in the Geographic Catalog        
            if (type != 'moreBio'){ // i.e., type is new or moreGeo
            
                $.getJSON( '/geoSearch/', { 
                        q: text,
                        f: geoTotalRes+1,
                        s: 5 
                    } ).done(function( response ) {
                        if ( response.metadataIds !== undefined ){
                            geoTotalRes += +response.retrieved;
                            // Update results panel
                            $geoResTitle.html('<h3>Resultados GeoNetwork: ' + geoTotalRes + ' de ' + response.total + '</h3>');

                            response.metadataIds.forEach(function(item, idx){
                                getMetadataById( item );
                            });
                            
                            // Is it possible to get more results?
                            if ( geoTotalRes < +response.total ){
                                $geoResMore.html( '<button class="btn btn-primary btn-block" onclick="doSearch(\'moreGeo\',\'' + text + '\')" >Cargar más resultados</button>' );
                            } else {
                                $geoResMore.html('');
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
            
            // Search in the Biological Catalog
            if (type != 'moreGeo'){ // i.e., type is new or moreBio
            
                $.getJSON( '/bioSearch/', { 
                        q: text, 
                        f: bioTotalRes,
                        s: 5
                    } ).done(function( response ) {
                        if ( response.resources !== undefined ){
                            bioTotalRes += response.retrieved;                    
                            //Update results panel 
                            $bioResTitle.html('<h3>Resultados Ceiba: ' + bioTotalRes + ' de ' + response.total + '</h3>');
                            
                            response.resources.forEach(function(item, idx){
                               console.log( "Resource:", item.title );
                               $bioResults.append( getResultInHTML( 'bio', item ) );
                            });
                        
                            // Is it possible to get more results?
                            if ( bioTotalRes < +response.total ){
                                $bioResMore.html( '<button class="btn btn-primary btn-block" onclick="doSearch(\'moreBio\',\'' + text + '\')" >Cargar más resultados</button>' );
                            } else {
                                $bioResMore.html('');
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

            // Enable controls    
            
        }
},

getMetadataById = function( metadataId ){
    $.getJSON( '/geoMetadata/', { 
            id: metadataId 
        } ).done(function( response ){
            if ( response.title !== undefined ){
                console.log( "Metadata:", response.title );
                $geoResults.append( getResultInHTML( 'geo', response ) );
            }
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
      data.url = "http://geonetwork.humboldt.org.co/geonetwork/srv/spa/search?#|" + data.uuid;
  }
  if (data.title === undefined || data.abstract === undefined ){
      console.log("WARNING: Couldn't parse object.", data);
      return "";
  }
  return '<div class="media">' +
        '<div class="media-left">' +
            '<a href="' + data.url + '">' +
                '<img width="64px" src="' + data.graphicUrl + '" class="media-object" alt="Vista previa">' +
            '</a>' +
        '</div>' +
        '<div class="media-body">' +
            '<a href="' + data.url + '">' +
            '<h4 class="media-heading">' + data.title + '</h4>' + 
            '</a>' + 
            '<p><small>' + data.abstract + '</small></p>' +
        '</div>' + 
    '</div>';
};

