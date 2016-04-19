import classNames from 'classnames';
import React from 'react';

class StackedProgressBar extends React.Component {
  render() {
    let label;
    let secondaryLabel;
    let props = this.props;
    let classes = classNames(props.className, props.layoutClassName, {
      'is-erroneous': props.progressState === 'error',
      'is-ongoing': props.progressState === 'ongoing',
      'is-upcoming': props.progressState === 'upcoming',
      'is-paused': props.progressState === 'paused',
      'is-waiting': props.progressState === 'waiting'
    });

    if (props.label) {
      label = (
        <div className={props.headerClassName}>
          <span className={props.labelClassName}>
            <span className={props.labelContentClassName}>{props.label}</span>
          </span>
          <span className={props.labelActionClassName}>
            {props.labelAction}
          </span>
        </div>
      );
    }

    if (props.secondaryLabel) {
      secondaryLabel = (
        <div className={props.secondaryLabelClassName}>
          {this.props.secondaryLabel}
        </div>
      );
    }

    return (
      <div className={classes}>
        {label}
        <div className={props.fillWrapperClassName}>
          <div className={props.fillClassName} style={{
            width: `${props.progress}%`
          }} />
        </div>
        {secondaryLabel}
      </div>
    );
  }
}

StackedProgressBar.defaultProps = {
  className: 'stacked-progress-bar',
  headerClassName: 'progress-bar-header',
  fillClassName: 'progress-bar-fill',
  fillWrapperClassName: 'progress-bar-fill-wrapper',
  labelActionClassName: 'progress-bar-label-action',
  labelClassName: 'progress-bar-label',
  labelContentClassName: 'progress-bar-label-content',
  layoutClassName: '',
  progress: 100,
  secondaryLabelClassName: 'progress-bar-label-secondary'
};

StackedProgressBar.propTypes = {
  className: React.PropTypes.string,
  headerClassName: React.PropTypes.string,
  fillClassName: React.PropTypes.string,
  fillWrapperClassName: React.PropTypes.string,
  label: React.PropTypes.node,
  labelAction: React.PropTypes.node,
  labelActionClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  labelContentClassName: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
  progress: React.PropTypes.number,
  progressState: React.PropTypes
    .oneOf(['error', 'ongoing', 'paused', 'upcoming', 'waiting']).isRequired,
  secondaryLabel: React.PropTypes.node,
  secondaryLabelClassName: React.PropTypes.string
};

module.exports = StackedProgressBar;
