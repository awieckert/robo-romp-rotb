const Gryphon = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.armor = 2;
  defendingRobot.health = (defendingRobot.health - 20);
  defendingRobot.debuff = 3;
  defendingRobot.attackCount = (defendingRobot.attackCount - 1);

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 20;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 20;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 20;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const GoliathATV = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.armor = 0;
  defendingRobot.critChance = (defendingRobot.critChance - 25);
  defendingRobot.health = (defendingRobot.health - 15);
  defendingRobot.debuff = 4;

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 15;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 15;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 15;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const MerlinATV = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.health = (defendingRobot.health - 30);
  defendingRobot.evasion = (defendingRobot.evasion - 10);
  defendingRobot.debuff = 2;

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 30;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 30;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 30;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const Stinger = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.health = (defendingRobot.health - 20);

  attackingRobot.attackCount = 1;
  gameObject.attackDamage = 20;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 20;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 20;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const CombatRogue = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.health = (defendingRobot.health - 22);
  defendingRobot.critMulti = 1;
  defendingRobot.debuff = 3;
  defendingRobot.attackCount = (defendingRobot.attackCount - 2);

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 22;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 22;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 22;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const AssassinationRogue = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.armor = 1;
  defendingRobot.health = (defendingRobot.health - 16);
  defendingRobot.evasion = 0;
  defendingRobot.debuff = 2;

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 16;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 16;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 16;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const PaladinDrone = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.health = (defendingRobot.health - 12);
  attackingRobot.health = (attackingRobot.health + 20);

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 12;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 12;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 12;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

const SuperAwesomeBot = (attackingRobot, defendingRobot, gameObject) => {
  defendingRobot.health = (defendingRobot.health - 20);
  defendingRobot.critChance = (defendingRobot.critChance - 15);
  defendingRobot.debuff = 3;
  defendingRobot.armor = (defendingRobot.armor - 1);

  attackingRobot.attackCount = 0;
  gameObject.attackDamage = 20;
  gameObject.evaded = false;
  gameObject.isCritical = false;
  if (gameObject.turn === 'user') {
    gameObject.userProfile.dmgDealt += 20;
    gameObject.turn = 'enemy';
  } else if (gameObject.turn === 'enemy') {
    gameObject.enemyProfile.dmgDealt += 20;
    gameObject.turn = 'user';
  }
  if (attackingRobot.user === 'user1') {
    gameObject.userRobot = attackingRobot;
    gameObject.enemyRobot = defendingRobot;
  } else {
    gameObject.userRobot = defendingRobot;
    gameObject.enemyRobot = attackingRobot;
  }
  return gameObject;
};

export default {Gryphon, GoliathATV, MerlinATV, Stinger, CombatRogue, AssassinationRogue, PaladinDrone, SuperAwesomeBot};
