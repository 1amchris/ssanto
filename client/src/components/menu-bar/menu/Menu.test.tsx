import React from 'react';
import { render } from '@testing-library/react';
import Menu from './Menu';
import MenuModel from '@models/MenuModel';

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
