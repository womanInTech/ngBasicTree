import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { categoryTreeDb } from "./category-tree-db";
import { categoryFlatNode, categoryNode, categoryData } from "./../treeDataSource/categoryTree";


@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.css'],
  providers: [categoryTreeDb]
})
export class categoryTreeComponent implements OnInit {
  selectedFlatNode: string;
  treeControl: FlatTreeControl<categoryFlatNode>;
  treeFlattener: MatTreeFlattener<categoryNode, categoryFlatNode>;
  dataSource: MatTreeFlatDataSource<categoryNode, categoryFlatNode>;

  transformer = (node: categoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.label,
      level: level,
    };
  }

  getLevel = (node: categoryFlatNode) => node.level;
  isExpandable = (node: categoryFlatNode) => node.expandable;
  getChildren = (node: categoryNode): categoryNode[] => node.children;
  hasChild = (_: number, _nodeData: categoryFlatNode) => _nodeData.expandable;


  constructor(private db: categoryTreeDb) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    )

    this.treeControl = new FlatTreeControl<categoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    db.dataChange.subscribe(data => {
      this.dataSource.data = data
    })
  }

  ngOnInit(): void {
  }

  filterChanged(filterText: string) {
    this.db.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    }
    else {
      this.treeControl.collapseAll();
    }
  }

  selectNode(nodeSelected: categoryFlatNode) {
    this.selectedFlatNode = nodeSelected.name;
  }


  isSelected(node: categoryFlatNode): any {
    let selected = (node.name === this.selectedFlatNode) ? true : false;
    return { 'highlightNode': selected }
  }


}
