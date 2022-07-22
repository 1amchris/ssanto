import { Color, Opacity } from 'enums/Color';
import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IconBaseProps, IconType } from 'react-icons';
import * as codicons from 'react-icons/vsc';
import { useAppSelector } from 'store/hooks';
import { selectTasker } from 'store/reducers/tasker';
import ColorsUtils from 'utils/colors-utils';
import Task from 'models/ITask';

const { left, right } = {
  left: [
    {
      id: 'ssanto.git-branch',
      label: 'ui-overhaul*+',
      iconName: 'VscGitMerge',
    },
    {
      id: 'ssanto.git-synchronize',
      iconName: 'VscSync',
      description: 'Synchronize with Git',
    },
    {
      id: 'ssanto.start',
      iconName: 'VscDebugAlt',
      description: 'Start Analysing',
    },
    {
      id: 'ssanto.person-account',
      label: 'Christophe',
      iconName: 'VscPerson',
      description: 'Sign in to Github.',
    },
    {
      id: 'ssanto.live-share',
      label: 'Live Share',
      iconName: 'VscLiveShare',
      description: 'Start Collaborative Session',
    },
  ],
  right: [
    {
      id: 'ssanto.end-of-line',
      label: 'LF',
      description: 'Select End of Line Sequence',
    },
    {
      id: 'ssanto.language',
      label: 'TypeScript React',
      iconName: 'VscSymbolNamespace',
      description: 'Select Language Mode',
    },
    {
      id: 'ssanto.tslint',
      label: 'TSLint',
      iconName: 'VscWarning',
      description: 'Linter is running.',
    },
    { id: 'ssanto.prettier', label: 'Prettier', iconName: 'VscCheck' },
    {
      id: 'ssanto.feedback',
      iconName: 'VscFeedback',
      description: 'Tweet Feedback',
    },
    {
      id: 'ssanto.notifications',
      iconName: 'VscBell',
      description: 'No Notifications',
    },
  ],
};

const backgroundColors = {
  disabled: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
  focused: ColorsUtils.applyOpacity(Color.White, Opacity.OneEighth),
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
};

const iconColors = {
  disabled: ColorsUtils.applyOpacity(Color.Black, Opacity.Half),
  focused: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
  default: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
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

  const options = { disabled, focused };
  const activity = {
    size: '12px',
    cursor: disabled ? 'default' : 'cursor',
    color: ColorsUtils.getRelevantColor(iconColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
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
          cursor: activity.cursor,
        }}
        onClick={(e: any) => !disabled && onClick(e)}
        onMouseEnter={() => !disabled && setFocused(true)}
        onMouseLeave={() => !disabled && setFocused(false)}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => !disabled && setFocused(false)}
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
  const { tasks } = useAppSelector(selectTasker);

  function handleItemClick(item: any) {
    console.log(`clicked on status item: "${item.id}"`);
  }

  return (
    <nav
      className="d-flex flex-row justify-content-between px-2"
      style={{
        ...style,
        backgroundColor:
          tasks?.filter((task: Task) => task.running)?.length > 0
            ? Color.Orange
            : Color.Primary,
      }}
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
