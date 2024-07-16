import * as d3 from 'd3';

const linearInterpolation = (max: number, colorScheme: any) => d3.scaleLinear<string>()
  .domain([0, max])
  .range(
    [
      colorScheme(0),
      colorScheme(1),
    ],
  );

const thresholdInterpolation = (data: number[], colorScheme: any) => {
  const halfPoint = Math.ceil(data.length / 2);
  const lowerThreshold = d3.median(data.slice(0, halfPoint));
  const upperThreshold = d3.median(data.slice(halfPoint, data.length));

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

const quantileInterpolation = (data: number[], colorScheme: any) => d3.scaleQuantile<string>()
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

const quantizeInterpolation = ([min, max]: number[], colorScheme: any) => d3.scaleQuantize<string>()
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

export {
  linearInterpolation,
  thresholdInterpolation,
  quantileInterpolation,
  quantizeInterpolation,
};
