import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ApiDocSection {
  title: string;
  content: string;
  endpoint?: string;
  method?: string;
  api?: string; // 'github', 'youtube', 'spotify', 'twitter', 'googlemaps', 'stripe', 'openai', 'openweathermap', 'notion', 'reddit'
}

export class DocumentationFetcher {
  private cachedDocs: Map<string, ApiDocSection[]> = new Map();

  // Fetch comprehensive GitHub API documentation
  async fetchGitHubDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('github')) {
      return this.cachedDocs.get('github')!;
    }

    // Comprehensive GitHub API documentation
    const sections: ApiDocSection[] = [
      {
        title: 'List user repositories',
        content: 'GET /user/repos - Lists repositories for the authenticated user. Returns a list of repositories that the authenticated user has access to. Supports pagination and filtering by visibility, affiliation, and type.',
        endpoint: '/user/repos',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get a repository',
        content: 'GET /repos/{owner}/{repo} - Gets detailed information about a specific repository including name, description, stars, forks, language, and other metadata.',
        endpoint: '/repos/{owner}/{repo}',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'List repository issues',
        content: 'GET /repos/{owner}/{repo}/issues - Lists all issues for a repository. Can filter by state (open, closed, all), labels, assignee, creator, and sort by various fields.',
        endpoint: '/repos/{owner}/{repo}/issues',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Create a repository',
        content: 'POST /user/repos - Creates a new repository for the authenticated user. Requires authentication. Can set name, description, visibility (private/public), and initialize with README, .gitignore, and license.',
        endpoint: '/user/repos',
        method: 'POST',
        api: 'github',
      },
      {
        title: 'Search repositories',
        content: 'GET /search/repositories?q={query} - Searches for repositories matching the query. Supports complex queries with qualifiers like language, stars, forks, size, and more.',
        endpoint: '/search/repositories',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get repository commits',
        content: 'GET /repos/{owner}/{repo}/commits - Lists commits for a repository. Can filter by author, committer, SHA, and path. Returns commit message, author, date, and SHA.',
        endpoint: '/repos/{owner}/{repo}/commits',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get repository branches',
        content: 'GET /repos/{owner}/{repo}/branches - Lists branches for a repository. Returns branch name, commit SHA, and protection status.',
        endpoint: '/repos/{owner}/{repo}/branches',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get repository pull requests',
        content: 'GET /repos/{owner}/{repo}/pulls - Lists pull requests for a repository. Can filter by state (open, closed, all), head, base, and sort by various criteria.',
        endpoint: '/repos/{owner}/{repo}/pulls',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get user information',
        content: 'GET /users/{username} - Gets public information about a GitHub user including profile, bio, location, public repos count, followers, and following count.',
        endpoint: '/users/{username}',
        method: 'GET',
        api: 'github',
      },
      {
        title: 'Get authenticated user',
        content: 'GET /user - Gets information about the authenticated user. Requires authentication. Returns detailed user profile including private information.',
        endpoint: '/user',
        method: 'GET',
        api: 'github',
      },
    ];

    this.cachedDocs.set('github', sections);
    return sections;
  }

  // Fetch comprehensive YouTube API documentation
  async fetchYouTubeDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('youtube')) {
      return this.cachedDocs.get('youtube')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Get video details',
        content: 'GET /v3/videos - Retrieves a list of videos that match the API request parameters. Use the id parameter to specify video IDs. Returns video title, description, thumbnail, duration, view count, like count, channel information, and more.',
        endpoint: '/v3/videos',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Search for videos',
        content: 'GET /v3/search - Searches for videos matching the specified query parameters. Supports filtering by video type, order, published date, and region. Returns video IDs, titles, descriptions, and thumbnails.',
        endpoint: '/v3/search',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get channel details',
        content: 'GET /v3/channels - Retrieves a list of channel resources that match the API request parameters. Returns channel information including subscriber count, view count, video count, custom URL, and branding settings.',
        endpoint: '/v3/channels',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get playlist items',
        content: 'GET /v3/playlistItems - Retrieves a list of items in a playlist. Requires playlist ID. Returns video information for each item in the playlist including position and published date.',
        endpoint: '/v3/playlistItems',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get video comments',
        content: 'GET /v3/commentThreads - Retrieves comment threads for a video. Supports pagination and filtering. Returns comments with author information, text, like count, and reply count.',
        endpoint: '/v3/commentThreads',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get playlists',
        content: 'GET /v3/playlists - Retrieves playlists matching the request parameters. Can filter by channel ID. Returns playlist title, description, thumbnail, item count, and privacy status.',
        endpoint: '/v3/playlists',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get channel subscriptions',
        content: 'GET /v3/subscriptions - Lists subscriptions for a channel. Returns channel IDs that the authenticated user is subscribed to, or channels subscribed to a specific channel.',
        endpoint: '/v3/subscriptions',
        method: 'GET',
        api: 'youtube',
      },
      {
        title: 'Get video captions',
        content: 'GET /v3/captions - Lists caption tracks for a video. Requires video ID. Returns caption track information including language and track name.',
        endpoint: '/v3/captions',
        method: 'GET',
        api: 'youtube',
      },
    ];

    this.cachedDocs.set('youtube', sections);
    return sections;
  }

  // Fetch comprehensive Spotify API documentation
  async fetchSpotifyDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('spotify')) {
      return this.cachedDocs.get('spotify')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Search for tracks',
        content: 'GET /v1/search?type=track&q={query} - Searches for tracks matching the query. Returns track name, artist, album, duration, popularity, preview URL, and external IDs (ISRC, etc.).',
        endpoint: '/v1/search',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get track details',
        content: 'GET /v1/tracks/{id} - Retrieves detailed information about a specific track including name, artists, album, duration, popularity, explicit content flag, and available markets.',
        endpoint: '/v1/tracks/{id}',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get artist information',
        content: 'GET /v1/artists/{id} - Gets information about a specific artist including name, genres, popularity, followers count, and external URLs.',
        endpoint: '/v1/artists/{id}',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get artist albums',
        content: 'GET /v1/artists/{id}/albums - Retrieves all albums for a specific artist. Supports filtering by album type (album, single, compilation) and pagination.',
        endpoint: '/v1/artists/{id}/albums',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get album details',
        content: 'GET /v1/albums/{id} - Retrieves detailed information about an album including name, artists, release date, total tracks, genres, and album art.',
        endpoint: '/v1/albums/{id}',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get album tracks',
        content: 'GET /v1/albums/{id}/tracks - Lists all tracks in an album. Returns track names, artists, duration, and track numbers. Supports pagination.',
        endpoint: '/v1/albums/{id}/tracks',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get user playlists',
        content: 'GET /v1/me/playlists - Retrieves playlists for the current authenticated user. Requires authentication with user-read-private scope. Returns playlist name, description, owner, and track count.',
        endpoint: '/v1/me/playlists',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get playlist tracks',
        content: 'GET /v1/playlists/{playlist_id}/tracks - Retrieves all tracks in a playlist. Returns track details including added date, added by user, and track information.',
        endpoint: '/v1/playlists/{playlist_id}/tracks',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get current user profile',
        content: 'GET /v1/me - Gets detailed profile information about the current authenticated user including display name, email, followers count, subscription type, and country.',
        endpoint: '/v1/me',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get track audio features',
        content: 'GET /v1/audio-features/{id} - Retrieves audio features for a track including danceability, energy, key, tempo, valence, and acousticness. Useful for music analysis.',
        endpoint: '/v1/audio-features/{id}',
        method: 'GET',
        api: 'spotify',
      },
      {
        title: 'Get recommendations',
        content: 'GET /v1/recommendations - Generates track recommendations based on seed artists, tracks, and genres. Can filter by target audio features like energy, danceability, and tempo.',
        endpoint: '/v1/recommendations',
        method: 'GET',
        api: 'spotify',
      },
    ];

    this.cachedDocs.set('spotify', sections);
    return sections;
  }

  // Fetch comprehensive X (Twitter) API v2 documentation
  async fetchTwitterDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('twitter')) {
      return this.cachedDocs.get('twitter')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Get user by username',
        content: 'GET /2/users/by/username/{username} - Retrieves user information by username. Returns user ID, name, username, description, profile image URL, follower count, following count, tweet count, and account creation date.',
        endpoint: '/2/users/by/username/{username}',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Get user by ID',
        content: 'GET /2/users/{id} - Retrieves user information by user ID. Returns detailed user profile including verified status, location, and account metadata.',
        endpoint: '/2/users/{id}',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Get user tweets',
        content: 'GET /2/users/{id}/tweets - Retrieves tweets created by a specific user. Supports pagination with max_results and pagination_token. Can filter by exclude (replies, retweets) and include fields.',
        endpoint: '/2/users/{id}/tweets',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Get tweet by ID',
        content: 'GET /2/tweets/{id} - Retrieves a single tweet by its ID. Returns tweet text, author ID, created time, public metrics (likes, retweets, replies), and referenced tweets.',
        endpoint: '/2/tweets/{id}',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Search tweets',
        content: 'GET /2/tweets/search/recent - Searches recent tweets matching a query. Supports complex query operators, filtering by location, language, and time range. Returns up to 100 tweets per request.',
        endpoint: '/2/tweets/search/recent',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Create tweet',
        content: 'POST /2/tweets - Creates a new tweet on behalf of the authenticated user. Requires text content and optional reply, quote, or poll parameters. Returns created tweet ID and details.',
        endpoint: '/2/tweets',
        method: 'POST',
        api: 'twitter',
      },
      {
        title: 'Delete tweet',
        content: 'DELETE /2/tweets/{id} - Deletes a tweet by its ID. Requires authentication and ownership of the tweet. Returns deletion status.',
        endpoint: '/2/tweets/{id}',
        method: 'DELETE',
        api: 'twitter',
      },
      {
        title: 'Get user followers',
        content: 'GET /2/users/{id}/followers - Retrieves a list of users who are followers of the specified user. Supports pagination and returns user information for each follower.',
        endpoint: '/2/users/{id}/followers',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Get user following',
        content: 'GET /2/users/{id}/following - Retrieves a list of users that the specified user is following. Supports pagination and returns user information for each followed account.',
        endpoint: '/2/users/{id}/following',
        method: 'GET',
        api: 'twitter',
      },
      {
        title: 'Like a tweet',
        content: 'POST /2/users/{id}/likes - Allows the authenticated user to like a tweet. Requires user ID and tweet ID. Returns like status.',
        endpoint: '/2/users/{id}/likes',
        method: 'POST',
        api: 'twitter',
      },
      {
        title: 'Get liked tweets',
        content: 'GET /2/users/{id}/liked_tweets - Retrieves tweets liked by a specific user. Supports pagination and returns tweet details for each liked tweet.',
        endpoint: '/2/users/{id}/liked_tweets',
        method: 'GET',
        api: 'twitter',
      },
    ];

    this.cachedDocs.set('twitter', sections);
    return sections;
  }

  // Fetch comprehensive Google Maps API documentation
  async fetchGoogleMapsDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('googlemaps')) {
      return this.cachedDocs.get('googlemaps')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Geocoding - Address to Coordinates',
        content: 'GET /maps/api/geocode/json?address={address}&key={api_key} - Converts an address into geographic coordinates (latitude/longitude). Returns formatted address, location coordinates, place ID, and address components.',
        endpoint: '/maps/api/geocode/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Reverse Geocoding - Coordinates to Address',
        content: 'GET /maps/api/geocode/json?latlng={lat},{lng}&key={api_key} - Converts geographic coordinates into a human-readable address. Returns formatted address, place ID, and address components.',
        endpoint: '/maps/api/geocode/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Places Nearby Search',
        content: 'GET /maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&type={type}&key={api_key} - Finds places within a specified area. Returns place names, ratings, addresses, opening hours, and photos.',
        endpoint: '/maps/api/place/nearbysearch/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Places Text Search',
        content: 'GET /maps/api/place/textsearch/json?query={query}&key={api_key} - Searches for places based on a text query. Returns matching places with details like name, rating, location, and photos.',
        endpoint: '/maps/api/place/textsearch/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Place Details',
        content: 'GET /maps/api/place/details/json?place_id={place_id}&key={api_key} - Retrieves detailed information about a specific place using its place ID. Returns comprehensive data including reviews, photos, opening hours, and contact information.',
        endpoint: '/maps/api/place/details/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Directions',
        content: 'GET /maps/api/directions/json?origin={origin}&destination={destination}&key={api_key} - Calculates directions between two or more locations. Returns route information including distance, duration, steps, and polyline encoding.',
        endpoint: '/maps/api/directions/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Distance Matrix',
        content: 'GET /maps/api/distancematrix/json?origins={origins}&destinations={destinations}&key={api_key} - Calculates travel distance and time for multiple origin-destination pairs. Returns distance in meters and duration in seconds for each pair.',
        endpoint: '/maps/api/distancematrix/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Places Autocomplete',
        content: 'GET /maps/api/place/autocomplete/json?input={input}&key={api_key} - Provides place predictions based on partial text input. Returns suggestions with place IDs and descriptions for autocomplete functionality.',
        endpoint: '/maps/api/place/autocomplete/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Elevation',
        content: 'GET /maps/api/elevation/json?locations={lat},{lng}&key={api_key} - Retrieves elevation data for specific locations. Returns elevation in meters for given coordinates.',
        endpoint: '/maps/api/elevation/json',
        method: 'GET',
        api: 'googlemaps',
      },
      {
        title: 'Time Zone',
        content: 'GET /maps/api/timezone/json?location={lat},{lng}&timestamp={timestamp}&key={api_key} - Retrieves timezone information for a specific location. Returns timezone ID, offset from UTC, and DST offset.',
        endpoint: '/maps/api/timezone/json',
        method: 'GET',
        api: 'googlemaps',
      },
    ];

    this.cachedDocs.set('googlemaps', sections);
    return sections;
  }

  // Fetch comprehensive Stripe API documentation
  async fetchStripeDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('stripe')) {
      return this.cachedDocs.get('stripe')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Create payment intent',
        content: 'POST /v1/payment_intents - Creates a PaymentIntent object to confirm payment. Requires amount, currency, and payment method. Returns client secret for frontend confirmation.',
        endpoint: '/v1/payment_intents',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'Retrieve payment intent',
        content: 'GET /v1/payment_intents/{id} - Retrieves details of a PaymentIntent. Returns amount, currency, status, payment method, and customer information.',
        endpoint: '/v1/payment_intents/{id}',
        method: 'GET',
        api: 'stripe',
      },
      {
        title: 'List payment intents',
        content: 'GET /v1/payment_intents - Lists all PaymentIntents. Supports filtering by customer, status, and created date. Supports pagination with limit and starting_after.',
        endpoint: '/v1/payment_intents',
        method: 'GET',
        api: 'stripe',
      },
      {
        title: 'Create customer',
        content: 'POST /v1/customers - Creates a new customer object. Requires email or description. Can include name, phone, address, and metadata. Returns customer ID and details.',
        endpoint: '/v1/customers',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'Retrieve customer',
        content: 'GET /v1/customers/{id} - Retrieves a customer by ID. Returns customer details including payment methods, subscriptions, and invoice history.',
        endpoint: '/v1/customers/{id}',
        method: 'GET',
        api: 'stripe',
      },
      {
        title: 'Update customer',
        content: 'POST /v1/customers/{id} - Updates a customer\'s information. Can modify email, name, address, metadata, and default payment method.',
        endpoint: '/v1/customers/{id}',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'Create subscription',
        content: 'POST /v1/subscriptions - Creates a new subscription for a customer. Requires customer ID and items (price IDs with quantities). Returns subscription with billing details.',
        endpoint: '/v1/subscriptions',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'Cancel subscription',
        content: 'DELETE /v1/subscriptions/{id} - Cancels a customer\'s subscription immediately or at period end. Returns updated subscription status.',
        endpoint: '/v1/subscriptions/{id}',
        method: 'DELETE',
        api: 'stripe',
      },
      {
        title: 'Create checkout session',
        content: 'POST /v1/checkout/sessions - Creates a Checkout Session to accept payment. Configure line items, success/cancel URLs, and payment modes. Returns session URL for redirect.',
        endpoint: '/v1/checkout/sessions',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'List products',
        content: 'GET /v1/products - Lists all products. Supports filtering by active status and type. Returns product name, description, images, and associated prices.',
        endpoint: '/v1/products',
        method: 'GET',
        api: 'stripe',
      },
      {
        title: 'Create invoice',
        content: 'POST /v1/invoices - Creates an invoice for a customer. Can add line items, set due date, and apply discounts. Returns invoice with payment link.',
        endpoint: '/v1/invoices',
        method: 'POST',
        api: 'stripe',
      },
      {
        title: 'Create refund',
        content: 'POST /v1/refunds - Creates a refund for a charge or payment intent. Can specify amount or refund full amount. Returns refund status and details.',
        endpoint: '/v1/refunds',
        method: 'POST',
        api: 'stripe',
      },
    ];

    this.cachedDocs.set('stripe', sections);
    return sections;
  }

  // Fetch comprehensive OpenAI API documentation
  async fetchOpenAIDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('openai')) {
      return this.cachedDocs.get('openai')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Create chat completion',
        content: 'POST /v1/chat/completions - Creates a completion for the chat message. Requires model (gpt-4, gpt-3.5-turbo) and messages array. Returns assistant response with tokens used.',
        endpoint: '/v1/chat/completions',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Create completion',
        content: 'POST /v1/completions - Creates a completion for the provided prompt. Requires model (text-davinci-003, etc.) and prompt. Returns generated text completion.',
        endpoint: '/v1/completions',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Create embeddings',
        content: 'POST /v1/embeddings - Creates an embedding vector representing the input text. Requires model (text-embedding-ada-002) and input. Returns embedding vectors for semantic search.',
        endpoint: '/v1/embeddings',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Generate image',
        content: 'POST /v1/images/generations - Creates an image given a prompt. Requires prompt and optional size, n (number), and quality. Returns image URLs.',
        endpoint: '/v1/images/generations',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Edit image',
        content: 'POST /v1/images/edits - Creates an edited or extended image given an original image and a prompt. Requires image, prompt, and mask (optional). Returns edited image.',
        endpoint: '/v1/images/edits',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Create image variation',
        content: 'POST /v1/images/variations - Creates a variation of a given image. Requires image file. Returns variation image URLs.',
        endpoint: '/v1/images/variations',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Transcribe audio',
        content: 'POST /v1/audio/transcriptions - Transcribes audio into the input language. Requires file, model (whisper-1), and optional prompt. Returns transcribed text.',
        endpoint: '/v1/audio/transcriptions',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'Translate audio',
        content: 'POST /v1/audio/translations - Translates audio into English. Requires file and model (whisper-1). Returns translated text in English.',
        endpoint: '/v1/audio/translations',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'List models',
        content: 'GET /v1/models - Lists the currently available models. Returns model IDs, ownership, and permissions for each model.',
        endpoint: '/v1/models',
        method: 'GET',
        api: 'openai',
      },
      {
        title: 'Retrieve model',
        content: 'GET /v1/models/{model} - Retrieves a model instance. Returns model details including ID, created date, and owner.',
        endpoint: '/v1/models/{model}',
        method: 'GET',
        api: 'openai',
      },
      {
        title: 'Create fine-tuning job',
        content: 'POST /v1/fine_tuning/jobs - Creates a fine-tuning job which begins the process of creating a fine-tuned model. Requires model, training_file, and optional hyperparameters.',
        endpoint: '/v1/fine_tuning/jobs',
        method: 'POST',
        api: 'openai',
      },
      {
        title: 'List fine-tuning jobs',
        content: 'GET /v1/fine_tuning/jobs - Lists fine-tuning jobs. Supports pagination. Returns job status, model, training file, and results.',
        endpoint: '/v1/fine_tuning/jobs',
        method: 'GET',
        api: 'openai',
      },
    ];

    this.cachedDocs.set('openai', sections);
    return sections;
  }

  // Fetch comprehensive OpenWeatherMap API documentation
  async fetchOpenWeatherMapDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('openweathermap')) {
      return this.cachedDocs.get('openweathermap')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Current weather by city',
        content: 'GET /data/2.5/weather?q={city}&appid={api_key} - Gets current weather data for a city. Returns temperature, humidity, pressure, wind speed, weather conditions, and coordinates.',
        endpoint: '/data/2.5/weather',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Current weather by coordinates',
        content: 'GET /data/2.5/weather?lat={lat}&lon={lon}&appid={api_key} - Gets current weather data by geographic coordinates. Returns detailed weather information for the location.',
        endpoint: '/data/2.5/weather',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Weather forecast',
        content: 'GET /data/2.5/forecast?q={city}&appid={api_key} - Gets 5-day weather forecast with 3-hour intervals. Returns forecast data for temperature, conditions, and precipitation.',
        endpoint: '/data/2.5/forecast',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Hourly forecast',
        content: 'GET /data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={api_key} - Gets hourly weather forecast for 48 hours. Returns detailed hourly weather predictions.',
        endpoint: '/data/2.5/forecast/hourly',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Daily forecast',
        content: 'GET /data/2.5/forecast/daily?q={city}&cnt={days}&appid={api_key} - Gets daily weather forecast for up to 16 days. Returns daily temperature ranges and conditions.',
        endpoint: '/data/2.5/forecast/daily',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Historical weather data',
        content: 'GET /data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={timestamp}&appid={api_key} - Gets historical weather data for a specific date. Requires timestamp and coordinates.',
        endpoint: '/data/2.5/onecall/timemachine',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'UV Index',
        content: 'GET /data/2.5/uvi?lat={lat}&lon={lon}&appid={api_key} - Gets current UV Index for a location. Returns UV index value and exposure level.',
        endpoint: '/data/2.5/uvi',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Air pollution',
        content: 'GET /data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key} - Gets current air pollution data. Returns Air Quality Index (AQI) and pollutant concentrations.',
        endpoint: '/data/2.5/air_pollution',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Geocoding',
        content: 'GET /geo/1.0/direct?q={city}&appid={api_key} - Converts city name to coordinates. Returns latitude, longitude, country, and state information.',
        endpoint: '/geo/1.0/direct',
        method: 'GET',
        api: 'openweathermap',
      },
      {
        title: 'Reverse geocoding',
        content: 'GET /geo/1.0/reverse?lat={lat}&lon={lon}&appid={api_key} - Converts coordinates to city name. Returns location name, country, and administrative information.',
        endpoint: '/geo/1.0/reverse',
        method: 'GET',
        api: 'openweathermap',
      },
    ];

    this.cachedDocs.set('openweathermap', sections);
    return sections;
  }

  // Fetch comprehensive Notion API documentation
  async fetchNotionDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('notion')) {
      return this.cachedDocs.get('notion')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Retrieve page',
        content: 'GET /v1/pages/{page_id} - Retrieves a page object. Returns page properties, parent information, created time, last edited time, and archived status.',
        endpoint: '/v1/pages/{page_id}',
        method: 'GET',
        api: 'notion',
      },
      {
        title: 'Create page',
        content: 'POST /v1/pages - Creates a new page in a database or as a child of an existing page. Requires parent and properties. Returns created page with ID.',
        endpoint: '/v1/pages',
        method: 'POST',
        api: 'notion',
      },
      {
        title: 'Update page',
        content: 'PATCH /v1/pages/{page_id} - Updates page properties. Can modify title, text, checkbox, date, select, and other property values.',
        endpoint: '/v1/pages/{page_id}',
        method: 'PATCH',
        api: 'notion',
      },
      {
        title: 'Retrieve database',
        content: 'GET /v1/databases/{database_id} - Retrieves a database object. Returns database title, properties schema, created time, and last edited time.',
        endpoint: '/v1/databases/{database_id}',
        method: 'GET',
        api: 'notion',
      },
      {
        title: 'Create database',
        content: 'POST /v1/databases - Creates a new database as a child of a page. Requires parent page ID and properties schema. Returns created database.',
        endpoint: '/v1/databases',
        method: 'POST',
        api: 'notion',
      },
      {
        title: 'Query database',
        content: 'POST /v1/databases/{database_id}/query - Searches and filters a database. Supports filtering by property, sorting, and pagination. Returns matching pages.',
        endpoint: '/v1/databases/{database_id}/query',
        method: 'POST',
        api: 'notion',
      },
      {
        title: 'Update database',
        content: 'PATCH /v1/databases/{database_id} - Updates database title and properties. Can add, modify, or remove property schemas.',
        endpoint: '/v1/databases/{database_id}',
        method: 'PATCH',
        api: 'notion',
      },
      {
        title: 'List blocks',
        content: 'GET /v1/blocks/{block_id}/children - Retrieves a paginated array of child block objects. Supports pagination with page_size and start_cursor.',
        endpoint: '/v1/blocks/{block_id}/children',
        method: 'GET',
        api: 'notion',
      },
      {
        title: 'Append blocks',
        content: 'PATCH /v1/blocks/{block_id}/children - Creates and appends new children blocks. Can add paragraphs, headings, lists, code blocks, and more.',
        endpoint: '/v1/blocks/{block_id}/children',
        method: 'PATCH',
        api: 'notion',
      },
      {
        title: 'Update block',
        content: 'PATCH /v1/blocks/{block_id} - Updates content for the specified block. Can modify text content, toggle state, and other block properties.',
        endpoint: '/v1/blocks/{block_id}',
        method: 'PATCH',
        api: 'notion',
      },
      {
        title: 'Delete block',
        content: 'DELETE /v1/blocks/{block_id} - Sets block to archived. The block and its children are no longer accessible but remain in the API.',
        endpoint: '/v1/blocks/{block_id}',
        method: 'DELETE',
        api: 'notion',
      },
      {
        title: 'Search',
        content: 'POST /v1/search - Searches all pages and child databases. Supports filtering by object type and query text. Returns matching pages and databases.',
        endpoint: '/v1/search',
        method: 'POST',
        api: 'notion',
      },
    ];

    this.cachedDocs.set('notion', sections);
    return sections;
  }

  // Fetch comprehensive Reddit API documentation
  async fetchRedditDocs(): Promise<ApiDocSection[]> {
    if (this.cachedDocs.has('reddit')) {
      return this.cachedDocs.get('reddit')!;
    }

    const sections: ApiDocSection[] = [
      {
        title: 'Get subreddit information',
        content: 'GET /r/{subreddit}/about.json - Retrieves information about a subreddit. Returns description, subscriber count, created date, and subreddit settings.',
        endpoint: '/r/{subreddit}/about.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get subreddit posts',
        content: 'GET /r/{subreddit}/{sort}.json - Lists posts from a subreddit. Sort options: hot, new, top, rising. Supports pagination with limit and after/before parameters.',
        endpoint: '/r/{subreddit}/{sort}.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get post details',
        content: 'GET /r/{subreddit}/comments/{post_id}.json - Retrieves a post and its comments. Returns post content, score, author, submission time, and comment tree.',
        endpoint: '/r/{subreddit}/comments/{post_id}.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Search subreddit',
        content: 'GET /r/{subreddit}/search.json?q={query} - Searches posts within a subreddit. Supports time filters, sort options, and pagination.',
        endpoint: '/r/{subreddit}/search.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get user information',
        content: 'GET /user/{username}/about.json - Retrieves user profile information. Returns account age, karma, trophies, and post/comment history summary.',
        endpoint: '/user/{username}/about.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get user posts',
        content: 'GET /user/{username}/submitted.json - Retrieves posts submitted by a user. Supports pagination and filtering by subreddit.',
        endpoint: '/user/{username}/submitted.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get user comments',
        content: 'GET /user/{username}/comments.json - Retrieves comments made by a user. Supports pagination and returns comment text, score, and parent post.',
        endpoint: '/user/{username}/comments.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Submit post',
        content: 'POST /api/submit - Creates a new post in a subreddit. Requires authentication, subreddit, title, and text or URL. Returns created post details.',
        endpoint: '/api/submit',
        method: 'POST',
        api: 'reddit',
      },
      {
        title: 'Comment on post',
        content: 'POST /api/comment - Creates a comment on a post or another comment. Requires authentication, parent ID, and text. Returns created comment.',
        endpoint: '/api/comment',
        method: 'POST',
        api: 'reddit',
      },
      {
        title: 'Get trending subreddits',
        content: 'GET /subreddits/popular.json - Lists popular subreddits. Returns subreddit information sorted by subscriber count and activity.',
        endpoint: '/subreddits/popular.json',
        method: 'GET',
        api: 'reddit',
      },
      {
        title: 'Get homepage posts',
        content: 'GET /{sort}.json - Retrieves posts from front page or user\'s subscribed subreddits. Sort options: hot, new, top, rising. Requires authentication for personalized feed.',
        endpoint: '/{sort}.json',
        method: 'GET',
        api: 'reddit',
      },
    ];

    this.cachedDocs.set('reddit', sections);
    return sections;
  }

  // Get all API documentation
  async getAllDocs(): Promise<ApiDocSection[]> {
    const [
      github,
      youtube,
      spotify,
      twitter,
      googlemaps,
      stripe,
      openai,
      openweathermap,
      notion,
      reddit,
    ] = await Promise.all([
      this.fetchGitHubDocs(),
      this.fetchYouTubeDocs(),
      this.fetchSpotifyDocs(),
      this.fetchTwitterDocs(),
      this.fetchGoogleMapsDocs(),
      this.fetchStripeDocs(),
      this.fetchOpenAIDocs(),
      this.fetchOpenWeatherMapDocs(),
      this.fetchNotionDocs(),
      this.fetchRedditDocs(),
    ]);

    return [
      ...github,
      ...youtube,
      ...spotify,
      ...twitter,
      ...googlemaps,
      ...stripe,
      ...openai,
      ...openweathermap,
      ...notion,
      ...reddit,
    ];
  }

  // Search docs (kept for backward compatibility, but will be replaced by vector search)
  async searchDocs(query: string, apiName?: string): Promise<ApiDocSection[]> {
    const allDocs = await this.getAllDocs();
    
    let filtered = allDocs;
    if (apiName) {
      const apiNameLower = apiName.toLowerCase();
      filtered = allDocs.filter(doc => 
        doc.api?.toLowerCase().includes(apiNameLower)
      );
    }

    return this.filterDocs(filtered, query);
  }

  private filterDocs(docs: ApiDocSection[], query: string): ApiDocSection[] {
    const queryLower = query.toLowerCase();
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(queryLower) ||
        doc.content.toLowerCase().includes(queryLower) ||
        doc.endpoint?.toLowerCase().includes(queryLower)
    ).slice(0, 5);
  }
}
