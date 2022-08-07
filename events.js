const jailed = {
  title: 'You are in jail',
  location: 'jail',
  message: 'We\'ll let you know when your next court appearance is. Until then, sit tight.',
  schedule: 0,
  closeButtonText: 'Okay',
  exitTransaction: {
    makeMorning: true,
    setHealth: 80,
    time: 1,
  },
};

export const start_probation = {
  location: 'probation',
  schedule: 1,
  late: -1,
  time: 1,
  lateMessage: 'You\'re late. I\'m sorry, but I have to give you a violation.',
  messageHTML: [
    `<p>I'm your probation officer. We will meet at least once each week
    during the first month of your probation.</p>
    <ul>
      <li>Being late to an appointment is a violation of your probation.</li>
      <li>You have been placed in a Halfway House, not too far from here.</li>
      <li>You must find work within thirty days and begin paying half of your income in rent.</li>
    </ul>`,
    `<ul>
        <li>Each week, you must attend Narcotics Anonymous and Group Therapy.</li>
        <li>You may not use drugs or alcohol, and you must complete a Urinalysis (UA) test each week.</li>
        <li>Within your first month, you must pay $200 in restitution at the Courthouse.</li>
        <li>Here's a schedule to put in your backpack (click on "items", top right).</li>
      </ul>
      <p>Go directly to the halfway house and settle in, and I will see you next week.</p>`,
  ],
  exitTransaction: {
    addToCalendar: [
      { name: 'na1', title: '7pm Tuesday: Narcotics anonymous at St. Jude\'s Church', },
      { name: 'na2', title: '9pm Tuesday: Narcotics anonymous at Heights Church', },
      { name: 'angerManagement', title: '10am Friday: Anger Management at Counseling Center', },
      { name: 'probation', title: '10am Monday: Probation Appointment', },
    ],
    give: ['pouareq'],
    time: 1,
  },
};

const restart_probation = {
  title: 'Restart Probation',
  location: 'probation',
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
  location: 'courthouse',
  addEvents: [ restart_probation ],
};

const guilty_sentence = {
  title: 'Sentencing',
  location: 'courthouse',
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
  location: 'courthouse',
  schedule: 0,
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

export const events = {
  outofprison: {
    title: 'Home from Ten Years in Prison',
    message: `You\'ve been in prison for ten years, and today you\'re out on
      probation. You have $100 you saved from your prison job, and your
      social security card. You received a G.E.D. while in prison. The prison
      staff put you on a bus to Central City, and here you are.`,
    location: 'jail',
    closeButtonText: 'Next',
  },
  meetpo: {
    title: 'Meet your Probation Officer',
    message: `You have to check in with your probation officer at 11am. The
      probabation office in in Uptown Heights, so you'll need to figure out
      how to get there quickly.`,
    location: 'probation',
    closeButtonText: 'Get Started',
  },
  arrest: {
    title: 'Hold it right there!',
    message: 'You\'re on probation? I have to take you to jail.',
    closeButtonText: 'Okay',
    location: 'police',
    violation: true,
    exitTransaction: {
      reset: true,
      time: 1,
      addEvents: [ jailed, arraignment ],
    },
  },
};