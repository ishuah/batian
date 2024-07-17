import * as d3 from 'd3';
import {
  LEGEND_HEIGHT,
  LEGEND_OFFSETX,
  LEGEND_OFFSETY,
  LEGEND_TICKS,
  LEGEND_WIDTH,
} from './constants';

class QuantileColorScale implements IColorScale {
  data: number[];

  colorScheme: (t: number) => string;

  constructor(data: number[], colorScheme: (t: number) => string) {
    this.data = data;
    this.colorScheme = colorScheme;
  }

  public interpolation(): d3.ScaleQuantile<string, never> {
    return d3.scaleQuantile<string>()
      .domain(this.data)
      .range(
        [
          this.colorScheme(0),
          this.colorScheme(0.25),
          this.colorScheme(0.5),
          this.colorScheme(0.75),
          this.colorScheme(1),
        ],
      );
  }

  public legend(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): void {
    const color = this.interpolation();
    const thresholds = color.quantiles();
    const tickValues = d3.range(thresholds.length);
    const thresholdFormat = d3.format('.2s');
    const tickFormat = (i: number) => thresholdFormat(thresholds[i]);
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
        .tickFormat((d, i) => tickFormat(i))
        .tickSize(6)
        .tickValues(tickValues))
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

export default QuantileColorScale;
