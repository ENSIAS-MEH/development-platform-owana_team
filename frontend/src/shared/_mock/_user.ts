import type { ChildUser, ParentUser } from 'src/contexts/types/user';

import dayjs from 'dayjs';

import { _mock, _mockListUsers } from './_mock';
import { _purchasedSubscriptions } from './_abonnements';

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
  { value: 'rejected', label: 'Rejected' },
];

export const _userAbout = {
  id: _mock.id(1),
  role: _mock.role(1),
  email: _mock.email(1),
  school: _mock.companyNames(2),
  company: _mock.companyNames(1),
  country: _mock.countryNames(2),
  coverUrl: _mock.image.cover(3),
  totalFollowers: _mock.number.nativeL(1),
  totalFollowing: _mock.number.nativeL(2),
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  socialLinks: {
    facebook: `https://www.facebook.com/caitlyn.kerluke`,
    instagram: `https://www.instagram.com/caitlyn.kerluke`,
    linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitter: `https://www.twitter.com/caitlyn.kerluke`,
  },
};

export const _userFollowers = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  country: _mock.countryNames(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _userFriends = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _userGallery = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  imageUrl: _mock.image.cover(index),
}));

export const _userFeeds = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  createdAt: _mock.time(index),
  media: _mock.image.travel(index + 1),
  message: _mock.sentence(index),
  personLikes: [...Array(20)].map((__, personIndex) => ({
    name: _mock.fullName(personIndex),
    avatarUrl: _mock.image.avatar(personIndex + 2),
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(index + 5),
        name: _mock.fullName(index + 5),
      },
      createdAt: _mock.time(2),
      message: 'Praesent venenatis metus at',
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(index + 6),
        name: _mock.fullName(index + 6),
      },
      createdAt: _mock.time(3),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
    },
  ],
}));

export const _userCards = [...Array(21)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  coverUrl: _mock.image.cover(index),
  avatarUrl: _mock.image.avatar(index),
  totalFollowers: _mock.number.nativeL(index),
  totalPosts: _mock.number.nativeL(index + 2),
  totalFollowing: _mock.number.nativeL(index + 1),
}));

export const _userPayment = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  cardNumber: ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 7878'][index],
  cardType: ['mastercard', 'visa', 'visa'][index],
  primary: index === 1,
}));

export const _userAddressBook = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  phoneNumber: _mock.phoneNumber(index),
  fullAddress: _mock.fullAddress(index),
  addressType: (index === 0 && 'Home') || 'Office',
}));

export const _userInvoices = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-199${index}`,
  createdAt: _mock.time(index),
  price: _mock.number.price(index),
}));

export const _userPlans = [
  { subscription: 'basic', price: 0, primary: false },
  { subscription: 'starter', price: 4.99, primary: true },
  { subscription: 'premium', price: 9.99, primary: false },
];

export const _userList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  zipCode: '85807',
  state: 'Virginia',
  city: 'Rancho Cordova',
  role: _mock.role(index),
  email: _mock.email(index),
  address: '908 Jack Locks',
  name: _mock.fullName(index),
  isVerified: _mock.boolean(index),
  company: _mock.companyNames(index),
  country: _mock.countryNames(index),
  avatarUrl: _mock.image.avatar(index),
  phoneNumber: _mock.phoneNumber(index),
  status:
    (index % 2 && 'pending') || (index % 3 && 'banned') || (index % 4 && 'rejected') || 'active',
}));

export const USER_STATUS = [
  { value: 'Actif', label: 'Actif' },
  { value: 'Suspendu', label: 'Suspendu' },
  { value: 'Bloqué', label: 'Bloqué' },
  { value: 'Supprimé ', label: 'Supprimé' },
];

export const ROLE_OPTIONS = [
  { value: 'Tous', label: 'Tous' },
  { value: 'Admin', label: 'Admins' },
  { value: 'Parent', label: 'Parents' },
  { value: 'Enfant', label: 'Enfants' },
]; // adapte le chemin si besoin

const numberOfParents = 6;
const numberOfChildrenPerParent = 2;

const children: ChildUser[] = [];

const parents: ParentUser[] = [...Array(numberOfParents)].map((__, parentIndex) => {
  const id = _mockListUsers.id(parentIndex);

  const parentChildren: ChildUser[] = [...Array(numberOfChildrenPerParent)].map(
    (___, childIndex) => {
      const index = numberOfParents + parentIndex * numberOfChildrenPerParent + childIndex;
      const child: ChildUser = {
        id: _mockListUsers.id(index),
        role: 'Enfant',
        email: _mockListUsers.email(index),
        firstName: _mockListUsers.firstName(index),
        lastName: _mockListUsers.lastName(index),
        photo: _mockListUsers.image.avatar(index),
        phoneNumber: _mockListUsers.phoneNumber(index),
        status: 'ACTIVE',
        createdAt: _mock.time(index),
        lastLogin: dayjs(_mock.time(index)).add(5, 'day').toISOString(),
        birthDate: dayjs(_mock.time(index)).subtract(12, 'year').toISOString(),
        parentId: id,
        subjects: _mockListUsers.subjects(),
        daily_question_limit: Math.floor(Math.random() * 5) + 1,
      };
      children.push(child);
      return child;
    }
  );

  const parent: ParentUser = {
    id,
    role: 'Parent',
    email: _mockListUsers.email(parentIndex),
    firstName: _mockListUsers.firstName(parentIndex),
    lastName: _mockListUsers.lastName(parentIndex),
    photo: _mockListUsers.image.avatar(parentIndex),
    phoneNumber: _mockListUsers.phoneNumber(parentIndex),
    status: 'ACTIVE',
    createdAt: _mock.time(parentIndex),
    lastLogin: dayjs(_mock.time(parentIndex)).add(5, 'day').toISOString(),
    birthDate: dayjs(_mock.time(parentIndex)).subtract(35, 'year').toISOString(),
    subscription: _purchasedSubscriptions[parentIndex],
    children: parentChildren,
  };

  return parent;
});

export const _listUsers = [...parents, ...children];
