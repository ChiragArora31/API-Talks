import { ApiDocSection } from './documentation-fetcher';

export class CodeGenerator {
  generateCode(docSection: ApiDocSection, query: string): string {
    const { endpoint, method, title } = docSection;
    const endpointStr = endpoint || '';
    const methodStr = method || 'GET';

    const apiName = docSection.api?.toLowerCase() || '';
    
    if (apiName === 'github' || endpointStr.includes('github') || title.toLowerCase().includes('github')) {
      return this.generateGitHubCode(endpointStr, methodStr, query);
    } else if (apiName === 'youtube' || endpointStr.includes('youtube') || title.toLowerCase().includes('youtube')) {
      return this.generateYouTubeCode(endpointStr, methodStr, query);
    } else if (apiName === 'spotify' || endpointStr.includes('spotify') || title.toLowerCase().includes('spotify')) {
      return this.generateSpotifyCode(endpointStr, methodStr, query);
    } else if (apiName === 'twitter' || endpointStr.includes('twitter') || title.toLowerCase().includes('twitter')) {
      return this.generateTwitterCode(endpointStr, methodStr, query);
    } else if (apiName === 'googlemaps' || endpointStr.includes('googlemaps') || endpointStr.includes('maps/api')) {
      return this.generateGoogleMapsCode(endpointStr, methodStr, query);
    } else if (apiName === 'stripe' || endpointStr.includes('stripe') || title.toLowerCase().includes('stripe')) {
      return this.generateStripeCode(endpointStr, methodStr, query);
    } else if (apiName === 'openai' || endpointStr.includes('openai') || title.toLowerCase().includes('openai')) {
      return this.generateOpenAICode(endpointStr, methodStr, query);
    } else if (apiName === 'openweathermap' || endpointStr.includes('openweathermap') || endpointStr.includes('weather')) {
      return this.generateOpenWeatherMapCode(endpointStr, methodStr, query);
    } else if (apiName === 'notion' || endpointStr.includes('notion') || title.toLowerCase().includes('notion')) {
      return this.generateNotionCode(endpointStr, methodStr, query);
    } else if (apiName === 'reddit' || endpointStr.includes('reddit') || title.toLowerCase().includes('reddit')) {
      return this.generateRedditCode(endpointStr, methodStr, query);
    }

    return this.generateGenericCode(endpointStr, methodStr);
  }

  private generateGitHubCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/user/repos') && method === 'GET') {
      return `// Get list of user repositories
const response = await fetch('https://api.github.com/user/repos', {
  method: 'GET',
  headers: {
    'Authorization': 'token YOUR_GITHUB_TOKEN',
    'Accept': 'application/vnd.github.v3+json'
  }
});

const repos = await response.json();
console.log(repos);`;
    }

    if (endpoint.includes('/search/repositories')) {
      return `// Search GitHub repositories
const query = 'react';
const response = await fetch(\`https://api.github.com/search/repositories?q=\${query}\`, {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

const results = await response.json();
console.log(results.items);`;
    }

    if (endpoint.includes('/repos/{owner}/{repo}')) {
      return `// Get a specific repository
const owner = 'facebook';
const repo = 'react';
const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}\`, {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

const repository = await response.json();
console.log(repository);`;
    }

    return this.generateGenericCode(endpoint, method);
  }

  private generateYouTubeCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/v3/videos')) {
      return `// Get video details from YouTube
const videoId = 'VIDEO_ID_HERE';
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

const response = await fetch(
  \`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=\${videoId}&key=\${API_KEY}\`,
  {
    method: 'GET'
  }
);

const data = await response.json();
console.log(data.items[0]);`;
    }

    if (endpoint.includes('/v3/search')) {
      return `// Search for YouTube videos
const searchQuery = 'react tutorial';
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

const response = await fetch(
  \`https://www.googleapis.com/youtube/v3/search?part=snippet&q=\${encodeURIComponent(searchQuery)}&key=\${API_KEY}\`,
  {
    method: 'GET'
  }
);

const data = await response.json();
console.log(data.items);`;
    }

    return this.generateGenericCode(endpoint, method);
  }

  private generateSpotifyCode(endpoint: string, method: string, query: string): string {
    // Search endpoint - handle both track search and general search
    if (endpoint.includes('/v1/search') || query.toLowerCase().includes('search')) {
      return `// Search for tracks on Spotify
const searchQuery = 'track name here';
const ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN';

const response = await fetch(
  \`https://api.spotify.com/v1/search?q=\${encodeURIComponent(searchQuery)}&type=track&limit=20\`,
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.tracks.items);`;
    }

    if (endpoint.includes('/v1/tracks/')) {
      return `// Get track details from Spotify
const trackId = 'TRACK_ID_HERE';
const ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN';

const response = await fetch(
  \`https://api.spotify.com/v1/tracks/\${trackId}\`,
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
      'Content-Type': 'application/json'
    }
  }
);

const track = await response.json();
console.log(track);`;
    }

    if (endpoint.includes('/v1/artists/') && endpoint.includes('/albums')) {
      return `// Get artist albums from Spotify
const artistId = 'ARTIST_ID_HERE';
const ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN';

const response = await fetch(
  \`https://api.spotify.com/v1/artists/\${artistId}/albums?include_groups=album,single&limit=50\`,
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.items);`;
    }

    if (endpoint.includes('/v1/me/playlists')) {
      return `// Get user playlists from Spotify
const ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN';

const response = await fetch(
  'https://api.spotify.com/v1/me/playlists',
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.items);`;
    }

    return this.generateGenericCode(endpoint, method);
  }

  private generateTwitterCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/2/tweets/search')) {
      return `// Search recent tweets
const BEARER_TOKEN = 'YOUR_TWITTER_BEARER_TOKEN';
const query = 'javascript';

const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent(query), {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${BEARER_TOKEN}\`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateGoogleMapsCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('geocode/json')) {
      return `// Geocode address to coordinates
const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const address = '1600 Amphitheatre Parkway, Mountain View, CA';

const response = await fetch(\`https://maps.googleapis.com/maps/api/geocode/json?address=\${encodeURIComponent(address)}&key=\${API_KEY}\`, {
  method: 'GET'
});

const data = await response.json();
console.log(data.results[0].geometry.location);`;
    }
    if (endpoint.includes('place/nearbysearch')) {
      return `// Find nearby places
const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const lat = 37.7749;
const lng = -122.4194;

const response = await fetch(\`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=\${lat},\${lng}&radius=1000&type=restaurant&key=\${API_KEY}\`, {
  method: 'GET'
});

const data = await response.json();
console.log(data.results);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateStripeCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/v1/payment_intents')) {
      return `// Create payment intent
const SECRET_KEY = 'YOUR_STRIPE_SECRET_KEY';

const response = await fetch('https://api.stripe.com/v1/payment_intents', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${SECRET_KEY}\`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    amount: '2000',
    currency: 'usd'
  })
});

const data = await response.json();
console.log(data);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateOpenAICode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/v1/chat/completions')) {
      return `// Create chat completion
const API_KEY = 'YOUR_OPENAI_API_KEY';

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateOpenWeatherMapCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/data/2.5/weather')) {
      return `// Get current weather by city
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const city = 'London';

const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`, {
  method: 'GET'
});

const data = await response.json();
console.log(\`Temperature: \${data.main.temp}°C\`);
console.log(\`Weather: \${data.weather[0].description}\`);`;
    }
    if (endpoint.includes('/data/2.5/forecast')) {
      return `// Get weather forecast
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const city = 'London';

const response = await fetch(\`https://api.openweathermap.org/data/2.5/forecast?q=\${city}&appid=\${API_KEY}&units=metric\`, {
  method: 'GET'
});

const data = await response.json();
console.log(data.list);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateNotionCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/v1/pages')) {
      return `// Retrieve a page
const API_KEY = 'YOUR_NOTION_API_KEY';
const pageId = 'PAGE_ID_HERE';

const response = await fetch(\`https://api.notion.com/v1/pages/\${pageId}\`, {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateRedditCode(endpoint: string, method: string, query: string): string {
    if (endpoint.includes('/r/') && endpoint.includes('.json')) {
      return `// Get subreddit posts
const subreddit = 'javascript';
const sort = 'hot';

const response = await fetch(\`https://www.reddit.com/r/\${subreddit}/\${sort}.json\`, {
  method: 'GET',
  headers: {
    'User-Agent': 'YourApp/1.0'
  }
});

const data = await response.json();
console.log(data.data.children);`;
    }
    return this.generateGenericCode(endpoint, method);
  }

  private generateGenericCode(endpoint: string, method: string): string {
    return `// ${method} request example
const response = await fetch('https://api.example.com${endpoint}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    // Add your API key or authentication headers here
  }
});

const data = await response.json();
console.log(data);`;
  }
}
