import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as d3 from 'd3';
import { recoilState } from '../store';
import { REGIONS, SYMBOL_PALETTE } from '../constants';

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

  const numericSort = (arr: number[]): number[] => arr.slice().sort((a, b) => a - b);

  const linearInterpolation = (max: number) => {
    const colorScheme = choroplethColor(appState.choroplethColorScheme);
    return d3.scaleLinear<string>()
      .domain([0, max])
      .range(
        [
          colorScheme(0),
          colorScheme(1),
        ],
      );
  };

  const thresholdInterpolation = (data: number[]) => {
    const halfPoint = Math.ceil(data.length / 2);
    const lowerThreshold = d3.median(data.slice(0, halfPoint));
    const upperThreshold = d3.median(data.slice(halfPoint, data.length));
    const colorScheme = choroplethColor(appState.choroplethColorScheme);

    return d3.scaleThreshold<number, string>()
      .domain([lowerThreshold!, upperThreshold!])
      .range(
        [
          colorScheme(0),
          colorScheme(0.5),
          colorScheme(1),
        ],
      );
  };

  const quantileInterpolation = (data: number[]) => {
    const colorScheme = choroplethColor(appState.choroplethColorScheme);
    return d3.scaleQuantile<string>()
      .domain(data)
      .range(
        [
          colorScheme(0),
          colorScheme(0.25),
          colorScheme(0.5),
          colorScheme(0.75),
          colorScheme(1),
        ],
      );
  };

  const quantizeInterpolation = ([min, max]: number[]) => {
    const colorScheme = choroplethColor(appState.choroplethColorScheme);
    return d3.scaleQuantize<string>()
      .domain([min, max])
      .range(
        [
          colorScheme(0),
          colorScheme(0.25),
          colorScheme(0.5),
          colorScheme(0.75),
          colorScheme(1),
        ],
      );
  };

  const choroplethData = getDataValues(appState.dataKeys.values!);
  const sortedChoroplethData = numericSort(choroplethData);
  const [min, max] = getDataRange(choroplethData);

  const symbolData = getDataValues(appState.dataKeys.sizeValues!);
  const [smin, smax] = getDataRange(symbolData);
  const colorData = getSymbolColorData(appState.dataKeys.colorValues!);
  const colorPalette = SYMBOL_PALETTE[appState.symbolColorScheme];

  const baseLayerFill = (d: any) => {
    const regionValue: { [key: string]: number; } = {};
    appState.userData.data.forEach((row) => {
      regionValue[row[appState.dataKeys.name!]] = Number(row[appState.dataKeys.values!]);
    });

    if (regionValue[d.properties.admin]) {
      switch (appState.interpolationType) {
        case 'Linear':
          return linearInterpolation(max)(regionValue[d.properties.admin]);
        case 'Threshold':
          return thresholdInterpolation(sortedChoroplethData)(regionValue[d.properties.admin]);
        case 'Quantile':
          return quantileInterpolation(choroplethData)(regionValue[d.properties.admin]);
        case 'Quantize':
          return quantizeInterpolation([min, max])(regionValue[d.properties.admin]);
        default:
          return linearInterpolation(max)(regionValue[d.properties.admin]);
      }
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

  const ramp = (color: d3.ScaleLinear<string, string, never>, n = 256) => {
    const canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext('2d')!;
    for (let i = 0; i < n; i += 1) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
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
        const width = 320;
        const height = 20;
        const offsetX = 50;
        const offsetY = 620;
        const ticks = width / 64;
        let x: d3.ScaleLinear<string, string, never> | d3.ScaleLinear<number, number, never>;

        // Continuous
        if (appState.interpolationType === 'Linear') {
          const color = linearInterpolation(max);
          const n = Math.min(color.domain().length, color.range().length);
          x = color.copy().rangeRound(d3.quantize(d3.interpolate(offsetX, width + offsetX), n));

          svg.append('image')
            .attr('x', offsetX)
            .attr('y', offsetY)
            .attr('width', width)
            .attr('height', height)
            .attr('preserveAspectRatio', 'none')
            .attr('xlink:href', ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
        } else if (appState.interpolationType === 'Threshold') { // Threshold
          const color = thresholdInterpolation(sortedChoroplethData);
          const thresholds = color.domain();

          x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([offsetX, width + offsetX]);

          svg.selectAll('g.legend')
            .data(color.range())
            .join('rect')
            .attr('x', (d, i) => x(i - 1))
            .attr('y', offsetY)
            .attr('width', (d, i) => Number(x(i)) - Number(x(i - 1)))
            .attr('height', height)
            .attr('fill', (d) => d);
        } else if (appState.interpolationType === 'Quantile') { // Quantile
          const color = quantileInterpolation(choroplethData);
          const thresholds = color.quantiles();

          x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([offsetX, width + offsetX]);

          svg.selectAll('g.legend')
            .data(color.range())
            .join('rect')
            .attr('x', (d, i) => x(i - 1))
            .attr('y', offsetY)
            .attr('width', (d, i) => Number(x(i)) - Number(x(i - 1)))
            .attr('height', height)
            .attr('fill', (d) => d);
        } else { // Quantize
          const color = quantizeInterpolation(choroplethData);
          const thresholds = color.thresholds();

          x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([offsetX, width + offsetX]);

          svg.selectAll('g.legend')
            .data(color.range())
            .join('rect')
            .attr('x', (d, i) => x(i - 1))
            .attr('y', offsetY)
            .attr('width', (d, i) => Number(x(i)) - Number(x(i - 1)))
            .attr('height', height)
            .attr('fill', (d) => d);
        }

        svg.append('g')
          .attr('transform', `translate(${0}, ${offsetY + height})`)
          .call(d3.axisBottom(x as d3.ScaleLinear<number, number, never>)
            .ticks(ticks)
            .tickSize(6))
          .call((g) => g.append('text')
            .attr('x', offsetX)
            .attr('y', -30)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .attr('class', 'title')
            .text('Legend'));
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

    getD3Data();
  });
  return (
    <svg id="RenderMap" width="720" height="720" />
  );
}

export default RenderMap;
