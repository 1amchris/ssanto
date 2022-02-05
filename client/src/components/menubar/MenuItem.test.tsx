import React from 'react';
import { render } from '@testing-library/react';
import MenuItem from './MenuItem';
import MenuItemModel from '../../models/MenuItemModel';

test('renders MenuItem', () => {
  const element = render(
    <MenuItem
      options={
        {
          name: 'some-menu-item',
          enabled: true,
          action: (_: any) => null,
        } as MenuItemModel
      }
    />
  );

  expect(element.getByText('Some-menu-item')).toBeInTheDocument();
});
