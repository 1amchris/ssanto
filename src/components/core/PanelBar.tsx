import React, { Suspense, useState } from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { Color, Opacity } from 'enums/Color';
import DefaultView from 'components/common/DefaultView';
import * as codicons from 'react-icons/vsc';
import ColorsUtils from 'utils/colors-utils';
import { ColorPalette } from 'models/ColorPalette';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectViewsManager } from 'store/reducers/views-manager';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import { call } from 'store/reducers/server';
import useViewsRegistry from 'hooks/useViewsRegistry';
import ViewAction from 'models/ViewAction';
import ViewModel from 'models/ViewModel';

const backgroundColors = {
  disabled: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
  focused: undefined,
  active: undefined,
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
} as ColorPalette;

const borderColors = {
  disabled: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
  focused: undefined,
  active: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
} as ColorPalette;

const iconColors = {
  disabled: ColorsUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
  focused: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  active: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  default: ColorsUtils.applyOpacity(Color.Gray, Opacity.Opaque),
} as ColorPalette;

function PanelItem({ label, active, disabled, onClick }: any) {
  const [focused, setFocused] = useState(false);

  const options = { active, disabled, focused };
  const panel = {
    size: 11,
    height: 35,
    cursor: disabled ? 'default' : 'pointer',
    color: ColorsUtils.getRelevantColor(iconColors, options),
    borderColor: ColorsUtils.getRelevantColor(borderColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
  };

  return (
    <OverlayTrigger
      trigger={label && !disabled ? ['hover', 'focus'] : []}
      placement={'top'}
      delay={650}
      overlay={
        <Popover>
          <Popover.Body>{label}</Popover.Body>
        </Popover>
      }
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: panel.size,
          minHeight: panel.height,
          padding: '4px 12px',
          cursor: panel.cursor,
        }}
        onClick={(e: any) => !disabled && onClick(e)}
        onMouseEnter={() => !disabled && setFocused(true)}
        onMouseLeave={() => !disabled && setFocused(false)}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => !disabled && setFocused(false)}
      >
        <div
          className="text-uppercase d-flex"
          style={{
            backgroundColor: panel.backgroundColor,
            borderBottom: `2px solid ${panel.borderColor}`,
          }}
        >
          <span className="m-auto">{label}</span>
        </div>
      </div>
    </OverlayTrigger>
  );
}

/**
 * Panel bar component.
 * @return {JSX.Element} Html.
 */
function PanelBar({ style }: any) {
  const { getView, getActions } = useViewsRegistry();

  const dispatch = useAppDispatch();
  const {
    panel: { active: activeId, activities: panels },
  } = useAppSelector(selectViewsManager);
  const panel = panels.find((panel: any) => panel.uri === activeId)!;

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const defaultActions = [
    {
      label: 'Maximize panel size',
      iconName: 'VscChevronUp',
      action: () => {},
    },
    {
      label: 'Close panel',
      iconName: 'VscClose',
      action: () => {},
    },
  ] as ViewAction[];

  const viewsActions = getActions(panel?.active?.[0]) as ViewAction[];

  return (
    <nav
      className="d-flex flex-column"
      style={{ userSelect: 'none', ...style }}
    >
      <div
        className="d-flex flex-row justify-content-between"
        style={{ padding: '0px 8px' }}
      >
        <div className="d-flex flex-row">
          {panels?.map(panel => (
            <PanelItem
              {...panel}
              key={`${panel.uri}${activeId === panel.uri}`}
              active={activeId === panel.uri}
              onClick={() =>
                dispatch(
                  call({
                    target: ServerCallTarget.WorkspaceViewsSelectPanel,
                    args: [panel.uri],
                  } as CallModel)
                )
              }
            />
          ))}
        </div>
        <div
          style={{ minHeight: 35 }}
          className="d-flex flex-row align-items-center"
        >
          {([] as ViewAction[])
            .concat(viewsActions || [])
            .concat(defaultActions || [])
            .map((action: any, index: number) => (
              <button
                key={`${action.label}-${index}`}
                style={{
                  padding: '0 2.5px',
                }}
                className="btn btn-sm"
                onClick={() =>
                  action.action({
                    view: panel.views.find(
                      (view: ViewModel) => view.uri === panel.active[0]
                    )!,
                  })
                }
              >
                {(codicons as { [name: string]: IconType })[action.iconName]({
                  title: action.label,
                  ...iconBaseProps,
                })}
              </button>
            ))}
        </div>
      </div>
      {panel?.views?.length > 0 ? (
        panel?.views.map((view: any) => {
          const Panel = getView(view.uri);
          return (
            <div key={view.name} className="w-100 h-100 overflow-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <Panel />
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

export default PanelBar;
