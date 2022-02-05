import MenuItemModel from '../models/MenuItemModel';

const menus = [
  {
    name: 'file',
    enabled: true,
    options: [
      [
        {
          name: 'new file',
          enabled: true,
          action: (event: any) => console.log('/file/new file', event),
        } as MenuItemModel,
        {
          name: 'new window',
          enabled: false,
          action: (event: any) => console.log('/file/new window', event),
        } as MenuItemModel,
      ],
      [
        {
          name: 'open project',
          enabled: true,
          action: (event: any) => console.log('/file/open project', event),
        } as MenuItemModel,
      ],
    ],
  },
  {
    name: 'edit',
    enabled: true,
    options: [
      [
        {
          name: 'action',
          enabled: false,
          action: (event: any) => console.log('/edit/action', event),
        } as MenuItemModel,
        {
          name: 'another action',
          enabled: false,
          action: (event: any) => console.log('/edit/another action', event),
        } as MenuItemModel,
      ],
      [
        {
          name: 'something else here',
          enabled: true,
          action: (event: any) =>
            console.log('/edit/something else here', event),
        } as MenuItemModel,
      ],
    ],
  },
  {
    name: 'help',
    enabled: true,
    options: [
      [
        {
          name: 'show guide',
          enabled: true,
          action: (event: any) => {
            console.log('/help/guide', event);
          },
        } as MenuItemModel,
      ],
    ],
  },
];

export default menus;
