import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    readonly #snackbar = inject(MatSnackBar);

    success(message: string): void {
        this.#openSnackBar(message, 'Ok', 'success-snackbar');
    }

    error(message: string): void {
        this.#openSnackBar(message, 'Ok', 'error-snackbar');
    }

    #openSnackBar(
        message: string,
        action: string,
        className = '',
        duration = 50000
    ) {
        this.#snackbar.open(
            message,
            action,
            {
                duration,
                panelClass: [className]
            }
        )
    }
}