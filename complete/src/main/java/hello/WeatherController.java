package hello;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Calendar;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@RestController
public class WeatherController {
    private static final Logger LOGGER = LoggerFactory.getLogger(WeatherController.class);
    public static final String ROLE_USER = "ROLE_USER";
    public static final String TO_MANY_REQUEST_FROM_USER = "to many request from User";

    @Value("${weather.max.user.request}")
    private int MAX_USER_VISIT;
    @Value("${weather.openweathermap.api.key}")
    private  String _APIKEY;
    @Value("${weather.google.api.key}")
    private  String GOOGLE_KEY;

    private final AtomicLong counter = new AtomicLong();

    private final Map<String, AtomicInteger> map = new ConcurrentHashMap<>();

    @RequestMapping("/places")
    public String getPlaces(@RequestParam(value = "input", defaultValue = "Moscow") String city) throws IOException, JSONException {
        LOGGER.info("getPlaces ask {} user: {} counter {}", city, SecurityContextHolder.getContext().getAuthentication().getName(), counter.incrementAndGet());
        String GOOGLE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
        final String url = GOOGLE_URL + "?input=" + city + "&key=" + GOOGLE_KEY;
        final JSONObject response = JsonReader.read(url);
        return response.toString();
    }

    private void isBlockExecution(String userName) {
        boolean isUser = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(el -> ROLE_USER.equals(el.getAuthority()));
        if (isUser) {
            AtomicInteger l = map.get(userName);
            if (l != null && l.get() >= MAX_USER_VISIT) {
                throw new SecurityException(TO_MANY_REQUEST_FROM_USER);
            } else {
                if (l != null) {
                    l.incrementAndGet();
                    map.put(userName, l);
                } else {
                    map.put(userName, new AtomicInteger(0));
                }
            }
        }
    }

    @RequestMapping("/weather/forecast/daily")
    public String getWeather(@RequestParam(value = "q" ,required=false) String q,
                             @RequestParam(value = "type", defaultValue = "accurate" ,required=false) String type,
                             @RequestParam(value = "APPID" ,required=false) String APPID,
                             @RequestParam(value = "cnt", defaultValue = "5" ,required=false) String cnt,
                             @RequestParam(value = "lang", defaultValue = "ru" ,required=false) String lang,
                             @RequestParam(value = "lat" ,required=false) String lat,
                             @RequestParam(value = "lon" ,required=false) String lon

    ) throws IOException, JSONException {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        LOGGER.info("getWeather ask {} user: {} counter {}", q, userName, counter.incrementAndGet());
        isBlockExecution(userName + Calendar.getInstance().get(Calendar.DAY_OF_YEAR));
        String WEATHER_URL = "http://api.openweathermap.org/data/2.5/";
        String url = WEATHER_URL + "forecast/daily?cnt=" + cnt + "&type=" + type + "&APPID=" + _APIKEY+ "&lang=" + lang;
        if (q!= null) {
            url+="&q=" + q;
        } else {
            url+="&lon=" + lon + "&lat=" + lat;
        }
        final JSONObject response = JsonReader.read(url);
        return response.toString();
    }
}
