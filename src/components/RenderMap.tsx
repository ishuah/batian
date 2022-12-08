import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as d3 from 'd3';
import { recoilState } from '../store';
import { REGIONS } from '../constants';

function RenderMap() {
  const appState = useRecoilValue<AppState>(recoilState);

  const projection = d3
    .geoMercator()
    .scale(1)
    .translate([0, 0]);
  const path = d3.geoPath().projection(projection);

  const choroplethColor = (colorString: string) => {
    switch (colorString) {
      case 'Reds':
        return d3.interpolateReds;
      case 'Blues':
        return d3.interpolateBlues;
      case 'Greens':
        return d3.interpolateGreens;
      case 'Cool':
        return d3.interpolateCool;
      case 'Warm':
        return d3.interpolateWarm;
      case 'Spectral':
        return d3.interpolateSpectral;
      default:
        return d3.interpolateReds;
    }
  };

  const symbolColor = (colorString: string) => {
    switch (colorString) {
      case 'Red':
        return '#c71e1d';
      case 'Blue':
        return '#18a1cd';
      case 'Green':
        return '#5ea685';
      case 'Orange':
        return '#fa8c00';
      default:
        return '#c71e1d';
    }
  };

  const symbolShape = (shapeString: string) => {
    switch (shapeString) {
      case 'Circle':
        return d3.symbolCircle;
      case 'Square':
        return d3.symbolSquare;
      case 'Triangle':
        return d3.symbolTriangle;
      case 'Diamond':
        return d3.symbolDiamond;
      default:
        return d3.symbolCircle;
    }
  };

  const getDataRange = (key: string): number[] => {
    const values = appState.userData.data.map((row) => {
      if (row[key] === undefined) return 0;
      return Number(row[key]);
    });

    return [Math.min(...values), Math.max(...values)];
  };

  const baseLayerFill = (d: any) => {
    const regionValue: { [key: string]: number; } = {};
    appState.userData.data.forEach((row) => {
      regionValue[row[appState.dataKeys.name!]] = Number(row[appState.dataKeys.values!]);
    });

    const [min, max] = getDataRange(appState.dataKeys.values!);
    const color = d3.scaleSequential(
      [min, max],
      choroplethColor(appState.choroplethColorScheme),
    );
    if (regionValue[d.properties.admin]) return color(regionValue[d.properties.admin]);
    return '#c9d1da';
  };

  const symbolShapeAndSize = (d: any) => {
    if (appState.dataKeys.sizeValues) {
      const [min, max] = getDataRange(appState.dataKeys.sizeValues!);
      const size = d3.scaleSequential()
        .domain([min, max])
        .range([200, 2000]);
      return d3.symbol()
        .type(symbolShape(appState.symbolShape))
        .size(size(d[appState.dataKeys.sizeValues!]))();
    }

    return d3.symbol()
      .type(symbolShape(appState.symbolShape))
      .size(200)();
  };

  useEffect(() => {
    const svg = d3
      .select('#RenderMap')
      .attr('width', 720)
      .attr('height', 720);
    svg.selectAll('*').remove();

    const url = REGIONS[appState.map.region];

    const getD3Data = async () => {
      const data = await d3.json(url) as any;
      const b = path.bounds(data);
      const scale = 0.95 / Math.max((b[1][0] - b[0][0]) / 720, (b[1][1] - b[0][1]) / 600);
      const translate: [number, number] = [(720 - scale * (b[1][0] + b[0][0])) / 2,
        (600 - scale * (b[1][1] + b[0][1])) / 2];
      projection
        .scale(scale)
        .translate(translate);

      // Render base layer (country shapes)
      svg
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('fill', baseLayerFill)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('d', path as any);

      // Render symbols
      if (appState.dataKeys.latitude && appState.dataKeys.longitude) {
        svg.append('g')
          .selectAll('path')
          .data(appState.userData.data)
          .join('path')
          // eslint-disable-next-line dot-notation
          .attr('transform', (d) => `translate(${projection([d[appState.dataKeys.longitude!], d[appState.dataKeys.latitude!]])})`)
          .attr('d', symbolShapeAndSize)
          .attr('fill', symbolColor(appState.symbolColorScheme))
          .attr('opacity', 0.7);
      }
    };

    getD3Data();
  });
  return (
    <svg id="RenderMap" width="720" height="720" />
  );
}

export default RenderMap;
