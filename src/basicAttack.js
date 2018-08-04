const swing = function () {
  const isCritical = Math.floor((Math.random() * 101));
  if (isCritical <= this.critChance) {
    return (this.attack * this.critMulti);
  } else {
    return this.attack;
  }
};

export default {swing};
