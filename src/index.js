const refs = {
  startBtn: document.querySelector('button[data-action-start]'),
  stopBtn: document.querySelector('button[ data-action-stop]'),
  clockface: document.querySelector('.js-clockface'),
};

class Timer {
  constructor({ onTick, updateBtn }) {
    this.intervalId = null;
    this.isActive = false;
    this.resetBtnOn = false;
    this.onTick = onTick;
    this.updateBtn = updateBtn;

    this.init();
  }

  init() {
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  start() {
    if (this.isActive) {
      return;
    }
    if (this.resetBtnOn) {
      this.updateBtn(this.resetBtnOn);
      this.resetBtnOn = false;
    }

    this.isActive = true;
    this.init();

    const startTime = Date.now();

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const time = this.getTimeComponents(deltaTime);
      this.onTick(time);
    }, 1000);
  }

  stop() {
    if (!this.isActive && !this.resetBtnOn) {
      return;
    }
    if (this.resetBtnOn) {
      this.init();
      this.updateBtn(this.resetBtnOn);
      this.resetBtnOn = false;
    } else {
      clearInterval(this.intervalId);
      this.isActive = false;
      this.updateBtn(this.resetBtnOn);
      this.resetBtnOn = true;
    }
  }

  // - Accepts time in milliseconds,
  // - calculates how many hours, minutes, seconds are in them.
  // - Returns an object with the following properties: hours, minutes, seconds.
  getTimeComponents(time) {
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const minutes = this.pad(
      Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    );
    const seconds = this.pad(Math.floor((time % (1000 * 60)) / 1000));
    return { hours, minutes, seconds };
  }

  // - Accepts a number, converts it into a string,
  // - adds 0 to the beginning if the number has less than two characters.
  pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({ onTick: updateClockface, updateBtn: updateBtn });

refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.stopBtn.addEventListener('click', timer.stop.bind(timer));

// - Takes time in milliseconds,
// - calculates how many hours, minutes, seconds are in them.
// - Draws the interface.
function updateClockface({ hours, minutes, seconds }) {
  refs.clockface.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateBtn(init) {
  if (init) {
    refs.stopBtn.textContent = 'Stop';
  } else {
    refs.stopBtn.textContent = 'Reset';
  }
}
