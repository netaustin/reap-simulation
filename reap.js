import { visitOptions } from './visitOptions.js';
import { events, start_probation } from './events.js';
import { debugStates } from './debugStates.js';

(() => {

// kill these
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// resource management
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
    GRAYER: '#aaaaaa',
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
      { pos: [[695, 870], [950, 1115]], name: 'pronto', fillStyle: colors.PURPLE, title: 'Joe\'s Cafe', },
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
    watch: { title: 'Your grandfather\'s gold watch', max: 1, icon: '⏱' },
    ssn: { title: 'Social Security Card', max: 1, icon: '🆔', },
    restitutionreceipt: { title: 'Restitution Receipt', icon: '🔖' },
    birthcertificatereceipt: { title: 'Birth Certificate Order Receipt', icon: '🔖', },
    birthcertificate: { title: 'Birth Certificate', max: 1, icon: '📜', },
    fishinglicense: { title: 'Fishing License', max: 1, icon: '🐟' },
    stateid: { title: 'State ID Card', icon: '🆔' },
    plasmacard: { title: 'Plasma Donation Record', icon: '🆎', },
    halfwayhouseinvite: { hidden: true, icon: '🔖' },
    halfwayhousekey: { title: 'Halfway House Key', icon: '🔑' },
    pouareq: { title: 'UA form from Probation Officer', icon: '📄' },
    pouapass: { title: 'UA results for Probation Officer', hidden: true },
    pouafail: { title: 'UA results for Probation Officer', hidden: true, },
    jobuareq: { title: 'UA form from Hiring Manager', icon: '📄' },
    jobuapass: { title: 'UA results for Hiring Manager', hidden: true, },
    jobuafail: { title: 'UA results for Hiring Manager', hidden: true, },
    debitcard: { title: 'Debit Card', icon: '💳', },
    workboots: { title: 'Work Boots', icon:  '👞', },
    navoucher: { title: 'Attendence Slip from Narcotics Anonymous', icon: '📄', },
    counselingvoucher: { title: 'Counseling Voucher', icon: '📄' },
    careervoucher: { title: 'Career Center Voucher', icon: '📄' },
    careercenterdemand: { hidden: true },
    stateiddemand: { hidden: true },
    birthcertificatedemand: { hidden: true },
    ramen: { title: 'Ramen Noodles', icon: '🍜', },
    warehouseapplication: { title: 'Blank Warehouse Application', icon: '📄' },
    completedwarehouseapplication: { title: 'Completed Warehouse Application', icon: '📄' },
    jobid: { title: 'Job ID and Timecard', icon: '🆔' },
    joborientationinvite: { title: 'Job Orientation Invitation', icon: '🔖',  },
    paycheck: { title: 'A paper paycheck in the amount of $168', icon: '💵', },
  };

  const startTime = new Date('January 3, 2022 09:00:00');
  const player = {
    money: 50,
    health: 80,
    map: 'downtown',
    home: 'halfwayhouse',
    time: startTime,
    violations: 0,
    playedHours: 0,
    items: ['watch', 'ssn', 'halfwayhouseinvite'],
    locationEvents: [
      start_probation,
    ],
    accruedPay: 0,
    paychecksReady: 0,
    lastMeal: startTime,
    nextProbation: startTime,
    lastStrength: startTime,
    communityservice: 0,
    calendar: [],
    arrests: 0,
    hospitalvisits: 0,
    events: [
      { name: 'outofprison', schedule: 0 },
      { name: 'meetpo', schedule: 0 },
    ],
  };

  // refactor how locations are stored, for the love of god.
  const locationTitle = (location) => [...maps.downtown, ...maps.heights]
    .filter((locObject) => locObject.name == location)
    .pop()
    .title;

  return { colors, maps, visitOptions, events, player, waitingMessages, itemTable, locationTitle };
};

const advanceTime = (time, hours) =>
  new Date(time.getTime() + (hours * 3600000));

const getHoursDiff = (start, end) =>
  Math.round((end - start) / (1000 * 60 * 60));

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

// this should be in kind of a preprocessor?
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

const nextProbation = (time) => {
  let nextappt = time;
  if (time.getDay() == 1) {
    nextappt = advanceTime(nextappt, 24);
  }
  while (nextappt.getDay() !== 1) {
    nextappt = advanceTime(nextappt, 1);
  }
  return advanceTime(nextappt, 10);
}

const playerHasWarrant = (player) => getHoursDiff(player.time, player.nextProbation) < -24;

const poReview = (readPlayer, writePlayer) => {
  const player = readPlayer();
  const timeUntilReview = getHoursDiff(player.time, player.nextProbation);
  const messageStack = [];
  let violations = 0;
  let arrest = false;
  const ret = {
    give: ['pouareq'],
    take: ['pouareq', 'pouapass', 'pouafail', 'counselingvoucher', 'careervoucher', 'navoucher',],
  }
  // refactor
  if (timeUntilReview > 0) {
    messageStack.push(pickOne([
      `I'm flattered that you want to see me again, but I'm really quite busy.`,
      `Were you supposed to come today? Ah, no you were not. See you soon!`,
      `Your probation officer is not in the office. Come back at your scheduled time.`,
    ]));
    const poEvents = [{
      title: 'Appointment with your Parole Officer',
      messageHTML: messageStack,
      photo: 'probation',
      schedule: 0,
    }];
    writePlayer('events', [...poEvents, ...player.events]);
    return { give: [], take: [], };
  } else if (timeUntilReview < -24) { // 1 or more days late
    messageStack.push(
      `I've been looking for you. You missed an appointment, and I have to take you into custody.`);
      arrest = true;
  } else {
    if (timeUntilReview < 0) { // 0-24 hours late.
      messageStack.push(`First off, you're late. I have to give you a violation for being late.`);
      violations++;
    }
    messageStack.push(
      `We are going to review your drug test, your treatment progress, and your job search.
      First I'll pull up your urinalysis results.`
    );
    // UA
    if (player.items.indexOf('pouareq') >= 0) {
      messageStack.push(
        `You didn't get a UA test done? That's a parole violation. Please do not forget again.`
      );
      violations++;
    } else if (player.items.indexOf('pouapass')) {
      messageStack.push(`You passed your urinalysis. Good work staying clean.`);
    } else {
      messageStack.push(
        `You failed your urinalysis, which is a violation of your parole.`
      );
      violations++;
    }
    // Treatment
    if (player.items.indexOf('navoucher') >= 0) {
      messageStack.push(
        `Let's look at your treatment progress next. Thank you for bringing the voucher from NA.`
      );
    } else {
      messageStack.push(
        `Let's look at your treatment progress. You needed to go to NA this week, but you didn't, 
        which is a violation of your parole.`
      );
      violations++;
    }
    if (player.items.indexOf('counselingvoucher') >= 0) {
      messageStack.push(
        `I see you have the form from your group therapy session, thank you.`
      );
    } else {
      messageStack.push(
        `I see you haven't been to group therapy, which is a violation of your parole.`
      );
      violations++;
    }
    // Job Search
    if (player.items.indexOf('jobid') > -1) {
      messageStack.push(`You're working. That's great. Remember you are required to pay $200 in
        restitution this month.`);
    } else {
      messageStack.push(`As a condition of your parole, you are also required to find a job.`);
      if (player.items.indexOf('careervoucher') >= 0) {
        messageStack.push(
          `I see you have been to the career center this week, good luck with the job hunt.`
        );
      } else if (player.items.indexOf('stateid') >= 0) {
        messageStack.push(
          `I see you have gotten your state ID. Now you need to go to the career center and try to
          find a job. Please do so by our next visit.`
        );
        // ret.give('careercenterdemand');
      } else if (player.items.indexOf('birthcertificate') >= 0) {
        messageStack.push(
          `I see you have your birth certificate, but you will need a state ID in order to get
          a job. Please bring a state ID to your next visit.`
        );
        // ret.give.push('stateiddemand');
      } else if (player.items.indexOf('birthcertificatereceipt')) {
        messageStack.push(
          `You've requested your birth certificate. Once it arrives, you will need to get a state ID.`
        );
      }
      if (player.communityservice > 0) {
        messageStack.push(
          `You are also required to complete community service. Thus far, you have completed
          ${player.communityservice} hours of service. Keep it up and it'll be done before you
          know it.`
        );
      } else {
        messageStack.push(
          `You are required to complete community service, but you have yet to start working on
          your required time. Please complete a shift before our next meeting.`
        );
      }
    }
    const acceptableViolations = randomize({random: 'uniform', min: 2, max: 4});
    if (violations < 2) {
      messageStack.push(
        `That's all for this week, see you next time.`
      );
    } else if (violations <= acceptableViolations) {
      messageStack.push(
        `You have ${violations} new violations this week. I could take you into custody, but I'm going
        to give you a week to turn things around. See you then.`
      );
    } else {
      messageStack.push(
        `You have ${violations} new violations this week. I'm sorry, but I have to take you into custody.`
      );
      arrest = true;
    }
  }

  const poEvents = [{
    title: 'Appointment with your Parole Officer',
    messageHTML: messageStack,
    photo: 'probation',
    schedule: 0,
  }];
  if (arrest) {
    writePlayer('arrests', player.arrests + 1);
    poEvents.push({ name: 'pocustody', schedule: 0, });
  } else {
    writePlayer('nextProbation', nextProbation(player.time));
  }
  writePlayer('violations', player.violations + violations);
  writePlayer('events', [...poEvents, ...player.events]);
  return ret;
};

const hoursToHealth = (hours) => hours * 2;

// refactor each option to a function
const transact = (state, dispatch, rawOption, location) => {
  const { player, locationTitle } = state;
  const option = {
    money: 0,
    travel: '',
    health: 0,
    time: 0,
    wait: false,
    give: [],
    take: [],
    addEvents: [],
    paid: 0,
    paycheck: false,
    communityservice: 0,
    messageExitTransaction: {},
  };
  Object.assign(option, rawOption);
  const playerState = Object.assign({}, player);
  const readPlayer = () => playerState;
  const writePlayer = (key, value) => playerState[key] = value;
  if (option.possibilities) {
    const rand = Math.random();
    const choice = option.possibilities.filter((candidate) => candidate.threshold > rand).shift();
    Object.assign(option, choice);
  }
  if (option.poreview) {
    const poActions = poReview(readPlayer, writePlayer);
    option.take = [...option.take, ...poActions.take];
    option.give = [...option.give, ...poActions.give];
  }
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
    playerState.playedHours += timeToAdvance;
  }
  if (option.paid || option.paycheck) {
    playerState.accruedPay += option.paid;
    const dow = playerState.time.getDay();
    const expectedHours = dow == 5 ? 0 : dow * 7;
    if (playerState.accruedPay != expectedHours) {
      option.message = `It appears that you missed a shift. You have been fired. Here is your final
        pay in cash. Goodbye.`;
      option.money += (playerState.accruedTime * 6);
      playerState.accruedPay = 0;
    }
    if (playerState.accruedPay == 28) {
      playerState.paychecksReady++;
      playerState.accruedPay = 0;
    }
    if (option.paycheck) {
      for (let i = 0; i < playerState.paychecksReady; i++) {
        option.give.push('paycheck');
      }
      playerState.paychecksReady = 0;
    }
  }
  if (option.setProbationTime) {
    playerState.nextProbation = nextProbation(player.time);
  }
  if (option.makeMonday) {
    while(playerState.time.getDay() !== 1 && playerState.time.getHours() !== 8) {
      playerState.time = advanceTime(playerState.time, 1);
    }
  }
  if (option.makeMorning) {
    while(playerState.time.getHours() !== 8) {
      playerState.health -= hoursToHealth(1);
      playerState.time = advanceTime(playerState.time, 1);
    }
  }
  if ((option.failWithoutAny && !playerHasAny(player, option.failWithoutAny)) ||
      (option.failWithoutAll && !playerHasAll(player, option.failWithoutAll))) {
    const neededNames = option.failWithoutAny ? option.failWithoutAny : option.failWithoutAll;
    const needed = neededNames.map((itemName) => state.itemTable[itemName].title);
    playerState.events.unshift({
      title: 'Missing something',
      message: `You are missing some or all of the required items: ${needed.join(', ')}`,
      photo: location,
      schedule: 0,
    });
    dispatch({ player: playerState });
    return;
  }
  if (option.money) {
    const money = randomize(option.money);
    if (money < 0 && (-1 * money) > playerState.money) {
      playerState.events.unshift({
        title: 'Too expensive!',
        message: 'You cannot afford that',
        photo: location,
        schedule: 0,
      });
      dispatch({ player: playerState });
      return;
    }
    playerState.money += money;
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
  if (option.communityservice) {
    playerState.communityservice += option.communityservice;
  }
  if (option.risk && option.risk > Math.random()) {
    playerState.arrests++;
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
  if (option.take) {
    option.take.forEach((item) => {
      const takenIdx = playerState.items.indexOf(item);
      if (takenIdx > -1) {
        playerState.items.splice(takenIdx, 1);
      }
    });
  }
  if (option.give) {
    playerState.items.push(...option.give);
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
  if (playerState.health <= 0) {
    playerState.money = 0;
    playerState.health = 50;
    playerState.hospitalvisits++;
    option.addEvents.unshift({
      schedule: 0,
      animate: 'medical',
      title: 'You were found in the street',
      message: `Weak from hunger and exhaustion, you collapsed on the street. A passerby called
        911 and an ambulance brought you to the emergency room, where you have been discharged
        after a modest meal and a little bit of rest.`,
      photo: 'clinic',
      exitTransaction: {
        travel: 'downtown',
      },
    });
  }
  if (option.nextProbation) {
    playerState.nextProbation = nextProbation(playerState.time);
  }
  if (option.reset) { // the player's life is on a new course.
    playerState.events = [];
    playerState.money = 0;
    playerState.lastMeal = playerState.time;
    playerState.health = 70;
    option.take.push('halfwayhousekey');
  }
  if (option.message || option.messageHTML) {
    option.addEvents.unshift({
      schedule: 0,
      type: 'event',
      title: locationTitle(location),
      message: option.message,
      messageHTML: option.messageHTML,
      photo: location,
      animate: option.animate,
      closeButtonText: option.closeButtonText ? 'Okay' : option.closeButtonText,
      exitTransaction: option.messageExitTransaction ? option.messageExitTransaction : {},
    });
  }
  // must avoid deep copy issues
  if (option.addEvents) {
    option.addEvents.forEach((evt) => playerState.events.push(Object.assign({}, evt)));
  }
  if (option.addLocationEvents) {
    option.addLocationEvents.forEach((evt) => playerState.locationEvents.push(Object.assign({}, evt)));
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
    animate = false,
  },
) => {
  modal.style.display = 'block';
  modal.className = '';
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
    return `<p>${message}</p>`;
  };
  const photoName = photo ? photo : name;
  const renderLateMessage = () => (lateMessage && schedule < 0) ? `<p>${lateMessage}</p>` : '';
  const renderPhoto = () => {
    if (!photoName) {
      return '';
    }
    return `<div class="col-sm-3"><img src="/img/${photoName}.jpg" style="width: 100%"></div>`;
  }
  const mainColSize = photoName ? 'col-sm-9' : 'col-sm-12';
  const render = () => {
    modal.innerHTML = `<div class="choice-box card">
      <div class="section modal-title">
        <h2 class="col-sm-12">${title}</h2>
        ${openHours(hours)}
      </div>
      <div class="container">
        <div class="row">
          ${renderPhoto()}
          <div class="${mainColSize}">
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
          } else {
            dispatch({});
          }
        } else {
          const idx = parseInt(e.target.value);
          transact(state, dispatch, filtered[idx], photoName);
        }
      });
    });
  }
  if (animate) {
    modal.classList.add('animate', animate);
    setTimeout(() => render(), 5000);
  } else {
    render();
  }
}

const nextEvent = (state, dispatch) => {
  const newState = {...state};
  const scheduledEvents = state.player.events.filter((e) => e.schedule <= 0);
  if (scheduledEvents.length == 0) {
    return false;
  }
  const evtIdx = state.player.events.indexOf(scheduledEvents[0]);
  const thisEvt = scheduledEvents.shift();
  const baseEvt = state.events[thisEvt.name] || {};
  const evt = {
    ...baseEvt,
    ...thisEvt,
    hours: [],
    type: 'event',
  };
  newState.player.events.splice(evtIdx, 1);
  const locationOpts = state.visitOptions[evt.location];
  renderModal(newState, dispatch, { ...locationOpts, photo: evt.location, ...evt });
  return true;
};

const visit = (state, dispatch, location, waited = 0) => {
  const { visitOptions, player } = state;
  const { locationEvents } = player;

  if (playerHasWarrant(player) && randomize({ random: 'uniform', min: 0, max: 8}) == 1) {
    return renderModal(
      state,
      dispatch,
      events.powarrant
    );
  }

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
      if (evt.schedule !== undefined && evt.schedule <= 0) {
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
  console.log({
    ...player,
    time: player.time.getTime(),
    lastMeal: player.lastMeal.getTime(),
    nextProbation: player.nextProbation.getTime(),
    lastStrength: player.lastStrength.getTime(),
  });
  const { items, calendar } = player;
  const backpackItems = () => {
    if (items.length == 0) {
      return '<p>Your backpack contains nothing</p>';
    }
    const itemsToList = {};
    items.forEach((key) => {
      const item = itemTable[key];
      if (item.hidden) {
        return;
      }
      if (itemsToList[item.title]) {
        itemsToList[item.title].qty++;
      } else {
        itemsToList[item.title] = { qty: 1, icon: item.icon };
      }
    });
    console.log(itemsToList);
    const htmlList = Object.keys(itemsToList).map((itemName) => {
      const qty = itemsToList[itemName].qty > 1 ? ` (${itemsToList[itemName].qty})` : '';
      return `${itemsToList[itemName].icon} ${itemName}${qty}`;
    });
    const stats = [
      `🔶 Total parole violations: ${player.violations}`,
      `⏲ Community service hours: ${player.communityservice}`,
      `💰 Cash on hand: ${player.money}`,
      `🗓 Days played: ${Math.floor(player.playedHours / 24)}`,
      `🚓 Arrests: ${player.arrests}`,
      `🚑 Hospital visits: ${player.hospitalvisits}`,
    ];
    window.clipshare = () => {
      try {
        const txt = ['Backpack Contents', '', ...htmlList, '', 'Simulation Statistics', '', ...stats];
        navigator.clipboard.writeText(txt.join("\n"));
        document.getElementById('clip-share-result').innerHTML = '👍 Copied!';
        setTimeout(() => document.getElementById('clip-share-result').innerHTML = '', 2500);
      } catch (err) {
        document.getElementById('clip-share-result').innerHTML = ' Cannot copy, select text manually';
      }
    }
    return `
      <h4>Backpack Contents</h4>
      <ul class="bp">${htmlList.map((item) => `<li>${item}</li>`).join('')}</ul>
      <h4>Simulation Statistics</h4>
      <ul class="bp">${stats.map((stat) => `<li>${stat}</li>`).join('')}</ul>
      <button value="x" class="cb-btn small" onclick="clipshare()">Close backpack</button>
      <button id="clip-share" class="small" onclick="clipshare()">📋 Copy results to clipboard</button>
      <span id="clip-share-result"></span>`;
  }
  
  // const calendarItems = () => {
  //   if (calendar.length == 0) {
  //     return '';
  //   }
  //   const itemList = calendar.map((item) => `<li>${item.title}</li>`);
  //   return `<h4>Weekly Calendar</h4>
  //     <ul>${itemList.join('')}</ul>`
  // }
  renderModal(state, dispatch, {
    photo: false,
    title: 'Your Backpack',
    closeButtonText: 'Close your backpack',
    messageHTML: backpackItems(),
    canLeave: false,
  });
}

// wrong arg order
const drawStatusBar = ({ width }, { player, colors, itemTable }, hover = false) => {
  const padding = 5;
  const barHeight = 30;
  ctx.font = 'Bold 14px Arial, sans-serif';
  if (hover) {
    ctx.fillStyle = colors.GRAYER;
  } else if (player.health <= 30) {
    ctx.fillStyle = colors.RED;
  } else {
    ctx.fillStyle = colors.GRAY;
  }
  ctx.fillRect(0, 0, width, barHeight);
  ctx.fillStyle = colors.BLACK;
  const dateTxt = hover ? 'Open backpack' : formatDate(player.time);
  const dateTxtMetrics = ctx.measureText(dateTxt);
  const txtHeight = dateTxtMetrics.fontBoundingBoxAscent;
  const verticalCenter = (barHeight - txtHeight) / 2 + txtHeight;
  ctx.fillText(dateTxt, padding, verticalCenter);
  const itemCount = player.items.filter((item) => !itemTable[item].hidden).length;
  const strengthicon = () => {
    if (player.health > 80) {
      return '😄';
    }
    if (player.health > 50) {
      return '🙂';
    }
    if (player.health > 30) {
      return '😔';
    }
    if (player.health > 15) {
      return '😣';  
    }
    return '😫';
  }
  const statusTxt = `🎒 Items: ${itemCount} | 💰 Money: $${player.money} | ${strengthicon()} Strength: ${player.health}`;
  const statusTxtMetrics = ctx.measureText(statusTxt);
  ctx.fillText( statusTxt, width - statusTxtMetrics.width - padding, verticalCenter);
};

const _shapeInBlock = (scalex, scaley) => (block) => ({
  x: scalex(block.pos[0][0]),
  y: scaley(block.pos[0][1]),
  width: scalex(block.pos[1][0] - block.pos[0][0]),
  height: scaley(block.pos[1][1] - block.pos[0][1]),
});

const drawMap = ({ width, height }, state, dispatch, e) => {
  const { maps, player, colors, itemTable } = state;
  const mapObj = maps[player.map];
  const topmargin = 30;

  ctx.translate(0, 0);
  canvas.style.cursor = 'default';

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

  if (e && e.clientY - rect.top < topmargin) {
    drawStatusBar({ width }, { player, colors, itemTable }, true);
    canvas.style.cursor = 'pointer';
  } else {
    drawStatusBar({ width }, { player, colors, itemTable });
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
        canvas.style.cursor = 'pointer';
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
  });
};

const draw = ({ width, height}, state, dispatch, e) => {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  drawMap({ width, height }, state, dispatch, e);
  ctx.restore();
};

const init = () => {
  const state = {
    ...config(),
  };
  const params = new URLSearchParams(document.location.search);
  const debugState = params.get('state');
  if (debugState) {
    if (debugStates[debugState]) {
      state.player = debugStates[debugState];
    }
  }
  const { width } = canvas.getBoundingClientRect();
  const height = width * (IMGDIMS.HEIGHT / IMGDIMS.WIDTH);
  const dims = { width, height };
  const dispatch = (change) => {
    Object.assign(state, change);
    const e = new CustomEvent('stateChange', {
      detail: { change },
    });
    draw(dims, Object.assign({}, state), dispatch, e);
    if (nextEvent(state, dispatch)) {
      return;
    }
  };
  // handle map hover states
  canvas.onmousemove = (e) => draw(dims, state, dispatch, e);
  canvas.onmouseout = (e) => draw(dims, state, dispatch, e);
  canvas.onclick = (e) => draw(dims, state, dispatch, e);
  // initialize the game
  ctx.scale(1, 1);
  canvas.width = width; // necessary to properly scale
  canvas.height = height;
  // wait for all resources to load before drawing
  const resources = Object.values(bgs);
  const loads = [];
  const loaded = () => {
    loads.push(1);
    if (loads.length == resources.length) {
      draw(dims, state, dispatch);
      dispatch({});
    }
  }
  resources.forEach((im) => im.onload = loaded);
}

init();

})();