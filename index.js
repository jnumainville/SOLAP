import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import ClassedPolygonsSld from "./ClassedPolygonsSld";

const basemapLayer = new TileLayer({ source: new OSM() });
const symbolizer = new ClassedPolygonsSld(
  "solap:spatial_analytics",
  "Symbolization by land area",
  "aland",
  [
    {
      title: "low class",
      lowVal: 0,
      highVal: 2000000000,
      fillColor: "#ffff00"
    },
    {
      title: "high class",
      lowVal: 2000000000,
      highVal: 99999999999,
      fillColor: "#00ffff"
    }
  ]
);

const countySource = new ImageWMS({
  url: "http://149.165.157.200:8080/geoserver/wms",
  params: {
    LAYERS: "solap:spatial_analytics",
    sld_body: symbolizer.sld
  },
  serverType: "geoserver"
});

const countyLayer = new ImageLayer({ source: countySource });

const view = new View({
  center: [-10500000, 5860000],
  zoom: 6
});

const map = new Map({
  target: "map",
  layers: [basemapLayer, countyLayer],
  view: view
});

// Listen for changes to the slider to set the breakpoint
document
  .querySelector("#classBreak input")
  .addEventListener("change", function(e) {
    console.log(e.target.value);
    let exSym = new ClassedPolygonsSld(
      "solap:spatial_analytics",
      "Symbolization by land area",
      "aland",
      [
        {
          title: "low class",
          lowVal: 0,
          highVal: e.target.value,
          fillColor: "#ffff00"
        },
        {
          title: "high class",
          lowVal: e.target.value,
          highVal: 99999999999,
          fillColor: "#00ffff"
        }
      ]
    );
    countySource.params_.sld_body = exSym.sld;
    countySource.refresh();
    document.querySelector("#classBreak span span").innerText = parseInt(
      e.target.value,
      10
    ).toLocaleString();
  });
