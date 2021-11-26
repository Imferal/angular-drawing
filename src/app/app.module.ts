import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { CanvasComponent } from './components/image-field/canvas.component';
import { MatButtonModule } from '@angular/material/button';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AppComponent, MenuBarComponent, CanvasComponent, SideMenuComponent],
  imports: [
    MatCardModule,
    BrowserModule,
    MatInputModule,
    MatSliderModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
