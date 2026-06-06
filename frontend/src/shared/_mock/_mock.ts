import type { ISubject } from 'src/contexts/types/common';

import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _userRoles,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _fileNames,
  _postTitles,
  _firstNames,
  _eventNames,
  _courseNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
  _countryNames,
  _ameliorationsTitles,
} from './assets';

// ----------------------------------------------------------------------

const { assetURL } = CONFIG.site;

export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => fSub({ days: index, hours: index }),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _roles[index],
  // Text
  courseNames: (index: number) => _courseNames[index],
  fileNames: (index: number) => _fileNames[index],
  eventNames: (index: number) => _eventNames[index],
  taskNames: (index: number) => _taskNames[index],
  postTitle: (index: number) => _postTitles[index],
  jobTitle: (index: number) => _jobTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  sentence: (index: number) => _sentences[index],
  description: (index: number) => _descriptions[index],
  ameliorationsTitles: (index: number) => _ameliorationsTitles[index],
  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  companyNames: (index: number) => _companyNames[index],
  countryNames: (index: number) => _countryNames[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) => `${assetURL}/assets/images/cover/cover-${index + 1}.webp`,
    avatar: (index: number) => `${assetURL}/assets/images/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) => `${assetURL}/assets/images/travel/travel-${index + 1}.webp`,
    course: (index: number) => `${assetURL}/assets/images/course/course-${index + 1}.webp`,
    company: (index: number) => `${assetURL}/assets/images/company/company-${index + 1}.webp`,
    product: (index: number) => `${assetURL}/assets/images/m-product/product-${index + 1}.webp`,
    portrait: (index: number) => `${assetURL}/assets/images/portrait/portrait-${index + 1}.webp`,
  },
};

const statuses = ['Actif', 'Suspendu', 'Bloqué', 'Supprimé'];

const allSubjects = [
  { id: 'subj1', name: 'Mathématiques', isSelected: false },
  { id: 'subj2', name: 'Français', isSelected: false },
  { id: 'subj3', name: 'Physique-Chimie', isSelected: false },
  { id: 'subj4', name: 'SVT', isSelected: false },
  { id: 'subj5', name: 'Histoire-Géographie', isSelected: false },
  { id: 'subj6', name: 'Anglais', isSelected: false },
  { id: 'subj7', name: 'Informatique', isSelected: false },
  { id: 'subj8', name: 'Français B1', isSelected: false },
];

// Fonction utilitaire pour générer un sous-ensemble aléatoire
function getRandomSubjects(): ISubject[] {
  const shuffled = [...allSubjects].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 2; // entre 2 et 4
  return shuffled.slice(0, count);
}

export const _mockListUsers = {
  id: (index: number) => _id[index],
  time: (index: number) => fSub({ days: index, hours: index }),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _userRoles[index % _userRoles.length],
  status: (index: number) => {
    const random = Math.random();
    if (random < 0.7) {
      return statuses[0];
    }

    const otherIndex = 1 + Math.floor(Math.random() * (statuses.length - 1));
    return statuses[otherIndex];
  },
  // Text
  courseNames: (index: number) => _courseNames[index],
  fileNames: (index: number) => _fileNames[index],
  eventNames: (index: number) => _eventNames[index],
  taskNames: (index: number) => _taskNames[index],
  postTitle: (index: number) => _postTitles[index],
  jobTitle: (index: number) => _jobTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  sentence: (index: number) => _sentences[index],
  description: (index: number) => _descriptions[index],
  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  companyNames: (index: number) => _companyNames[index],
  countryNames: (index: number) => _countryNames[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) => `${assetURL}/assets/images/cover/cover-${index + 1}.webp`,
    avatar: (index: number) => `${assetURL}/assets/images/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) => `${assetURL}/assets/images/travel/travel-${index + 1}.webp`,
    course: (index: number) => `${assetURL}/assets/images/course/course-${index + 1}.webp`,
    company: (index: number) => `${assetURL}/assets/images/company/company-${index + 1}.webp`,
    product: (index: number) => `${assetURL}/assets/images/m-product/product-${index + 1}.webp`,
    portrait: (index: number) => `${assetURL}/assets/images/portrait/portrait-${index + 1}.webp`,
  },
  subjects: () => getRandomSubjects(),
};
