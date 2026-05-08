import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../../services/authentication.service';
import { MatButton } from '@angular/material/button';

/**
 * Component responsible for displaying the authentication section of the UI.
 *
 * @summary
 * Displays buttons for sign-in, sign-up, and sign-out depending on the user's authentication state.
 * Listens to authentication state changes via observables from the {@link AuthenticationService}.
 */
@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [MatButton],
  templateUrl: './authentication-section.component.html',
  styleUrl: './authentication-section.component.css',
})
export class AuthenticationSectionComponent {
  /**
   * The username of the currently signed-in user.
   */
  currentUserName: string = '';

  /**
   * Indicates whether a user is currently signed in.
   */
  isSignedIn: boolean = false;

  /**
   * Constructs the component and subscribes to authentication observables.
   *
   * @param router - Angular router used to navigate between views.
   * @param authenticationService - Service used to access authentication state and perform sign-out.
   */
  constructor(
    private router: Router,
    private authenticationService: Authentication,
  ) {
    this.authenticationService.currentUsername.subscribe(
      (username) => (this.currentUserName = username),
    );
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => (this.isSignedIn = isSignedIn));
  }

  /**
   * Navigates the user to the login page.
   */
  onSignIn() {
    this.router.navigate(['/login']).then();
  }

  /**
   * Navigates the user to the sign-up/registration page.
   */
  onSignUp() {
    this.router.navigate(['/signup']).then();
  }

  /**
   * Signs out the user and clears their session data.
   */
  onSignOut() {
    this.authenticationService.signOut();
  }
}
