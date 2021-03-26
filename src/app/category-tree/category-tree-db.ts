import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { categoryFlatNode, categoryNode, categoryData } from "./../treeDataSource/categoryTree";

export const fullTree = categoryData;
/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class categoryTreeDb {

  //pass back the tree data which is an array of nested nodes
  //use a behavior subject that tracks the last value that you
  //can get. We start off with an empty array
  dataChange = new BehaviorSubject<categoryNode[]>([]);
  currentTree: any[];
  isMatch = ({
    label
  }, filteredText) => label.toLowerCase().indexOf(filteredText.toLowerCase()) > -1;


  //when you want the tree data, just use "data"
  //get data(): categoryNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    this.currentTree = categoryData;
    //send the tree data
    this.dataChange.next(this.currentTree);
  }

  filterTree(array, findTextMatchFn, filteredText) { //is match returns either tru or false
    return array.reduce((acc, nV) => {
      //first call the filter function again on the children
      var children = this.filterTree(nV.children || [], findTextMatchFn, filteredText);
      //passing "nV" pulls out the label and does a compare that results
      //in either tru or false
      if (findTextMatchFn(nV, filteredText) || children.length) {
        //object.assign can have multiple sources. the rightmost has the most precendence
        //first two arguments make a copy of nV (the node )
        //last argument replaces the children with the filtered children in this functino
        acc.push(Object.assign({}, nV, children.length && {
          children
        }))
      };
      return acc;
    }, []);
  }

  //this depends on a flat set of data to traverse.
  //maybe create a map of nodes
  public filter(filterText: string) {
    if (filterText && filterText.length > 2)
      this.currentTree = this.filterTree(fullTree, this.isMatch, filterText);
    else
      this.currentTree = fullTree
    this.dataChange.next(this.currentTree);
  }


  copyObj(o) {
    return Object.assign({}, o)
  }

  nodeHasChildren(node: categoryNode): boolean {
    return (typeof node === 'object')
      && (typeof node.children !== 'undefined')
      && (node.children.length > 0);
  }

}
