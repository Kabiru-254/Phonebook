import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeKey = 'darkMode';

  constructor(
  ) {
    this.applyStoredMode();
  }

  toggleMode() {
    const currentMode = this.getCurrentMode();
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    this.setMode(newMode);
  }

  // Get the current mode (light or dark)
  getCurrentMode(): string {
    return localStorage.getItem(this.darkModeKey) || 'light';
  }

  // Set the mode (light or dark)
  setMode(mode: string): void {
    localStorage.setItem(this.darkModeKey, mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }

  // Apply the stored mode from localStorage
  private applyStoredMode(): void {
    const storedMode = this.getCurrentMode();
    document.documentElement.classList.toggle('dark', storedMode === 'dark');
  }

}
