import React from 'react';
import { render } from '@testing-library/react';
import MenuModel from 'models/MenuModel';
import Menu from './Menu';

test('renders Menu', () => {
  const element = render(
    <Menu
      options={
        {
          name: 'some-menu-item',
          enabled: true,
          options: [],
        } as MenuModel
      }
    />
  );

  expect(element.getByText('Some-menu-item')).toBeInTheDocument();
});
