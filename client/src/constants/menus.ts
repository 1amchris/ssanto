import * as MenuItems from '../models/menu-item-models/';

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
        } as MenuItems.Action,
        {
          type: 'action',
          name: 'new window',
          enabled: false,
          onActionCalled: (event: any) =>
            console.log('/file/new window', event),
        } as MenuItems.Action,
      ],
      [
        {
          type: 'import',
          name: 'open project',
          enabled: true,
          onFileImported: (file: File) =>
            console.log('/file/open project', file),
        } as MenuItems.Import,
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
        } as MenuItems.Export,
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
        } as MenuItems.Action,
        {
          type: 'action',
          name: 'another action',
          enabled: false,
          onActionCalled: (event: any) =>
            console.log('/edit/another action', event),
        } as MenuItems.Action,
      ],
      [
        {
          type: 'action',
          name: 'something else here',
          enabled: true,
          onActionCalled: (event: any) =>
            console.log('/edit/something else here', event),
        } as MenuItems.Action,
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
        } as MenuItems.Action,
      ],
    ],
  },
];

export default menus;
