import MenuItemModel from '../models/MenuItemModel';

const menus = [
  {
    name: 'file',
    enabled: true,
    options: [
      [
        {
          type: 'action',
          name: 'new file',
          enabled: true,
          onActionCalled: (event: any) => console.log('/file/new file', event),
        } as MenuItemModel,
        {
          type: 'action',
          name: 'new window',
          enabled: false,
          onActionCalled: (event: any) =>
            console.log('/file/new window', event),
        } as MenuItemModel,
      ],
      [
        {
          type: 'import',
          name: 'open project',
          enabled: true,
          onFileImported: (file: File) =>
            console.log('/file/open project', file),
        } as MenuItemModel,
        {
          type: 'export',
          name: 'save project',
          enabled: true,
          getExportedFile: () => {
            console.log('/file/save project');
            return new File(['Hello, world!'], 'hello world.txt', {
              type: 'text/plain;charset=utf-8',
            });
          },
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
          type: 'action',
          name: 'action',
          enabled: false,
          onActionCalled: (event: any) => console.log('/edit/action', event),
        } as MenuItemModel,
        {
          type: 'action',
          name: 'another action',
          enabled: false,
          onActionCalled: (event: any) =>
            console.log('/edit/another action', event),
        } as MenuItemModel,
      ],
      [
        {
          type: 'action',
          name: 'something else here',
          enabled: true,
          onActionCalled: (event: any) =>
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
          type: 'action',
          name: 'show guide',
          enabled: true,
          onActionCalled: (event: any) => {
            console.log('/help/guide', event);
          },
        } as MenuItemModel,
      ],
    ],
  },
];

export default menus;
