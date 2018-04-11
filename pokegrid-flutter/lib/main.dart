import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';

// Constants
const BASE_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=';
const BASE_IMAGE_URL =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const OFFSET_STEP = 50;

var httpClient = HttpClient();

void main() => runApp(MyApp());

class Pokemon {
  var name, number;

  Pokemon(this.name, this.number);

  factory Pokemon.fromJson(json) {
    var paths = json['url'].toString().split('/');
    return Pokemon(json['name'], paths[paths.length - 2]);
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PokeGrid',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'PokeGrid'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;

  MyHomePage({Key key, this.title}) : super(key: key);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final _pokemons = <Pokemon>[];
  final _scrollController =
      ScrollController(debugLabel: 'PokemonScrollController');
  var _isLoading = false;

  _fetchPokemons([offset = 0]) async {
    final url = '$BASE_API_URL$offset';

    try {
      var request = await httpClient.getUrl(Uri.parse(url));
      var response = await request.close();

      if (response.statusCode == HttpStatus.OK) {
        var jsonString = await response.transform(utf8.decoder).join();
        var data = json.decode(jsonString)['results'];
        var pokemons = data.map((json) => Pokemon.fromJson(json));

        if (mounted) {
          setState(() {
            _pokemons.addAll(pokemons);
          });
        }
      }
    } finally {
      _isLoading = false;
    }
  }

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if (!_isLoading && _scrollController.position.extentAfter == 0.0) {
        _isLoading = true;
        _fetchPokemons(_pokemons.length);
      }
    });

    _fetchPokemons();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: ListView.builder(
            controller: _scrollController,
            itemCount: _pokemons.length,
            itemBuilder: (context, index) => PokemonItem(_pokemons[index])));
  }
}

class PokemonItem extends StatelessWidget {
  final Pokemon pokemon;

  PokemonItem(this.pokemon);

  @override
  Widget build(BuildContext context) {
    return ListTile(
        leading: FadeInImage.assetNetwork(
            placeholder: 'images/poke_ball.png',
            image: '$BASE_IMAGE_URL${pokemon.number}.png'),
        title: Text(pokemon.name),
        trailing: Text('#${pokemon.number}'));
  }
}
