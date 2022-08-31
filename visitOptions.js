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
            photo: 'countyclerk',
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
        message: 'Here is your state ID',
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
        health: 52,
        food: true,
        time: 3,
        message: 'You feel pretty full!',
      },
      {
        title: 'Attend Narcotics Anonymous',
        hours: [false, false, [19, 20], false, false, false, false],
        give: ['navoucher'],
        health: 2,
        time: 2,
        message: `The chairperson signed a voucher to give to your PO.`,
      },
      {
        title: 'Put something in the collection box ($5)',
        money: -5,
        message: `You don't feel any better and you're out $5.`,
      },
      {
        title: 'Attend church',
        time: 2,
        health: 14,
        message: `There were snacks afterwards!`,
        hours: [[9, 12], false, false, false, false, false, false],
      }
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
        title: 'Check in for the night (12 hours)',
        message: `You didn't sleep very well but at least you ate something.`,
        hideWithAny: ['halfwayhousekey', 'halfwayhouseinvite'],
        health: 14,
        time: 12,
        animate: 'sleep',
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
    message: 'Donate plasma for cash! Once every seven days. If you donated recently you cannot donate again. It takes three hours to donate.',
    options: [
      {
        title: 'Donate to earn $50',
        money: 50,
        time: 3,
        health: -10,
        hideWithAny: ['plasmacard'],
        give: ['plasmacard'], // TODO: item expiration?
        message: 'You feel pretty crappy but you made some money.',
        addEvents: [{
          schedule: (24 * 7), // need to wipe out cards on reset
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
        title: 'Buy work boots ($90)',
        message: `Congratulations, you are out $90 before you worked a single shift.`,
        money: -90,
        time: 1,
        give: ['workboots'],
      },
      {
        title: 'Grab a candy bar and a soda pop ($4)',
        message: `Comforting, but empty!`,
        food: true,
        health: 7,
        money: -4,
        time: 1,
      },
      {
        title: 'Walk around the mall for an hour',
        message: 'You got some weird looks.',
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
        possibilities: [
          {
            threshold: 0.66,
            message: `I'm sorry, but we're not aware of any openings for a candidate like you
              at the moment. Feel free to check back often, new jobs open regularly!`
          },
          {
            threshold: 1,
            message: `Here is an application for Savealot Warehouse, they are hiring part time
              on the first shift. You will need to take a drug test and complete this application.`,
            give: ['warehouseapplication', 'jobuareq'],
          },
        ],
      },
      {
        title: 'Get help filling out an application',
        failWithoutAll: ['warehouseapplication'],
        take: ['warehouseapplication'],
        give: ['completedwarehouseapplication'],
        message: `Okay, we'll complete this together. You can take it the warehouse with your UA
          test. Good luck.`,
      }
    ],
  },
  pronto: {
    hours: commerceHours,
    message: `Welcome to Joe's, home of the most forgettable office lunches in all of downtown!`,
    options: [
      {
        title: 'Panini ($11)',
        message: 'You already forgot what you had for lunch',
        food: true,
        health: 15,
        time: 1,
        money: -11
      },
      {
        title: 'The "Protein Box" ($9)',
        message: 'You are unsatisfied, but if you really think about it you feel a bit better.',
        food: true,
        health: 21,
        time: 1,
        money: -9
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
              to make $100 running an errand. You know the risks.`,
            options: [
              {
                title: 'Sure',
                give: ['bagofdrugs'],
                time: 3,
                message: 'Take this package to the crew at the playground.'
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
        title: 'Big breakfast ($9)',
        message: 'You feel ready for the day',
        hours: [[5, 14], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 14]],
        time: 1,
        food: true,
        money: -9,
        health: 27,
      },
      {
        title: 'Fries, please ($5)',
        message: 'Greasy but delicious',
        time: 1,
        food: true,
        money: -5,
        health: 10,
      },
      {
        title: 'Turkey club and a greek salad ($12)',
        message: 'A virtuous choice',
        time: 1,
        food: true,
        money: -12,
        health: 24,
      },
      {
        title: 'Blue plate special ($10)',
        hours: [[17, 22], [17, 22], [17, 22], [17, 22], [17, 22], [17, 22], [17, 22]],
        time: 1,
        food: true,
        money: -10,
        health: 29,
        message: 'A warm feeling of nostalgia washes over you. Or is it just the gravy?',
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
        message: `Here is a key to the house and to your room. You have a roommate. Curfew is at
          11pm each night. You cannot enter between 11pm and 9am. If you are re-incarcerated, you
          will lose your spot at this house.`,
      },
      {
        title: 'Check in for the night (10 hours)',
        message: 'You wake up feeling refreshed, if a bit hungry.',
        animate: 'sleep',
        hideWithoutAll: ['halfwayhousekey'],
        health: 13,
        time: 10,
        hours: [[18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24]],
      },
      {
        title: 'Grab five hours of sleep',
        message: 'You wake up with a sick feeling in your stomach.',
        hideWithoutAll: ['halfwayhousekey'],
        animate: 'sleep',
        health: 1,
        time: 5,
        hours: [[18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24]],
      },
      {
        title: 'Relax for an hour',
        hours: [[9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24]],
        hideWithoutAll: ['halfwayhousekey'],
        time: 1,
        health: 1,
      },
      {
        title: 'Get advice from your roommate',
        hours: [[9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24]],
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
      {
        title: 'Cook and Eat Ramen Noodles',
        message: `You feel a little better.`,
        hours: [[9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24]],
        hideWithoutAll: ['halfwayhousekey', 'ramen'],
        time: 1,
        health: 8,
        food: true,
        take: ['ramen'],
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
        time: 1,
        message: 'Welcome to Uptown Heights',
        animate: 'train',
        messageExitTransaction: {
          travel: 'heights',
        },
      },
      {
        title: 'Jump the turnstile ($0)',
        risk: 0.2,
        time: 1,
        animate: 'train',
        message: 'Welcome to Uptown Heights',
        messageExitTransaction: {
          travel: 'heights',
        },
      },
      {
        title: 'No thanks, I\'ll walk (3h)',
        health: -8,
        time: 3,
        animate: 'walk',
        message: 'Welcome to Uptown Heights',
        messageExitTransaction: {
          travel: 'heights',
        },
      },
    ],
  },
  park: {
    message: 'Take a walk in beautiful Buchanan Park, the Jewel of Central City',
    options: [
      {
        title: 'Spend a quiet hour here',
        health: 1,
        time: 1,
      },
      {
        title: 'Curl up for the night',
        health: -2,
        time: 8,
        animate: 'park',
      },
      {
        title: 'Recycle cans and bottles',
        message: 'You made some money and got hassled a little bit.',
        risk: 0.05,
        time: 5,
        animate: 'park',
        money: { random: 'uniform', min: 4, max: 13, },
      },
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
      {
        title: 'Idle for a few hours',
        risk: 0.1,
        time: 5,
        animate: 'park',
        // money: { random: 'uniform', min: 4, max: 14, },
      },
    ]
  },
  heightsstation: {
    message: 'Take our beautiful and clean light rail Downtown!',
    options: [
      {
        title: 'Sure! ($3)',
        money: -3,
        animate: 'train',
        message: 'Welcome to Central City',
        messageExitTransaction: {
          travel: 'downtown',
        },
        time: 1,
      },
      {
        title: 'Jump the turnstile ($0)',
        risk: 0.2,
        animate: 'train',
        message: 'Welcome to Central City',
        messageExitTransaction: {
          travel: 'downtown',
        },
        time: 1,
      },
      {
        title: 'No thanks, I\'ll walk (3h)',
        health: -8,
        time: 3,
        animate: 'walk',
        message: 'Welcome to Central City',
        messageExitTransaction: {
          travel: 'downtown',
        },
      },
    ],
  },
  pawnshop: {
    message: 'You can sell Rick your stuff, and he\'ll give you a "fair" price.',
    hours: [false, [10, 19], [10, 19], [10, 19], [10, 19], [10, 21], [10, 21]],
    options: [
      {
        title: 'Sell your grandfather\'s watch for $75',
        message: `Grandpa liked that watch, but he liked food even better.`,
        money: 75,
        health: -10,
        time: 1,
        hideWithoutAll: ['watch'],
        take: ['watch'],
      },
      {
        title: 'Buy a familiar-looking watch for $190',
        message: `Your grandpa hated to be ripped off, but you're sure he'd understand.`,
        money: -190,
        time: 1,
        hideWithAny: ['watch'],
        give: ['watch'],
      },
      {
        title: 'Cash your paycheck ($15 fee)',
        message: `Two hours of your hard work went to pay that $15 fee.`,
        money: 153,
        time: 1,
        hideWithoutAll: ['paycheck'],
        take: ['paycheck'],
      },
    ],
  },
  probation: {
    message: 'Not your favorite place.',
    hours: govtHours,
    options: [
      {
        title: 'Check in with your Parole Officer',
        time: 1,
        poreview: true,
      },
      {
        title: 'Do a community service shift (8 hours)',
        hours: [false, [9, 10], [9, 10], [9, 10], [9, 10], [9, 10], false],
        time: 8,
        health: -4,
        communityservice: 8,
        animate: 'park',
        message: 'You picked up trash all day.',
      },
    ],
  },
  communitycollege: {
    message: `You don't take classes here.`,
  },
  playground: {
    message: `You're not sure you should be here.`,
    options: [
      {
        hideWithoutAll: ['bagofdrugs'],
        take: ['bagofdrugs'],
        title: 'Hand over the package',
        money: 60,
        risk: 0.4,
        animate: 'justice',
        message: `You made less money than you were promised and you feel a little sick.`,
      }
    ]
  },
  heightshousing: {
    message: `You don't live here.`,
  },
  discountmedical: {
    hours: [false, [8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [10, 14]],
    wait: 1,
    message: 'Our motto: "Here\'s the cup, you know what to do!"',
    options: [
      {
        title: 'Get a urinalysis test for your parole officer ($25)',
        money: -25,
        failWithoutAll: ['pouareq'],
        take: ['pouareq'],
        giveOne: { pouapass: 0.9, pouafail: 1.0, },
        time: 1,
        message: `You receive a form to give to your PO, but all it has is a barcode.`,
      },
      {
        title: 'Get a work urinalysis and physical ($40)',
        money: -40,
        hideWithoutAll: ['jobuareq'],
        take: ['jobuareq'],
        giveOne: { jobuapass: 0.9, jobuafail: 1.0, },
        time: 1,
        message: `You receive a form to give to your hiring manager, but all it has is a barcode.`,
      },
    ],
  },
  clinic: {
    hours: [[10, 18], [7, 21], [7, 21], [7, 21], [7, 21], [7, 21], [10, 18]],
    wait: { random: 'uniform', min: 1, max: 2, },
    message: 'A busy urban hospital with a walk-in clinic.',
    options: [
      {
        title: 'Get a urinalysis test for your parole officer ($21)',
        money: -21,
        failWithoutAll: ['pouareq'],
        take: ['pouareq'],
        giveOne: { pouapass: 0.7, pouafail: 1.0, },
        time: 1,
        message: `You receive a form to give to your PO, but all it has is a barcode.`,
      },
      {
        title: 'Get a urinalysis and physical for work ($34)',
        money: -34,
        hideWithoutAll: ['jobuareq'],
        take: ['jobuareq'],
        giveOne: { jobuapass: 0.7, jobuafail: 1.0, },
        time: 1,
        message: `You receive a form to give to your hiring manager, but all it has is a barcode.`,
      },
    ],
  },
  counseling: {
    hours: [false, [8, 21], [8, 21], [8, 21], [8, 21], [8, 21], false],
    message: 'Specializing in group and 1:1 therapy. Group therapy sessions are 4-5pm Mondays, Wednesdays, and Fridays, and 7-8pm on Tuesdays and Thursdays.',
    options: [
      {
        title: 'Attend group therapy',
        hours: [false, [16, 17], [19, 20], [16, 17], [19, 20], [16, 17], false],
        hideWithAny: ['counselingvoucher'],
        give: ['counselingvoucher'],
        time: 1,
        message: `Your group was pretty quiet today.`,
      },
    ],
  },
  warehouse: {
    hours: [[5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23], [5, 23],],
    message: `A megastore's urban distribution center.`,
    options: [
      {
        title: 'Apply for a job',
        hideWithoutAll: ['jobuapass', 'completedwarehouseapplication'],
        possibilities: [
          {
            threshold: 0.5,
            message: `I'm sorry, we're not hiring today. Keep your application and try again tomorrow.`,
            time: 1,
          },
          {
            threshold: 1,
            time: 3,
            message: `Congratulations. You are hired on the first shift at the loading dock. Your
              pay is $8 per hour. You can join our next orientation on Monday at 5am. You will need
              to bring your own steel-toed boots.`,
            take: ['jobuapass', 'completedwarehouseapplication'],
            give: ['joborientationinvite'],
          }
        ],
      },
      {
        title: 'Apply for a job',
        time: 1,
        hideWithoutAll: ['jobuafail', 'completedwarehouseapplication'],
        take: ['jobuafail', 'completedwarehouseapplication'],
        message: `Sorry, but you failed your UA test.`,
      },
      {
        title: 'Apply for a job',
        time: 1,
        hideWithAny: ['completedwarehouseapplication', 'joborientationinvite', 'jobid'],
        message: `Sorry, we need a completed application and a UA test in order to consider hiring
          you. We let the career center know when we have open jobs, you should check with them.`,
      },
      {
        title: 'Start your new job',
        hours: [false, [5, 6], false, false, false, false, false],
        failWithoutAll: ['joborientationinvite', 'workboots'],
        message: `Welcome aboard. Here is your job ID and timecard. Your hours are 5am to 1pm,
          Monday through Thursday. You cannot clock in late, and you cannot miss any shifts at all for
          the first month or you will be automatically terminated. The pay office is only open from
          2pm to 5pm on Fridays, you should pick up your check then.`,
        take: ['joborientationinvite'],
        give: ['jobid'],
        time: 8,
        paid: 7,
      },
      {
        title: 'Pick up your check',
        hours: [false, false, false, false, false, [14, 17], false],
        hideWithoutAll: ['jobid'],
        paycheck: true,
        paid: 0,
        time: 1,
      },
      {
        hours: [false, [5, 6], [5, 6], [5, 6], [5, 6], false, false],
        title: 'Work your shift',
        hideWithoutAll: ['workboots', 'jobid'],
        paid: 7,
        time: 8,
      },
    ],
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
        title: 'Four-Pack of Ramen Noodles ($9)',
        give: ['ramen', 'ramen', 'ramen', 'ramen'],
        message: `You can cook this in your room at the halfway house.`,
        money: -9,
        time: 1,
      },
      {
        title: 'Pre-wrapped sandwich ($6)',
        message: `You feel a little better.`,
        food: true,
        money: -6,
        health: 12,
        time: 1,
      },
      {
        title: 'Cheese stick ($2)',
        message: `You feel slightly better.`,
        money: -2,
        food: true,
        health: 4,
        time: 1,
      },
    ],
  },
  heightschurch: {
    message: `Welcome to Heights Baptist Church. We serve a free hearty
      meal on Wednesdays from 5-8pm, and twelve-step groups meet here weekly.`,
    options: [
      {
        // actually wait?
        title: 'Wait in line for a healthy, hearty meal',
        hours: [false, false, false, [17, 20], false, false, false],
        health: 32,
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
      {
        title: 'Attend church',
        time: 4,
        health: 25,
        message: `There was a potluck afterwards!`,
        hours: [[9, 12], false, false, false, false, false, false],
      }
      // {
      //   title: 'Steal the collection box',
      //   randMoney: 50,
      //   risk: 0.45,
      // },
    ]
  },
};
