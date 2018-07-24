import React from 'react';
import './AttackResult.css';

class AttackResult extends React.Component {

  displayCorrectResult = () => {
    let result = {};
    const isCritical = this.props.isCritical;
    const evaded = this.props.evaded;
    const attackDamage = this.props.attackDamage;
    if (evaded) {
      result = <h2>Evaded!</h2>;
    } else if (isCritical) {
      result = <h2>{attackDamage} Critical Strike!</h2>;
    } else {
      result = <h2>{attackDamage}</h2>;
    }
    return result;
  };

  render () {
    const correctResult = this.displayCorrectResult();
    return (
      <div>
        {correctResult}
      </div>
    );
  }
};

export default AttackResult;
