import * as d3 from 'd3';
import {
  LEGEND_HEIGHT,
  LEGEND_OFFSETX,
  LEGEND_OFFSETY,
  LEGEND_TICKS,
  LEGEND_WIDTH,
} from './constants';

class ThresholdColorScale implements IColorScale {
  data: number[];

  colorScheme: (t: number) => string;

  constructor(data: number[], colorScheme: (t: number) => string) {
    this.data = data.slice().sort((a, b) => a - b);
    this.colorScheme = colorScheme;
  }

  public interpolation(): d3.ScaleThreshold<number, string, never> {
    const halfPoint = Math.ceil(this.data.length / 2);
    const lowerThreshold = d3.median(this.data.slice(0, halfPoint));
    const upperThreshold = d3.median(this.data.slice(halfPoint, this.data.length));

    return d3.scaleThreshold<number, string>()
      .domain([lowerThreshold!, upperThreshold!])
      .range(
        [
          this.colorScheme(0),
          this.colorScheme(0.5),
          this.colorScheme(1),
        ],
      );
  }

  public legend(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): void {
    const color = this.interpolation();
    const x = d3.scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([LEGEND_OFFSETX, LEGEND_WIDTH + LEGEND_OFFSETX]);

    svg.selectAll('g.legend')
      .data(color.range())
      .join('rect')
      .attr('x', (d, i) => x(i - 1))
      .attr('y', LEGEND_OFFSETY)
      .attr('width', (d, i) => Number(x(i)) - Number(x(i - 1)))
      .attr('height', LEGEND_HEIGHT)
      .attr('fill', (d) => d);

    svg.append('g')
      .attr('transform', `translate(${0}, ${LEGEND_OFFSETY + LEGEND_HEIGHT})`)
      .call(d3.axisBottom(x as d3.ScaleLinear<number, number, never>)
        .ticks(LEGEND_TICKS)
        .tickSize(6))
      .call((g) => g.append('text')
        .attr('x', LEGEND_OFFSETX)
        .attr('y', -30)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('class', 'title')
        .text('Legend'));
  }
}

export default ThresholdColorScale;
