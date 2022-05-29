import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { selectActivityBar } from 'store/reducers/activity-bar';
import { useAppSelector } from 'store/hooks';
import { ActivityModel } from 'models/ActivityModel';
import DefaultView from 'components/common/DefaultView';
import FileExplorer from 'activities/FileExplorer';
import * as codicons from 'react-icons/vsc';

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ style }: any) {
  const { active: activeActivity, activities } =
    useAppSelector(selectActivityBar);
  const activity = activities.find(
    (activity: ActivityModel) => activity.id === activeActivity
  )!;

  const label = 'Views and more actions...';
  const iconName = 'VscEllipsis';
  const iconBaseProps: IconBaseProps = {
    size: 12,
    color: '#000',
    title: label,
  };

  return (
    <nav
      className="d-flex flex-column"
      style={{ userSelect: 'none', ...style }}
    >
      <div
        className="d-flex flex-row justify-content-between"
        style={{ padding: '12px 16px 12px 20px' }}
      >
        <div className="text-uppercase" style={{ fontSize: 12 }}>
          {activity.label}
        </div>
        <div style={{ marginBottom: -6, marginTop: -6 }}>
          {(codicons as { [iconName: string]: IconType })[iconName](
            iconBaseProps
          )}
        </div>
      </div>
      <div className="w-100 h-100 overflow-auto">
        {true && <FileExplorer />}
        {false && <DefaultView />}
      </div>
    </nav>
  );
}

export default SideBar;
