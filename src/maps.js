import colors from './colors.js';

export default {
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