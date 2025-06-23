import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /** Put your mantine theme override here */
  colors: {
    'hoj-dark-blue': [
      '#eef2ff',
      '#dce2f9',
      '#b9c5f0',
      '#93a7e7',
      '#748cde',
      '#607bda',
      '#5372d8',
      '#4361c0',
      '#3b56ac',
      '#2f4a98',
    ],
    'hoj-yellow': [
      '#fff9e1',
      '#fff2cd',
      '#ffe59c',
      '#ffd867',
      '#ffce3d',
      '#ffc923',
      '#ffc614',
      '#e3ae08',
      '#c99b00',
      '#ae8700',
    ],
  },
  primaryColor: 'hoj-dark-blue',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'Verdana, sans-serif',
  },
  fontFamily: 'Verdana, sans-serif',
}); 