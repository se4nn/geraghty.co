// Homepage content that isn't a project. Edit copy and links here.
import type { LogoChip } from '../components/LogoStack.astro';

import chipFormat from '../assets/logos/chips/format.svg';
import chipDelli from '../assets/logos/chips/delli.svg';
import chipStudia from '../assets/logos/chips/studia.svg';
import chipFertifa from '../assets/logos/chips/fertifa.svg';
import chipShuffle from '../assets/logos/chips/shuffle.svg';
import chipSteepClub from '../assets/logos/chips/steepclub.svg';
import chipMinimum from '../assets/logos/chips/minimum.svg';
import chipFewVentures from '../assets/logos/chips/few-ventures.svg';

import quicknode from '../assets/logos/previous/quicknode.svg';
import knoma from '../assets/logos/previous/knoma.svg';
import ustwo from '../assets/logos/previous/ustwo.svg';
import snoots from '../assets/logos/previous/snoots.svg';
import fare from '../assets/logos/previous/fare.svg';
import florence from '../assets/logos/previous/florence.svg';
import nested from '../assets/logos/previous/nested.svg';
import burberry from '../assets/logos/previous/burberry.svg';

import martin from '../assets/home/martin-dreymann.png';
import formatWordmark from '../assets/logos/format-wordmark.svg';

export const availability = 'Open to work';

export const contactEmail = 'sean@geraghty.co';

// Intro line. Links without an href render as plain underlined text
// until their destination exists.
export const intro = {
  lead: 'I’m Sean, a London-based designer, who loves to',
  links: [
    { label: 'host supper clubs,', href: 'https://eatbred.com' },
    { label: 'paint on huge canvases', href: 'https://seangeraghty.co.uk' },
    { label: 'write (occasionally)', href: undefined },
  ],
};

// `project` links a chip to that project in src/content/work (its case study,
// or its homepage tile until the case study exists). `href` links anywhere else.
const chip = {
  format: { name: 'Format', project: 'format', src: chipFormat, bg: 'var(--chip-format)', width: 20, height: 20 },
  delli: { name: 'DELLI', project: 'delli', src: chipDelli, bg: 'var(--chip-delli)', width: 20, height: 5.556 },
  studia: { name: 'Studia', project: 'studia', src: chipStudia, bg: 'var(--chip-studia)', width: 20, height: 6 },
  fertifa: { name: 'Fertifa', project: 'fertifa', src: chipFertifa, bg: 'var(--chip-fertifa)', width: 20, height: 20 },
  shuffle: { name: 'Shuffle', project: 'shuffle', src: chipShuffle },
  steepClub: { name: 'The Steep Club', href: '/steepclub.html', src: chipSteepClub },
  minimum: { name: 'Minimum', project: 'minimum', src: chipMinimum },
  fewVentures: { name: 'Few Ventures', href: 'https://fewww.vc', src: chipFewVentures },
};

// Rotations are from the Figma frame
export const skills: { label: string; logos: LogoChip[] }[] = [
  {
    label: 'Product design & strategy',
    logos: [
      { ...chip.format, rotate: -11 },
      { ...chip.delli, rotate: 12 },
      { ...chip.shuffle, rotate: -4 },
      { ...chip.studia, rotate: 14 },
    ],
  },
  {
    label: 'Branding',
    logos: [
      { ...chip.fertifa, rotate: 12 },
      { ...chip.steepClub, rotate: -8 },
      { ...chip.minimum, rotate: 4 },
    ],
  },
  {
    label: 'Design & code',
    logos: [
      { ...chip.format, rotate: -11 },
      { ...chip.delli, rotate: 12 },
      { ...chip.fewVentures, rotate: -6 },
    ],
  },
];

export const workIntro = {
  text: 'I’ve spent more than a decade spotting problems nobody’s named yet.',
  text2: 'I get in early, ask difficult questions, design a fix and then',
  emphasis: 'build it',
};

export const previous = {
  heading: 'I’ve also had the pleasure to work with the talented teams at',
  logos: [
    { name: 'QuickNode', src: quicknode },
    { name: 'Knoma', src: knoma },
    { name: 'ustwo', src: ustwo },
    { name: 'Snoots', src: snoots },
    { name: 'FARE', src: fare },
    { name: 'Florence', src: florence },
    { name: 'Nested', src: nested },
    { name: 'Burberry', src: burberry },
  ],
};

export const testimonial = {
  quote:
    'Sean really gets into what users are actually trying to do, and asks the tough questions that make you rethink things you thought you’d figured out.',
  name: 'Martin Dreymann',
  role: 'Co-founder & CTO',
  photo: martin,
  companyLogo: formatWordmark,
  company: 'Format',
  // Format case study doesn't exist yet
  link: '#work',
};
