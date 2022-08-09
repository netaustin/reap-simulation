import { visitOptions } from './visitOptions.js';
import { events, start_probation } from './events.js';

(() => {

// kill these
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// move this to config

const imgWithSource = (src) => {
  const im = new Image();
  im.src = src;
  return im;
};

const IMGDIMS = { WIDTH: 1624, HEIGHT: 1157 };

const bgs = {
  'heights': imgWithSource('maps/heights.png'),
  'heights-hover': imgWithSource('maps/heights-hover.png'),
  'downtown': imgWithSource('maps/downtown.png'),
  'downtown-hover': imgWithSource('maps/downtown-hover.png'),
};

const config = () => {
  const colors = {
    WHITE: '#ffffff',
    BLACK: '#232323',
    GRAY: '#dddddd',
    PINK: '#ba8f95',     // used by non-profits
    YELLOW: '#ffbe0b',   // used by governments
    GREEN: '#4daa57',    // used by parks
    RED: '#fc440f',      // used by healthcare
    BLUE: '#01baef',     // used by transit
    DARKBLUE: '#4169e1', // used by housing
    PURPLE: '#8e7dbe',   // used by commerce
    BROWN: '#826754',    // used by workplaces
    MAP: '#eeeadf',      // used by the map background
  };

  const waitingMessages = {
    lines: [
      [], // 0 hours, no messages
      ['You are waiting in a line.', 'You hope this line moves quickly.',],
      ['This line looks a little long.', 'Guess you\'ll have to wait',],
      ['Oh no, this could take all day.', 'You are beginning to wish you had a snack.'],
      ['Waiting in lines like this is so demoralizing.', 'You cannot see the end of this terrible line.'],
    ],
    timeout: [
      'This does not look promising.',
      'Wait, this place is closing!',
      'Where are the workers going??',
    ],
  };

  const maps = {
    downtown: [
      // top row
      { pos: [[145, 100], [385, 345]], name: 'jail', fillStyle: colors.YELLOW, title: 'City Jail', },
      { pos: [[420, 100], [675, 345]], name: 'courthouse', fillStyle: colors.YELLOW, title: 'Courthouse', },
      { pos: [[695, 100], [950, 345]], name: 'countyclerk', fillStyle: colors.YELLOW, title: 'County Clerk', },
      { pos: [[975, 100], [1235, 345]], name: 'church', fillStyle: colors.PINK, title: 'St. Jude\'s Church', },
      { pos: [[1235, 100], [1495, 345]], name: 'shelter', fillStyle: colors.DARKBLUE, title: 'Homeless Shelter', },
      // second row
      { pos: [[145, 360], [385, 600]], name: 'dmv', fillStyle: colors.YELLOW, title: 'DMV', },
      { pos: [[420, 360], [950, 855]], name: 'park', title: 'Buchanan Square Park', fillStyle: colors.GREEN, },
      { pos: [[975, 360], [1495, 600]], name: 'clinic', fillStyle: colors.RED, title: 'Medical Center', },
      // third row
      { pos: [[145, 625], [385, 855]], name: 'bank', fillStyle: colors.PURPLE, title: 'First City Bank', },
      { pos: [[975, 615], [1225, 855]], name: 'shoppingcenter', fillStyle: colors.PURPLE, title: 'Shopping Center', },
      { pos: [[1235, 615], [1495, 1115]], name: 'warehouse', title: 'Savealot Warehouse', fillStyle: colors.BROWN, },
      // fourth row
      { pos: [[145, 870], [385, 1115]], name: 'employment', title: 'Career Center', fillStyle: colors.PINK, },
      { pos: [[420, 870], [675, 1115]], name: 'downtownstation', fillStyle: colors.BLUE, title: 'Metro Station', },
      { pos: [[695, 870], [950, 1115]], name: 'pronto', fillStyle: colors.PURPLE, title: 'Pronto Cafe', },
      { pos: [[975, 870], [1235, 1115]], name: 'plasma', fillStyle: colors.RED, title: 'Plasma Bank', },
    ],
    heights: [
      { pos: [[145, 100], [405, 345]], name: 'chancesbar', title: 'Chance\'s Bar', fillStyle: colors.PURPLE, },
      { pos: [[420, 100], [680, 600]], name: 'construction', title: 'Acme Construction.', fillStyle: colors.BROWN, },
      { pos: [[685, 100], [960, 345]], name: 'halfwayhouse', title: 'Halfway Home', fillStyle: colors.DARKBLUE, },
      { pos: [[960, 100], [1223, 345]], name: 'playground', title: 'Playground', fillStyle: colors.GREEN, },
      { pos: [[1237, 100], [1493, 345]], name: 'police', title: 'Police Precinct', fillStyle: colors.YELLOW, },
    
      { pos: [[145, 355], [405, 600]], name: 'diner', title: 'Jane\'s Diner', fillStyle: colors.PURPLE, },
      { pos: [[685, 355], [1223, 600]], name: 'heightshousing', title: 'Heights Public Housing', fillStyle: colors.DARKBLUE, },
      { pos: [[1237, 355], [1493, 600]], title: 'Shop \'n Stuff Grocery', name: 'grocery', fillStyle: colors.PURPLE, },
    
      { pos: [[145, 622], [405, 856]], name: 'discountmedical', title: 'Discount Medical', fillStyle: colors.RED, },
      { pos: [[420, 622], [952, 856]], name: 'heightspark', title: 'Heights Park', fillStyle: colors.GREEN, },
      { pos: [[960, 622], [1223, 856]], name: 'pawnshop', title: 'Rick\'s Pawn Shop', fillStyle: colors.PURPLE, },
      { pos: [[1237, 622], [1493, 856]], name: 'janitorservices', fillStyle: colors.BROWN, title: 'Janitor Services', },
    
      { pos: [[1, 872], [405, 1116]], name: 'heightschurch', fillStyle: colors.PINK, title: 'Heights Baptist Church', },
      { pos: [[420, 872], [685, 1116]], name: 'heightsstation', fillStyle: colors.BLUE, title: 'Metro Station', },
      { pos: [[685, 872], [952, 1116]], name: 'probation', fillStyle: colors.YELLOW, title: 'Probation Office', },
      { pos: [[960, 872], [1223, 1116]], name: 'counseling', fillStyle: colors.PINK, title: 'Counseling Center', },
      { pos: [[1237, 872], [1493, 1116]], name: 'communitycollege', fillStyle: colors.PINK, title: 'Community College', },
    ],
  };

  const itemTable = {
    watch: { title: 'Your grandfather\'s gold watch', max: 1 },
    ssn: { title: 'Social Security Card', max: 1 },
    restitutionreceipt: { title: 'Restitution Receipt', },
    birthcertificatereceipt: { title: 'Birth Certificate Order Receipt' },
    birthcertificate: { title: 'Birth Certificate', max: 1, },
    fishinglicense: { title: 'Fishing License', max: 1 },
    stateid: { title: 'State ID Card' },
    plasmacard: { title: 'Plasma Donation Record',},
    halfwayhouseinvite: { hidden: true, },
    halfwayhousekey: { title: 'Halfway House Key' },
    pouareq: { title: 'UA form from Probation Officer' },
    pouapass: { title: 'UA results for Probation Officer', hidden: true },
    pouafail: { title: 'UA results for Probation Officer', hidden: true, },
    jobuareq: { title: 'UA form from Hiring Manager' },
    jobuapass: { title: 'UA results for Hiring Manager', hidden: true, },
    jobuafail: { title: 'UA results for Hiring Manager', hidden: true, },
    debitcard: { title: 'Debit Card' },
    workboots: { title: 'Work Boots' },
  };

  const startTime = new Date('January 3, 2022 09:00:00');
  const player = {
    money: 100,
    health: 100,
    map: 'downtown',
    home: 'halfwayhouse',
    time: startTime,
    violations: 0,
    items: ['watch', 'ssn', 'halfwayhouseinvite'],
    locationEvents: [
      start_probation,
    ],
    lastMeal: startTime,
    lastProbation: startTime,
    lastStrength: startTime,
    calendar: [],
    events: [
      { name: 'outofprison', schedule: 0 },
      { name: 'meetpo', schedule: 0 },
    ],
  };
  return { colors, maps, visitOptions, events, player, waitingMessages, itemTable };
};

const advanceTime = (time, hours) =>
  new Date(time.getTime() + (hours * 3600000));

const getHoursDiff = (start, end) =>
  Math.round(Math.abs(end - start) / (1000 * 60 * 60));

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

// this should be in kind of a preprocessor...
const randomize = (struct, readPlayer = () => {}) => {
  if (typeof struct == 'object') {
    if (struct.random == 'uniform') {
      return Math.floor(Math.random() * (struct.max + 1 - struct.min) ) + struct.min;
    } else if (struct.random == 'rotate') {
      const player = readPlayer();
      const key = player[struct.key] || 0;
      const idx = (key >= struct.values.length) ? key % idx : key;
      return struct.values[key];
    }
  }
  return struct;
};

const waitInLine = ({ waitingMessages, player, visitOptions }, dispatch, location, waitTime, next) => {
  // will the store close while we're in line?
  const dow = player.time.getDay();
  const hours = visitOptions[location.name].hours;
  const isClosing = (player.time.getHours() + waitTime >= hours[dow][1]);
  const kickedOut = () => renderModal(
    { player }, 
    dispatch,
    {
      ...location,
      ...visitOptions[location.name],
      title: 'Oh no!',
      message: `${location.title} closed while you were waiting in line! You will have to return some other day.`,
      closeButtonText: `Leave ${location.title}`,
      exitTransaction: { time: waitTime },
      options: [],
    },
  );
  renderModal(
    { player },
    dispatch,
    {
      ...location,
      ...visitOptions[location.name],
      title: `Waiting in line at ${location.title}`,
      message: pickOne(waitingMessages.lines[waitTime]),
      closeButtonText: 'It\'s your turn!',
      waitToCloseMS: waitTime * 4000,
      onComplete: isClosing ? kickedOut : next,
      autoClose: isClosing,
      options: [],
    },
  );
}

const maxWaitForLocation = ({ player, visitOptions }, location, waitObj) => {
  const waitTime = randomize(waitObj, () => player);
  const hours = visitOptions[location.name].hours;
  if (!hours) {
    return waitTime;
  }
  const testTime = new Date(player.time);
  testTime.setHours(testTime.getHours() + waitTime);
  if (time_between(testTime, hours)) {
    return waitTime;
  }
  const dow = player.time.getDay();
  return hours[dow][1] - player.time.getHours();
}

const playerHasItem = (player, itemName) => player.items.find((item) => item == itemName);
const playerHasAny = (player, itemNames) => {
  for (const i in itemNames) {
    if (playerHasItem(player, itemNames[i])) {
      return true;
    }
  }
  return false;
};
const playerHasAll = (player, itemNames) => {
  for (const i in itemNames) {
    if (!playerHasItem(player, itemNames[i])) {
      return false;
    }
  }
  return true;
};

const hoursToHealth = (hours) => hours * 2;

// refactor each option to a function
const transact = (state, dispatch, rawOption, location) => {
  const { player } = state;
  const option = {
    money: 0,
    travel: '',
    health: 0,
    time: 0,
    wait: false,
    give: [],
    take: [],
  };
  Object.assign(option, rawOption);
  const playerState = Object.assign({}, player);
  const readPlayer = () => playerState;
  const writePlayer = (key, value) => playerState[key] = value;
  if (option.time + playerState.accruedTime > 0) {
    const timeToAdvance = playerState.accruedTime + option.time;
    playerState.accruedTime = 0;
    const scheduleEvents = (e, time) => {
      e.schedule -= time;
      return e;
    };
    playerState.time = advanceTime(playerState.time, timeToAdvance);
    playerState.health -= hoursToHealth(timeToAdvance);
    playerState.events = playerState.events.map((e) => scheduleEvents(e, timeToAdvance));
    playerState.locationEvents = playerState.locationEvents.map((e) => scheduleEvents(e, timeToAdvance));
  }
  if (option.makeMorning || option.makeMonday) {
    while(playerState.time.getHours() !== 9) {
      playerState.health -= hoursToHealth(1);
      playerState.time = advanceTime(playerState.time, 1);
    }
  }
  // we can skip health here because the player always gets reset
  if (option.makeMonday) {
    while(playerState.time.getDay() !== 1) {
      playerState.time = advanceTime(playerState.time, 1);
    }
  }
  if (option.money) {
    if (option.money < 0 && (-1 * option.money) > playerState.money) {
      playerState.events.unshift({
        title: 'Too expensive!',
        message: 'You cannot afford that',
        photo: location,
        schedule: 0,
      });
      dispatch({ player: playerState });
      return;
    }
    playerState.money += option.money;
  }
  if ((option.failWithoutAny && !playerHasAny(player, option.failWithoutAny)) ||
      (option.failWithoutAll && !playerHasAll(player, option.failWithoutAll))) {
    const neededNames = option.failWithoutAny ? option.failWithoutAny : option.failWithoutAll;
    const needed = neededNames.map((itemName) => state.itemTable[itemName].title);
    playerState.events.unshift({
      ...state.visitOptions[location],
      title: 'Missing something',
      message: `You are missing some or all of the required items: ${needed.join(', ')}`,
      photo: location,
      schedule: 0,
    });
    dispatch({ player: playerState });
    return;
  }
  if (option.reset) { // the player's life is on a new course.
    playerState.events = [];
    playerState.locationEvents = [];
    playerState.money = 0;
    playerState.lastMeal = playerState.time;
    option.take.push('halfwayhousekey');
  }
  if (option.travel) {
    playerState.map = option.travel;
  }
  if (option.health) {
    playerState.health += option.health;
  }
  if (option.food) {
    playerState.lastMeal = playerState.time;
  }
  if (option.risk && option.risk > Math.random()) {
    playerState.events.push({ name: 'arrest', schedule: 0, });
  }
  if (option.randMoney) {
    playerState.money += Math.ceil(option.randMoney * Math.random());
  }
  if (option.addToCalendar) {
    playerState.calendar = [...playerState.calendar, ...option.addToCalendar];
  }
  if (option.giveOne) {
    const prob = Math.random();
    for (const item in option.giveOne) {
      const ceil = option.giveOne[item];
      if (ceil > prob) {
        playerState.items.push(item);
        break;
      }
    }
  }
  if (option.give) {
    playerState.items.push(...option.give);
  }
  if (option.take) {
    // TODO: refactor
    for (const idx in option.take) {
      const takeName = option.take[idx];
      const taken = playerState.items.find((item) => item == takeName);
      const takenIdx = playerState.items.indexOf(taken);
      playerState.items.splice(takenIdx, 1);
    }
  }
  // must avoid deep copy issues
  if (option.addEvents) {
    option.addEvents.forEach((evt) => playerState.events.push(Object.assign({}, evt)));
  }
  if (option.addLocationEvents) {
    option.addLocationEvents.forEach((evt) => playerState.locationEvents.push(Object.assign({}, evt)));
  }
  if (option.violation) {
    playerState.violations++;
  }
  if (option.setHealth) {
    playerState.health = option.setHealth;
  }
  if (option.incrementKey) {
    playerState[option.incrementKey]++;
  }
  dispatch({ player: playerState });
};

const time_between = (time, hoursByDay) => {
  const dow = time.getDay();
  const hours = hoursByDay[dow];
  const current = time.getHours() || [0, 0];
  return (current >= hours[0] && current < hours[1]);
};

const openHours = (days) => {
  if (!days) {
    return '';
  }
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const openToday = (hours) => {
    if (!hours) {
      return 'closed';
    }
    else {
      const fmt_hour = (h) => h < 13 ? `${h}am` : `${h-12}pm`;
      return hours.map((h) => fmt_hour(h)).join('-');
    }
  }
  const fullsked = days.map((hours, i) => `${names[i]}: ${openToday(hours)}`).join(', ');
  return `<p><small><em>${fullsked}</em></small></p>`
}

const renderModal = (
  state,
  dispatch,
  {
    waitToCloseMS = 0,
    closeButtonText = '',
    exitTransaction = {},
    fillStyle,
    hours = false,
    lateMessage = '',
    message = '',
    messageHTML = '',
    name,
    onComplete = () => {},
    options = [],
    photo = '',
    schedule,
    title,
    type = 'location',
    messageIdx = 0,
    canLeave = true,
  },
) => {
  modal.style.display = 'block';
  const closeModal = () => {
    modal.innerHTML = '';
    modal.style.display = 'none';
  };
  const messageIsList = (typeof messageHTML == 'object');
  const isClosed = (type == 'location' && hours && hours.length && !time_between(state.player.time, hours));
  const filtered = options.filter((opt) => {
    if (opt.hideWithoutAny) {
      if (!playerHasAny(state.player, opt.hideWithoutAny)) {
        return false;
      }
    }
    if (opt.hideWithoutAll) {
      if (!playerHasAll(state.player, opt.hideWithoutAll)) {
        return false;
      }
    }
    if (opt.hideWithAny) {
      if (playerHasAny(state.player, opt.hideWithAny)) {
        return false;
      }
    }
    if (opt.hours) {
      if (!time_between(state.player.time, opt.hours)) {
        return false;
      }
    }
    return true;
  });
  const transactButtons = () => {
    if (isClosed) {
      return '';
    }
    return filtered.map(
      (opt, i) => {
        return `<div class="button-group vertical">
          <button class="vertical cb-btn" value="${i}">${opt.title}</button>
        </div>`
      }
    ).join('');
  }
  const leaveButtonID = self.crypto.randomUUID();
  const messageID = self.crypto.randomUUID();
  const leaveButton = () => {
    const makeButtonText = () => {
      if (closeButtonText) {
        return closeButtonText;
      }
      if (type == 'location') {
        return `Leave ${title}`;
      }
      return 'Okay';
    }
    const closeHidden = () => {
      if (waitToCloseMS > 0) {
        return `style="visibility: hidden;"`
      }
      return '';
    };
    if (!canLeave) {
      return ``;
    }
    return `<div ${closeHidden()} class="button-group vertical" id="${leaveButtonID}">
      <button value="x" class="vertical cb-btn">${makeButtonText()}</button>
    </div>`;
  };
  const renderMessage = () => {
    if (isClosed) {
      return '<p><em>We are currently closed.</em></p>'
    }
    if (message.length == 0 && messageHTML.length == 0) {
      return '<p>Nothing to do here.</p>';
    }
    if (typeof message == 'object' && message.random) {
      return randomize(message, () => state.player);
    }
    if (messageIsList) {
      return messageHTML[messageIdx];
    }
    if (messageHTML.length) {
      return messageHTML;
    }
    return message;
  };
  const photoName = photo ? photo : name;
  const renderLateMessage = () => (lateMessage && schedule < 0) ? `<p>${lateMessage}</p>` : '';
    modal.innerHTML = `<div class="choice-box card">
      <div class="section" style="background-color: ${fillStyle}" >
        <h2 class="col-sm-12">${title}</h2>
        ${openHours(hours)}
      </div>
      <div class="container">
        <div class="row">
          <div class="col-sm-3">
            <img src="/img/${photoName}.jpg" style="width: 100%">
          </div>
          <div class="col-sm-9">
            ${renderLateMessage()}
            <div id="${messageID}">
              ${renderMessage()}
            </div>
            ${transactButtons()}
            ${leaveButton()}
          </div>
        </div>
      </div>
    </div>`;
    if (waitToCloseMS > 0) {
      const timer = document.createElement('p');
      // const timerId = self.crypto.randomUUID();
      // timer.setAttribute('id', timerId);
      document.getElementById(messageID).append(timer);
      let timecounter = 1;
      const tickTimer = () => {
        const totalminutes = timecounter * 15;
        const hours = Math.floor(totalminutes / 60);
        const minutes = totalminutes % 60;
        if (hours > 0) {
          const hoursword = hours > 1 ? 'hours' : 'hour';
          timer.innerHTML = `<em>You've been waiting for ${hours} ${hoursword} and ${minutes} minutes.</em>`;
        } else {
          timer.innerHTML = `<em>You've been waiting for ${minutes} minutes.</em>`;
        }
        timecounter++;
      };
      const timerInterval = setInterval(() => tickTimer(), 1000);
      setTimeout(() => {
        clearInterval(timerInterval);
        document.getElementById(leaveButtonID).style.visibility = 'visible';
      }, waitToCloseMS);
    }
    document.querySelectorAll('.cb-btn').forEach(item => {
      item.addEventListener('click', e => {
        if (messageIsList && messageIdx < messageHTML.length - 1) {
          messageIdx++;
          document.getElementById(messageID).innerHTML = messageHTML[messageIdx];
          return;
        }
        closeModal();
        onComplete();
        if (e.target.value == 'x') {
          if (exitTransaction) {
            transact(state, dispatch, exitTransaction, photoName);
          } else if (state.player.accruedTime) {
            transact(state, dispatch, {}, photoName);
          }
        } else {
          const idx = parseInt(e.target.value);
          transact(state, dispatch, filtered[idx], photoName);
        }
      });
    });
}

const nextEvent = (state, dispatch) => {
  const { player, events } = state;
  const scheduledEvents = player.events.filter((e) => e.schedule <= 0);
  if (scheduledEvents.length == 0) {
    return false;
  }
  const evtIdx = scheduledEvents.indexOf(scheduledEvents[0]);
  const thisEvt = scheduledEvents.shift();
  const baseEvt = events[thisEvt.name] || {};
  const evt = {
    ...baseEvt,
    ...thisEvt,
    hours: [],
    type: 'event',
  };
  evt.onComplete = () => {
    player.events.splice(evtIdx, 1);
    dispatch({ player });
  };
  const locationOpts = state.visitOptions[evt.location];
  renderModal(state, dispatch, { ...locationOpts, photo: evt.location, ...evt });
  return true;
};

const visit = (state, dispatch, location, waited = 0) => {
  const { visitOptions, player } = state;
  const { locationEvents } = player;
  if (visitOptions[location.name].maxHunger) {
    const hungerHours = getHoursDiff(player.lastMeal, player.time);
    if (hungerHours >= visitOptions[location.name].maxHunger) {
      return renderModal(
        state,
        dispatch,
        Object.assign(
          {},
          location,
          { message: 'You are too hungry to deal with this right now.' }
        )
      );
    }
  }
  if (visitOptions[location.name].wait && !waited && time_between(player.time, visitOptions[location.name].hours)) {
    const waitTime = maxWaitForLocation(state, location, visitOptions[location.name].wait);
    if (waitTime > 0) {
      // If the place closes while they are in line, that's it, none of the rest of this happens
      return waitInLine(
        state,
        dispatch,
        location,
        waitTime,
        () => visit(state, dispatch, location, waitTime)
      );
    }
  }
  const opts = () => {
    const evt = locationEvents.find((e) => e.location == location.name);
    if (evt) {
      if (evt.lateMessage && evt.schedule < 0) {
        state.player.violations++; // will get written in dispatch from transaction
      }
      if (!(evt.schedule && evt.schedule > 0)) {
        evt.onComplete = () => {
          const evtIdx = locationEvents.indexOf(evt);
          player.locationEvents.splice(evtIdx, 1);
          dispatch({ player });
        };
        evt.type = 'locationEvent';
        return evt;
      }
    }
    return visitOptions[location.name]
  };
  opts.type = 'visit';
  state.player.accruedTime = waited;
  renderModal(state, dispatch, Object.assign({}, location, opts()));
};

// There's a cool library called date-fns that we're assiduously not using
// so that we don't break our "never use any frameworks" rule. This is where
// it would be the nicest.
const formatDate = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  let hours = date.getHours();
  let ampm = 'am';
  if (hours == 0) {
    hours = 12;
  } else if (hours > 11) {
    ampm = 'pm';
    if (hours > 12) {
      hours -= 12;
    }
  }
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timestr = `${hours}:${minutes + ampm}`;
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${timestr}`
};

const showBackpack = (state, dispatch) => {
  const { player, itemTable } = state;
  const { items, calendar } = player;
  const backpackItems = () => {
    if (items.length == 0) {
      return '<p>Your backpack contains nothing</p>';
    }
    const itemQt = (qt) => qt > 1 ? `(${qt})` : '';
    const itemList = items.map((key) => {
      const item = itemTable[key];
      if (!item.hidden) {
        return `<li>${item.title} ${itemQt(item.quantity)}</li>`;
      }
      return '';
    });
    return `<p>Your backpack contains:</p>
      <ul>${itemList.join('')}</ul>`
  }
  const calendarItems = () => {
    if (calendar.length == 0) {
      return '';
    }
    const itemList = calendar.map((item) => `<li>${item.title}</li>`);
    return `<p>Weekly Calendar:</p>
      <ul>${itemList.join('')}</ul>`
  }
  const violations = () => `<p>Probation Violations: ${player.violations}</p>`
  renderModal(state, dispatch, {
    photo: 'backpack',
    title: 'Your Backpack',
    closeButtonText: 'Close your backpack',
    messageHTML: backpackItems() + calendarItems() + violations(),
  });
}

// wrong arg order
const drawStatusBar = ({ width }, { player, colors, itemTable }) => {
  const padding = 5;
  const barHeight = 30;
  ctx.font = 'Bold 14px Arial, sans-serif';
  ctx.fillStyle = colors.GRAY;
  ctx.fillRect(0, 0, width, barHeight);
  ctx.fillStyle = colors.BLACK;
  const dateTxt = formatDate(player.time);
  const dateTxtMetrics = ctx.measureText(dateTxt);
  const txtHeight = dateTxtMetrics.fontBoundingBoxAscent;
  const verticalCenter = (barHeight - txtHeight) / 2 + txtHeight;
  ctx.fillText(dateTxt, padding, verticalCenter);
  const itemCount = player.items.filter((item) => !itemTable[item].hidden).length;
  const statusTxt = `Items: ${itemCount} | Money: $${player.money} | Health: ${player.health}`;
  const statusTxtMetrics = ctx.measureText(statusTxt);
  ctx.fillText( statusTxt, width - statusTxtMetrics.width - padding, verticalCenter);
};

const drawMapTitle = ({ colors }, title, x, y) => {
  const textmargin = 10;
  ctx.font = '12px Arial, sans-serif';
  const metrics = ctx.measureText(title);
  ctx.fillStyle = colors.BLACK;
  ctx.fillText(title, x + textmargin, y + textmargin + metrics.fontBoundingBoxAscent);
};

const _shapeInBlock = (scalex, scaley) => (block) => ({
  x: scalex(block.pos[0][0]),
  y: scaley(block.pos[0][1]),
  width: scalex(block.pos[1][0] - block.pos[0][0]),
  height: scaley(block.pos[1][1] - block.pos[0][1]),
});

const drawMap = ({ width, height}, state, dispatch, e) => {
  if (nextEvent(state, dispatch)) {
    return;
  }
  const { maps, player, colors } = state;
  const mapObj = maps[player.map];
  const topmargin = 30;
  ctx.translate(0, 0);

  const scalex = (x) => (x / IMGDIMS.WIDTH) * width;
  const scaley = (y) => (y / IMGDIMS.HEIGHT) * height;
  const growx = (x) => (x / width) * IMGDIMS.WIDTH;
  const growy = (y) => (y / height) * IMGDIMS.HEIGHT;

  const shapeInBlock = _shapeInBlock(scalex, scaley);

  const rect = canvas.getBoundingClientRect();
  ctx.font = '14px Arial, sans-serif';

  ctx.drawImage(bgs[player.map], 0, 0, width, height);

  if (e && e.type == 'click') {
    if (e.clientY - rect.top < topmargin) {
      return showBackpack(state, dispatch);
    }
  }

  mapObj.forEach((blockData) => {
    const defaultBlock = { name: '', fillStyle: colors.GRAY, rowspan: 1, colspan: 1, };
    const block = { ...defaultBlock, ...blockData };
    ctx.beginPath();
    const shape = shapeInBlock(block);
    ctx.fillStyle = 'transparent';
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    if (e) {
      const ex = e.clientX - rect.left,
        ey = e.clientY - rect.top;
      if (ctx.isPointInPath(ex, ey)) {
        if (e.type == 'click') {
          visit(state, dispatch, block);
          return;
        }
        ctx.drawImage(
          bgs[player.map + '-hover'],
          growx(shape.x),
          growy(shape.y),
          growx(shape.width),
          growy(shape.height),
          shape.x,
          shape.y,
          shape.width,
          shape.height,
        );
      }
    }
    // ctx.rect(shape.x, shape.y, shape.width, shape.height);
    // to handle map interaction
    block.coordinates = shape;
    ctx.fill();
    drawMapTitle(state, block.title, shape.x, shape.y);
  });
};

const draw = ({ width, height}, state, dispatch, e) => {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  drawMap({ width, height }, state, dispatch, e);
  drawStatusBar({ width, height }, state, dispatch, e);
  ctx.restore();
};

const init = () => {
  const state = {
    ...config(),
  };
  const { width } = canvas.getBoundingClientRect();
  const height = width * (IMGDIMS.HEIGHT / IMGDIMS.WIDTH);
  const dims = { width, height };
  const dispatch = (change) => {
    Object.assign(state, change);
    const e = new CustomEvent('stateChange', {
      detail: { change },
    });
    draw(dims, Object.assign({}, state), dispatch, e);
  };
  // handle map hover states
  canvas.onmousemove = (e) => draw(dims, state, dispatch, e);
  canvas.onmouseout = (e) => draw(dims, state, dispatch, e);
  canvas.onclick = (e) => draw(dims, state, dispatch, e);
  // initialize the game
  ctx.scale(1, 1);
  canvas.width = width; // necessary to properly scale
  canvas.height = height;
  draw(dims, state, dispatch);
}

init();

})();