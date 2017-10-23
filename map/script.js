var KEY = 'AIzaSyBurnP2Y9-YavLSun_85ZntENUfF4w45OE'; // only works on production domains
// use these for the labels numbering
var hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשת';

if (location.hostname.indexOf("localhost") > -1) { // development key
  KEY = "AIzaSyAvH9YqCyrBQoZeXlfNnYDRpngdwYmZEnw";
}

function _generateRandomString() {
  return Math.random().toString(36).substring(2);
}

function _getInput() {
  return document.getElementById('search');
}

function getSearchText() {
  return document.getElementById('search').value;
}

function addScript(src) {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  document.body.appendChild(s);
}


/**
 * gets a template string and creates a html render of it,
 * with the obj as params.
 * @param {string} template
 * @param {object} obj
 */
function render(templateString, obj) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return templateString.replace(/{{.+?}}/g, function(found) {
    var content = obj[found.replace('{{', '').replace('}}', '')];
    for (var el in entityMap) {
      content = content.toString().replace(new RegExp(el, 'g'), entityMap[el]);
    }
    return content;
  })
}

function renderSideBar(data) {
  var template = document.getElementById('sidebar-template').innerHTML
  var html = render(template, data)
  $('#slide-out').html(html)
  $('.button-collapse').click()
}

function renderSearchResults(data) {
  $('.search-results a').off('click');
  var template = document.getElementById('search-results-template').innerHTML
  var elementsList = data.map(function(datum) {
    return render(template, {
      text: datum.name,
      index: datum.index
    });
  });
  var html = elementsList.join('')
  $('.search-results').html(html)
  $('.search-results a').on('click', function openMarker() {
    var index = $(this).data('index');
    $('.search-results').html('')
    $('#pac-input').text('');
    renderSideBar(globalData[index]);
  })
}


$(".button-collapse").sideNav();
var geocoder = null;
var globalData = [];
var config = {
  // api: "http://api.meirim.org/"
  api: "http://localhost:3000/"
}

addScript("https://maps.googleapis.com/maps/api/js?key=" + KEY + "&callback=initMap");


function initMap() {
  var latlngbounds = new google.maps.LatLngBounds();
  var map = new google.maps.Map(document.getElementById('map'));
  $.ajax({
    contentType: "application/json",
    url: config.api + 'activity'
  }).then(response => {
    response.data.forEach((datum, index) => {
      if (datum.latlon){
        var marker = new google.maps.Marker({ map: map, position: {lat: datum.latlon.x, lng: datum.latlon.y}, icon: "./props/unselectedMarker.png" });
        marker.addListener('click', function handleClick() {
          renderSideBar(datum);
        });
        latlngbounds.extend(new google.maps.LatLng (datum.latlon.x,datum.latlon.y));
      }
    });
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);
  });
}
