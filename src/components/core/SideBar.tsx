import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { selectActivityBar } from 'store/reducers/activity-bar';
import { useAppSelector } from 'store/hooks';
import { ActivityModel } from 'models/ActivityModel';
import { Activity } from 'enums/Activity';
import { Color } from 'enums/Color';
import DefaultView from 'components/common/DefaultView';
import FileExplorer from 'components/views/FileExplorer';
import FileSearcher from 'components/views/FileSearcher';
import * as codicons from 'react-icons/vsc';

function getView(activity: ActivityModel) {
  switch (activity.id) {
    case Activity.Explorer:
      return <FileExplorer />;
    case Activity.Search:
      return <FileSearcher />;
    default:
      return <DefaultView />;
  }
}

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ style }: any) {
  const { active: activeId, activities } = useAppSelector(selectActivityBar);
  const activity = activities.find(
    (activity: ActivityModel) => activity.id === activeId
  )!;

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const icons = [
    {
      label: 'Refresh explorer',
      name: 'VscRefresh',
    },
    {
      label: 'Collapse folders in explorer',
      name: 'VscCollapseAll',
    },
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
        className="d-flex flex-row justify-content-between flex-nowrap"
        style={{ padding: '12px 16px 12px 20px' }}
      >
        <div className="text-uppercase text-truncate" style={{ fontSize: 11 }}>
          {activity.label}
        </div>
        <div style={{ marginBottom: -6, marginTop: -6 }}>
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
      <div className="w-100 h-100 overflow-auto">{getView(activity)}</div>
    </nav>
  );
}

export default SideBar;
