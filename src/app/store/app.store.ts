import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { switchMap, tap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

import { DictionariesService } from "../services/dictionaries.service";
import { initialAppSlice } from "./app.slice";
import { changeLanguage, resetLanguages, setBusy, setDictionary } from "./app.updaters";
import { NotificationsService } from "../services/notifications.service";
import { ColorQuizGeneratorService } from "../services/color-quiz-generator.service";

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppSlice),
    withDevtools('app-store'),
    withProps(_ => {
        const _dictionariesService = inject(DictionariesService);
        const _languages = _dictionariesService.languages;

        return {
            _dictionariesService,
            _languages,
            _notification: inject(NotificationsService),
            _quizGeneratorService: inject(ColorQuizGeneratorService)
        }
    }),
    withMethods(store => {
        const _invalidateDictionary = rxMethod<string>(input$ => input$.pipe(
                tap(_ => patchState(store, setBusy(true))),
                switchMap(lang => store._dictionariesService.getDictionaryWithDelay(lang).pipe(
                    tapResponse({
                        next: dict => patchState(store, setDictionary(dict), setBusy(false)),
                        error: err => store._notification.error(`${err}`),
                        finalize: () => patchState(store, setBusy(false))
                    })
                ))
            )
    );

        _invalidateDictionary(store.selectedLanguage);

        return {
            changeLanguage: () => patchState(store, changeLanguage(store._languages)),
            _resetLanguages: () => patchState(store, resetLanguages(store._languages))
        }
    }),
    withHooks(store => ({
        onInit: () => {
            store._resetLanguages();
        }
    }))
)