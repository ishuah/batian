import * as d3 from 'd3';
import {
  LEGEND_HEIGHT,
  LEGEND_OFFSETX,
  LEGEND_OFFSETY,
  LEGEND_TICKS,
  LEGEND_WIDTH,
} from './constants';

class LinearColorScale implements IColorScale {
  max: number;

  colorScheme: (t: number) => string;

  constructor(max: number, colorScheme: (t: number) => string) {
    this.max = max;
    this.colorScheme = colorScheme;
  }

  public interpolation(): d3.ScaleLinear<string, string, never> {
    return d3.scaleLinear<string>()
      .domain([0, this.max])
      .range(
        [
          this.colorScheme(0),
          this.colorScheme(1),
        ],
      );
  }

  static ramp(color: d3.ScaleLinear<string, string, never>, n: number): HTMLCanvasElement {
    const legendColor = color.copy().domain(d3.quantize(d3.interpolate(0, 1), n));
    const canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext('2d')!;

    for (let i = 0; i < n; i += 1) {
      context.fillStyle = legendColor(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  public legend(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): void {
    const color = this.interpolation();
    const n = Math.min(color.domain().length, color.range().length);
    const x = color.copy()
      .rangeRound(
        d3.quantize(d3.interpolate(LEGEND_OFFSETX, LEGEND_WIDTH + LEGEND_OFFSETX), n),
      );

    svg.append('image')
      .attr('x', LEGEND_OFFSETX)
      .attr('y', LEGEND_OFFSETY)
      .attr('width', LEGEND_WIDTH)
      .attr('height', LEGEND_HEIGHT)
      .attr('preserveAspectRatio', 'none')
      .attr('xlink:href', LinearColorScale.ramp(color, n).toDataURL());

    svg.append('g')
      .attr('transform', `translate(${0}, ${LEGEND_OFFSETY + LEGEND_HEIGHT})`)
      .call(d3.axisBottom(x as unknown as d3.ScaleLinear<number, number, never>)
        .ticks(LEGEND_TICKS)
        .tickFormat(d3.format('.2s'))
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

export default LinearColorScale;
