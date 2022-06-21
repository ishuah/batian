import React, { useEffect } from 'react';
import * as d3 from 'd3';

type RenderMapProps = {
  url: string
  mapType: string
  userData: { data: never[], ready: boolean }
}

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
    const { url, userData, mapType } = props;
    svg.selectAll('*').remove();

    d3.json(url)
      .then((data: any) => {
        const b = path.bounds(data);
        const scale = 0.95 / Math.max((b[1][0] - b[0][0]) / 720, (b[1][1] - b[0][1]) / 600);
        const translate: [number, number] = [(720 - scale * (b[1][0] + b[0][0])) / 2,
          (600 - scale * (b[1][1] + b[0][1])) / 2];
        projection
          .scale(scale)
          .translate(translate);
        svg
          .selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('fill', '#c9d1da')
          .attr('stroke', 'white')
          .attr('d', path as any);

        if (mapType === 'Symbol') {
          svg.append('g')
            .selectAll('circle')
            .data(userData.data)
            .join('circle')
            // eslint-disable-next-line dot-notation
            .attr('transform', (d) => `translate(${projection([d['LONGITUDE'], d['LATITUDE']])})`)
            .attr('r', 5)
            .attr('fill', '#3d9fa0')
            .append('title')
            // eslint-disable-next-line dot-notation
            .text((d) => d['TITLE']);
        }
      });
  }, [props]);
  return (
    <svg id="RenderMap" width="720" height="600" />
  );
}

export default RenderMap;
