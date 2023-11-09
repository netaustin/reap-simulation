const keys = ['rentalkey', 'momskey'];

export default {
  message: 'A broken elevator and a warm bed.',
  options: [
    {
      title: 'Stay the night (10 hours)',
      message: 'You wake up feeling refreshed, if a bit hungry.',
      animate: 'sleep',
      hideWithoutAny: keys,
      health: 20,
      time: 10,
      hours: [[18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24], [18, 24]],
    },
    {
      title: 'Grab five hours of sleep',
      message: 'You wake up with a sick feeling in your stomach.',
      hideWithoutAny: keys,
      animate: 'sleep',
      health: 10,
      time: 5,
      // hours: [],
    },
    {
      title: 'Relax for an hour',
      hours: [[9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24]],
      hideWithoutAny: keys,
      time: 1,
      health: 1,
    },
    // only if you're renting
    {
      title: 'Cook and Eat Ramen Noodles',
      message: `You feel a little better.`,
      hours: [[9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24], [9, 24]],
      hideWithoutAll: ['rentalkey', 'ramen'],
      time: 1,
      health: 8,
      food: true,
      take: ['ramen'],
    },
    {
      title: 'Cook and Eat a Frozen Meal',
      message: `Not half bad!`,
      hours: [],
      hideWithoutAll: ['rentalkey', 'frozenfood'],
      time: 1,
      health: 15,
      food: true,
      take: ['frozenfood'],
    },
    // only if it's your mom's place
    {
      title: 'Raid the fridge!',
      message: `You feel a little better.`,
      // hours: [],
      hideWithoutAll: ['momskey'],
      time: 1,
      health: 8,
      food: true,
    },
    {
      title: 'Sit down for dinner',
      message: `You feel a lot better.`,
      hours: [[17, 21], [17, 21], [17, 21], [17, 21], [17, 21], [17, 21], [17, 21],],
      hideWithoutAll: ['momskey'],
      time: 1,
      health: 30,
      food: true,
    },
  ],
};