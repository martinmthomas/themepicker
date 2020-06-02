import { Component, Renderer2, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'theme-picker';
  currentTheme = 'default-mode';

  constructor(private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.renderer.addClass(document.body.parentElement, 'default-mode');
  }

  applyDefaultTheme() {
    this.applyTheme('default-mode');
  }

  applyLightTheme() {
    this.applyTheme('light-mode');
  }

  applyDarkTheme() {
    this.applyTheme('dark-mode');
  }

  applyTheme(themeName: string) {
    if (this.currentTheme !== themeName) {

      // default theme is not generated separately but it is part of the main styles.scss. 
      if (themeName !== 'default-mode') { 
        if (environment.production) {
          let stylesheetLink = this.renderer.createElement('link');
          stylesheetLink.rel = 'stylesheet';
          stylesheetLink.href = `theme-${themeName}.css`;
          this.renderer.appendChild(document.body, stylesheetLink);
        }
        else { // in dev environment styles are always generated as .js files for performance reasons
          let stylesheetLink = this.renderer.createElement('script');
          stylesheetLink.src = `theme-${themeName}.js`;
          this.renderer.appendChild(document.body, stylesheetLink);
        }
      }

        // Remove current theme from html element and apply the selected theme
        // Removing css class could cause a flickering effect on screen, if this happens before
        // the stylesheet is downloaded. Therefore, trigger the logic after a safe time interval
      setTimeout(() => {
        this.renderer.removeClass(document.body.parentElement, this.currentTheme);
        this.renderer.addClass(document.body.parentElement, themeName);
        this.currentTheme = themeName;
      }, 500);
    }
  }
}
