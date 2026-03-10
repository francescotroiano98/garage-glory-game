import { CustomerPersonality } from '@/types/game';

import bargainHunter from '@/assets/customers/bargain-hunter.png';
import impulseBuyer from '@/assets/customers/impulse-buyer.png';
import skeptic from '@/assets/customers/skeptic.png';
import enthusiast from '@/assets/customers/enthusiast.png';
import businessman from '@/assets/customers/businessman.png';
import firstTimer from '@/assets/customers/first-timer.png';
import collector from '@/assets/customers/collector.png';
import commuter from '@/assets/customers/commuter.png';
import familyPerson from '@/assets/customers/family-person.png';
import student from '@/assets/customers/student.png';
import retiree from '@/assets/customers/retiree.png';
import flipper from '@/assets/customers/flipper.png';
import mechanic from '@/assets/customers/mechanic.png';
import impatient from '@/assets/customers/impatient.png';
import patient from '@/assets/customers/patient.png';
import rich from '@/assets/customers/rich.png';
import budget from '@/assets/customers/budget.png';
import suspicious from '@/assets/customers/suspicious.png';
import friendly from '@/assets/customers/friendly.png';
import expert from '@/assets/customers/expert.png';

export const CUSTOMER_AVATAR_IMAGES: Record<CustomerPersonality, string> = {
  bargain_hunter: bargainHunter,
  impulse_buyer: impulseBuyer,
  skeptic,
  enthusiast,
  businessman,
  first_timer: firstTimer,
  collector,
  commuter,
  family_person: familyPerson,
  student,
  retiree,
  flipper,
  mechanic,
  impatient,
  patient,
  rich,
  budget,
  suspicious,
  friendly,
  expert,
};
