import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IconBaseProps, IconType } from 'react-icons';
import * as codicons from 'react-icons/vsc';
import { useAppSelector } from 'store/hooks';
import { selectStatusBar } from 'store/reducers/status-bar';

const backgroundColors = {
  disabled: '#00000000',
  focused: '#ffffff22',
  default: '#00000000',
};

const iconColors = {
  disabled: '#00000090',
  focused: '#ffffffff',
  default: '#ffffffff',
};

function StatusItem({
  id,
  label,
  iconName,
  description,
  disabled,
  onClick,
}: any) {
  const [focused, setFocused] = useState(false);

  const activity = {
    size: '12px',
    color: focused
      ? iconColors.focused
      : disabled
      ? iconColors.disabled
      : iconColors.default,
    backgroundColor: focused
      ? backgroundColors.focused
      : disabled
      ? backgroundColors.disabled
      : backgroundColors.default,
  };

  const iconBaseProps: IconBaseProps = {
    size: 14,
    color: activity.color,
    title: label,
  };

  return (
    <OverlayTrigger
      trigger={description && !disabled ? ['hover', 'focus'] : []}
      placement={'top'}
      delay={650}
      overlay={
        <Popover>
          <Popover.Body>{description}</Popover.Body>
        </Popover>
      }
    >
      <div
        className="d-flex justify-content-center align-items-center px-1 mx-1 small"
        style={{
          minHeight: activity.size,
          backgroundColor: activity.backgroundColor,
        }}
        onClick={onClick}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {iconName &&
          (codicons as { [iconName: string]: IconType })[iconName](
            iconBaseProps
          )}
        {label && (
          <small
            className={codicons ? 'ps-1' : ''}
            style={{ color: activity.color }}
          >
            {label}
          </small>
        )}
      </div>
    </OverlayTrigger>
  );
}

/**
 * Status bar component.
 * @return {JSX.Element} Html.
 */
function StatusBar({ style }: any) {
  const { left, right } = useAppSelector(selectStatusBar);

  function handleItemClick(item: any) {
    console.log(`clicked on status item: "${item.id}"`);
  }

  return (
    <nav
      className="d-flex flex-row justify-content-between bg-primary px-2"
      style={style}
    >
      <div className="d-flex flex-row overflow-auto">
        {left?.map(item => (
          <StatusItem
            {...item}
            key={`status/status-${item.id}`}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      <div className="d-flex flex-row overflow-auto">
        {right?.map(item => (
          <StatusItem
            {...item}
            key={`status/status-${item.id}`}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </nav>
  );
}

export default StatusBar;
