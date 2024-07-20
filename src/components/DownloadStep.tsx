import {
  Box, Button, Heading, Paragraph,
} from 'grommet';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { recoilState } from '../store';

function DownloadStep() {
  const appState = useRecoilValue<AppState>(recoilState);

  function createStyleElementFromCSS() {
    const sheet = document.styleSheets[1];

    const styleRules = [];
    for (let i = 0; i < sheet.cssRules.length; i += 1) {
      styleRules.push(sheet.cssRules.item(i)?.cssText);
    }
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styleRules.join(' ')));
    return style;
  }

  function generateSVGBlob(svg: SVGSVGElement) {
    const style = createStyleElementFromCSS();
    svg?.insertBefore(style, svg.firstChild);
    const data = (new XMLSerializer()).serializeToString(svg);

    const svgBlob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    });
    style.remove();

    return URL.createObjectURL(svgBlob);
  }

  const downloadSVG = () => {
    const svg = document.querySelector('svg#RenderMap') as SVGSVGElement;
    const url = generateSVGBlob(svg);
    const a = document.createElement('a');
    a.download = `${appState.map.title}.svg`;
    document.body.appendChild(a);
    a.href = url;
    a.click();
    a.remove();
  };

  const downloadPNG = () => {
    const svg = document.querySelector('svg#RenderMap') as SVGSVGElement;
    const url = generateSVGBlob(svg);
    const img = new window.Image();
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 720;

      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, 720, 720);

      URL.revokeObjectURL(url);

      // trigger a synthetic download operation with a temporary link
      const a = document.createElement('a');
      a.download = `${appState.map.title}.png`;
      document.body.appendChild(a);
      a.href = canvas.toDataURL();
      a.click();
      a.remove();
    });
    img.src = url;

    console.log(svg);
  };

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level="4">Download visualization</Heading>
        <Paragraph>Download your visualization in either SVG or PNG format.</Paragraph>
        <Box direction="row">
          <Button data-testid="download-svg" onClick={downloadSVG} label="Download SVG" primary margin={{ right: 'small' }} />
          <Button data-testid="download-png" onClick={downloadPNG} label="Download PNG" primary />
        </Box>
      </Box>
    </Box>
  );
}

export default DownloadStep;
