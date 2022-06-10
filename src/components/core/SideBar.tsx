import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { useAppSelector } from 'store/hooks';
import { Activity } from 'enums/Activity';
import { Color } from 'enums/Color';
import DefaultView from 'components/common/DefaultView';
import FileExplorer from 'components/views/FileExplorer';
import FileSearcher from 'components/views/FileSearcher';
import * as codicons from 'react-icons/vsc';
import { selectViewsManager } from 'store/reducers/views-manager';

function getView(activity: any) {
  // TODO: Move to a ViewsRegistry
  const viewType = activity?.uri?.slice(0, activity?.uri?.indexOf('://'));
  switch (viewType) {
    case Activity.Explorer:
      return <FileExplorer />;
    case Activity.Search:
      return <FileSearcher />;
  }
  return <DefaultView />;
}

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ style }: any) {
  const {
    sidebar: { active: activeId, activities },
  } = useAppSelector(selectViewsManager);
  const activity = activities.find(
    (activity: any) => activity.uri === activeId
  )!;

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const icons = [
    // {
    //   label: 'Refresh explorer',
    //   name: 'VscRefresh',
    // },
    // {
    //   label: 'Collapse folders in explorer',
    //   name: 'VscCollapseAll',
    // },
    {
      label: 'Views and more actions...',
      name: 'VscEllipsis',
    },
  ];

  return (
    <nav
      className="d-flex flex-column"
      style={{ userSelect: 'none', ...style }}
    >
      <div
        className="d-flex flex-row justify-content-between align-items-center flex-nowrap"
        style={{ height: 35, paddingLeft: 20 }}
      >
        <span
          className="flex-shrink-1 text-uppercase text-truncate"
          style={{ fontSize: 11 }}
        >
          {activity?.label}
        </span>
        <div style={{ marginTop: -6 }} className="flex-shrink-0 ps-1 pe-2">
          {/* TODO: add action to icon */}
          {icons.map((icon: any, index: number) => (
            <button
              key={`${icon.label}-${index}`}
              style={{
                padding: '0 2.5px',
              }}
              className="btn btn-sm"
            >
              {(codicons as { [name: string]: IconType })[icon.name]({
                title: icon.label,
                ...iconBaseProps,
              })}
            </button>
          ))}
        </div>
      </div>
      {activity?.views?.length > 0 ? (
        activity?.views.map((view: any) => (
          <div key={view.name} className="w-100 h-100 overflow-auto">
            {getView(view)}
          </div>
        ))
      ) : (
        <div className="w-100 h-100 overflow-auto">
          <DefaultView />
        </div>
      )}
    </nav>
  );
}

export default SideBar;
