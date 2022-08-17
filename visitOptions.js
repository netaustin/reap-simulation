import { govtHours, churchHours, commerceHours, allHours, lateHours, } from './places/hours.js';

/*
randomStruct = { random: 'uniform', min: int, max: int }
randomStruct = int

location = {
  message: '',
  title: '',
  hours: [],
  wait: randomStruct,
  maxHunger: int,
  options: [
    {
      title: str,
      money: int,
      health: int,
      food: bool,
      hideWithAny: [],
      hideWithoutAny: [],
      hideWithoutAll: [],
      failWithoutAny: [],
      failWithoutAll: [],
      addEvents: [
        event
      ]
    }
  ]
}
*/

export const visitOptions = {
  jail: {
    hours: allHours,
    message: 'You would rather not be here.',
  },
  courthouse: {
    message: 'You can pay restitution here.',
    hours: govtHours,
    options: [
      {
        title: 'Pay restitution ($200)',
        money: -200,
        give: ['restitutionreceipt'],
      },
    ],
  },
  countyclerk: {
    message: 'Welcome to the County Clerk\'s office.',
    maxHunger: 24,
    hours: govtHours,
    wait: { random: 'uniform', min: 1, max: 4, },
    options: [
      {
        title: 'Order a copy of your birth certificate ($35)',
        hideWithAny: ['birthcertificate', 'birthcertificatereceipt'],
        failWithoutAll: ['ssn'],
        money: -35,
        wait: { random: 'uniform', min: 1, max: 4, },
        addEvents: [
          {
            message: 'Check back in a week for your birth certificate.',
            schedule: 0,
            location: 'countyclerk',
            title: 'Have a nice day',
            closeButtonText: 'Okay',
            exitTransaction: {
              'give': ['birthcertificatereceipt']
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
              'take': ['birthcertificatereceipt'],
              'give': ['birthcertificate'],
            }
          }
        ]
      },
      {
        title: 'Buy a seasonal fishing license ($80)',
        failWithoutAll: ['id'],
        money: -80,
        give: ['fishinglicense'],
      },
    ],
  },
  dmv: {
    message: 'Welcome to the DMV, please take a number!',
    hours: govtHours,
    wait: { random: 'uniform', min: 1, max: 4, },
    options: [
      {
        title: 'Apply for a State ID ($14)',
        failWithoutAll: ['ssn', 'birthcertificate'],
        money: -14,
        give: ['stateid'],
      },
    ],
  },
  church: {
    message: `Welcome to St. Jude\'s Episcopal Church. We serve a free hearty
      meal on Saturdays from 10-1, and twelve-step groups meet here weekly.`,
    options: [
      {
        // actually wait?
        title: 'Wait in line for a healthy, hearty meal',
        hours: [false, false, false, false, false, false, [10, 13]],
        health: 15,
        food: true,
        time: 3,
      },
      {
        title: 'Attend Narcotics Anonymous',
        hours: [false, false, [19, 20], false, false, false, false],
        give: ['navoucher'],
        health: 2,
        time: 2,
      },
      {
        title: 'Put something in the collection box ($5)',
        money: -5,
      },
      // {
      //   title: 'Steal the collection box',
      //   randMoney: 50,
      //   risk: 0.45,
      // },
    ]
  },
  shelter: {
    hours: [[16, 20], [16, 20], [16, 20], [16, 20], [16, 20], [16, 20], [16, 20]],
    wait: 2,
    message: 'You must check in then and stay all night without leaving. We serve a hot dinner and a cold breakfast. You may not stay here if you have a primary residence.',
    options: [
      {
        title: 'Check in and stay the night.',
        hideWithAny: ['halfwayhousekey', 'halfwayhouseinvite'],
        health: 12,
        makeMorning: true,
      },
    ],
  },
  bank: {
    hours: govtHours,
    message: 'An imposing bank full of imposing people',
    wait: 1,
    options: [
      {
        title: 'Open a bank account',
        time: 1,
        failWithoutAll: ['stateid'],
        give: ['debitcard'],
      },
    ],
  },
  plasma: {
    hours: commerceHours,
    wait: { random: 'uniform', min: 1, max: 3 },
    message: 'Donate plasma for cash! Once every three days. If you donated recently you cannot donate again. It takes three hours to donate.',
    options: [
      {
        title: 'Donate ($35)',
        money: 35,
        time: 3,
        health: -10,
        hideWithAny: ['plasmacard'],
        give: ['plasmacard'],
        addEvents: [{
          schedule: 36, // need to wipe out cards on reset
          title: 'Plasma Bank Here!',
          location: 'plasma',
          message: 'You can donate plasma again. Our community\'s need is as urgent as ever!',
          exitTransaction: {
            take: ['plasmacard'],
          },
        }],
      }
    ],
  },
  shoppingcenter: {
    hours: commerceHours,
    message: 'A once-great vertical shopping mall.',
    options: [
      {
        title: 'Buy work boots ($50)',
        money: -50,
        time: 1,
        give: ['workboots'],
      },
      {
        title: 'Grab a candy bar and a soda pop ($4)',
        food: true,
        health: 4,
        money: -4,
        time: 1,
      },
      {
        title: 'Walk around the mall for an hour',
        health: 1,
        time: 1,
      },
    ],
  },
  employment: {
    hours: govtHours,
    message: 'Learn about your career options and find a job',
    wait: { random: 'uniform', min: 2, max: 4, },
    options: [
      {
        title: 'Ask about a job',
        failWithoutAll: ['stateid'],
      },
    ],
  },
  pronto: {
    hours: commerceHours,
    message: 'Welcome to Pronto a Mangiare. It means "Ready to Eat" in Italian.',
    options: [
      {
        title: 'Panini ($11)',
        food: true,
        health: 18,
        time: 1,
      },
    ],
  },
  chancesbar: {
    message: 'Have a beer and so much more!',
    hours: lateHours,
    options: [
      {
        title: 'Have a beer ($4)',
        health: -2,
        time: 1,
        money: -4
      },
      {
        title: 'Ask how to make some money',
        addEvents: [
          {
            schedule: 0,
            location: 'chancesbar',
            title: 'Try to make some money',
            message: `You recognize someone from your distant past. He asks if you want
              to make $50 running an errand. You know the risks.`,
            options: [
              {
                title: 'Do the job',
                risk: 0.4,
                money: 50,
              }
            ],
            closeButtonText: 'No thanks',
          }
        ]
      }
    ]
  },
  diner: {
    message: 'Enjoy a big plate of greasy fries.',
    hours: allHours,
    options: [
      {
        title: 'Fries, please ($5)',
        time: 1,
        money: -5,
        health: 14,
      },
      {
        title: 'Turkey club and a greek salad ($12)',
        time: 1,
        money: -11,
        health: 34,
      },
    ],
  },
  halfwayhouse: {
    message: 'A safe place for a good night\'s sleep.',
    options: [
      {
        title: 'Check in and Unpack',
        hours: [false, [11, 16], [11, 16], [11, 16], [11, 16], [11, 16], false],
        hideWithoutAll: ['halfwayhouseinvite'],
        take: ['halfwayhouseinvite'],
        give: ['halfwayhousekey'],
        time: 1,
      },
      {
        title: 'Go to bed',
        hideWithoutAll: ['halfwayhousekey'],
        health: 7,
        hours: [[17, 22], [17, 22], [17, 22], [17, 22], [17, 22], [17, 22], [17, 22]],
        makeMorning: true,
      },
      {
        title: 'Relax for an hour',
        hideWithoutAll: ['halfwayhousekey'],
        time: 1,
        health: 1,
      },
      {
        title: 'Get advice from your roommate',
        hideWithoutAll: ['halfwayhousekey'],
        time: 1,
        addEvents: [{
          schedule: 0,
          photo: 'halfwayhouse',
          title: 'Free advice',
          message: {
            random: 'rotate', // TODO: rename random
            key: 'hhadvice',
            values: [
              `Try to do whatever your PO tells you, they can make your life really hard.`,
              `You gotta eat enough to live. Everything else can wait, unless it can't.`,
              `Don't bother me right now.`,
            ],
          },
          exitTransaction: {
            incrementKey: 'hhadvice',
          },
        }],
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
        health: -8,
        time: 3,
      },
    ],
  },
  park: {
    message: 'Take a walk in beautiful Buchanan Park, the Jewel of Central City',
    options: [
      {
        title: 'Spend a quiet hour here',
        health: 2,
        time: 1,
      },
      {
        title: 'Curl up for the night',
        health: -2,
        time: 8,
      },
      // {
      //   title: 'Pick a pocket',
      //   health: -3,
      //   time: 1,
      //   randMoney: 80,
      //   risk: 0.25,
      // },
    ]
  },
  heightspark: {
    message: 'More concrete than grass...',
    options: [
      {
        title: 'Kill an hour',
        health: 0,
        time: 1,
      },
      {
        title: 'Curl up for the night',
        health: 5,
        time: 8,
      },
    ]
  },
  heightsstation: {
    message: 'Take our beautiful and clean light rail Downtown!',
    options: [
      {
        title: 'Sure! ($3)',
        money: -3,
        travel: 'downtown',
        time: 1,
      },
      {
        title: 'Jump the turnstile ($0)',
        risk: 0.2,
        travel: 'downtown',
        time: 1,
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
        hideWithoutAll: ['watch'],
        take: 'watch',
      },
      {
        title: 'Buy a familiar-looking watch for $190',
        money: -190,
        time: 1,
        hideWithAny: ['watch'],
        give: ['watch'],
      },
    ],
  },
  probation: {
    hours: govtHours,
    options: [
      {
        title: 'Check in with your Probation Officer',
        time: 2,
        poreview: true,
      }
    ]
  },
  discountmedical: {
    hours: [false, [8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [10, 14]],
    wait: 1,
    message: 'Our motto: "Here\'s the cup, you know what to do!"',
    options: [
      {
        title: 'Get a urinalysis test for probation ($25)',
        money: -25,
        failWithoutAll: ['pouareq'],
        take: ['pouareq'],
        giveOne: { pouapass: 0.9, pouafail: 1.0, },
        time: 1,
      },
      {
        title: 'Get a work urinalysis and physical ($40)',
        money: -40,
        hideWithoutAll: ['jobuareq'],
        take: ['jobuareq'],
        giveOne: { jobuapass: 0.9, jobuafail: 1.0, },
        time: 1,
      },
    ],
  },
  clinic: {
    hours: [[10, 18], [7, 21], [7, 21], [7, 21], [7, 21], [7, 21], [10, 18]],
    wait: { random: 'uniform', min: 1, max: 2, },
    message: 'A busy urban hospital with a walk-in clinic.',
    options: [
      {
        title: 'Get a urinalysis test for probation ($21)',
        money: -21,
        failWithoutAll: ['pouareq'],
        take: ['poouareq'],
        giveOne: { pouapass: 0.7, pouafail: 1.0, },
        time: 1,
      },
      {
        title: 'Get a urinalysis and physical for work ($34)',
        money: -34,
        hideWithoutAll: ['jobuareq'],
        take: ['jobuareq'],
        giveOne: { jobuapass: 0.7, jobuafail: 1.0, },
        time: 1,
      },
    ],
  },
  counseling: {
    hours: [false, [8, 21], [8, 21], [8, 21], [8, 21], [8, 21], false],
    message: 'Specializing in group and 1:1 therapy. Group therapy sessions are 4-5pm Mondays, Wednesdays, and Fridays, and 7-8pm on Tuesdays and Thursdays.',
    options: [
      {
        title: 'Attend group therapy',
        hours: [false, [16, 17], [19-20], [16, 17], [19-20], [16, 17], false],
        hideWithAny: ['counselingvoucher'],
        give: ['counselingvoucher'],
      },
    ],
  },
  warehouse: {
    hours: [[5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23],],
    message: 'You don\'t work here.',
  },
  construction: {
    hours: [[5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23],],
    message: 'You don\'t work here.',
  },
  janitorservices: {
    hours: [[5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23],],
    message: 'You don\'t work here.',
  },
  police: {
    hours: [],
    message: 'You would rather not be here.',
  },
  grocery: {
    hours: commerceHours,
    message: 'Bright but dilapidated grocery store',
    options: [
      {
        title: 'Pre-wrapped sandwich ($6)',
        food: true,
        health: 12,
      },
      {
        title: 'Cheese stick ($2)',
        food: true,
        health: 3,
      },
    ],
  },
  heightschurch: {
    message: `Welcome to Heights Baptist Church We serve a free hearty
      meal on Wednesdays from 5-8pm, and twelve-step groups meet here weekly.`,
    options: [
      {
        // actually wait?
        title: 'Wait in line for a healthy, hearty meal',
        hours: [false, false, false, [17, 20], false, false, false],
        health: 15,
        food: true,
        time: 3,
      },
      {
        title: 'Attend Narcotics Anonymous',
        hours: [false, false, false, false, [21, 22], false, false],
        give: ['navoucher'],
        health: 2,
        time: 2,
      },
      {
        title: 'Put something in the collection box ($5)',
        money: -5,
      },
      // {
      //   title: 'Steal the collection box',
      //   randMoney: 50,
      //   risk: 0.45,
      // },
    ]
  },
};
