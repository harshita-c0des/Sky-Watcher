import { useState, KeyboardEvent } from 'react';
import { Search, Loader2, Wind, Droplets, MapPin, Cloud } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setError("OpenWeather API key is not configured.");
        setWeather(null);
        return;
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      
      if (res.status === 404) {
        setError("City not found. Please try another name.");
        setWeather(null);
        return;
      }
      
      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError("An error occurred. Please try again later.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative">
      {/* Abstract atmospheric circles behind the card */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-md z-10 flex flex-col gap-6">
        {/* Search Section */}
        <div className="glass-card rounded-2xl p-2 flex items-center gap-2 transition-all duration-500 hover:bg-white/10">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search city..."
              className="w-full bg-transparent text-white placeholder:text-white/50 px-12 py-3 outline-none text-lg"
              data-testid="input-city"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !city.trim()}
            className="glass-button w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            data-testid="button-search"
            aria-label="Search weather"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Search className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="glass-card rounded-[2rem] overflow-hidden transition-all duration-700 ease-out min-h-[300px] flex flex-col relative">
          
          {error && (
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Cloud className="w-8 h-8 text-red-300" />
              </div>
              <p className="text-lg text-white/90 font-medium" data-testid="text-error">
                {error}
              </p>
            </div>
          )}

          {!weather && !error && !loading && (
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <Cloud className="w-16 h-16 text-white/20 mb-6 animate-pulse" />
              <h2 className="text-2xl font-medium text-white/80 mb-2">Atmosphere</h2>
              <p className="text-white/50">Search for a city to see the weather</p>
            </div>
          )}

          {weather && !error && (
            <div className="p-8 flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in duration-700">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight" data-testid="text-city-name">
                    {weather.name}
                  </h1>
                  <p className="text-lg text-white/60 mt-1 font-medium tracking-wide uppercase">
                    {weather.sys.country}
                  </p>
                </div>
                <div className="w-20 h-20 shrink-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    data-testid="img-weather-icon"
                  />
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-bold text-white tracking-tighter" data-testid="text-temperature">
                    {Math.round(weather.main.temp)}°
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl text-white/90 capitalize font-medium" data-testid="text-description">
                      {weather.weather[0].description}
                    </span>
                    <span className="text-white/60">
                      Feels like {Math.round(weather.main.feels_like)}°
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm font-medium">Wind</p>
                    <p className="text-white font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm font-medium">Humidity</p>
                    <p className="text-white font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
