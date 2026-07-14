import { useState, useMemo, KeyboardEvent } from 'react';
import { Search, Loader2, Wind, Droplets, MapPin, Cloud } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { id: number; description: string; icon: string }[];
  wind: { speed: number };
}

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

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

  const displayTemp = (tempC: number) => {
    if (unit === 'F') return Math.round((tempC * 9/5) + 32);
    return Math.round(tempC);
  };

  const getBackgroundClass = (weatherId: number, temp: number) => {
    if (weatherId >= 200 && weatherId < 600) return 'bg-weather-rain';
    if (weatherId === 800) {
      if (temp >= 30) return 'bg-weather-hot';
      if (temp < 10) return 'bg-weather-cold';
      return 'bg-animated-gradient';
    }
    if (weatherId > 800 && weatherId < 900) return 'bg-weather-cloudy';
    return 'bg-animated-gradient';
  };

  const getWeatherScene = (weatherId: number, windSpeed: number) => {
    const isRain = weatherId >= 200 && weatherId < 600;
    if (windSpeed > 10 && !isRain) return 'windy';
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId === 800) return 'sunny';
    if (weatherId > 800 && weatherId < 900) return 'cloudy';
    return 'default';
  };

  const bgClass = weather ? getBackgroundClass(weather.weather[0].id, weather.main.temp) : 'bg-animated-gradient';
  const sceneType = weather ? getWeatherScene(weather.weather[0].id, weather.wind.speed) : 'default';

  const raindrops = useMemo(() => Array.from({ length: 30 }).map(() => ({
    left: `${Math.random() * 100}vw`,
    delay: `${Math.random() * 1.2}s`,
    duration: `${0.5 + Math.random() * 0.7}s`
  })), []);

  const snowflakes = useMemo(() => Array.from({ length: 25 }).map(() => ({
    left: `${Math.random() * 100}vw`,
    size: `${4 + Math.random() * 4}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 3}s`
  })), []);

  const windLines = useMemo(() => Array.from({ length: 5 }).map(() => ({
    top: `${20 + Math.random() * 60}%`,
    width: `${100 + Math.random() * 150}px`,
    delay: `${Math.random() * 2}s`,
    duration: `${1 + Math.random()}s`
  })), []);

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative transition-colors duration-1000 ${bgClass}`}>
      
      {/* Weather Scene Overlay */}
      <div className="weather-scene">
        {sceneType === 'sunny' && (
          <div className="sun">
            <div className="sun-rays" />
            <div className="sun-rays-2" />
          </div>
        )}
        
        {sceneType === 'cloudy' && (
          <>
            <div className="cloud cloud-shape cloud-1" />
            <div className="cloud cloud-shape cloud-2" />
            <div className="cloud cloud-shape cloud-3" />
          </>
        )}
        
        {(sceneType === 'rain' || sceneType === 'thunderstorm') && (
          <>
            <div className="cloud cloud-shape" style={{ top: '-20px', left: '10%', background: 'rgba(100,110,120,0.8)' }} />
            <div className="cloud cloud-shape" style={{ top: '-30px', left: '40%', background: 'rgba(100,110,120,0.8)' }} />
            <div className="cloud cloud-shape" style={{ top: '-10px', left: '70%', background: 'rgba(100,110,120,0.8)' }} />
            {raindrops.map((drop, i) => (
              <div 
                key={i} 
                className="raindrop" 
                style={{ 
                  left: drop.left, 
                  animationDelay: drop.delay,
                  animationDuration: drop.duration
                }} 
              />
            ))}
            {sceneType === 'thunderstorm' && (
              <>
                <div className="lightning" style={{ animationDelay: '0s' }} />
                <div className="lightning" style={{ animationDelay: '2.5s' }} />
              </>
            )}
          </>
        )}
        
        {sceneType === 'windy' && (
          <>
            <div className="cloud cloud-shape cloud-1" style={{ animationDuration: '12s' }} />
            <div className="cloud cloud-shape cloud-2" style={{ animationDuration: '15s' }} />
            <div className="cloud cloud-shape cloud-3" style={{ animationDuration: '10s' }} />
            {windLines.map((wind, i) => (
              <div
                key={`wind-${i}`}
                className="wind-line"
                style={{
                  top: wind.top,
                  width: wind.width,
                  animationDelay: wind.delay,
                  animationDuration: wind.duration
                }}
              />
            ))}
          </>
        )}
        
        {sceneType === 'snow' && (
          <>
            {snowflakes.map((snow, i) => (
              <div 
                key={i} 
                className="snowflake" 
                style={{ 
                  left: snow.left, 
                  width: snow.size,
                  height: snow.size,
                  animationDelay: snow.delay,
                  animationDuration: snow.duration
                }} 
              />
            ))}
          </>
        )}
      </div>

      {/* Abstract atmospheric circles behind the card (default state) */}
      {(sceneType === 'default' || !weather) && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      )}

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
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 z-10 bg-black/10 backdrop-blur-sm">
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
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-8xl font-bold text-white tracking-tighter" data-testid="text-temperature">
                      {displayTemp(weather.main.temp)}°
                    </span>
                    <div className="flex flex-col pb-2">
                      <span className="text-xl text-white/90 capitalize font-medium" data-testid="text-description">
                        {weather.weather[0].description}
                      </span>
                      <span className="text-white/60">
                        Feels like {displayTemp(weather.main.feels_like)}°
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg backdrop-blur-md border border-white/10">
                      <button
                        onClick={() => setUnit('C')}
                        className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${
                          unit === 'C' ? 'bg-white text-black shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        °C
                      </button>
                      <button
                        onClick={() => setUnit('F')}
                        className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${
                          unit === 'F' ? 'bg-white text-black shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        °F
                      </button>
                    </div>
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
