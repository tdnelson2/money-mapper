import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrls: ['./toast-messages.component.css']
})
export class ToastMessagesComponent implements OnInit {

  constructor(
    public toastr: ToastsManager,
    vcr:           ViewContainerRef
    ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.toastr.onClickToast()
    .subscribe( toast => {
        this.installUpdate(toast.data as ServiceWorker);
        this.toastr.dismissToast(toast);
    });
  }

  updateServiceWorker() {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.register('/sw.js').then( reg => {

      // If this is the first visit, don't prompt for update
      if (!navigator.serviceWorker.controller) return;

      // If there's an updated worker already waiting, notify the user.
      if (reg.waiting) {
        this.updateReady(reg.waiting);
        return;
      }

      // If there's an updated worker installing, track its
      // progress. If it becomes "installed", notify the user.
      if (reg.installing) {
        this.trackInstalling(reg.installing);
        return;
      }

      // Otherwise, listen for new installing workers arriving.
      // If one arrives, track its progress.
      // If it becomes "installed", , notify the user.
      reg.addEventListener('updatefound', () => {
        this.trackInstalling(reg.installing);
      });
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }

  private trackInstalling(sw: ServiceWorker) {
    sw.addEventListener('statechange', () => {
      if (sw.state == 'installed') {
        this.updateReady(sw);
      }
    });

  }

  updateReady(sw: ServiceWorker) {
    this.toastr.custom('INSTALL UPDATE', 'Update Available', {
      showCloseButton:true,
      dismiss: 'controlled',
      data: sw
    });
  }

  installUpdate(sw: ServiceWorker) {
    console.log('install clicked')
    sw.postMessage({action: 'skipWaiting'});
  }

  ngOnInit() {
    // Allow time for the SW to load
    setTimeout(() => {
      this.updateServiceWorker();
    }, 5000);
  }

}
