import { Injectable } from '@angular/core';
//import { SelectionModel } from '@angular/cdk/collections';
//import { FlatTreeControl } from '@angular/cdk/tree';
//import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import { TreeItemFlatNode, TreeItemNode, TREE_DATA } from "./../treeDataSource/codeTree";

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

  //pass back the tree data which is an array of nested nodes
  //use a behavior subject that tracks the last value that you
  //can get. We start off with an empty array
  dataChange = new BehaviorSubject<TreeItemNode[]>([]);
  treeData: any[];

  //when you want the tree data, just use "data"
  get data(): TreeItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    this.treeData = TREE_DATA;
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, '0');

    //send the tree data
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */

  //pass the tree data with the code number.  start wit level 0
  buildFileTree(obj: any[], level: string): TreeItemNode[] {
    //where o has text and a code.
    //level is dependent on how many "."
    //ONE . is root
    //two .'s, under root - roots children --level 2
    return obj.filter(o => //find nodes at given level
      (<string>o.code).startsWith(level + '.') //level is 0 so 0.1 is true
      && (o.code.match(/\./g) || []).length ===  //if find dots, how may? (or zero)
      (level.match(/\./g) || []).length + 1
    )
      .map(o => { //for each node found at that level
        const node = new TreeItemNode(); //create a nested node
        node.item = o.text; //set it's label
        node.code = o.code; //set it's code
        //set it's children
        const children = obj.filter(so => (<string>so.code).startsWith(level + '.'));
        if (children && children.length > 0) {
          //for each child, built it's tree whci means a tree of nodes
          node.children = this.buildFileTree(children, o.code);
        }
        return node;
      });
  }

  //this depends on a flat set of data to traverse.
  //maybe create a map of nodes
  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      filteredTreeData = this.treeData.filter(d => //is letter set part of the node label?
        d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
      //assign the filtered data to an array
      Object.assign([], filteredTreeData).forEach(ftd => {
        let str = (<string>ftd.code);
        while (str.lastIndexOf('.') > -1) {
          const index = str.lastIndexOf('.');//1,3,5 depending on number of levels
          str = str.substring(0, index);//number
          if (filteredTreeData.findIndex(t => t.code === str) === -1) {
            const obj = this.treeData.find(d => d.code === str);
            if (obj) {
              filteredTreeData.push(obj);
            }
          }
        }
      });
    } else {
      filteredTreeData = this.treeData;
    }

    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    const data = this.buildFileTree(filteredTreeData, '0');
    // Notify the change.
    this.dataChange.next(data);
  }
}
