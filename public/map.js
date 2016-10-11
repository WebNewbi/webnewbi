var map;

loadMap = function(elementId, x, y) {
    var container = document.getElementById(elementId);
    var options = {
        center: new daum.maps.LatLng(x, y),
        level: 3
    };
    map = new daum.maps.Map(container, options);
  };

panTo = function(x, y) {
    var moveLatLon = new daum.maps.LatLng(x, y);

    map.panTo(moveLatLon);
  };

$(document).ready(function ()
{
    loadMap('map', 33.450701, 126.570667);
    $("#seoul").bind('click', function () { panTo(33.350701, 126.470667); });
});
