require 'rubygems'
require 'httparty'
require 'pry'
require 'uri'
require 'sinatra'
require 'haml'
require 'json'

API_URL = 'http://ws.spotify.com/search/1/track.json?q='
NO_RESULTS = {message: 'No results!'}
ERROR = {message: 'Something went wrong, please refresh the page and try again.'}
GA_ID = ENV['GA_ID'] if ENV['RACK_ENV'] == 'production'

before do
  if ENV['RACK_ENV'] == 'production' && request.url.split('//')[1][0..3] != "www."
    redirect "www.#{request.url}", 301
  end
end

get '/' do
  @sample = [
    {
      artist: 'Prince',
      song: '1999'
    },
    {
      artist: 'Radiohead',
      song: 'Creep'
    },
    {
      artist: 'Aesop Rock',
      song: 'Daylight'
    }
  ].shuffle.first

  haml :index
end

get '/search' do
  if params[:artist].nil? || params[:song].nil?
    ERROR.to_json
  else
    artist = params[:artist].downcase
    escaped_song = URI::escape(params[:song])
    response = HTTParty.get(API_URL + escaped_song)

    if !response
      ERROR.to_json
    else
      results = response['tracks'].find_all do |t|
        t['artists'].map { |a| a['name'].downcase }.member?(artist)
      end.sort_by do |t|
        t['album']['released'].to_i
      end.map do |t|
        "#{t['name']} appeared on #{t['artists'].first['name']}'s #{t['album']['name']} which was released in #{t['album']['released']}."
      end

      results = results.uniq

      if results.length > 0
        {message: 'Success!', results: results}.to_json
      else
        NO_RESULTS.to_json
      end
    end
  end
end
