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

import fewVenturesTile from '../assets/work/fewventures-tile.png';
import fewVenturesLogo from '../assets/logos/few-ventures.svg';

import martin from '../assets/home/martin-dreymann.png';
import formatWordmark from '../assets/logos/format-wordmark.svg';

import bredHummusBeef from '../assets/home/intro/bred-hummus-beef.webp';
import bredShakshuka from '../assets/home/intro/bred-shakshuka.webp';
import bredPotatoes from '../assets/home/intro/bred-potatoes.webp';
import bredPeach from '../assets/home/intro/bred-peach.webp';
import paintingMomentOfHappiness from '../assets/home/intro/painting-moment-of-happiness.webp';
import paintingJoyCanBeFleeting from '../assets/home/intro/painting-joy-can-be-fleeting.webp';
import paintingLustOrLove from '../assets/home/intro/painting-lust-or-love.webp';
import paintingAroundAndAround from '../assets/home/intro/painting-around-and-around.webp';

export const availability = 'Open to work';

export const contactEmail = 'sean@geraghty.co';

export const intro = {
  lead: 'I’m Sean, a London-based designer, who loves to',
  links: [
    {
      label: 'host supper clubs,',
      href: 'https://eatbred.com',
      images: [bredHummusBeef, bredPotatoes, bredPeach, bredShakshuka],
    },
    {
      label: 'paint on huge canvases',
      href: 'https://seangeraghty.co.uk',
      images: [paintingMomentOfHappiness, paintingLustOrLove, paintingJoyCanBeFleeting, paintingAroundAndAround],
    },
    { label: 'write (occasionally)', href: undefined },
  ],
};

const chip = {
  format: { name: 'Format', project: 'format', src: chipFormat, bg: 'var(--chip-format)', width: 20, height: 20 },
  delli: { name: 'DELLI', project: 'delli', src: chipDelli, bg: 'var(--chip-delli)', width: 20, height: 5.556 },
  studia: { name: 'Studia', project: 'studia', src: chipStudia, bg: 'var(--chip-studia)', width: 20, height: 6 },
  fertifa: { name: 'Fertifa', project: 'fertifa', src: chipFertifa, bg: 'var(--chip-fertifa)', width: 20, height: 20 },
  shuffle: { name: 'Shuffle', project: 'shuffle', src: chipShuffle },
  steepClub: { name: 'The Steep Club', project: 'steepclub', src: chipSteepClub },
  minimum: { name: 'Minimum', project: 'minimum', src: chipMinimum },
  fewVentures: {
    name: 'Few Ventures',
    href: 'https://fewww.vc',
    src: chipFewVentures,
    card: {
      image: fewVenturesTile,
      logo: fewVenturesLogo,
      logoScale: 0.5,
      grain: true,
      tint: 'var(--chip-fewventures)',
      alt: 'Few Ventures',
    },
  },
};

export const skills: { label: string; logos: LogoChip[] }[] = [
  {
    label: 'Product Design',
    logos: [
      { ...chip.format, rotate: -11 },
      { ...chip.shuffle, rotate: 12 },
      { ...chip.delli, rotate: -4 },
      { ...chip.studia, rotate: 14 },
    ],
  },
  {
    label: 'Branding',
    logos: [
      { ...chip.fertifa, rotate: 12 },
      { ...chip.steepClub, rotate: -8 },
      { ...chip.minimum, rotate: 4 },
      { ...chip.shuffle, rotate: -4 },
    ],
  },
  {
    label: 'Code',
    logos: [
      { ...chip.format, rotate: -11 },
      { ...chip.delli, rotate: 12 },
      { ...chip.fewVentures, rotate: -6 },
    ],
  },
];

export const workIntro = {
  text: 'I’ve spent more than a decade spotting problems nobody’s named yet.',
  text2: 'I\u00a0get in early, ask difficult questions, design a fix and then',
  emphasis: 'build it',
};

export const previous = {
  heading: 'I’ve also had the pleasure of working with the talented teams at',
  logos: [
    { name: 'QuickNode', src: quicknode, href: 'https://www.quicknode.com' },
    { name: 'Knoma', src: knoma },
    { name: 'ustwo', src: ustwo, href: 'https://ustwo.com' },
    { name: 'Snoots', src: snoots },
    { name: 'FARE', src: fare },
    { name: 'Florence', src: florence, href: 'https://www.florence.co.uk' },
    { name: 'Nested', src: nested, href: 'https://nested.com' },
    { name: 'Burberry', src: burberry, href: 'https://uk.burberry.com' },
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
  link: '/work/format/',
};
