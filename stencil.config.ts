import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { inlineSvg } from 'stencil-inline-svg';

export const config: Config = {
  hydratedFlag: {
    selector: 'attribute',
  },
  namespace: 'geotrek-rando-widget',
  buildEs5: 'prod',
  extras: {
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: 'assets',
          dest: 'assets',
          warn: true,
        },
      ],
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: {
        swSrc: 'src/sw.js',
        globPatterns: ['**/*.{js,css,json,html,ico,png,ttf}', 'assets/contract.svg', 'assets/default-image.svg', 'assets/layers.svg', 'assets/parking.svg'],
      },
      copy: [
        { src: '**/test/*.html' },
        { src: '**/test/*.css' },
        {
          src: 'assets/contract.svg',
          dest: 'build/assets/contract.svg',
          warn: true,
        },
        {
          src: 'assets/default-image.svg',
          dest: 'build/assets/default-image.svg',
          warn: true,
        },
        {
          src: 'assets/layers.svg',
          dest: 'build/assets/layers.svg',
          warn: true,
        },
        {
          src: 'assets/parking.svg',
          dest: 'build/assets/parking.svg',
          warn: true,
        },
      ],
    },
  ],
  plugins: [sass(), inlineSvg()],
  globalStyle: 'src/global/global.scss',
  sourceMap: true,
};
