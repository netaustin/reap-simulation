(() => {

/*
TODO:

Friday
- Residential maps
- Transit between maps, pick between walk or subway
- Clock advances with activity
- Health decreases if you don't eat

Saturday
- Food solves health problems
- Have other possessions, clicking top bar shows them
- Possessions unlock activities

Sunday
- Final scripts
*/

// kill these
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let { width, height } = canvas.getBoundingClientRect();

const config = () => {
  cfg = [];

  const govtHours = [false, [8, 15], [8, 15], [8, 15], [8, 15], [8, 15], false];
  const commerceHours = [[8, 19], [7, 21], [7, 21], [7, 21], [7, 21], [7, 21], [8, 20]];
  const churchHours = [[8, 13], [10, 16], [10, 21], [10, 16], [10, 16], [10, 16], [11, 15]];

  const colors = {
    WHITE: '#ffffff',
    BLACK: '#000000',
    GRAY: '#dddddd',
    PINK: '#ba8f95',     // used by non-profits
    YELLOW: '#ffbe0b',   // used by governments
    GREEN: '#4daa57',    // used by parks
    RED: '#fc440f',      // used by healthcare
    BLUE: '#01baef',     // used by transit
    DARKBLUE: '#4169e1', // used by housing
    PURPLE: '#8e7dbe',   // used by commerce
    BROWN: '#826754',    // used by workplaces
  };

  const maps = {
    downtown: [
      // top row
      { row: 0, col: 0, name: 'jail', fillStyle: colors.YELLOW, title: 'City Jail', },
      { row: 0, col: 1, name: 'courthouse', fillStyle: colors.YELLOW, title: 'Courthouse', },
      { row: 0, col: 2, name: 'countyclerk', fillStyle: colors.YELLOW, title: 'County Clerk', },
      { row: 0, col: 3, name: 'church', fillStyle: colors.PINK, title: 'St. Jude\'s Church', },
      { row: 0, col: 4, name: 'shelter', fillStyle: colors.DARKBLUE, title: 'Homeless Shelter', },
      // second row
      { row: 1, col: 0, name: 'dmv', fillStyle: colors.YELLOW, title: 'DMV', },
      { row: 1, col: 1, rowspan: 2, colspan: 2, name: 'park', title: 'Buchanan Square Park', fillStyle: colors.GREEN, },
      { row: 1, col: 3, colspan: 2, name: 'clinic', fillStyle: colors.RED, title: 'Medical Center', },
      // third row
      { row: 2, col: 0, name: 'bank', fillStyle: colors.PURPLE, title: 'First City Bank', },
      { row: 2, col: 3, name: 'shoppingcenter', fillStyle: colors.PURPLE, title: 'Shopping Center', },
      { row: 2, col: 4, rowspan: 2, name: 'warehouse', title: 'Savealot Warehouse', fillStyle: colors.BROWN, },
      // fourth row
      { row: 3, col: 0, name: 'employment', title: 'Career Center', fillStyle: colors.PINK, },
      { row: 3, col: 1, name: 'downtownstation', fillStyle: colors.BLUE, title: 'Metro Station', },
      { row: 3, col: 2, name: 'joescafe', fillStyle: colors.PURPLE, title: 'Joe\'s Cafe', },
      { row: 3, col: 3, name: 'plasma', fillStyle: colors.RED, title: 'Plasma Bank', },
    ],
    heights: [
      { row: 0, col: 0, name: 'chancesbar', title: 'Chance\'s Bar and Grill', fillStyle: colors.PURPLE, },
      { row: 0, col: 1, rowspan: 2, name: 'construction', title: 'Acme Construction Co.', fillStyle: colors.BROWN, },
      { row: 0, col: 2, name: 'halfwayhouse', title: 'Halfway Home', fillStyle: colors.DARKBLUE, },
      { row: 0, col: 3, name: 'playground', title: 'Playground', fillStyle: colors.GREEN, },
      { row: 0, col: 4, name: 'police', title: 'Police Precinct', fillStyle: colors.YELLOW, },
    
      { row: 1, col: 0, name: 'diner', title: 'Jane\'s Diner', fillStyle: colors.PURPLE, },
      { row: 1, col: 2, colspan: 2, name: 'heightshousing', title: 'Heights Public Housing', fillStyle: colors.DARKBLUE, },
      { row: 1, col: 4, title: 'Shop \'n Stuff Grocery', name: 'grocery', fillStyle: colors.PURPLE, },
    
      { row: 2, col: 0, name: 'discountmedical', title: 'Discount Medical', fillStyle: colors.RED, },
      { row: 2, col: 1, colspan: 2, name: 'heightspark', title: 'Heights Park', fillStyle: colors.GREEN, },
      { row: 2, col: 3, name: 'pawnshop', title: 'Rick\'s Pawn Shop', fillStyle: colors.PURPLE, },
      { row: 2, col: 4, rowspan: 2, name: 'janitorservices', fillStyle: colors.BROWN, title: 'Janitor Services', },
    
      { row: 3, col: 0, name: 'heightschurch', fillStyle: colors.PINK, title: 'Heights Baptist Church', },
      { row: 3, col: 1, name: 'heightsstation', fillStyle: colors.BLUE, title: 'Metro Station', },
      { row: 3, col: 2, name: 'probation', fillStyle: colors.YELLOW, title: 'Probation Office', },
      { row: 3, col: 3, name: 'counseling', fillStyle: colors.PINK, title: 'Counseling Center', },
    ],
  };

  const visitOptions = {
    cityJail: {
      message: 'You would rather not be here.',
    },
    courthouse: {
      message: 'You can pay restitution here.',
      hours: govtHours,
      options: [
        {
          title: 'Pay restitution ($200)',
          money: -200,
          give: { name: 'rreceipt', title: 'Restitution Receipt', quantity: 1 },
        },
      ],
    },
    countyclerk: {
      message: 'Welcome to the County Clerk\'s office.',
      hours: govtHours,
      options: [
        {
          title: 'Order a copy of your birth certificate ($35)',
          withoutAny: ['birthcertificate', 'birthcertificatereceipt'],
          money: -35,
          time: 2,
          addEvents: [
            {
              message: 'Check back in a week for your birth certificate.',
              schedule: 0,
              photo: 'countyclerk',
              title: 'Have a nice day',
              closeButtonText: 'Okay',
              exitTransaction: {
                'give': { name: 'birthcertificatereceipt', quantity: 1, title: 'Birth Certificate Order Receipt' },
              },
            },
          ],
          addLocationEvents: [
            {
              location: 'countyclerk',
              schedule: (24 * 7),
              time: 1,
              message: 'Here is your birth certificate',
              closeButtonText: 'Take the birth certificate',
              exitTransaction: {
                'take': 'birthcertificatereceipt',
                'give': { name: 'birthcertificate', quantity: 1, title: 'Birth Certificate' }
              }
            }
          ]
        },
        {
          title: 'Buy a seasonal fishing license ($80)',
          withoutAny: ['id'],
          money: -80,
          give: { name: 'fishinglicense', title: 'Fishing License', quantity: 1 },
          time: 2,
        },
      ],
      exitTransaction: {
        time: 2,
      },
    },
    church: {
      message: `Welcome to St. Jude\'s Episcopal Church. We serve a free hearty
        meal on Saturdays from 10-1, and twelve-step groups meet here weekly.`,
      options: [
        {
          title: 'Wait in line for a healthy, hearty meal',
          hours: [false, false, false, false, false, false, [10, 13]],
          health: 10,
          time: 2,
        },
        {
          title: 'Attend Narcotics Anonymous',
          hours: [false, false, [19, 20], false, false, false, false],
          give: { name: 'nacard', title: 'Narcotics Anonymous Voucher' },
          health: 10,
          time: 2,
        },
        {
          title: 'Put something in the collection box ($5)',
          money: -5,
        },
        {
          title: 'Steal the collection box',
          randMoney: 50,
          risk: 0.45,
        },
      ]
    },
    plasma: {
      message: 'Donate plasma for cash! Once every three days. If you donated recently you cannot donate again. It takes three hours to donate.',
      options: [
        {
          title: 'Donate ($35)',
          money: 35,
          time: 36,
          health: -10,
          without: ['plasmacard'],
          give: { name: 'plasmacard', title: 'Plasma Contribution Receipt',},
          addEvents: [{
            schedule: 3, // need to wipe out cards on reset
            title: 'Plasma Bank Here!',
            photo: 'plasma',
            message: 'You can donate plasma again. Our community\'s need is as grave as ever!',
            exitTransaction: {
              take: 'plasmacard',
            },
          }],
        }
      ],
    },
    diner: {
      message: 'Enjoy a big plate of greasy fries.',
      options: [
        {
          title: 'The fries, please! ($5)',
          time: 1,
          money: -5,
          health: 5,
        },
        {
          title: 'Turkey club and a greek salad! ($11)',
          time: 1,
          money: -11,
          health: 11,
        },
      ],
    },
    halfwayhouse: {
      message: 'A safe place for a good night\'s sleep.',
      options: [
        {
          title: 'Go to bed',
          time: 8,
          health: 7,
        },
      ],
    },
    downtownstation: {
      message: 'Take our beautiful and clean light rail to Uptown Heights!',
      // cantLeave: 'The metro station is closed',
      options: [
        {
          title: 'Sure! ($3)',
          money: -3,
          travel: 'heights',
          time: 1,
        },
        {
          title: 'Jump the turnstile ($0)',
          risk: 0.2,
          time: 1,
          travel: 'heights',
        },
        {
          title: 'No thanks, I\'ll walk (3h)',
          travel: 'heights',
          health: 1,
          time: 3,
        },
      ],
    },
    park: {
      message: 'Take a walk in beautiful Buchanan Park',
      options: [
        {
          title: 'Spend a quiet hour here',
          health: 2,
          time: 1,
        },
        {
          title: 'Pick a pocket',
          health: -3,
          time: 1,
          randMoney: 80,
          risk: 0.25,
        },
      ]
    },
    // things happen in the heights
    heightsstation: {
      message: 'Take our beautiful and clean light rail Downtown!',
      options: [
        {
          title: 'Sure! ($3)',
          money: -3,
          travel: 'downtown',
        },
        {
          title: 'Jump the turnstile ($0)',
          risk: 0.2,
          travel: 'downtown',
        },
        {
          title: 'No thanks, I\'ll walk (3h)',
          travel: 'downtown',
          health: -2,
          time: 3,
        }
      ],
    },
    pawnshop: {
      message: 'You can sell Rick your stuff, and he\'ll give you a "fair" price.',
      hours: [false, [10, 19], [10, 19], [10, 19], [10, 19], [10, 21], [10, 21]],
      options: [
        {
          title: 'Sell your grandfather\'s watch for $75',
          money: 75,
          health: -10,
          time: 1,
          with: ['watch'],
          take: 'watch',
        },
      ],
    },
  };
  const jailed = {
    title: 'You are in jail',
    photo: 'jail',
    message: 'We\'ll let you know when your next court appearance is. Until then, sit tight.',
    schedule: 0,
    exitTransaction: {
      makeMorning: true,
      setHealth: 80,
      time: 1,
    },
  };
  const start_probation = {
    location: 'probation',
    schedule: 2,
    late: -1,
    time: 1,
    lateMessage: 'You\'re late.',
    messageHTML: `
      <p>I'm your probation officer. We will meet at least once each week
      during the first month of your probation.</p>
      <ul>
        <li>Being late to an appointment is a violation of your probation.</li>
        <li>You have been placed in a Halfway House, not too far from here.</li>
        <li>You must find work within thirty days and begin paying half of your income in rent.</li>
        <li>Each week, you must attend Narcotics Anonymous and Anger Management Therapy.</li>
        <li>You must also complete a Urinalysis (UA) test each week.</li>
        <li>Within your first month, you must pay $200 in restitution at the Courthouse.</li>
        <li>Here's a schedule to put in your backpack (click on "items", top right).</li>
      </ul>
      <p>Go directly to the halfway house and settle in, and I will see you next week.</p>`,
    exitTransaction: {
      addToCalendar: [
        { name: 'na1', title: '7pm Tuesday: Narcotics anonymous at St. Jude\'s Church', },
        { name: 'na2', title: '9pm Tuesday: Narcotics anonymous at Heights Church', },
        { name: 'angerManagement', title: '10am Friday: Anger Management at Counseling Center', },
      ],
      time: 1,
    },
  };
  const restart_probation = {
    title: 'Restart Probation',
    photo: 'probation',
    message: 'You are out of jail, and you need to report to the probation office within the hour.',
    schedule: 0,
    exitTransaction: {
      addLocationEvents: [{
        ...start_probation,
        schedule: 0,
        exitTransaction: {},
        messageHTML: `<p>Are you ready to try this again? The same provisions of your probation still
          apply, but unfortunately there is not a housing placement available for you, so you will need
          to arrange for your own housing. I will see you next week.</p>`,
        lateMessage: 'This is unacceptable. You cannot be late to probation appointments.',
      }],
    }
  };
  const guilty_transaction = {
    time: (6 * 24 * 7),
    makeMonday: true,
    setHealth: 70,
    addEvents: [ restart_probation ],
  };
  const guilty_sentence = {
    title: 'Sentencing',
    photo: 'courthouse',
    message: 'The court accepts your plea and sentences you to six weeks in the city jail',
    schedule: 0,
    exitTransaction: guilty_transaction,
  };
  const not_guilty_sentence = {
    ...guilty_sentence,
    message: 'The court finds you guilty and sentences you to eighteen weeks in jail.',
    exitTransaction: { ...guilty_transaction, time: (18 * 24 * 7) },
  };
  const arraignment = {
    title: 'Arraignment',
    photo: 'courthouse',
    schedule: 0,
    message: `You are charged with a crime. Considering your recent release from
      prison, I am setting your bond to $10,000 and sending you back to jail,
      pending a trial, which is scheduled for six weeks from today. If you
      wish to accept a plea bargain, you may do so now.`,
    options: [
      {
        title: 'Plead guilty and spend the next six weeks in jail.',
        addEvents: [
          guilty_sentence,
        ],
      },
      {
        title: 'Plead not guilty',
        addEvents: [
          {
            ...jailed,
            exitTransaction: {
              addEvents: [ not_guilty_sentence ],
              time: 5 * 24 * 7,
              setHealth: 70,
              makeMonday: true,
            }, 
          },
        ],
      }
    ],
  };
  const events = {
    outofprison: {
      title: 'Home from Ten Years in Prison',
      message: `You\'ve been in prison for ten years, and today you\'re out on
        probation. You have $100 you saved from your prison job, and your
        social security card. You received a G.E.D. while in prison. The prison
        staff put you on a bus to Central City, and here you are.`,
      photo: 'jail',
      closeButtonText: 'Next',
    },
    meetpo: {
      title: 'Meet your Probation Officer',
      message: `You have to check in with your probation officer at 11am. The
        probabation office in in Uptown Heights, so you'll need to figure out
        how to get there quickly.`,
        photo: 'probation',
      closeButtonText: 'Get Started',
    },
    arrest: {
      title: 'Hold it right there!',
      message: 'You\'re on probation? I have to take you to jail.',
      photo: 'police',
      violation: true,
      exitTransaction: {
        reset: true,
        time: 1,
        addEvents: [ jailed, arraignment ],
      },
    },
  };
  const player = {
    money: 100,
    health: 100,
    map: 'downtown',
    home: 'halfwayhouse',
    time: new Date('January 3, 2022 09:00:00'),
    violations: 0,
    items: [
      { name: 'ssn', title: 'Social Security Card', quantity: 1 },
      { name: 'watch', title: 'Your grandfather\'s gold watch', quantity: 1 },
    ],
    locationEvents: [
      start_probation,
    ],
    calendar: [],
    events: [
      { name: 'outofprison', schedule: 0 },
      { name: 'meetpo', schedule: 0 },
    ],
  };
  return { colors, maps, visitOptions, events, player };
};

const advanceTime = (time, hours) =>
  new Date(time.getTime() + (hours * 3600000));

const transact = ({ player }, dispatch, rawOption) => {
  const option = {
    money: 0,
    travel: '',
    health: 0,
    time: 0,
  };
  Object.assign(option, rawOption);
  const playerState = Object.assign({}, player);
  playerState.money += option.money;
  if (option.time) {
    const scheduleEvents = (e, time) => {
      e.schedule -= time;
      return e;
    }
    playerState.time = advanceTime(playerState.time, option.time);
    playerState.health -= option.time;
    playerState.events = playerState.events.map((e) => scheduleEvents(e, option.time));
    playerState.locationEvents = playerState.locationEvents.map((e) => scheduleEvents(e, option.time));
  }

  if (option.reset) { // the player's life is on a new course.
    playerState.events = [];
    playerState.locationEvents = [];
    playerState.money = 0;
  }
  if (option.travel) {
    playerState.map = option.travel;
  }
  if (option.health) {
    playerState.health += option.health;
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
  if (option.give) {
    playerState.items.push(option.give);
  }
  if (option.take) {
    const taken = playerState.items.find((item) => item.name == option.take);
    const takenIdx = playerState.items.indexOf(taken);
    playerState.items.splice(takenIdx, 1);
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
  if (option.makeMonday) {
    while(playerState.time.getDay() !== 1) {
      playerState.time = advanceTime(playerState.time, 1);
    }
    option.makeMorning = true;
  }
  if (option.makeMorning) {
    while(playerState.time.getHours() !== 9) {
      playerState.time = advanceTime(playerState.time, 1);
    }
  }
  if (option.setHealth) {
    playerState.health = option.setHealth;
  }
  dispatch({ player: playerState });
};

const time_between = (time, hoursByDay) => {
  const dow = time.getDay();
  const hours = hoursByDay[dow];
  const current = time.getHours() || [0, 0];
  return (current >= hours[0] && current < hours[1]);
};

const filter_options = ({ player }, options) => {
  const final = [];
  const missing = (items) =>
    items.filter((item) => !player.items.find((playerItem) => playerItem.name == item));
  // some options require the user to possess, or not possess, an item.
  return options.filter((opt) => {
    if (opt.with) {
      if (missing(opt.with).length) {
        return false;
      }
    }
    if (opt.without) {
      if (missing(opt.without).length !== opt.without.length) {
        return false;
      }
    }
    if (opt.withoutAny) {
      if (missing(opt.withoutAny).length < opt.withoutAny.length) {
        return false;
      }
    }
    if (opt.hours) {
      if (!time_between(player.time, opt.hours)) {
        return false;
      }
    }
    return true;
  })
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
  },
) => {
  modal.style.display = 'block';
  const closeModal = () => {
    modal.innerHTML = '';
    modal.style.display = 'none';
  };
  const isClosed = (hours && !time_between(state.player.time, hours));
  const filtered = filter_options(state, options);
  const transactButtons = () => {
    if (isClosed) {
      return '';
    }
    return filtered.map(
      (opt, i) => {
        const disabled = (opt.money && opt.money < 0 && (-1 * opt.money) > state.player.money) ? 'disabled' : '';
        return `<div class="button-group vertical">
          <button ${disabled} class="vertical cb-btn" value="${i}">${opt.title}</button>
        </div>`
      }
    ).join('');
  }
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
    if (visit.cantLeave) {
      return `<div class="button-group vertical">
        <button disabled>${visit.cantLeave}</button>
      </div>`;
    } else {
      return `<div class="button-group vertical">
        <button value="x" class="vertical cb-btn">${makeButtonText()}</button>
      </div>`;
    }
  }
  const renderMessage = () => {
    if (isClosed) {
      return '<p><em>We are currently closed.</em></p>'
    }
    if (message.length == 0 && messageHTML.length == 0) {
      return '<p>Nothing to do here.</p>';
    }
    return message ? `<p>${message}</p>` : messageHTML;
  }
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
            ${renderMessage()}
            ${transactButtons()}
            ${leaveButton()}
          </div>
        </div>
      </div>
    </div>`;
    document.querySelectorAll('.cb-btn').forEach(item => {
      item.addEventListener('click', e => {
        closeModal();
        onComplete();
        if (e.target.value == 'x') {
          if (exitTransaction) {
            transact(state, dispatch, exitTransaction);
          }
        } else {
          const idx = parseInt(e.target.value);
          transact(state, dispatch, filtered[idx]);
        }
      });
    });
}

const nextEvent = (state, dispatch) => {
  const { player, events, colors } = state;
  const scheduledEvents = player.events.filter((e) => e.schedule <= 0);
  if (scheduledEvents.length == 0) {
    return false;
  }
  const evtIdx = scheduledEvents.indexOf(scheduledEvents[0]);
  const thisEvt = scheduledEvents.shift();
  const evt = events[thisEvt.name] || {};
  const baseEvt = {
    schedule: 0,
    fillStyle: colors.GRAY,
    type: 'event',
  };
  evt.onComplete = () => {
    player.events.splice(evtIdx, 1);
    dispatch({ player });
  };
  renderModal(state, dispatch, { ...baseEvt, ...evt, ...thisEvt });
  return true;
};

const visit = (state, dispatch, location) => {
  const { visitOptions, player } = state;
  const { locationEvents } = player;
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
  const { player } = state;
  const { items, calendar } = player;
  const backpackItems = () => {
    if (items.length == 0) {
      return '<p>Your backpack contains nothing</p>';
    }
    const itemQt = (qt) => qt > 1 ? `(${qt})` : '';
    const itemList = items.map((item) => `<li>${item.title} ${itemQt(item.quantity)}</li>`);
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

const drawStatusBar = ({ player, colors }) => {
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
  const statusTxt = `Items: ${player.items.length} | Money: $${player.money} | Health: ${player.health}`;
  const statusTxtMetrics = ctx.measureText(statusTxt);
  ctx.fillText( statusTxt, width - statusTxtMetrics.width - padding, verticalCenter);
};

const drawMapTitle = ({ colors }, title, x, y) => {
  const textmargin = 4;
  const metrics = ctx.measureText(title);
  ctx.fillStyle = colors.WHITE;
  ctx.fillText(title, x + textmargin, y + textmargin + metrics.fontBoundingBoxAscent);
};

const _shapeInBlock = (blockWidth, blockHeight, padding) => (block) => {
  shape = {};
  shape.x = block.col * (blockWidth + padding);
  shape.y = block.row * (blockHeight + padding);
  if (block.colspan == 1) {
    shape.width = blockWidth;
  } else {
    shape.width = ((blockWidth + padding) * block.colspan) - padding;
  }
  if (shape.rowspan == 1) {
    shape.height = blockHeight;
  } else {
    shape.height = ((blockHeight + padding) * block.rowspan) - padding;
  }
  return shape;
};

const drawMap = (state, dispatch, e) => {
  if (nextEvent(state, dispatch)) {
    return;
  }
  const { maps, player, colors } = state;
  const mapObj = maps[player.map];
  const topmargin = 35;
  const padding = 5;
  const rows = 4;
  const cols = 5;
  const blockWidth = (width / cols) - (padding * ((cols - 1) / cols));
  const blockHeight = ((height - (topmargin)) / rows) - (padding * ((rows - 1) / rows));
  const shapeInBlock = _shapeInBlock(blockWidth, blockHeight, padding);
  ctx.translate(0, topmargin);

  const rect = canvas.getBoundingClientRect();
  ctx.font = '14px Arial, sans-serif';

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
    ctx.fillStyle = block.fillStyle;
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    if (e) {
      const ex = e.clientX - rect.left,
        ey = e.clientY - rect.top;
      if (ctx.isPointInPath(ex, ey)) {
        if (e.type == 'click') {
          visit(state, dispatch, block);
          return;
        }
        ctx.beginPath(); // start over
        // this is what we have to do to get an "inner stroke"
        ctx.lineWidth = 2;
        ctx.rect(shape.x + 2, shape.y + 2, shape.width - 4, shape.height - 4);
        ctx.strokeRect(shape.x + 2, shape.y + 2, shape.width - 4, shape.height - 4);
      }
    }
    // ctx.rect(shape.x, shape.y, shape.width, shape.height);
    // to handle map interaction
    block.coordinates = shape;
    ctx.fill();
    drawMapTitle(state, block.title, shape.x, shape.y);
  });
};

const draw = (state, dispatch, e) => {
  ctx.clearRect(0, 0, width, height);
  drawStatusBar(state, dispatch, e);
  ctx.save();
  drawMap(state, dispatch, e);
  ctx.restore();
};

const init = () => {
  const state = {
    ...config(),
  };
  const dispatch = (change) => {
    Object.assign(state, change);
    const e = new CustomEvent('stateChange', {
      detail: { change },
    });
    draw(Object.assign({}, state), dispatch, e);
  };
  // handle map hover states
  canvas.onmousemove = (e) => draw(state, dispatch, e);
  canvas.onmouseout = (e) => draw(state, dispatch, e);
  canvas.onclick = (e) => draw(state, dispatch, e);
  // initialize the game
  ctx.scale(1, 1);
  canvas.width = width; // necessary to properly scale
  canvas.height = (width - 3) * 0.8;
  height = canvas.height;
  draw(state, dispatch);
}

init();

})();