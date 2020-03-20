function Color() {
  var red = 255, green = 0, blue = 0, defaultHue = 0;

  this.rgb = function(input) {
    if (typeof input == 'string') {
      let match = input.match(/^(\d+), (\d+), (\d+)$/);

      if (match != null)
        input = {
          red: parseInt(match[1]),
          green: parseInt(match[2]),
          blue: parseInt(match[3])
        };
    }

    if (typeof input == 'object') {
      let isValid = (a) => typeof a == 'number' && a >= 0 && a <= 255,
          validObj = true;

      if (isValid(input.red)) {validObj = true; red = input.red;}
      if (isValid(input.green)) {validObj = true; green = input.green;}
      if (isValid(input.blue)) {validObj = true; blue = input.blue;}
      defaultHue = this.hsv().hue;
      if (validObj) return this;
    }

    return {
      red: red,
      green: green,
      blue: blue,
      toString: () => Math.round(red) + ', ' + Math.round(green) + ', ' + Math.round(blue)
    }
  }

  // HSV color model (hue, saturation, value)
  this.hsv = function(input) {
    if (typeof input == 'string') {
      let match = input.match(/^(\d+)°, (\d+)%, (\d+)%$/);

      if (match != null)
        input = {
          hue: parseInt(match[1]),
          saturation: parseInt(match[2]),
          value: parseInt(match[3])
        };
    }

    if (typeof input == 'object') {

      var defaults = this.hsv(),
          valid = [['hue', 360], ['saturation', 100], ['value', 100]]
            .map(([prop, maxVal]) => {
              let validProp = typeof input[prop] == 'number' && input[prop] >= 0 && input[prop] <= maxVal;
              if (!validProp) input[prop] = defaults[prop];
              return validProp;
            })
            .reduce((a,b) => a || b);

      if (valid) {
        let s = input.saturation / 100,
            v = input.value / 100,
            h = input.hue / 60,
            c = v * s,
            x = c * (1 - Math.abs(h % 2 - 1)),
            a = [[c,x,0],[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]],
            m = v - c,
            [red, green, blue] = a[Math.ceil(h)].map(v => 255 * (v + m));


        this.rgb({red: red, green: green, blue: blue});
        defaultHue = input.hue;
        return this;
      }
    }

    var rgb = this.rgb(),
        r = rgb.red / 255,
        g = rgb.green / 255,
        b = rgb.blue / 255,
        value = Math.max(r, g, b),
        c = value - Math.min(r, g, b);

    if (c == 0) var hue = defaultHue;
    else if (value == r) var hue = (g < b) ? 360 + 60 * (g - b) / c : 60 * (g - b) / c;
    else if (value == g) var hue = 60 * (2 + (b - r) / c);
    else var hue = 60 * (4 + (r - g) / c);

    var saturation = (value == 0) ? 0 : c / value * 100;

    return {
      hue: hue,
      saturation: saturation,
      value: value * 100,
      toString: () => Math.round(hue) + '°, ' + Math.round(saturation) + '%, ' + Math.round(value * 100) + '%'
    };
}

  // HSL color model (hue, saturation, lightness)
  this.hsl = function(input) {
    if (typeof input == 'string') {
      let match = input.match(/^(\d+)°, (\d+)%, (\d+)%$/);

      if (match != null)
        input = {
          hue: parseInt(match[1]),
          saturation: parseInt(match[2]),
          lightness: parseInt(match[3])
        };
    }

    if (typeof input == 'object') {
      var defaults = this.hsl(),
          valid = [['hue', 360], ['saturation', 100], ['lightness', 100]]
            .map(([prop, maxVal]) => {
              let validProp = typeof input[prop] == 'number' && input[prop] >= 0 && input[prop] <= maxVal;
              if (!validProp) input[prop] = defaults[prop];
              return validProp;
            })
            .reduce((a,b) => a || b);

      if (valid) {
        let s = input.saturation / 100,
            l = input.lightness / 100,
            h = input.hue / 60,
            c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(h % 2 - 1)),
            a = [[c,x,0],[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]],
            m = l - c / 2,
            [red, green, blue] = a[Math.ceil(h)].map(v => 255 * (v + m));

        this.rgb({red: red, green: green, blue: blue});
        defaultHue = input.hue;
        return this;
      }
    }

    var rgb = this.rgb(),
        r = rgb.red / 255,
        g = rgb.green / 255,
        b = rgb.blue / 255,
        v = Math.max(r, g, b),
        c = v - Math.min(r, g, b),
        lightness = v - c / 2;

    if (c == 0) var hue = defaultHue;
    else if (v == r) var hue = (g < b) ? 360 + 60 * (g - b) / c : 60 * (g - b) / c;
    else if (v == g) var hue = 60 * (2 + (b - r) / c);
    else var hue = 60 * (4 + (r - g) / c);

    var saturation = (lightness == 0 || lightness == 1) ? 0 : c / (1 - Math.abs(2 * lightness - 1)) * 100;
    return {
      hue: hue,
      saturation: saturation,
      lightness: lightness * 100,
      toString: () => Math.round(hue) + '°, ' + Math.round(saturation) + '%, ' + Math.round(lightness * 100) + '%'
    };
}

  // CMYK color model (cyan, saturation, yellow, key/black)
  this.cmyk = function(input) {
    if (typeof input == 'string') {
      let match = input.match(/^(\d+)%, (\d+)%, (\d+)%$/);

      if (match != null)
        input = {
          cyan: parseInt(match[1]),
          magenta: parseInt(match[2]),
          yellow: parseInt(match[3]),
          key: parseInt(match[4])
        };
    }

    if (typeof input == 'object') {
      let defaults = this.cmyk(),
          valid = ['cyan', 'magenta', 'yellow', 'key']
            .map((prop) => {
              let validProp = typeof input[prop] == 'number' && input[prop] >= 0 && input[prop] <= 100;
              input[prop] = (validProp ? input[prop] : defaults[prop]) / 100;
              return validProp;
            })
            .reduce((a, b) => a || b);

      if (valid) {
        this.rgb({
          red: 255 * (1 - input.cyan) * (1 - input.key),
          green: 255 * (1 - input.magenta) * (1 - input.key),
          blue: 255 * (1 - input.yellow) * (1 - input.key)
        });
        defaultHue = this.hsv().hue;
        return this;
      }
    }

    var rgb = this.rgb(),
        r = rgb.red / 255,
        g = rgb.green / 255,
        b = rgb.blue / 255,
        key = 1 - Math.max(r, g, b),
        cyan = key == 1 ? 0 : (1 - r - key) / (1 - key) * 100,
        magenta = key == 1 ? 0 : (1 - g - key) / (1 - key) * 100,
        yellow = key == 1 ? 0 : (1 - b - key) / (1 - key) * 100;

    return {
      cyan: cyan,
      magenta: magenta,
      yellow: yellow,
      key: key * 100,
      toString: () => Math.round(cyan) + '%, ' + Math.round(magenta) + '%, ' + Math.round(yellow) + '%, ' + Math.round(key * 100) + '%'
    };
  }

  // Hexadecimal color format, e.g. "#ff0000" for the color red
  this.hex = function(hex) {
    if (typeof hex == 'string' && hex.match(/^#[\dabcdef]{6}$/) != null) {
      var red = parseInt(hex.slice(1, 3), 16),
          blue = parseInt(hex.slice(3, 5), 16),
          green = parseInt(hex.slice(5, 7), 16);

      this.rgb({
        red: red,
        blue: blue,
        green: green
      });
      defaultHue = this.hsv().hue;
      return this;
    } else {
      var rgb = this.rgb(),
          redHex = Math.round(rgb.red).toString(16).padStart(2, 0),
          greenHex = Math.round(rgb.green).toString(16).padStart(2, 0),
          blueHex = Math.round(rgb.blue).toString(16).padStart(2, 0);

      return '#' + redHex + greenHex + blueHex;
    }
  }
};
