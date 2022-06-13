import React, { Suspense } from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { useAppSelector } from 'store/hooks';
import { Color } from 'enums/Color';
import DefaultView from 'components/common/DefaultView';
import * as codicons from 'react-icons/vsc';
import { selectViewsManager } from 'store/reducers/views-manager';
import useViewsRegistry from 'hooks/useViewsRegistry';

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ style }: any) {
  const { getView } = useViewsRegistry();

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
        activity?.views.map((view: any) => {
          const Activity = getView(view.uri);
          return (
            <div key={view.name} className="w-100 h-100 overflow-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <Activity />
              </Suspense>
            </div>
          );
        })
      ) : (
        <div className="w-100 h-100 overflow-auto">
          <DefaultView />
        </div>
      )}
    </nav>
  );
}

export default SideBar;
