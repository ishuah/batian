import React, { useEffect } from 'react';
import * as d3 from 'd3';

type RenderMapProps = {
  url: string
}

function RenderMap(props: RenderMapProps) {
  const svg = d3
    .select('#RenderMap')
    .attr('width', 720)
    .attr('height', 600)
    .attr('style', 'background-color: white');

  const aProjection = d3
    .geoMercator()
    .scale(40)
    .translate([300, 300]);
  const geoPath = d3.geoPath().projection(aProjection);

  useEffect(() => {
    const { url } = props;
    svg.selectAll('*').remove();

    d3.json(url)
      .then((data: any) => {
        svg
          .selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('fill', '#c9d1da')
          .attr('stroke', 'white')
          .attr('d', geoPath as any);
      });
  }, [props]);
  return (
    <svg id="RenderMap" width="720" height="600" />
  );
}

export default RenderMap;
