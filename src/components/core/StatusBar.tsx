import { Color, Opacity } from 'enums/Color';
import React, { useState } from 'react';
import { OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import { useAppSelector } from 'store/hooks';
import { selectTasker } from 'store/reducers/tasker';
import ColorsUtils from 'utils/colors-utils';
import Task from 'models/ITask';
import {
  VscBell,
  VscCheck,
  VscDebugAlt,
  VscError,
  VscFeedback,
  VscGitMerge,
  VscLiveShare,
  VscPerson,
  VscSymbolNamespace,
  VscSync,
  VscWarning,
} from 'react-icons/vsc';

const { left, right } = {
  left: [
    {
      id: 'ssanto.git-branch',
      label: (
        <React.Fragment>
          <VscGitMerge /> ui-overhaul*+
        </React.Fragment>
      ),
    },
    {
      id: 'ssanto.git-synchronize',
      label: <VscSync />,
      description: 'Synchronize with Git',
    },
    {
      id: 'ssanto.diagnostics',
      label: (
        <React.Fragment>
          <VscError /> 15 <VscWarning /> 0
        </React.Fragment>
      ),
      description: 'Errors: 15, Warnings: 0',
    },
    {
      id: 'ssanto.start',
      label: <VscDebugAlt />,
      description: 'Start Analysing',
    },
    {
      id: 'ssanto.person-account',
      label: (
        <React.Fragment>
          <VscPerson /> Christophe
        </React.Fragment>
      ),
      description: 'Sign in to Github.',
    },
    {
      id: 'ssanto.live-share',
      label: (
        <React.Fragment>
          <VscLiveShare /> Live Share
        </React.Fragment>
      ),
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
      label: (
        <React.Fragment>
          <VscSymbolNamespace /> TypeScript React
        </React.Fragment>
      ),
      description: 'Select Language Mode',
    },
    {
      id: 'ssanto.tslint',
      label: (
        <React.Fragment>
          <VscWarning /> TSLint
        </React.Fragment>
      ),
      description: 'Linter is running.',
    },
    {
      id: 'ssanto.prettier',
      label: (
        <React.Fragment>
          <VscCheck /> Prettier
        </React.Fragment>
      ),
    },
    {
      id: 'ssanto.feedback',
      label: <VscFeedback />,
      description: 'Tweet Feedback',
    },
    {
      id: 'ssanto.notifications',
      label: <VscBell />,
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

function Loading() {
  return (
    <Spinner
      style={{ borderWidth: 1, height: 12.25, width: 12.25 }}
      animation="border"
    />
  );
}

function StatusItem({ label, description, disabled, onClick }: any) {
  const [focused, setFocused] = useState(false);

  const options = { disabled, focused };
  const activity = {
    size: '12px',
    cursor: disabled ? 'default' : 'cursor',
    color: ColorsUtils.getRelevantColor(iconColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
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
        {label && <small style={{ color: activity.color }}>{label}</small>}
      </div>
    </OverlayTrigger>
  );
}

/**
 * Status bar component.
 * @return {JSX.Element} Html.
 */
function StatusBar({ style }: any) {
  const { tasks = [] } = useAppSelector(selectTasker);

  const runningTasksCount =
    tasks.filter((task: Task) => task.running).length || 0;

  function handleItemClick(item: any) {
    console.log(`clicked on status item: "${item.id}"`);
  }

  return (
    <nav
      className="d-flex flex-row justify-content-between px-2"
      style={{
        ...style,
        backgroundColor: runningTasksCount > 0 ? Color.Orange : Color.Primary,
      }}
    >
      <div className="d-flex flex-row overflow-visible">
        {left?.map(item => (
          <StatusItem
            {...item}
            key={`status/status-${item.id}`}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      <div className="d-flex flex-row overflow-visible">
        <StatusItem
          id="ssanto.tasks"
          label={
            runningTasksCount > 0 ? (
              <React.Fragment>
                <Loading /> {runningTasksCount} Task
                {runningTasksCount > 1 ? 's' : ''} Running
              </React.Fragment>
            ) : (
              <React.Fragment>
                <VscCheck /> No Tasks Running
              </React.Fragment>
            )
          }
        />
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
