import React, { useState } from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { Color, Opacity } from 'enums/Color';
import DefaultView from 'components/common/DefaultView';
import * as codicons from 'react-icons/vsc';
import ColorsUtils from 'utils/colors-utils';
import IPanelModel from 'models/IPanelModel';
import { ColorPalette } from 'models/ColorPalette';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectPanelBar, setActive } from 'store/reducers/panel-bar';
import { Panel } from 'enums/Panel';
import Output from 'components/views/Output';
import Problems from 'components/views/Problems';

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

function getView(panel: IPanelModel) {
  switch (panel.id) {
    case Panel.Output:
      return <Output />;
    case Panel.Problems:
      return <Problems />;
    default:
      return <DefaultView />;
  }
}

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
  const dispatch = useAppDispatch();
  const { active: activeId, panels } = useAppSelector(selectPanelBar);
  const panel = panels.find((panel: IPanelModel) => panel.id === activeId)!;

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const icons = [
    {
      label: 'Maximize panel size',
      name: 'VscChevronUp',
    },
    {
      label: 'Close panel',
      name: 'VscClose',
    },
  ];

  function handlePanelClick(panel: any) {
    dispatch(setActive(panel.id));
  }

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
          {panels?.map((panel: IPanelModel) => (
            <PanelItem
              {...panel}
              key={`${panel.id}${activeId === panel.id}`}
              active={activeId === panel.id}
              onClick={() => handlePanelClick(panel)}
            />
          ))}
        </div>
        <div
          style={{ minHeight: 35 }}
          className="d-flex flex-row align-items-center"
        >
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
      <div className="w-100 h-100 overflow-auto">{getView(panel)}</div>
    </nav>
  );
}

export default PanelBar;
