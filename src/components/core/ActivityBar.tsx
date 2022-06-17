import React, { useState } from 'react';
import { Color, Opacity } from 'enums/Color';
import ServerCallTarget from 'enums/ServerCallTarget';
import { ColorPalette } from 'models/ColorPalette';
import CallModel from 'models/server-coms/CallModel';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IconBaseProps, IconType } from 'react-icons';
import * as codicons from 'react-icons/vsc';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { call } from 'store/reducers/server';
import { selectViewsManager } from 'store/reducers/views-manager';
import ColorsUtils from 'utils/colors-utils';

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

function ActivityItem({
  label,
  icon: iconName,
  active,
  disabled,
  onClick,
}: any) {
  const [focused, setFocused] = useState(false);

  const options = { active, disabled, focused };
  const activity = {
    size: '48px',
    cursor: disabled ? 'default' : 'pointer',
    color: ColorsUtils.getRelevantColor(iconColors, options),
    borderColor: ColorsUtils.getRelevantColor(borderColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
  };

  const iconBaseProps: IconBaseProps = {
    size: 24,
    color: activity.color,
    title: label,
  };

  return (
    <OverlayTrigger
      trigger={label && !disabled ? ['hover', 'focus'] : []}
      placement={'right'}
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
          minHeight: activity.size,
          minWidth: activity.size,
          backgroundColor: activity.backgroundColor,
          borderLeft: `2px solid ${activity.borderColor}`,
          cursor: activity.cursor,
        }}
        onClick={(e: any) => !disabled && onClick(e)}
        onMouseEnter={() => !disabled && setFocused(true)}
        onMouseLeave={() => !disabled && setFocused(false)}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => !disabled && setFocused(false)}
      >
        {(codicons as { [iconName: string]: IconType })[iconName](
          iconBaseProps
        )}
      </div>
    </OverlayTrigger>
  );
}

/**
 * Activity bar component.
 * @return {JSX.Element} Html.
 */
function ActivityBar() {
  const {
    sidebar: { active, activities, options },
  } = useAppSelector(selectViewsManager);
  const dispatch = useAppDispatch();

  function handleActivityClick(activity: any) {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsSelectActivity,
        args: [activity.uri],
      } as CallModel)
    );
  }

  function handleOptionClick(option: any) {
    // TODO: implement clicking on activity bar option
    console.log(`clicked on activity option: "${option.uri}"`);
  }

  return (
    <nav className="d-flex flex-column justify-content-between bg-light">
      <div className="d-flex flex-column overflow-auto">
        {activities?.map(activity => (
          <ActivityItem
            {...activity}
            key={`${activity.uri}${active === activity.uri}`}
            active={active === activity.uri}
            onClick={() => handleActivityClick(activity)}
          />
        ))}
      </div>
      <div className="d-flex flex-column">
        {options?.map((option: any) => (
          <ActivityItem
            {...option}
            key={`activities/option-${option.uri}`}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </div>
    </nav>
  );
}

export default ActivityBar;
