import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IconBaseProps, IconType } from 'react-icons';
import * as codicons from 'react-icons/vsc';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectActivityBar, setActive } from 'store/reducers/activity-bar';

const backgroundColors = {
  disabled: 'lightgray',
  focused: 'white',
  activated: 'white',
  default: 'white',
};

const iconColors = {
  disabled: '#00000090',
  focused: '#000000ff',
  activated: '#000000ff',
  default: '#00000088',
};

function ActivityItem({ id, label, iconName, active, disabled, onClick }: any) {
  const [focused, setFocused] = useState(false);

  const activity = {
    size: '48px',
    color: focused
      ? iconColors.focused
      : active
      ? iconColors.activated
      : disabled
      ? iconColors.disabled
      : iconColors.default,
    backgroundColor: focused
      ? backgroundColors.focused
      : active
      ? backgroundColors.activated
      : disabled
      ? backgroundColors.disabled
      : backgroundColors.default,
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
          borderLeftWidth: '2px',
          borderLeftColor: activity.color,
          borderLeftStyle: active ? 'solid' : 'none',
        }}
        onClick={onClick}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
  const { active, activities, options } = useAppSelector(selectActivityBar);
  const dispatch = useAppDispatch();

  function handleActivityClick(activity: any) {
    console.log(`clicked on activity: "${activity.id}"`);
    dispatch(setActive(activity.id));
  }

  function handleOptionClick(option: any) {
    console.log(`clicked on activity option: "${option.id}"`);
  }

  return (
    <nav className="d-flex flex-column justify-content-between">
      <div className="d-flex flex-column overflow-auto">
        {activities?.map(activity => (
          <ActivityItem
            {...activity}
            key={`activities/activity-${activity.id}`}
            active={active === activity.id}
            onClick={() => handleActivityClick(activity)}
          />
        ))}
      </div>
      <div className="d-flex flex-column">
        {options?.map(option => (
          <ActivityItem
            {...option}
            key={`activities/option-${option.id}`}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </div>
    </nav>
  );
}

export default ActivityBar;
