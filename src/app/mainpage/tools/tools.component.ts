import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  @Input() icon:string = ""
  @Input() name:string = ""
  color:number = 0
  @Input() mastery:number = 0.5
  @Input() link:string = ""

  ngOnInit() {
    this.color = Math.random();
  }
}
