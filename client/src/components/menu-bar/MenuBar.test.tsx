import React from 'react';
import { render } from '@testing-library/react';
import MenuBar from './MenuBar';

test('renders MenuItem', () => {
  const element = render(<MenuBar />);

  expect(element.getByText('File')).toBeInTheDocument();
  expect(element.getByText('Help')).toBeInTheDocument();
});
