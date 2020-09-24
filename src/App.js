import React, { useLayoutEffect } from "react"
import "./App.css"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"

function App(props) {
  useLayoutEffect(() => {
    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart)
    chart.geodata = am4geodata_worldLow
    chart.projection = new am4maps.projections.Miller()
    chart.homeZoomLevel = 2.5
    chart.homeGeoPoint = {
      latitude: 38,
      longitude: -60,
    }

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.useGeodata = true
    polygonSeries.mapPolygons.template.fill = chart.colors
      .getIndex(0)
      .lighten(0.5)
    polygonSeries.mapPolygons.template.nonScalingStroke = true
    polygonSeries.exclude = ["AQ"]

    // Add markers
    var cities = chart.series.push(new am4maps.MapImageSeries())

    var imageSeriesTemplate = cities.mapImages.template
    var city = imageSeriesTemplate.createChild(am4core.Image)
    city.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg"
    city.width = 20
    city.height = 20
    city.nonScaling = true
    city.horizontalCenter = "middle"
    city.verticalCenter = "bottom"
    city.propertyFields.href = "icon"

    // Set property fields
    imageSeriesTemplate.propertyFields.latitude = "latitude"
    imageSeriesTemplate.propertyFields.longitude = "longitude"

    function addCity(coords, title) {
      const city = cities.mapImages.create()
      city.latitude = coords.latitude
      city.longitude = coords.longitude
      city.tooltipText = title

      return city
    }

    var paris = addCity({ latitude: 48.8567, longitude: 2.351 }, "Paris")
    var toronto = addCity({ latitude: 43.8163, longitude: -79.4287 }, "Toronto")
    var la = addCity({ latitude: 34.3, longitude: -118.15 }, "Los Angeles")
    var havana = addCity({ latitude: 23, longitude: -82 }, "Havana")

    // Add lines
    var lineSeries = chart.series.push(new am4maps.MapArcSeries())
    lineSeries.mapLines.template.line.strokeWidth = 2
    lineSeries.mapLines.template.line.strokeOpacity = 0.5
    lineSeries.mapLines.template.line.stroke = city.fill
    lineSeries.mapLines.template.line.nonScalingStroke = true
    lineSeries.mapLines.template.line.strokeDasharray = "1,1"
    lineSeries.zIndex = 10

    function addLine(from, to) {
      var line = lineSeries.mapLines.create()
      line.imagesToConnect = [from, to]
      line.line.controlPointDistance = -0.3

      return line
    }

    addLine(paris, toronto)
    addLine(toronto, la)
    addLine(la, havana)

    // Add plane
    var plane = lineSeries.mapLines.getIndex(0).lineObjects.create()
    plane.position = 0
    plane.width = 48
    plane.height = 48

    plane.adapter.add("scale", function (scale, target) {
      return 0.5 * (1 - Math.abs(0.5 - target.position))
    })

    var planeImage = plane.createChild(am4core.Sprite)
    planeImage.scale = 0.08
    planeImage.horizontalCenter = "middle"
    planeImage.verticalCenter = "middle"
    planeImage.path =
      "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47"
    planeImage.fill = chart.colors.getIndex(2).brighten(-0.2)
    planeImage.strokeOpacity = 0
  })

  return <div id="chartdiv"></div>
}

export default App
