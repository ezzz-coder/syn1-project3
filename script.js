var map = L.map('map').setView([51.505, -0.09], 10);
var curLayer = null;
var osm =L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var smooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
var watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 1,
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});
var Jawg_Streets = L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: '<your accessToken>'
});


var  WAQI_ATTR  =  'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';  

var  composite  =  "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0";  
var  compositeLayer  =  L.tileLayer(composite,  {  attribution:  WAQI_ATTR  });  

var pm25 =  "https://tiles.waqi.info/tiles/usepa-pm25/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0";  
var  pm25Layer =  L.tileLayer(pm25,  {  attribution:  WAQI_ATTR  });  

var o3 =  "https://tiles.waqi.info/tiles/usepa-o3/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0";  
var  o3Layer =  L.tileLayer(o3,  {  attribution:  WAQI_ATTR  });  

var no2= "https://tiles.waqi.info/tiles/usepa-no2/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0"; 
var  no2Layer =  L.tileLayer(no2,  {  attribution:  WAQI_ATTR  });

var so2= "https://tiles.waqi.info/tiles/usepa-so2/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0"; 
var  so2Layer =  L.tileLayer(so2,  {  attribution:  WAQI_ATTR  });

var co= "https://tiles.waqi.info/tiles/usepa-co/{z}/{x}/{y}.png?token=f9afa691d396045402f4282b13be1bcabbc894f0"; 
var  coLayer =  L.tileLayer(co,  {  attribution:  WAQI_ATTR  });

osm.addTo(map);

var locateUser = document.getElementById("locateUser");
locateUser.addEventListener("click", function(){
	map.locate().on("locationfound", function(e){
		map.flyTo(e.latlng);
	})
	
})	
var buttons_container = document.querySelector(".buttons");
var buttons = buttons_container.querySelectorAll("button");

for(var button of buttons){
	if(button.id=="locateUser"){
		break;
	}
	button.addEventListener("click", function(e){
		layerControl(e);
		displayInfo(e);
	})
}

function layerControl(e){
	var id = e.srcElement.id;
	if(id == "o3"){
		var layer = o3Layer	;
	}
	else if(id == "pm25"){
		var layer = pm25Layer;
	}
	else if(id == "composite"){
		var layer = compositeLayer;
	}
	else if(id == "no2"){
		var layer = no2Layer;
	}
	else if(id == "so2"){
		var layer = so2Layer;
	}
	else{
		var layer = coLayer;
	}

	if(curLayer === layer){
		return;
	}
	if(curLayer == null){
		layer.addTo(map);
	}
	else{
		curLayer.remove();
		layer.addTo(map);
	}
	curLayer = layer;
}

var curInfo = null;



function displayInfo(e){
	var id = e.srcElement.id;
	if(id == "o3"){
		var toggleInfo = "info-o3";
	}
	else if(id == "pm25"){
		var toggleInfo = "info-pm25";
	}
	else if(id == "composite"){
		return;
	}
	else if(id == "no2"){
		var toggleInfo = "info-no2";
	}
	else if(id == "so2"){
		var toggleInfo = "info-so2";
	}
	else{
		var toggleInfo = "info-co";
	}
	if(curInfo === toggleInfo){
		var sidebar = document.getElementById(toggleInfo);
		sidebar.classList.toggle("sidebarHidden");
		curInfo = null;
	}
	else if(curInfo==null){
		var sidebar = document.getElementById(toggleInfo);
		console.log(sidebar);
		sidebar.classList.toggle("sidebarHidden");
		console.log(sidebar);
		curInfo = toggleInfo;
	}
	else{
		var curSidebar = document.getElementById(curInfo);
		curSidebar.classList.toggle("sidebarHidden");
		var sidebar = document.getElementById(toggleInfo);
		sidebar.classList.toggle("sidebarHidden");
		curInfo = toggleInfo;
		return;
	}

	var map = document.getElementById("mapState");
	map.classList.toggle("mapContainer");

}

var geocoder = L.Control.geocoder({defaultMarkGeocode: false}).addTo(map);
var searchCity = null;
geocoder.on("markgeocode", function(e){
	// searchCity = e.geocode.name.split(",")[0].split(" ").join("-");
	var latlng = L.latLng(e.geocode.center);
	map.flyTo(latlng);
	// _aqiFeed({  container:  "city-aqi-container",  city:  searchCity  , display: "%details"});  
})

