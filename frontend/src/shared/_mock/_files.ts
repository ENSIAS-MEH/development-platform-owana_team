import dayjs from 'dayjs';

import { _mock } from 'src/shared/_mock/_mock';
import { _tags, _fileNames } from 'src/shared/_mock/assets';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;


const hierarchy = [
  {
    niveau: 'Niveau 1',
  },
  {
    niveau: 'Niveau 2',
  },
];



const FOLDERS = ['Documents', 'Projets', 'Travail', 'Formation', 'Sport', 'Aliments'];
const SUBFOLDER_PREFIXES = ['Images', 'Vidéos', 'Audio', 'Documents', 'Archives', 'Présentations'];

const URLS = [
  _mock.image.cover(1),
  'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
  'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
  'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
  _mock.image.cover(3),
  _mock.image.cover(5),
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
  'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
  'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/vintage_bahrain_saipan.xls',
  'https://www.cloud.com/s/c218bo6kjuqyv66/indonesia-quito-nancy-grace-left-glad.xlsx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/legislation-grain.zip',
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_energy_dry_philippines.rar',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-243-ecuador.iso',
  'https://www.cloud.com/s/c218bo6kjuqyv66/kyrgyzstan-04795009-picabo-street-guide-style.ai',
  'https://www.cloud.com/s/c218bo6kjuqyv66/india-data-large-gk-chesterton-mother.esp',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-barbados-celine-dion.ppt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_respectively_366996.pptx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_ahead_531437_sweden_popup.wav',
  'https://www.cloud.com/s/c218bo6kjuqyv66/trinidad_samuel-morse_bring.m4v',
  _mock.image.cover(11),
  _mock.image.cover(17),
  'https://www.cloud.com/s/c218bo6kjuqyv66/xl_david-blaine_component_tanzania_books.pdf',
];

// ----------------------------------------------------------------------

export interface IItemBase {
  id: string;
  name: string;
  parentId: string | null;
}

export type IFolderMock = IItemBase & {
  type: 'dossier';
  url: string;
  tags: string[];
  size: number;
  totalFiles: number;
  createdAt: string;
  modifiedAt: string;
  isFavorited: boolean;
  description: string;
  niveau: string;  
};

export type IFileMock = IItemBase & {
  url: string;
  tags: string[];
  size: number;
  createdAt: string;
  modifiedAt: string;
  type: string;
  description: string;
  isFavorited: boolean;
};

export const _mainFolders: IFolderMock[] = FOLDERS.map((name, index) => ({
  id: `${_mock.id(index)}_folder`,
  name,
  parentId: null,
  type: 'dossier',
  url: URLS[index],
  tags: _tags.slice(0, 5),
  size: GB / ((index + 1) * 10),
  totalFiles: index + 1,
  createdAt: _mock.time(index),
  modifiedAt: _mock.time(index),
  isFavorited: _mock.boolean(index + 1),
  description: _mock.description(index),
  niveau: getRandomHierarchy(index),
}));

export const _subFolders: IFolderMock[] = [];

const usedSubfolderNames = new Set<string>();

_mainFolders.forEach((mainFolder) => {
  const numSubfolders = Math.floor(Math.random() * 3) + 1;
  
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numSubfolders; i++) {
    const subfolderPrefix = SUBFOLDER_PREFIXES[i % SUBFOLDER_PREFIXES.length];
    const subfolderName = `${subfolderPrefix} - ${mainFolder.name}`;
        let uniqueCounter = 1;
    let uniqueName = subfolderName;
    while (usedSubfolderNames.has(uniqueName)) {
      uniqueName = `${subfolderName} (${uniqueCounter})`;
      // eslint-disable-next-line no-plusplus
      uniqueCounter++;
    }
    
    usedSubfolderNames.add(uniqueName);
    
    const subfolderId = `${_mock.id(i + _mainFolders.length)}_subfolder_${mainFolder.id}`;
    
    _subFolders.push({
      id: subfolderId,
      name: uniqueName,
      parentId: mainFolder.id,
      type: 'dossier',
      url: URLS[(i + _mainFolders.length) % URLS.length],
      tags: _tags.slice(0, 3),
      size: GB / ((i + 1) * 20),
      totalFiles: i + 1,
      createdAt: _mock.time(i + _mainFolders.length),
      modifiedAt: _mock.time(i + _mainFolders.length),
      isFavorited: _mock.boolean(i),
      description: `Subfolder for ${mainFolder.name}`,
      niveau: getRandomHierarchy(i + _mainFolders.length),
    });
    
    if (Math.random() > 0.7) {
      const deeperSubfolderPrefix = SUBFOLDER_PREFIXES[(i + 3) % SUBFOLDER_PREFIXES.length];
      const deeperSubfolderName = `${deeperSubfolderPrefix} - ${uniqueName}`;
      
      uniqueCounter = 1;
      let uniqueDeeperName = deeperSubfolderName;
      while (usedSubfolderNames.has(uniqueDeeperName)) {
        uniqueDeeperName = `${deeperSubfolderName} (${uniqueCounter})`;
        // eslint-disable-next-line no-plusplus
        uniqueCounter++;
      }
      
      usedSubfolderNames.add(uniqueDeeperName);
      
      const deeperSubfolderId = `${_mock.id(i + _mainFolders.length + _subFolders.length)}_deeper_subfolder`;
      
      _subFolders.push({
        id: deeperSubfolderId,
        name: uniqueDeeperName,
        parentId: subfolderId,
        type: 'dossier',
        url: URLS[(i + _mainFolders.length + 1) % URLS.length],
        tags: _tags.slice(0, 2),
        size: GB / ((i + 1) * 30),
        totalFiles: i,
        createdAt: _mock.time(i + _mainFolders.length + 10),
        modifiedAt: _mock.time(i + _mainFolders.length + 10),
        isFavorited: false,
        description: `Deeper subfolder for ${uniqueName}`,
        niveau: getRandomHierarchy(i + _mainFolders.length),
      });
    }
  }
});

function getRandomHierarchy(index: number): string {
  const { niveau } = hierarchy[Math.floor(Math.random() * hierarchy.length)];
  return niveau;
}


export const _folders: IFolderMock[] = [..._mainFolders, ..._subFolders];

function getRandomParent(): string | null {
  if (Math.random() < 0.3) return null;
  
  const allFolders = _folders;
  const randomIndex = Math.floor(Math.random() * allFolders.length);
  return allFolders[randomIndex].id;
}

export const _files: IFileMock[] = _fileNames.map((name, index) => {
  const niveau = getRandomHierarchy(index)
  const parentId = getRandomParent();
  return {
    id: `${_mock.id(index)}_file_${index}`,
    name,
    parentId,
    url: URLS[index % URLS.length],
    tags: _tags.slice(0, 5),
    size: GB / ((index + 1) * 500),
    createdAt: _mock.time(index),
    modifiedAt: dayjs(_mock.time(index)).add(5, 'day').toISOString(),
    type: name.split('.').pop() || 'txt',
    description: _mock.description(index),
    isFavorited: _mock.boolean(index + 1),
    niveau
  };
});

export const _allItems: Array<IFolderMock | IFileMock> = [..._folders, ..._files];