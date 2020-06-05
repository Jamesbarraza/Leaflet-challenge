function createFeatures(earthquakesData, faultLinesData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3>Magnitude: <b>" + feature.properties.mag +
        "</b><hr><p>" + new Date(feature.properties.time) + "</p>");
    };

    const earthquakes = L.geoJSON(earthquakesData, {       
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,  {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },           
        onEachFeature: onEachFeature
    });

    const faultLines = L.geoJSON(faultLinesData);

    createMap(earthquakes, faultLines)
    
};

function createMap(earthquakes, faultLines) {

    // Creating map object
    const myMap = L.map("map", {
        center:[38, -97],
        zoom:5        
    });
    // Adding tile layers
    const satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    const grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(myMap);

    const outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    const baseMaps = {
        Satellite: satelliteMap,
        Grayscale: grayscaleMap,
        Outdoors: outdoorsMap,

    };

    const overlayMaps = {
        "Fault Lines": faultLines,
        Earthquakes: earthquakes

    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
        legend: true
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create("div", "legend");
        labels = [];
        mag_catgry = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
        mag_catgry_color = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];
        var legendInfo = '<strong>Magnitude</strong>'
        div.innerHTML += legendInfo;
        labels = mag_catgry.map((val, index) => {
            return `<li><div class="colorblock" style= "background-color : ${chooseColor(mag_catgry_color[index])}"> </div> <span>${val} </span></li>` 
        })
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    return legend.addTo(myMap); 

    
};

function chooseColor(mag) {
    switch (true) {
        case mag >= 5:
            return "red";
        case mag >= 4:
            return "pink";
        case mag >= 3:
            return "orange";
        case mag >= 2:
            return "yellow";
        case mag >= 1:
            return "lightgreen";
        default:
            return "green";
    }
}

function markerSize(mag) {
    return 5 * mag
};
 





(async function init(){
    const APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    const data = await d3.json(APILink);
        console.log(data)

    const APILink2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    const data2 = await d3.json(APILink2);
    
    createFeatures(data, data2);
    
})()



