import { start_probation } from "./events.js";

const startTime = new Date('January 3, 2022 09:00:00');

const corePlayer = {
  money: 0,
  health: 100,
  map: 'downtown',
  home: 'halfwayhouse',
  time: startTime,
  violations: 0,
  playedHours: 0,
  items: [],
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
  playerEvents: {},
  events: [
    { name: 'outofprison', schedule: 0 },
    { name: 'meetpo', schedule: 0 },
  ],
}

export default [
  {
    ...corePlayer,
    money: 50,
    health: 80,
    map: 'downtown',
    home: 'halfwayhouse',
    items: ['watch', 'ssn', 'halfwayhouseinvite'],
    scenario: 'A',
    playerEvents: {
      outofprison: {
        title: 'Home from Ten Years in Prison',
        message: `You\'ve been in prison for ten years, and today you\'re out on parole to serve out the
          remainder of a sixteen-year sentence. You have $50 you saved from your prison job, and your
          social security card. You received a G.E.D. while in prison. The prison staff put you on a bus
          to Central City, and here you are.`,
        photo: 'jail',
        closeButtonText: 'Next',
      },
    },
    messages: {
      locationParole: 'You have been placed at a halfway house not too far from here. Go there now and settle in. See you next week.',
    },
  },
  {
    ...corePlayer,
    money: 400,
    health: 100,
    map: 'downtown',
    home: 'heightshousing',
    items: ['watch', 'ssn', 'rentalkey', 'birthcertificate', 'halfwayhouseinvite'],
    scenario: 'B',
    playerEvents: {
      outofprison: {
        title: 'Home from Two Years in Prison',
        message: `You\'ve been in prison for one year, and today you\'re out on parole to serve out the
          remainder of an 18 month sentence. You have $400 you saved, and you have your birth certificate
          and social security card, but your driver's license expired while you were incarcerated. The prison
          staff put you on a bus to Central City, and here you are.`,
        photo: 'jail',
        closeButtonText: 'Next',
      },
    },
    messages: {
      locationParole: 'You have been placed at a halfway house not too far from here. Go there now and settle in. See you next week.',
    },
  },
];