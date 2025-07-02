# Try It yourself - async methods
In this exercise we will practice:
1. Calling async APIs from the signal store
2. Using Promises and `async-await`

## Setup
1. In app store, Inject the `DictionariesService` and store it privately using `withProps`
2. Remove the `withComputed` feature that derived the current dictionary synchronously from the selected language


## `withMethods`
1. Create a method in the `withMethods` closure called '_invalidateDictionary` and make it an async method
2. Use `patchState` to set the `isBusy` flag to true
3. Run the async API in the service
   1. use `firstValueFrom` to convert the `Observable` into a `Promise`
   2. await the result
4. Patch state again to set the busy flag to false, and to set the current dictionary