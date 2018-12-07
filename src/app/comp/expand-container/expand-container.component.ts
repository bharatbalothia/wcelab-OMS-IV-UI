import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { _MatTabLabelWrapperMixinBase } from '@angular/material/tabs/typings/tab-label-wrapper';

@Component({
  selector: 'app-expand-container',
  templateUrl: './expand-container.component.html',
  styleUrls: ['./expand-container.component.less']
})
export class ExpandContainerComponent implements OnInit {

  private static nextId = 0;

  @HostBinding() id = `app-expand-container-${ExpandContainerComponent.nextId++}`;
  
  private _color: string;
  
  @Input() 
  public get color() : string {
    return this._color
  }
  public set color(v : string) {
    this._color = v;
  }
  
  
  private _label: string;
  @Input()
  public get label() : string {
    return this._label;
  }
  public set label(v : string) {
    this._label = v;
  }
  
  
  private _expanded: boolean;
  @Input()
  public get expanded() : string | boolean {
    return this._expanded;
  }
  public set expanded(v : string | boolean) {
    
    if (typeof v === "boolean") {
      this._expanded = v;
    } else {
      this._expanded = JSON.parse(v);
    };

    console.debug("Setting expanded: %s ************* %s ******", this.expanded, typeof v);
    
  }
  
  
  
  constructor() { }

  ngOnInit() {
  }

}
