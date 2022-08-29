const rawStates = {
  week2: {
    "money": 45,
    "health": 44,
    "map": "heights",
    "home": "halfwayhouse",
    "time": 1641826800000,
    "violations": 0,
    "playedHours": 169,
    "items": [
        "watch",
        "ssn",
        "halfwayhousekey",
        "birthcertificatereceipt",
        "ramen",
        "ramen",
        "ramen",
        "pouareq"
    ],
    "locationEvents": [
        {
            "location": "countyclerk",
            "schedule": 75,
            "time": 1,
            "message": "Here is your birth certificate",
            "closeButtonText": "Take the birth certificate",
            "exitTransaction": {
                "take": [
                    "birthcertificatereceipt"
                ],
                "give": [
                    "birthcertificate"
                ]
            }
        }
    ],
    "lastMeal": 1641819600000,
    "nextProbation": 1642431600000,
    "lastStrength": 1641218400000,
    "communityservice": 8,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0
  },
  week3: {
    "money": 27,
    "health": 22,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1642446000000,
    "violations": 1,
    "playedHours": 341,
    "items": [
        "watch",
        "ssn",
        "halfwayhousekey",
        "ramen",
        "birthcertificate",
        "pouareq",
        "stateid"
    ],
    "locationEvents": [],
    "lastMeal": 1642428000000,
    "nextProbation": 1643036400000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0
  },
  precareer: {
    "money": 30,
    "health": 12,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1642525200000 - (1000 * 3600 * 3),
    "violations": 1,
    "playedHours": 363,
    "items": [
        "watch",
        "ssn",
        "halfwayhousekey",
        "ramen",
        "birthcertificate",
        "pouareq",
        "stateid"
    ],
    "locationEvents": [],
    "lastMeal": 1642474800000,
    "nextProbation": 1643036400000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0
  },
  blankapplication: {
    "money": 54,
    "health": 8,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1642546800000,
    "violations": 1,
    "playedHours": 372,
    "items": [
        "ssn",
        "halfwayhousekey",
        "ramen",
        "birthcertificate",
        "pouareq",
        "stateid",
        "warehouseapplication",
        "jobuapass"
    ],
    "locationEvents": [],
    "lastMeal": 1642532400000,
    "nextProbation": 1643036400000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0
  },
  completedapplication: {
    "money": 37,
    "health": 18,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1642604400000,
    "violations": 1,
    "playedHours": 388,
    "items": [
        "ssn",
        "halfwayhousekey",
        "birthcertificate",
        "pouareq",
        "stateid",
        "jobuapass",
        "completedwarehouseapplication"
    ],
    "locationEvents": [],
    "lastMeal": 1642557600000,
    "nextProbation": 1643036400000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0,
    "accruedPay": 0,
  },
  orientation: {
    "money": 0,
    "health": 41,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1643018400000,
    "violations": 1,
    "playedHours": 503,
    "items": [
        "ssn",
        "halfwayhousekey",
        "birthcertificate",
        "stateid",
        "joborientationinvite",
        "workboots",
        "pouapass"
    ],
    "locationEvents": [],
    "lastMeal": 1643004000000,
    "nextProbation": 1643036400000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0,
    "accruedPay": 0,
    "paychecksReady": 0,
  },
  working: {
    "money": 40,
    "health": 4,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1643220000000,
    "violations": 4,
    "playedHours": 559,
    "items": [
        "ssn",
        "halfwayhousekey",
        "birthcertificate",
        "stateid",
        "workboots",
        "jobid",
        "pouareq"
    ],
    "locationEvents": [],
    "lastMeal": 1643162400000,
    "nextProbation": 1643641200000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0,
    "accruedPay": 21,
    "paychecksReady": 0
  },
  precheck: {
    "money": 6,
    "health": 36,
    "map": "downtown",
    "home": "halfwayhouse",
    "time": 1643407200000 - (3600 * 1000),
    "violations": 4,
    "playedHours": 611,
    "items": [
        "ssn",
        "halfwayhousekey",
        "birthcertificate",
        "stateid",
        "workboots",
        "jobid",
        "pouareq",
        "counselingvoucher",
        "navoucher"
    ],
    "locationEvents": [],
    "lastMeal": 1643382000000,
    "nextProbation": 1643641200000,
    "lastStrength": 1641218400000,
    "communityservice": 16,
    "calendar": [
        {
            "name": "na1",
            "title": "7pm Tuesday: Narcotics anonymous at St. Jude's Church"
        },
        {
            "name": "na2",
            "title": "9pm Thursday: Narcotics anonymous at Heights Church"
        },
        {
            "name": "angerManagement",
            "title": "10am Friday: Anger Management at Counseling Center"
        },
        {
            "name": "probation",
            "title": "10am Monday: Parole Appointment"
        }
    ],
    "events": [],
    "accruedTime": 0,
    "accruedPay": 0,
    "paychecksReady": 1,
    "hospitalvisits": 0,
    "arrests": 0,
  },
};


const fixTimes = (states) => {
  Object.keys(states)
    .forEach((state) =>
      ['time', 'lastMeal', 'nextProbation', 'lastStrength']
      .forEach((key) => states[state][key] = new Date(states[state][key])
    )
  );
  return states;
}

export const debugStates = fixTimes(rawStates);