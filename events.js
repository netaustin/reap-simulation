const jailed = {
  title: 'You are in jail',
  photo: 'jail',
  message: 'We\'ll let you know when your next court appearance is. Until then, sit tight.',
  schedule: 0,
  closeButtonText: 'Okay',
  animate: 'justice',
  exitTransaction: {
    makeMorning: true,
    setHealth: 80,
    time: 1,
  },
};

// probably move this to poReview
export const start_probation = {
  location: 'probation',
  schedule: 1,
  late: -1,
  time: 2,
  lateMessage: 'You\'re late. I\'m sorry, but I have to give you a violation.',
  messageHTML: [
    `<p>I'm your parole officer. We will meet at least once each week
    during the first month of your parole.</p>
    <ul>
      <li>Being late to an appointment is a violation of your parole.</li>
      <li>You have been placed in a Halfway House, not too far from here.</li>
      <li>You must find work within thirty days and begin paying half of your income in rent.</li>
    </ul>`,
    `<ul>
        <li>Each week, you must attend Narcotics Anonymous and Group Therapy.</li>
        <li>You may not use drugs or alcohol, and you must complete a Urinalysis (UA) test each week.</li>
        <li>Within your first month, you must pay $200 in restitution at the Courthouse.</li>
        <li>You must also do 24 hours of community service this month. You can check in for community service on weekdays at 9am.</li>
        <li>Here's a schedule to put in your backpack (click on "items", top right).</li>
      </ul>
      <p>Go directly to the halfway house and settle in, and I will see you next week.</p>`,
  ],
  exitTransaction: {
    nextProbation: true,
    addToCalendar: [
      { name: 'na1', title: '7pm Tuesday: Narcotics anonymous at St. Jude\'s Church', },
      { name: 'na2', title: '9pm Thursday: Narcotics anonymous at Heights Church', },
      { name: 'angerManagement', title: 'Weekdays at the Counseling Center', },
      { name: 'probation', title: '10am Monday: Parole Appointment', },
    ],
    give: ['pouareq'],
    time: 1,
  },
};

const restart_probation = {
  title: 'Restart Parole',
  photo: 'probation',
  animate: 'justice',
  message: 'You are out of jail, and you need to report to the parole office within the hour.',
  schedule: 0,
  exitTransaction: {
    setProbationTime: true,
    take: ['halfwayhousekey', 'pouareq', 'jobid', 'joborientationinvite', 'completedwarehouseapplication'],
    addLocationEvents: [{
      ...start_probation,
      schedule: 0,
      exitTransaction: {},
      makeMorning: true,
      messageHTML: `<p>Are you ready to try this again? The same provisions of your parole still
        apply, but unfortunately there is not a housing placement available for you, so you will need
        to arrange for your own housing. I will see you next week.</p>`,
      lateMessage: 'This is unacceptable. You cannot be late to parole appointments.',
    }],
  }
};

const guilty_transaction = {
  time: (6 * 24 * 7),
  makeMonday: true,
  setHealth: 70,
  photo: 'courthouse',
  addEvents: [ restart_probation ],
};

const guilty_sentence = {
  title: 'Sentencing',
  animate: 'justice',
  photo: 'courthouse',
  message: 'The court accepts your plea and sentences you to six weeks in the city jail',
  schedule: 0,
  exitTransaction: guilty_transaction,
  closeButtonText: 'Start Sentence',
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
  animate: 'justice',
  message: `You are charged with a crime. Considering your recent release from
    prison, I am setting your bond to $10,000 and sending you back to jail,
    pending a trial, which is scheduled for six weeks from today. If you
    wish to accept a plea bargain, you may do so now.`,
  canLeave: false,
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

const resentencing = {
  title: 'Resentencing Hearing',
  photo: 'courthouse',
  schedule: 0,
  animate: 'justice',
  message: `In light of your failure to comply with the terms of your parole, I am returning
    you to the custody of the state prison system for a minimum of six months before you will
    again become eligible for parole.`,
  exitTransaction: { ...guilty_transaction, time: (26 * 24 * 7) },
  closeButtonText: 'Start Sentence',
};

export const events = {
  outofprison: {
    title: 'Home from Ten Years in Prison',
    message: `You\'ve been in prison for ten years, and today you\'re out on parole to serve out the
      remainder of a sixteen-year sentence. You have $50 you saved from your prison job, and your
      social security card. You received a G.E.D. while in prison. The prison staff put you on a bus
      to Central City, and here you are.`,
    photo: 'jail',
    closeButtonText: 'Next',
  },
  meetpo: {
    title: 'Meet your Parole Officer',
    message: `You have to check in with your parole officer at 11am. The
      probabation office is in Uptown Heights, so you'll need to figure out
      how to get there quickly.`,
    photo: 'probation',
    type: 'event',
    closeButtonText: 'Get Started',
  },
  arrest: {
    title: 'Hold it right there!',
    message: 'You\'re out on parole? I have to take you to jail.',
    closeButtonText: 'Okay',
    photo: 'police',
    violation: true,
    animate: 'justice',
    exitTransaction: {
      reset: true,
      time: 1,
      addEvents: [ jailed, arraignment ],
    },
  },
  pocustody: {
    title: 'Parole Officer Custody',
    animate: 'justice',
    message: 'You are being transferred from your parole officer to jail.',
    closeButtonText: 'Okay',
    photo: 'police',
    violation: true,
    exitTransaction: {
      reset: true,
      time: 1,
      addEvents: [ jailed, resentencing ],
    },
  },
  powarrant: {
    photo: 'police',
    animate: 'justice',
    title: `We have been looking for you`,
    message: `You missed a parole appointment and a bench warrant was issued for your arrest.
      We are taking you into custody`,
    closeButtonText: 'Okay',
    exitTransaction: {
      reset: true,
      time: 1,
      addEvents: [ jailed, resentencing ],
    },
  },
};