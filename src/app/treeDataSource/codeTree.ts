/** Flat to-do item node with expandable and level information */
export class TreeItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  code: string;
}

/**
 * Node for to-do item
 */
export class TreeItemNode {
  children: TreeItemNode[];
  item: string;
  code: string;
}

/**
 * The Json object for to-do list data.
 */
export const TREE_DATA = [
  { 'text': 'Turkiye', 'code': '0.1' },
  { 'text': 'İstanbul', 'code': '0.1.1' },
  { 'text': 'Beykoz', 'code': '0.1.1.1' },
  { 'text': 'Fatih', 'code': '0.1.1.1' },
  { 'text': 'Ankara', 'code': '0.1.2' },
  { 'text': 'Cankaya', 'code': '0.1.2.1' },
  { 'text': 'Etimesgut', 'code': '0.1.2.1' },
  { 'text': 'Elazig', 'code': '0.1.3' },
  { 'text': 'Palu', 'code': '0.1.3.1' },
  { 'text': 'Baskil', 'code': '0.1.3.2' },
  { 'text': 'Sivrice', 'code': '0.1.3.3' }
];
