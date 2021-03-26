import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { ChecklistDatabase } from "./tree-database";
import { TreeItemFlatNode, TreeItemNode, TREE_DATA } from "./../treeDataSource/codeTree";



@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  providers: [ChecklistDatabase] //another way of importing a provider
})
export class TreeComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  //this says that the key is of type: TreeItemFlatNode and it's value is the
  //Tree Item Node
  //get the nested node by the flat node
  flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  //get the flat node by the nested node.
  nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  //pass the nested node, and level
  //return a flat node with information
  //based on the nested node and the level
  transformer = (node: TreeItemNode, level: number) => {
    //get the FLAT node by nested node.
    const existingNode = this.nestedNodeMap.get(node);
    //if a flat node.item (in our case it would be node.label) exist
    //as a result of the get, and both the flat and nested node labels are teh
    //same, then flat node is that existing node. otherwise make a new one
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TreeItemFlatNode();
    //this is redundant if it exists but whatevs
    flatNode.item = node.item;
    //assign the flat node the level
    flatNode.level = level;
    //assign the flat node the "code"
    flatNode.code = node.code;
    flatNode.expandable = node.children && node.children.length > 0;
    //while we are here, set the flatnode map
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  /** A selected parent node to be inserted */
  //selectedParent: TreeItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  //set up the tree control to use the flat node class we defined
  treeControl: FlatTreeControl<TreeItemFlatNode>;

  //set up the tree flattener to use the flat node and nested node we defined
  treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

  //set up the datasource to use the nested and flat node we defined
  dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;

  /** The selection for checklist */
  //checklistSelection = new SelectionModel<TreeItemFlatNode>(false /* multiple */);

  constructor(private database: ChecklistDatabase) {
    //transformer shows how to transform a nested node to a flat node
    //a function that gets level, is exandable by certain flat node properties
    //get children uses the nested node property
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    //same as above, the properties of the flat node and functions on how to
    //get those properties
    this.treeControl = new FlatTreeControl
      <TreeItemFlatNode>(this.getLevel,
        this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl, this.treeFlattener);

    //set the data of the tree (datasource ) to the reuslt of an observable that
    //you subscribe to
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TreeItemFlatNode) => node.level;

  isExpandable = (node: TreeItemFlatNode) => node.expandable;

  getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;


  filterChanged(filterText: string) {
    //use the filter function in the database
    this.database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }
}
