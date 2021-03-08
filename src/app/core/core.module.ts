import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BackendCommunicationService } from './services/backend-communication.service';
import { SessionStorageService } from './services/session-storage.service';
import { WindowService } from './services/window.service';

@NgModule({
  declarations: [],
  providers: [
    BackendCommunicationService,
    SessionStorageService,
    WindowService
  ],
  imports: [
    HttpClientModule,
  ],
})
export class CoreModule { }
