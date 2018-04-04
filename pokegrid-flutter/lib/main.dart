import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:convert';

// Constants
const BASE_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=';
const BASE_IMAGE_URL =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const OFFSET_STEP = 50;

var httpClient = new HttpClient();

void main() => runApp(new MyApp());

class Pokemon {
  String name, number;

  Pokemon(this.name, this.number);

  factory Pokemon.fromJson(json) {
    var paths = json['url'].toString().split('/');
    return new Pokemon(json['name'], paths[paths.length - 2]);
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'PokeGrid',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MyHomePage(title: 'PokeGrid'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;

  MyHomePage({Key key, this.title}) : super(key: key);

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var _pokemons = <Pokemon>[];
  var _scrollController = new ScrollController(debugLabel: 'PokemonScrollController');
  var _isLoading = false;
  var _currentOffset = 0;

  _fetchPokemons(offset) async {
    var url = '$BASE_API_URL$offset';
    var httpClient = new HttpClient();
    var pokemons = <Pokemon>[];

    try {
      var request = await httpClient.getUrl(Uri.parse(url));
      var response = await request.close();

      if (response.statusCode == HttpStatus.OK) {
        var jsonString = await response.transform(utf8.decoder).join();
        var data = json.decode(jsonString)['results'];

        data.forEach((json) {
          var pokemon = new Pokemon.fromJson(json);
          pokemons.add(pokemon);
        });
      }
    } catch (exception) {
      print(exception);
    }

    if (mounted) {
      setState(() {
        _pokemons.addAll(pokemons);
      });
    }

    _isLoading = false;
  }

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if (!_isLoading && _scrollController.position.extentAfter == 0.0) {
        _isLoading = true;
        _currentOffset += OFFSET_STEP;
        _fetchPokemons(_currentOffset);
      }
    });

    _fetchPokemons(_currentOffset);
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text(widget.title),
        ),
        body: new ListView.builder(
          controller: _scrollController,
          itemCount: _pokemons.length,
          itemBuilder: (context, index) {
            return new PokemonItem(_pokemons[index]);
          }
        ));
  }
}

class PokemonItem extends StatelessWidget {
  final Pokemon pokemon;

  PokemonItem(this.pokemon);

  @override
  Widget build(BuildContext context) {
    return new ListTile(
        leading: new FadeInImage.assetNetwork(
            placeholder: 'images/poke_ball.png',
            image: '$BASE_IMAGE_URL${pokemon.number}.png'
        ),
        title: new Text(pokemon.name),
        trailing: new Text('#${pokemon.number}'));
  }
}
