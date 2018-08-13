import React, { Component } from 'react';
import SpecialBar from '../SpecialBar/SpecialBar.js';
import './BattleBot.css';
import '../../../node_modules/animate.css/animate.css';

class BattleBot extends Component {

  determineHealth = (bot, staticBot) => {
    const healthPercent = (bot.health / staticBot.health) * 100;
    const healthStyle = {
      width: `${healthPercent}%`,
    };
    return healthStyle;
  };

  setSpecialBar = (bot) => {
    const specialBars = [];
    const fullBar = {
      width: '100%',
    };
    const emptyBar = {
      width: '0%',
    };

    for (let i = 1; i <= bot.specialCount; i++) {
      if (bot.attackCount >= i) {
        specialBars.push(<SpecialBar key={i} bar={fullBar}/>);
      } else {
        specialBars.push(<SpecialBar key={i} bar={emptyBar}/>);
      }
    }
    return specialBars;
  };

  determineDebuffs = (bot, staticBot) => {
    const currentDebuffs = [];
    if (bot.debuff > 0) {
      if (bot.critChance < staticBot.critChance) {
        const currentCrit = <h4>Crit Reduction:  - {staticBot.critChance - bot.critChance}%</h4>;
        currentDebuffs.push(currentCrit);
      }
      if (bot.critMulti < staticBot.critMulti) {
        const currentCritMulti = <h4>Crit Multiplier:  {bot.critMulti}</h4>;
        currentDebuffs.push(currentCritMulti);
      }
      if (bot.armor < staticBot.armor) {
        const currentArmor = <h4>Armor Reduction:  - {staticBot.armor - bot.armor}</h4>;
        currentDebuffs.push(currentArmor);
      }
      if (bot.evasion < staticBot.evasion) {
        const currentEvasion = <h4>Evasion Reduction:  - {staticBot.evasion - bot.evasion}%</h4>;
        currentDebuffs.push(currentEvasion);
      }
    } else {
      const noDebuffs = <h3>No Debuffs</h3>;
      currentDebuffs.push(noDebuffs);
      return currentDebuffs;
    }
    return currentDebuffs;
  };

  determineAttackAnimation = (bot) => {
    const turn = this.props.turn;
    let attackAnimation = '';
    if ((turn === 'enemy') && (bot.user === 'user1')) {
      attackAnimation = 'animated slideInLeft';
    } else if ((turn === 'user') && (bot.user === 'user2')) {
      attackAnimation = 'animated slideInRight';
    } else {
      attackAnimation = '';
    }
    return attackAnimation;
  };

  render () {
    const staticBot = {...this.props.staticBot};
    const bot = {...this.props.bot};
    const currentHealth =  ((bot.health / staticBot.health) * 100);
    const currentHealthPercent = currentHealth.toFixed(0);
    const healthRemaining = this.determineHealth(bot, staticBot);
    const specialBar = this.setSpecialBar(bot);
    const debuffs = this.determineDebuffs(bot, staticBot);
    const attackAnimation = this.determineAttackAnimation(bot);
    let robotImg = 'robot-image';
    if (this.props.attacking) {
      robotImg += ` ${attackAnimation}`;
    }
    return (
      <div className="BattleBot col-xs-6">
        {
          (bot.user === 'user1') ? (
            <img className='small-picture-left' src={bot.imgSmall} alt='robot head-shot' />
          ) : (
            <img className='small-picture-right' src={bot.imgSmall} alt='robot head-shot' />
          )
        }
        <div className="progress health-bar col-xs-6">
          <div className="progress-bar health-color" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={healthRemaining}>
            {currentHealthPercent}%
          </div>
        </div>
        <img className={robotImg} src={bot.img} alt="robot"/>
        <h3>Special Gauge</h3>
        <div className='special-bar'>
          {specialBar}
        </div>
        <div className='debuffs'>
          <h3>Current Debuffs</h3>
          {debuffs}
        </div>
      </div>
    );
  }
}

export default BattleBot;
