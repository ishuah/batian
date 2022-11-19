import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as d3 from 'd3';
import { recoilState } from '../store';
import { REGIONS } from '../constants';

// TODO: cleanup this component
function RenderMap() {
  const appState = useRecoilValue<AppState>(recoilState);
  const svg = d3
    .select('#RenderMap')
    .attr('width', 720)
    .attr('height', 720);

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

  useEffect(() => {
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

      if (appState.map.type === 'Choropleth' && appState.dataKeys.name && appState.dataKeys.values) {
        const values = appState.userData.data.map((row) => {
          if (row[appState.dataKeys.values!] === undefined) return 0;
          return Number(row[appState.dataKeys.values!]);
        });

        const regionValue: { [key: string]: number; } = {};
        appState.userData.data.forEach((row) => {
          regionValue[row[appState.dataKeys.name!]] = Number(row[appState.dataKeys.values!]);
        });

        const max = Math.max(...values);
        const min = Math.min(...values);

        const color = d3.scaleSequential([min, max], choroplethColor(appState.choroplethColorScheme));
        svg
          .selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('fill', (d: any) => {
            if (regionValue[d.properties.name]) return color(regionValue[d.properties.name]);
            return '#c9d1da';
          })
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5)
          .attr('d', path as any);
      } else {
        svg
          .selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('fill', '#c9d1da')
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5)
          .attr('d', path as any);
      }

      if (appState.map.type === 'Symbol' && appState.dataKeys.latitude && appState.dataKeys.longitude) {
        if (appState.dataKeys.sizeValues) {
          const values = appState.userData.data.map((row) => {
            if (row[appState.dataKeys.sizeValues!] === undefined) return 0;
            return Number(row[appState.dataKeys.sizeValues!]);
          });

          const max = Math.max(...values);
          const min = Math.min(...values);

          const size = d3.scaleSequential()
            .domain([min, max])
            .range([200, 2000]);

          svg.append('g')
            .selectAll('path')
            .data(appState.userData.data)
            .join('path')
            // eslint-disable-next-line dot-notation
            .attr('transform', (d) => `translate(${projection([d[appState.dataKeys.longitude!], d[appState.dataKeys.latitude!]])})`)
            .attr('d', (d) => d3.symbol().type(symbolShape(appState.symbolShape)).size(size(d[appState.dataKeys.sizeValues!]))())
            // .attr('r', (d) => size(d[dataKeys.sizeValues]))
            .attr('fill', symbolColor(appState.symbolColorScheme))
            .attr('opacity', 0.7)
            .append('title')
            // eslint-disable-next-line dot-notation
            .text((d) => d['Title']);
        } else {
          svg.append('g')
            .selectAll('path')
            .data(appState.userData.data)
            .join('path')
            // eslint-disable-next-line dot-notation
            .attr('transform', (d) => `translate(${projection([d[appState.dataKeys.longitude!], d[appState.dataKeys.latitude!]])})`)
            .attr('d', (d) => d3.symbol().type(symbolShape(appState.symbolShape)).size(200)())
            // .attr('r', 5)
            .attr('fill', symbolColor(appState.symbolColorScheme))
            .attr('opacity', 0.5)
            .append('title')
            // eslint-disable-next-line dot-notation
            .text((d) => d['Title']);
        }
      }
    };

    getD3Data();
  }, [appState]);
  return (
    <svg id="RenderMap" width="720" height="720" />
  );
}

export default RenderMap;
