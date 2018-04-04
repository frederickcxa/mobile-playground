package com.fcorcino.pokegrid

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_poke_grid.*
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

// Constants
const val BASE_API_URL = "https://pokeapi.co/api/v2"
const val BASE_IMAGE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"
const val VISIBLE_THRESHOLD = 25
const val OFFSET_STEPS = 50

// Models
data class Pokemon(val number: String, val name: String)

// Activity
class PokeGridActivity : AppCompatActivity() {
    private val httpClient = OkHttpClient()
    private val imageHandler = Picasso.get()
    private val viewAdapter = PokemonAdapter()
    private var loading = false
    private var currentOffset = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_poke_grid)
        setUpRecyclerView()
        fetchPokemons()
    }

    private fun setUpRecyclerView() {
        with(pokemonRecycler) {
            setHasFixedSize(true)

            val linearLayoutManager = LinearLayoutManager(this@PokeGridActivity)
            layoutManager = linearLayoutManager
            adapter = viewAdapter

            addOnScrollListener(object : RecyclerView.OnScrollListener() {
                override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                    super.onScrolled(recyclerView, dx, dy)

                    val totalItemCount = linearLayoutManager.itemCount
                    val lastVisibleItem = linearLayoutManager.findLastVisibleItemPosition()

                    if (!loading && totalItemCount <= (lastVisibleItem + VISIBLE_THRESHOLD)) {
                        loading = true
                        currentOffset += OFFSET_STEPS
                        fetchPokemons(currentOffset)
                    }
                }
            })
        }
    }

    private fun fetchPokemons(offset: Int = 0) {
        val url = "$BASE_API_URL/pokemon?limit=50&offset=$offset"
        val request = Request.Builder()
                .url(url)
                .build()

        httpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call?, e: IOException?) {}

            override fun onResponse(call: Call?, response: Response?) {
                response?.let {
                    val results = JSONObject(it.body()?.string()).getJSONArray("results") ?: return
                    val pokemons = (0 until results.length())
                            .map { results.getJSONObject(it) }
                            .map {
                                val number = it.getString("url")
                                        .removeSuffix("/")
                                        .split("/")
                                        .last()

                                Pokemon(
                                        number = number,
                                        name = it.getString("name")
                                )
                            }

                    loading = false

                    runOnUiThread {
                        progressBar.visibility = View.GONE
                        viewAdapter.addAll(*pokemons.toTypedArray())
                    }
                }
            }
        })
    }

    inner class PokemonAdapter(
            private val pokemons: ArrayList<Pokemon> = ArrayList()
    ) : RecyclerView.Adapter<PokemonAdapter.ViewHolder>() {

        inner class ViewHolder(item: View) : RecyclerView.ViewHolder(item) {
            val pokemonNameText = item.findViewById(R.id.pokemonNameText) as TextView
            val pokemonNumberText = item.findViewById(R.id.pokemonNumberText) as TextView
            val pokemonImage = item.findViewById(R.id.pokemonImage) as ImageView

            fun bind(pokemon: Pokemon) {
                with(pokemon) {
                    val imageUrl = "$BASE_IMAGE_URL/$number.png"
                    pokemonNameText.text = name.capitalize()
                    pokemonNumberText.text = "#$number"
                    imageHandler.load(imageUrl)
                            .placeholder(R.drawable.poke_ball)
                            .into(pokemonImage)
                }
            }
        }

        fun addAll(vararg pokemons: Pokemon) {
            this.pokemons.addAll(pokemons)
            notifyDataSetChanged()
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
                LayoutInflater.from(parent.context).inflate(R.layout.item_pokemon, parent, false).let { ViewHolder(it) }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            holder.bind(pokemons[position])
        }

        override fun getItemCount() = pokemons.size
    }
}
