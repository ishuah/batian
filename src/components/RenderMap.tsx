import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as d3 from 'd3';
import { recoilState } from '../store';
import { REGIONS, SYMBOL_PALETTE } from '../constants';
import LinearColorScale from '../lib/LinearColorScale';
import ThresholdColorScale from '../lib/ThresholdColorScale';
import QuantizeColorScale from '../lib/QuantizeColorScale';
import QuantileColorScale from '../lib/QuantileColorScale';

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

  const getSymbolColorData = (key: string): string[] => {
    const uniqueFilter = (
      value: string,
      index: number,
      array: string[],
    ) => array.indexOf(value) === index;

    return appState.userData.data.map((row) => row[key]).filter(uniqueFilter);
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

  const getDataValues = (key: string): number[] => {
    const value = appState.userData.data.map((row) => {
      if (row[key] === undefined) return 0;
      return Number(row[key]);
    });
    return value;
  };

  const getDataRange = (data: number[]): number[] => [Math.min(...data), Math.max(...data)];

  const choroplethData = getDataValues(appState.dataKeys.values!);
  const [min, max] = getDataRange(choroplethData);

  const symbolData = getDataValues(appState.dataKeys.sizeValues!);
  const [smin, smax] = getDataRange(symbolData);
  const colorData = getSymbolColorData(appState.dataKeys.colorValues!);
  const colorPalette = SYMBOL_PALETTE[appState.symbolColorScheme];

  const getColorScale = (): IColorScale => {
    const colorScheme = choroplethColor(appState.choroplethColorScheme);
    switch (appState.interpolationType) {
      case 'Linear':
        return new LinearColorScale(max, colorScheme);
      case 'Threshold':
        return new ThresholdColorScale(choroplethData, colorScheme);
      case 'Quantile':
        return new QuantileColorScale(choroplethData, colorScheme);
      case 'Quantize':
        return new QuantizeColorScale(min, max, colorScheme);
      default:
        return new LinearColorScale(max, colorScheme);
    }
  };

  const baseLayerFill = (d: any) => {
    const regionValue: { [key: string]: number; } = {};
    appState.userData.data.forEach((row) => {
      regionValue[row[appState.dataKeys.name!]] = Number(row[appState.dataKeys.values!]);
    });
    const colorScale = getColorScale();

    if (regionValue[d.properties.admin]) {
      return colorScale.interpolation()(regionValue[d.properties.admin]);
    }
    return '#c9d1da';
  };

  const symbolShapeAndSize = (d: any) => {
    if (appState.dataKeys.sizeValues) {
      const size = d3.scaleSqrt()
        .domain([smin, smax])
        .range([0, 2000]);
      return d3.symbol()
        .type(symbolShape(appState.symbolShape))
        .size(size(d[appState.dataKeys.sizeValues!]))();
    }

    return d3.symbol()
      .type(symbolShape(appState.symbolShape))
      .size(200)();
  };

  useEffect(() => {
    const colorScale = getColorScale();
    const svg = d3
      .select('#RenderMap')
      .attr('width', 720)
      .attr('height', 720);
    svg.selectAll('*').remove();

    const url = REGIONS[appState.map.region];

    const renderMap = async () => {
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
          .attr('transform', (d) => {
            if (!d[appState.dataKeys.longitude!] || !d[appState.dataKeys.latitude!])console.log(d);
            return `translate(${projection([d[appState.dataKeys.longitude!], d[appState.dataKeys.latitude!]])})`;
          })
          .attr('d', symbolShapeAndSize)
          .attr('fill', (d) => colorPalette[colorData.indexOf(d[appState.dataKeys.colorValues!])])
          .attr('opacity', 0.7);
      }

      // Render legend (for choropleth maps)
      if (appState.dataKeys.values) {
        colorScale.legend(svg);
      }
      // Render swatches (for symbol maps)
      if (appState.dataKeys.colorValues) {
        let offset = 50;
        const padding = 17;
        const legendWidth = 14;
        const legendHeight = 14;

        const swatches = svg.selectAll('g.swatches')
          .data(colorData);

        swatches.enter()
          .append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .attr('fill', (d) => SYMBOL_PALETTE[appState.symbolColorScheme][colorData.indexOf(d)])
          .attr('transform', (d, i) => {
            if (i === 0) return `translate(${offset}, ${620})`;
            offset += colorData[i - 1].length * 8;
            return `translate(${offset + (legendWidth * i)}, ${620})`;
          });

        offset = 50;
        swatches.enter()
          .append('text')
          .attr('x', (d, i) => {
            if (i === 0) return padding + offset;
            offset += colorData[i - 1].length * 8;
            return padding + offset + (legendWidth * i);
          })
          .attr('y', 632)
          .attr('font-size', 'smaller')
          .attr('font-family', 'Arial, Helvetica, sans-serif')
          .text((d) => d);
      }
    };

    renderMap();
  });
  return (
    <svg id="RenderMap" width="720" height="720" />
  );
}

export default RenderMap;
