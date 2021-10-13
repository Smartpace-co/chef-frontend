import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-troubleshooting',
  templateUrl: './troubleshooting.component.html',
  styleUrls: ['./troubleshooting.component.scss']
})
export class TroubleshootingComponent implements OnInit {

  troubleshootingList=[
    {
      icon: "./assets/images/troubleshoot_wifi.svg",
      title:"Internet Connections",
      message:"Find and fix problems with connecting to the internet or to applications",
    },
    {
      icon: "./assets/images/troubleshoot_audio.svg",
      title:"Playing Audio",
      message:"Find and fix problems with playing sound",
    },
    {
      icon: "./assets/images/troubleshoot_printer.svg",
      title:"Printer",
      message:"Find and fix problems with printer",
    },
    {
      icon: "./assets/images/troubleshoot_update.svg",
      title:"Update",
      message:"Resolve problems by application updates.",
    },
    {
      icon: "./assets/images/troubleshoot_signin.svg",
      title:"Can’t Sign In",
      message:"Find and fix problems with Signing In",
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
