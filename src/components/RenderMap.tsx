import React, { useEffect } from 'react';
import * as d3 from 'd3';

type RenderMapProps = {
  url: string
  mapType: string
  userData: { data: never[], ready: boolean }
  dataKeys: Record<string, string>
}

// TODO: cleanup this component
function RenderMap(props: RenderMapProps) {
  const svg = d3
    .select('#RenderMap')
    .attr('width', 720)
    .attr('height', 600);

  const projection = d3
    .geoMercator()
    .scale(1)
    .translate([0, 0]);
  const path = d3.geoPath().projection(projection);

  useEffect(() => {
    const {
      url,
      userData,
      mapType,
      dataKeys,
    } = props;
    svg.selectAll('*').remove();

    const getD3Data = async () => {
      const data = await d3.json(url) as any;
      const b = path.bounds(data);
      const scale = 0.95 / Math.max((b[1][0] - b[0][0]) / 720, (b[1][1] - b[0][1]) / 600);
      const translate: [number, number] = [(720 - scale * (b[1][0] + b[0][0])) / 2,
        (600 - scale * (b[1][1] + b[0][1])) / 2];
      projection
        .scale(scale)
        .translate(translate);

      if (mapType === 'Choropleth' && dataKeys.name && dataKeys.values) {
        const values = userData.data.map((row) => {
          if (row[dataKeys.values] === undefined) return 0;
          return Number(row[dataKeys.values]);
        });

        const regionValue: { [key: string]: number; } = {};
        userData.data.forEach((row) => {
          regionValue[row[dataKeys.name]] = Number(row[dataKeys.values]);
        });

        const max = Math.max(...values);
        const min = Math.min(...values);

        const color = d3.scaleSequential([min, max], d3.interpolateBlues);
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
          .attr('d', path as any);
      }

      if (mapType === 'Symbol' && dataKeys.latitude && dataKeys.longitude) {
        if (dataKeys.sizeValues) {
          const values = userData.data.map((row) => {
            if (row[dataKeys.sizeValues] === undefined) return 0;
            return Number(row[dataKeys.sizeValues]);
          });

          const max = Math.max(...values);
          const min = Math.min(...values);

          const size = d3.scaleLinear()
            .domain([min, max])
            .range([2, 15]);

          svg.append('g')
            .selectAll('circle')
            .data(userData.data)
            .join('circle')
            // eslint-disable-next-line dot-notation
            .attr('transform', (d) => `translate(${projection([d[dataKeys.longitude], d[dataKeys.latitude]])})`)
            .attr('r', (d) => size(d[dataKeys.sizeValues]))
            .attr('fill', '#3d9fa0')
            .append('title')
            // eslint-disable-next-line dot-notation
            .text((d) => d['Title']);
        } else {
          svg.append('g')
            .selectAll('circle')
            .data(userData.data)
            .join('circle')
            // eslint-disable-next-line dot-notation
            .attr('transform', (d) => `translate(${projection([d[dataKeys.longitude], d[dataKeys.latitude]])})`)
            .attr('r', 5)
            .attr('fill', '#3d9fa0')
            .append('title')
            // eslint-disable-next-line dot-notation
            .text((d) => d['Title']);
        }
      }
    };

    getD3Data();
  }, [props]);
  return (
    <svg id="RenderMap" width="720" height="600" />
  );
}

export default RenderMap;
