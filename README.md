# Mobile Playground

### Description

The purpose of this repo is to have a pretty basic app that let us build
it with different technologies with not much hassle. The point of redoing
 the same app using different mobile tools is to be able to detect what
 are the trade offs you have to deal with when you choose a tool. This 
 way we can have more context for further decisions on the tools we use 
 to build the next billion users app. :fire:

### Structure

The file structure will be with the follow structure:

- {appName}-{tool}
- {appName}-{tool2}
- {appName}-{tool3}

There will be a folder with the working application using the technology
 used as a suffix in the folder name.

### Application

The app consists of just a list where you can see all the Pokemon
available in the [PokeApi](https://pokeapi.co/) v2, from which we will
fetch the data.

Features so far:

- One row per pokemon, displaying it's name, image and number in the poke
dex.
- Infinite scroll, loading 50 pokemon per loading.
- Local cache (Only in `React Native` client... so far).

### Roadmap

- ~~[Kotlin client](https://kotlinlang.org/docs/reference/android-overview.html)~~.
- ~~[React Native client](https://facebook.github.io/react-native/)~~.
- ~~[Flutter client](https://flutter.io/)~~.
- ~~Add lazy loading until all pokemon are fetched~~.
- Add thoughts/notes about findings on using each tool.
- Local cache.
- Be able to mark a pokemon as favorite and display the favorites one in
another list.
- Details of a pokemon, this will take the user to another screen where
the user can see more info of the pokemon selected, make it a slide show
 so the user can see the details of the next/previous pokemon.
- Add tests.
- Add [Swift](https://developer.apple.com/swift/) client.
- Add [Kotlin Native](https://kotlinlang.org/docs/reference/native-overview.html) client for iOS.
