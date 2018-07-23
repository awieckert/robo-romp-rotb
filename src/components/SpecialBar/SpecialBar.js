import React from 'react';

class SpecialBar extends React.Component {

  render () {
    return (
      <div className="progress col-xs-2">
        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={this.props.bar}>
          <span className="sr-only">60% Complete</span>
        </div>
      </div>
    );
  };

};

export default SpecialBar;
